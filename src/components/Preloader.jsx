import React, { useEffect, useState } from 'react';

export default function Preloader({ onComplete, totalFrames = 300, loadedFrames = 0 }) {
  const [fadingOut, setFadingOut] = useState(false);
  const progress = Math.min(100, Math.floor((loadedFrames / totalFrames) * 100));

  useEffect(() => {
    // Automatically transition into the site as soon as loading reaches 100%
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#00222C] text-[#E0E5E9] flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-opacity duration-500 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center w-full max-w-md">
        {/* Zenith Title */}
        <h1 className="font-cursive text-6xl sm:text-8xl md:text-[10rem] font-normal tracking-normal text-mist-pure mb-8 leading-none drop-shadow-[0_4px_30px_rgba(0,34,44,0.9)]">
          Zenith
        </h1>

        {/* Minimalist Clean Loading Bar */}
        <div className="w-56 sm:w-72 h-1 bg-[#00171F] rounded-full overflow-hidden mx-auto mb-3 border border-mist/10">
          <div
            className="bg-mist-pure h-full transition-all duration-150 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <span className="font-mono text-xs text-mist-muted tracking-widest block">
          {progress}%
        </span>
      </div>
    </div>
  );
}
