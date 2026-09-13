import React, { useState } from 'react';
import { Award, Check } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';

export default function GearManifesto() {
  const { cmsData } = useCms();
  const gearItems = cmsData?.gear?.provided || [];
  const [selectedGear, setSelectedGear] = useState(0);

  const current = gearItems[selectedGear] || gearItems[0] || {};

  const handleSelect = (idx) => {
    soundscape.playClick();
    setSelectedGear(idx);
  };

  return (
    <section id="gear" className="relative bg-[#E0E5E9] text-[#00222C] py-16 sm:py-24 md:py-40 border-t border-[#004E64]/20 select-none font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 relative z-10">
        {/* Section Header with Big Cursive Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#004E64]/20 pb-5 mb-10 sm:mb-16 gap-4">
          <div>
            <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
              Safety Equipment
            </span>
            <h2 className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-normal text-[#00222C] leading-[0.95] sm:leading-[0.9] tracking-normal">
              Expedition Gear & Hardware
            </h2>
          </div>
          <div className="font-sans text-xs text-[#003646] tracking-wider uppercase font-medium">
            Tested & Verified for 4,800M Peaks
          </div>
        </div>

        {/* Gear Nav & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {gearItems.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 sm:p-6 border transition-all duration-200 cursor-pointer ${
                  selectedGear === idx
                    ? 'border-[#004E64] bg-[#F4F7F9] text-[#00222C] shadow-md translate-x-1'
                    : 'border-[#004E64]/20 bg-[#E0E5E9] text-[#003646] hover:border-[#004E64]/40 hover:translate-x-0.5'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-display text-xs font-bold text-[#004E64] tracking-widest">
                    ITEM {item.roman || `0${idx + 1}`}
                  </span>
                  <span className="font-mono text-xs text-[#003646]">{item.weight}</span>
                </div>
                <div className="font-sans font-bold text-base sm:text-lg text-[#00222C]">
                  {item.name}
                </div>
                <div className="font-sans text-xs text-[#004E64] uppercase tracking-wider mt-1 font-semibold">
                  {item.category}
                </div>
              </button>
            ))}
          </div>

          {/* Right Detail View */}
          <div className="lg:col-span-7 bg-[#F4F7F9] border border-[#004E64]/30 p-5 sm:p-8 md:p-12 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex flex-wrap justify-between items-start border-b border-[#004E64]/20 pb-5 mb-6 gap-3">
                <div>
                  <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase">
                    ITEM {current.roman || `0${selectedGear + 1}`} OVERVIEW
                  </span>
                  <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#00222C] leading-tight mt-1">
                    {current.name}
                  </h3>
                </div>
                <div className="font-sans text-xs px-3 py-1 bg-[#004E64] text-[#F4F7F9] uppercase tracking-wider font-semibold shrink-0">
                  {current.weight}
                </div>
              </div>

              <p className="font-sans text-sm sm:text-base text-[#003646] leading-relaxed mb-6 sm:mb-8 font-light">
                {current.description}
              </p>

              {/* Spec Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 font-sans text-xs">
                <div className="bg-[#E0E5E9]/60 p-3.5 sm:p-4 border border-[#004E64]/20">
                  <span className="font-sans text-[#004E64] block text-xs uppercase tracking-wider font-bold">Materials</span>
                  <span className="text-[#00222C] font-semibold text-sm mt-1 block">{current.material || 'Alpine Grade Material'}</span>
                </div>
                <div className="bg-[#E0E5E9]/60 p-3.5 sm:p-4 border border-[#004E64]/20">
                  <span className="font-sans text-[#004E64] block text-xs uppercase tracking-wider font-bold">Protection Level</span>
                  <span className="text-[#00222C] font-semibold text-sm mt-1 block">{current.rating || 'UIAA Tested'}</span>
                </div>
                <div className="bg-[#E0E5E9]/60 p-3.5 sm:p-4 border border-[#004E64]/20">
                  <span className="font-sans text-[#004E64] block text-xs uppercase tracking-wider font-bold">Temperature Range</span>
                  <span className="text-[#00222C] font-semibold text-sm mt-1 block">{current.tempRange || '-25°C Rated'}</span>
                </div>
                <div className="bg-[#E0E5E9]/60 p-3.5 sm:p-4 border border-[#004E64]/20">
                  <span className="font-sans text-[#004E64] block text-xs uppercase tracking-wider font-bold">Guide Approval</span>
                  <span className="text-[#00222C] font-semibold text-sm mt-1 block">Certified Guide Tested</span>
                </div>
              </div>

              {/* Attributes Checklist */}
              {current.features && current.features.length > 0 && (
                <div className="border-t border-[#004E64]/20 pt-6">
                  <span className="font-sans text-sm text-[#00222C] font-bold uppercase tracking-wider block mb-4">
                    Key Benefits & Features
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {current.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 font-sans text-xs text-[#003646]">
                        <Check className="w-4 h-4 text-[#004E64] shrink-0 mt-0.5" />
                        <span className="font-normal">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quality Pass Footer */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-[#004E64]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans text-xs text-[#003646] font-medium">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#004E64] shrink-0" />
                <span>All gear is cleaned, inspected, and provided before departure</span>
              </div>
              <span className="text-[#004E64] font-bold uppercase tracking-wider shrink-0">Ready to Climb</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
