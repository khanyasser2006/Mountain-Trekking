import React, { useState } from 'react';
import { Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';

export default function RouteTelemetry() {
  const { cmsData } = useCms();
  const stages = cmsData?.routes || [];
  const [activeStage, setActiveStage] = useState(0);

  const current = stages[activeStage] || stages[0] || {};

  const handleSelect = (idx) => {
    soundscape.playClick();
    setActiveStage(idx);
  };

  return (
    <section id="route" className="relative bg-[#00222C] text-[#E0E5E9] py-16 sm:py-24 md:py-40 border-t border-mist/20 select-none font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-mist/15 pb-5 mb-10 sm:mb-16 gap-4">
          <div>
            <span className="font-display text-xs text-mist tracking-widest uppercase block mb-1 font-bold">
              Expedition Itinerary
            </span>
            <h2 className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-normal text-mist-pure leading-[0.95] sm:leading-[0.9] tracking-normal">
              The Route to the Summit
            </h2>
          </div>
          <div className="font-sans text-xs text-mist-muted tracking-wider uppercase font-medium">
            <span>Total Ascent: +2,968M</span>
            <span className="mx-2 text-mist">/</span>
            <span>{stages.length} Days Climbing</span>
          </div>
        </div>

        {/* Topographic Cross-Section SVG Graphic */}
        <div className="bg-[#002B38] border border-mist/20 p-4 sm:p-8 md:p-10 mb-10 sm:mb-14">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <span className="font-sans text-xs text-mist-muted uppercase tracking-wider flex items-center gap-2.5 font-medium">
              <Navigation className="w-4 h-4 text-mist" />
              <span>Elevation Profile (Meters Above Sea Level)</span>
            </span>
            <span className="font-mono text-xs text-mist-pure tracking-widest">
              SUMMIT: 4,808M
            </span>
          </div>

          <div className="relative w-full h-36 sm:h-52 md:h-60">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 220"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="zenithGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#004E64" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00222C" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(224, 229, 233, 0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(224, 229, 233, 0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(224, 229, 233, 0.08)" strokeDasharray="4 4" />

              <polygon
                points="50,180 300,130 620,80 950,30 950,210 50,210"
                fill="url(#zenithGrad)"
              />

              <polyline
                points="50,180 300,130 620,80 950,30"
                fill="none"
                stroke="#E0E5E9"
                strokeWidth="2"
              />

              {[
                { x: 50, y: 180, label: '1,840m' },
                { x: 300, y: 130, label: '3,167m' },
                { x: 620, y: 80, label: '3,835m' },
                { x: 950, y: 30, label: '4,808m' },
              ].map((pt, i) => (
                <g key={i} className="cursor-pointer" onClick={() => handleSelect(Math.min(i, stages.length - 1))}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={activeStage === i ? '7' : '4.5'}
                    className={`transition-all ${
                      activeStage === i ? 'fill-[#E0E5E9] stroke-[#00222C] stroke-[2]' : 'fill-[#00222C] stroke-[#E0E5E9]'
                    }`}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor={i === 3 ? 'end' : i === 0 ? 'start' : 'middle'}
                    className="font-mono text-[11px] fill-[#8A9AA5] tracking-widest"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Stage Selector Tabs & Telemetry Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-5 flex flex-col gap-3">
            {stages.map((stg, idx) => (
              <button
                key={stg.id || idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 sm:p-6 border transition-all duration-200 cursor-pointer ${
                  activeStage === idx
                    ? 'border-mist bg-[#003646] text-mist-pure shadow-md translate-x-1'
                    : 'border-mist/15 bg-[#002B38] text-mist-muted hover:border-mist/40 hover:text-mist-pure hover:translate-x-0.5'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-display text-xs font-bold text-mist tracking-widest">
                    STAGE {stg.roman || `0${idx + 1}`}
                  </span>
                  <span className="font-mono text-xs text-mist-pure font-light">
                    {stg.elevation}
                  </span>
                </div>
                <div className="font-sans font-bold text-base sm:text-lg text-mist-pure leading-snug">
                  {stg.name || stg.title}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-[#002B38] border border-mist/20 p-5 sm:p-8 md:p-10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex flex-wrap justify-between items-start border-b border-mist/15 pb-5 mb-6 gap-3">
                <div>
                  <span className="font-display text-xs text-mist tracking-widest uppercase block font-bold">
                    STAGE {current.roman || `0${activeStage + 1}`} DETAILS
                  </span>
                  <h3 className="font-sans text-2xl sm:text-3xl font-bold text-mist-pure leading-tight mt-1">
                    {current.name || current.title}
                  </h3>
                </div>
                <div className="font-sans text-xs px-3 py-1 bg-[#00222C] border border-mist/30 text-mist tracking-wider uppercase font-medium">
                  {current.grade || 'Guided Alpine'}
                </div>
              </div>

              <p className="font-sans text-base text-mist leading-relaxed mb-8 font-light">
                {current.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#00222C] p-4 border border-mist/10 hover:border-mist/25 transition-colors duration-200">
                  <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-medium">Terrain</span>
                  <span className="font-sans text-base font-semibold text-mist-pure mt-1 block">{current.gradient || current.terrain}</span>
                </div>
                <div className="bg-[#00222C] p-4 border border-mist/10 hover:border-mist/25 transition-colors duration-200">
                  <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-medium">Exposure</span>
                  <span className="font-sans text-base font-semibold text-mist mt-1 block">{current.exposure || 'Alpine Moderate'}</span>
                </div>
                <div className="bg-[#00222C] p-4 border border-mist/10 hover:border-mist/25 transition-colors duration-200">
                  <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-medium">Duration</span>
                  <span className="font-sans text-base font-semibold text-mist-pure mt-1 block">{current.time}</span>
                </div>
                <div className="bg-[#00222C] p-4 border border-mist/10 hover:border-mist/25 transition-colors duration-200">
                  <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-medium">Distance</span>
                  <span className="font-sans text-base font-semibold text-mist-pure mt-1 block">{current.distance || current.climb}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-mist/15 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-mist shrink-0 mt-0.5" />
                <div>
                  <span className="font-sans text-mist-pure uppercase tracking-wider block font-bold text-xs">Required Gear</span>
                  <span className="text-mist-muted font-light">{current.gear || 'Alpine footwear, harness, ice axe'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-mist shrink-0 mt-0.5" />
                <div>
                  <span className="font-sans text-mist-pure uppercase tracking-wider block font-bold text-xs">Safety Notes</span>
                  <span className="text-mist-muted font-light">{current.hazard || current.tips || 'Maintain steady pace'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
