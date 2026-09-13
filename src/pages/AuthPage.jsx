import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { Shield, ShieldAlert, User, Lock, Mail, Award, CheckCircle2, ArrowRight, LogOut, Mountain, ExternalLink, AlertTriangle, Clock } from 'lucide-react';
import { soundscape } from '../utils/audio';
import SEOHead from '../components/SEOHead';
import {
  checkRateLimit,
  validatePasswordStrength,
  sanitizeInput,
  sanitizeEmail as cleanEmail,
} from '../utils/crypto';

export default function AuthPage() {
  const { currentUser, login, register, logout, isAdmin } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperienceLevel] = useState('Intermediate');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState({ valid: true, message: '' });
  const navigate = useNavigate();

  // Check rate limit on mount and update lockout countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const status = checkRateLimit();
      if (status.locked) {
        setLockoutRemaining(Math.ceil(status.remainingMs / 1000));
      } else {
        setLockoutRemaining(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || lockoutRemaining > 0) return;
    soundscape.playClick();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user?.isAdmin) {
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        navigate('/admin');
      } else {
        setSuccessMessage(`Welcome back, ${user.name}! You are logged in.`);
      }
    } catch (err) {
      if (err.message === 'NOT_REGISTERED') {
        setErrorMessage('No account found for this email. Please register your account below to continue.');
        setMode('register');
      } else {
        setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    soundscape.playClick();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate password strength before submission
    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      setErrorMessage(strength.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const newUser = await register({ name, email, password, experience });
      setSuccessMessage(`Welcome to Zenith, ${newUser.name}! Your climber profile has been created and you are now logged in.`);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    soundscape.playClick();
    logout();
    setSuccessMessage('You have been logged out.');
  };

  return (
    <div className="pt-24 pb-20 select-none font-sans bg-[#E0E5E9] text-[#00222C] min-h-[90vh] flex flex-col justify-center">
      <SEOHead
        title="Climber Member Portal & Guide Login | ZENITH"
        description="Access your Mont Blanc expedition bookings, climber permits, UIAGM mountain guide messages, or log in with administrator credentials."
        canonicalPath="/login"
      />
      <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="font-sans text-xs text-[#004E64] uppercase tracking-wider font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#004E64]/40">/</span>
          <span className="font-sans text-xs text-[#003646] uppercase tracking-wider font-semibold">
            {currentUser ? (isAdmin ? 'Admin Portal' : 'Climber Profile') : mode === 'login' ? 'Sign In' : 'Register'}
          </span>
        </div>

        {/* If user is already logged in: Display Climber or Admin Dashboard */}
        {currentUser ? (
          <div key="auth-logged-in-profile" className="bg-[#F4F7F9] border border-[#004E64]/30 p-5 sm:p-8 md:p-12 shadow-xl animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#004E64]/20 pb-6 mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[#F4F7F9] font-bold text-xl shadow-md shrink-0 ${isAdmin ? 'bg-amber-600' : 'bg-[#004E64]'}`}>
                  {isAdmin ? <Shield className="w-7 h-7" /> : currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <span className={`font-display text-xs font-bold tracking-widest uppercase block ${isAdmin ? 'text-amber-700' : 'text-[#004E64]'}`}>
                    {isAdmin ? 'SYSTEM ADMINISTRATOR' : 'ACTIVE CLIMBER ACCOUNT'}
                  </span>
                  <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#00222C]">
                    {currentUser.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-amber-600 hover:bg-amber-700 text-white transition-all font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Open Admin CMS</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 sm:py-2.5 border border-[#004E64]/30 hover:bg-[#00222C] hover:text-[#F4F7F9] transition-all font-sans text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-[#E0E5E9]/60 p-4 sm:p-6 border border-[#004E64]/20">
                <span className="font-sans text-xs text-[#004E64] block uppercase tracking-wider font-semibold mb-1">
                  Email Address
                </span>
                <span className="font-sans text-base font-bold text-[#00222C]">{currentUser.email}</span>
              </div>

              <div className="bg-[#E0E5E9]/60 p-4 sm:p-6 border border-[#004E64]/20">
                <span className="font-sans text-xs text-[#004E64] block uppercase tracking-wider font-semibold mb-1">
                  Role / Tier
                </span>
                <span className="font-sans text-base font-bold text-[#00222C]">
                  {isAdmin ? 'Master CMS Admin' : currentUser.experience}
                </span>
              </div>

              <div className="bg-[#E0E5E9]/60 p-4 sm:p-6 border border-[#004E64]/20">
                <span className="font-sans text-xs text-[#004E64] block uppercase tracking-wider font-semibold mb-1">
                  Account Reference
                </span>
                <span className="font-mono text-base font-bold text-[#004E64]">{currentUser.permitNumber || 'ZEN-MEMBER'}</span>
              </div>
            </div>

            <div className="border-t border-[#004E64]/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="font-sans text-xs text-[#003646] font-light">
                {isAdmin
                  ? 'You have full administrative privileges to edit all pages, routes, guides, and content.'
                  : `Member since ${currentUser.joinedDate || '2026'} // Direct UIAGM Mountain Guide link active.`}
              </span>
              <div className="flex flex-wrap w-full sm:w-auto gap-3 sm:gap-4">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="w-full sm:w-auto text-center justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] transition-all font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md"
                  >
                    <span>Enter Admin Control Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/dates"
                    className="w-full sm:w-auto text-center justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] transition-all font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md"
                  >
                    <span>Book Expedition Dates</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Authentication Suite (Login / Register Tabs) */
          <div key="auth-form-suite" className="bg-[#F4F7F9] border border-[#004E64]/30 shadow-2xl p-5 sm:p-8 md:p-12 animate-in fade-in">
            {/* Header */}
            <div className="text-center max-w-lg mx-auto mb-8 sm:mb-10">
              <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
                ZENITH MEMBER & ADMIN PORTAL
              </span>
              <h1 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-[#00222C] leading-none mb-3">
                {mode === 'login' ? 'Climber & Admin Login' : 'Create Account'}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#003646] font-light">
                {mode === 'login'
                  ? 'Access your expedition permit reservations or sign in with admin credentials.'
                  : 'Register your details to reserve guided climbing dates on Mont Blanc.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex max-w-sm mx-auto mb-8 border border-[#004E64]/30 p-1 bg-[#E0E5E9]/50">
              <button
                type="button"
                onClick={() => {
                  soundscape.playClick();
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 font-sans text-xs tracking-wider uppercase font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#004E64] text-[#F4F7F9] shadow-sm'
                    : 'text-[#003646] hover:text-[#00222C]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  soundscape.playClick();
                  setMode('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 font-sans text-xs tracking-wider uppercase font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#004E64] text-[#F4F7F9] shadow-sm'
                    : 'text-[#003646] hover:text-[#00222C]'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error or Success Alert */}
            {errorMessage && (
              <div className="max-w-md mx-auto mb-6 p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-sans leading-relaxed">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="max-w-md mx-auto mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-sans leading-relaxed flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-5 font-sans text-xs">
                <div>
                  <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#004E64] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#E0E5E9]/70 border border-[#004E64]/30 pl-10 pr-4 py-3 text-[#00222C] text-sm focus:outline-none focus:border-[#004E64]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#004E64] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#E0E5E9]/70 border border-[#004E64]/30 pl-10 pr-4 py-3 text-[#00222C] text-sm focus:outline-none focus:border-[#004E64]"
                    />
                  </div>
                </div>

                {/* Rate Limit Lockout Warning */}
                {lockoutRemaining > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-300 text-[11px] font-sans text-amber-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Too many failed attempts. Try again in{' '}
                      <strong>{Math.ceil(lockoutRemaining / 60)} min {lockoutRemaining % 60}s</strong>.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || lockoutRemaining > 0}
                  className={`w-full py-3.5 font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-md mt-4 ${
                    isSubmitting || lockoutRemaining > 0
                      ? 'bg-[#004E64]/50 text-[#F4F7F9]/60 cursor-not-allowed'
                      : 'bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] cursor-pointer'
                  }`}
                >
                  {isSubmitting ? 'Verifying…' : lockoutRemaining > 0 ? 'Account Locked' : 'Sign In to Account'}
                </button>

                <div className="text-center pt-2">
                  <span className="text-[#003646] font-light">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                    }}
                    className="text-[#004E64] font-bold underline hover:text-[#00222C] cursor-pointer"
                  >
                    Register here
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="max-w-md mx-auto space-y-4 font-sans text-xs">
                <div>
                  <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#004E64] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Henderson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#E0E5E9]/70 border border-[#004E64]/30 pl-10 pr-4 py-3 text-[#00222C] text-sm focus:outline-none focus:border-[#004E64]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#004E64] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#E0E5E9]/70 border border-[#004E64]/30 pl-10 pr-4 py-3 text-[#00222C] text-sm focus:outline-none focus:border-[#004E64]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#004E64] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Min 8 chars, include a number"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length > 0) {
                          setPasswordStrength(validatePasswordStrength(e.target.value));
                        } else {
                          setPasswordStrength({ valid: true, message: '' });
                        }
                      }}
                      className="w-full bg-[#E0E5E9]/70 border border-[#004E64]/30 pl-10 pr-4 py-3 text-[#00222C] text-sm focus:outline-none focus:border-[#004E64]"
                    />
                  </div>
                  {password.length > 0 && !passwordStrength.valid && (
                    <p className="mt-1.5 text-[11px] text-amber-700 font-sans flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {passwordStrength.message}
                    </p>
                  )}
                  {password.length >= 8 && passwordStrength.valid && (
                    <p className="mt-1.5 text-[11px] text-emerald-700 font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      Password strength: Good
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                    Hiking & Climbing Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-[#E0E5E9]/70 border border-[#004E64]/30 px-4 py-3 text-[#00222C] text-sm focus:outline-none focus:border-[#004E64]"
                  >
                    <option value="Beginner / Fit Hiker">Beginner / Good Fitness (Regular hill walker)</option>
                    <option value="Intermediate">Intermediate (Used crampons, hiked 3,000m peaks)</option>
                    <option value="Experienced Alpine">Experienced (Multi-day alpine trekking)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-md mt-4 ${
                    isSubmitting
                      ? 'bg-[#004E64]/50 text-[#F4F7F9]/60 cursor-not-allowed'
                      : 'bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] cursor-pointer'
                  }`}
                >
                  {isSubmitting ? 'Creating Account…' : 'Complete Registration & Sign In'}
                </button>

                <div className="text-center pt-2">
                  <span className="text-[#003646] font-light">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="text-[#004E64] font-bold underline hover:text-[#00222C] cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
