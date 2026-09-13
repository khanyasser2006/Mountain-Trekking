import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from './utils/auth';
import { CmsProvider } from './context/CmsContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import RoutePage from './pages/RoutePage';
import GearPage from './pages/GearPage';
import WeatherPage from './pages/WeatherPage';
import DatesPage from './pages/DatesPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [totalFrames, setTotalFrames] = useState(300);

  const handleProgressUpdate = (loaded, total) => {
    setLoadedFrames(loaded);
    setTotalFrames(total);
  };

  const handlePreloaderComplete = () => {
    setLoadingComplete(true);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // Only show the preloader on the home page when frames are still loading
  const shouldShowPreloader = isHome && !loadingComplete;

  return (
    <div className="relative min-h-screen bg-[#00222C] text-[#E0E5E9] selection:bg-[#004E64] selection:text-[#F4F7F9]">
      {/* Preloader ONLY on home page when loading */}
      {shouldShowPreloader && (
        <Preloader
          totalFrames={totalFrames}
          loadedFrames={loadedFrames}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Main Experience: Always visible on subpages, fades in on home after preloader */}
      <div className={`transition-opacity duration-700 ${!isHome || loadingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home onProgressUpdate={handleProgressUpdate} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/route" element={<RoutePage />} />
            <Route path="/gear" element={<GearPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/dates" element={<DatesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <AuthProvider>
      <CmsProvider>
        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Router>
      </CmsProvider>
    </AuthProvider>
  );
}
