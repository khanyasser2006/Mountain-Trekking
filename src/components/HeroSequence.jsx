import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import frameList from './frames.json';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';

gsap.registerPlugin(ScrollTrigger);

// Global module-level cache so frames are preserved across route transitions
let globalBitmapsCache = null;

export default function HeroSequence({ onProgressUpdate, onLoaded }) {
  const { cmsData } = useCms();
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const imagesRef = useRef(globalBitmapsCache || []);

  const phases = cmsData?.heroPhases || [
    { id: 0, title: 'Valley Moraine', subtitle: 'Quiet pine trails and morning mist at the base of the mountains.' },
    { id: 1, title: 'Goûter Ridge', subtitle: 'Climbing the high alpine ridge toward the mountain huts.' },
    { id: 2, title: 'Glacial Dome', subtitle: 'Walking across pure blue ice fields under open alpine skies.' },
    { id: 3, title: 'Mont Blanc Summit', subtitle: 'Standing at 4,808 meters on the highest peak in the Alps.' },
  ];

  // 1. Batch Worker Preload into GPU VRAM using createImageBitmap
  useEffect(() => {
    const total = frameList.length;

    // If already cached in memory, trigger instant complete
    if (globalBitmapsCache && globalBitmapsCache.length === total) {
      imagesRef.current = globalBitmapsCache;
      if (onProgressUpdate) onProgressUpdate(total, total);
      if (onLoaded) onLoaded();
      return;
    }

    let isCancelled = false;
    let loadedCount = 0;

    const loadImages = async () => {
      const bitmaps = new Array(total);
      const concurrency = 8;
      let currentIndex = 0;

      const worker = async () => {
        while (currentIndex < total && !isCancelled) {
          const index = currentIndex++;
          const filename = frameList[index];
          const url = `/cabinet_frames_600fps/${filename}`;

          try {
            const res = await fetch(url);
            const blob = await res.blob();
            const bitmap = await createImageBitmap(blob);
            if (!isCancelled) {
              bitmaps[index] = bitmap;
              loadedCount++;
              if (onProgressUpdate) {
                onProgressUpdate(loadedCount, total);
              }
            }
          } catch (err) {
            console.error(`Failed loading frame ${index}:`, err);
          }
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);

      if (!isCancelled) {
        globalBitmapsCache = bitmaps;
        imagesRef.current = bitmaps;
        if (onLoaded) {
          onLoaded();
        }
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Decoupled rAF Canvas Render Loop (VSync, Integer coordinates, Opaque Context)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let lastDrawnFrame = -1;

    const render = () => {
      if (imagesRef.current && imagesRef.current.length > 0) {
        const idx = Math.min(
          imagesRef.current.length - 1,
          Math.max(0, Math.floor(frameIndexRef.current))
        );

        if (idx !== lastDrawnFrame && imagesRef.current[idx]) {
          const img = imagesRef.current[idx];
          const cw = canvas.width;
          const ch = canvas.height;
          const iw = img.width;
          const ih = img.height;

          const scale = Math.max(cw / iw, ch / ih);
          const sw = (iw * scale) | 0;
          const sh = (ih * scale) | 0;
          const dx = ((cw - sw) / 2) | 0;
          const dy = ((ch - sh) / 2) | 0;

          ctx.drawImage(img, 0, 0, iw, ih, dx, dy, sw, sh);
          lastDrawnFrame = idx;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (window.innerWidth * dpr) | 0;
      canvas.height = (window.innerHeight * dpr) | 0;
      lastDrawnFrame = -1;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3. GSAP ScrollTrigger Scrubbing Engine
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalFrames = frameList.length - 1;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=450%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const frame = progress * totalFrames;
          frameIndexRef.current = frame;

          soundscape.updateAltitude(progress);

          if (progress < 0.25) {
            setCurrentPhase(0);
          } else if (progress < 0.55) {
            setCurrentPhase(1);
          } else if (progress < 0.8) {
            setCurrentPhase(2);
          } else {
            setCurrentPhase(3);
          }
        },
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const positionClasses = [
    'bottom-12 sm:bottom-16 left-4 sm:left-8 md:left-16 text-left max-w-xl pr-4',
    'bottom-12 sm:bottom-16 left-4 right-4 sm:left-auto sm:right-8 md:right-16 text-left md:text-right max-w-xl',
    'top-24 sm:top-32 left-4 sm:left-8 md:left-16 text-left max-w-xl pr-4',
    'bottom-12 sm:bottom-20 left-4 right-4 sm:left-8 sm:right-auto md:left-1/2 md:-translate-x-1/2 text-left md:text-center max-w-2xl',
  ];

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div id="hero-section" ref={containerRef} className="relative w-full h-screen bg-[#00222C] overflow-hidden select-none">
        {/* 600-Frame Clean GPU Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Floating Typographic Overlays: Big Cursive Heading + Clear Readable Subtitle */}
        {phases.map((p, idx) => {
          const isActive = currentPhase === idx;
          const posClass = positionClasses[idx % positionClasses.length];
          return (
            <div
              key={p.id || idx}
              className={`absolute pointer-events-none transition-all duration-700 ease-out ${posClass} ${
                isActive
                  ? 'opacity-100 translate-y-0 filter-none'
                  : 'opacity-0 translate-y-6 pointer-events-none'
              }`}
            >
              {/* Big Headline in Cursive */}
              <h2
                className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-normal tracking-normal text-mist-pure leading-[0.9] mb-3 drop-shadow-[0_4px_32px_rgba(0,34,44,0.95)]"
              >
                {p.title}
              </h2>

              {/* Subtitle in Clean, Highly Readable Sans */}
              <p
                className="font-sans text-sm sm:text-base md:text-lg text-mist-pure leading-relaxed drop-shadow-[0_2px_16px_rgba(0,34,44,0.95)] font-normal max-w-lg"
              >
                {p.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
