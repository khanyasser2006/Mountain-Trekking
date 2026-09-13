import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Immediately reset Lenis scroll position to (0, 0)
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
      window.__lenis.start();
    }

    // 2. Native instant scroll reset across all document containers
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // 3. Double-check on next frame after DOM mount
    const rafId = requestAnimationFrame(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    // 4. Refresh GSAP ScrollTrigger calculations
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
