import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Compass, ArrowRight, User, ShieldAlert } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useAuth } from '../utils/auth';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      // Always visible on subpages
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const manifestoElem = document.getElementById('manifesto');
      if (manifestoElem) {
        const rect = manifestoElem.getBoundingClientRect();
        // Reveals smoothly once user enters content below hero sequence on home
        setIsVisible(rect.top <= 160);
      } else {
        setIsVisible(window.scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'The Route', path: '/route' },
    { label: 'Gear', path: '/gear' },
    { label: 'Weather', path: '/weather' },
    { label: 'Dates', path: '/dates' },
  ];

  const handleNavClick = (link) => {
    soundscape.playClick();
    setMobileMenuOpen(false);
    if (link.path === '/' && isHome) {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-out font-sans px-4 sm:px-6 pointer-events-none ${
        isVisible || !isHome
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto mt-4 sm:mt-5 pointer-events-auto">
        {/* Floating Rounded-Border Glass Navbar */}
        <div className="relative bg-[#00222C]/85 backdrop-blur-2xl border border-mist/20 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-[0_12px_40px_rgba(0,23,31,0.65)] flex items-center justify-between transition-all duration-300 hover:border-mist/35">
          
          {/* Left Brand Identity */}
          <Link
            to="/"
            onClick={() => {
              soundscape.playClick();
              if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group cursor-pointer pl-1"
          >
            <div className="w-8 h-8 rounded-full border border-mist/20 bg-[#002B38] flex items-center justify-center group-hover:border-mist transition-colors">
              <Compass className="w-4 h-4 text-mist-pure group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <span className="font-cursive text-2xl sm:text-3xl text-mist-pure font-normal leading-none tracking-normal">
              Zenith
            </span>
          </Link>

          {/* Center Navigation Links (Semantic Crawlable Links for Google) */}
          <nav className="hidden lg:flex items-center gap-1 font-sans text-xs" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                    isActive
                      ? 'bg-[#004E64] text-[#F4F7F9] shadow-sm'
                      : 'text-mist-muted hover:text-mist-pure hover:bg-[#003646]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Admin CMS + Auth Button + Book Expedition CTA */}
          <div className="flex items-center gap-2">
            
            {/* If Admin: Show Admin CMS Button (desktop/tablet only, drawer has it on mobile) */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => soundscape.playClick()}
                className="hidden md:flex px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 transition-all font-sans text-xs font-bold uppercase tracking-wider items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin CMS</span>
              </Link>
            )}

            {/* Login / Register or Active Profile Button (desktop/tablet only) */}
            <Link
              to="/auth"
              onClick={() => soundscape.playClick()}
              className={`hidden sm:flex px-3.5 py-1.5 rounded-full transition-all font-sans text-xs font-semibold items-center gap-1.5 cursor-pointer ${
                location.pathname === '/auth'
                  ? 'bg-[#004E64] text-[#F4F7F9] border border-mist/30 shadow-sm'
                  : 'text-mist hover:text-mist-pure hover:bg-[#003646] border border-mist/15'
              }`}
            >
              {currentUser ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </>
              )}
            </Link>

            {/* Book Expedition CTA */}
            <Link
              to="/dates"
              onClick={() => soundscape.playClick()}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#E0E5E9] text-[#00222C] hover:bg-[#F4F7F9] transition-all font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Book<span className="hidden sm:inline"> Expedition</span></span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full border border-mist/20 bg-[#002B38] text-mist-pure cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Frosted Glass Menu Dropdown */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[-1] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="lg:hidden mt-2 bg-[#00222C]/95 backdrop-blur-2xl border border-mist/20 rounded-2xl p-4 flex flex-col gap-1.5 font-sans text-sm shadow-2xl animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link)}
                  className={`text-left px-4 py-2.5 rounded-xl transition-colors cursor-pointer font-medium block ${
                    isActive
                      ? 'bg-[#004E64] text-[#F4F7F9]'
                      : 'text-mist-pure hover:bg-[#003646]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => {
                  soundscape.playClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs uppercase"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>Admin CMS Control Panel</span>
              </Link>
            )}

            <div className="pt-2 mt-2 border-t border-mist/15">
              <Link
                to="/auth"
                onClick={() => {
                  soundscape.playClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003646] text-mist-pure font-semibold text-xs uppercase"
              >
                <User className="w-4 h-4 text-mist" />
                <span>{currentUser ? `Account (${currentUser.name})` : 'Login / Register'}</span>
              </Link>
            </div>
          </div>
        </>
      )}
      </div>
    </header>
  );
}
