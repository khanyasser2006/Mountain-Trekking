import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check, ArrowRight, Layers, PackageCheck } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

const gearJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://zenith-expeditions.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Expedition Gear',
          item: 'https://zenith-expeditions.com/gear',
        },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Mont Blanc Technical Climbing Gear Provided by ZENITH',
      description: 'Certified UIAA and CE alpine equipment provided free with every expedition booking.',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Petzl Sirocco Ultralight Climbing Helmet (UIAA Certified)' },
        { '@type': 'ListItem', position: 2, name: 'Black Diamond Couloir Alpine Harness' },
        { '@type': 'ListItem', position: 3, name: 'Grivel G12 Crampons with Anti-Ball Plates' },
        { '@type': 'ListItem', position: 4, name: 'Petzl Summit EVO Classic Mountaineering Ice Axe' },
      ],
    },
  ],
};

export default function GearPage() {
  const { cmsData } = useCms();
  const [activeCategory, setActiveCategory] = useState('provided');

  const providedGear = cmsData?.gear?.provided || [];
  const personalGear = cmsData?.gear?.personal || [];

  return (
    <div className="pt-24 pb-20 select-none font-sans bg-[#E0E5E9] text-[#00222C]">
      <SEOHead
        title="Mont Blanc Expedition Gear Guide & Equipment Checklist | ZENITH"
        description="Comprehensive Mont Blanc gear checklist. Learn what technical climbing hardware is provided (crampons, ice axe, harness, helmet) and how to pack the alpine 3-layer clothing system."
        keywords="Mont Blanc gear checklist, mountaineering equipment Alps, climbing crampons, ice axe, alpine layering system, mountaineering boots B2 B3, Gore-Tex alpine jacket"
        canonicalPath="/gear"
        jsonLd={gearJsonLd}
      />
      {/* Page Header */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="font-sans text-xs text-[#004E64] uppercase tracking-wider font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#004E64]/40">/</span>
          <span className="font-sans text-xs text-[#003646] uppercase tracking-wider font-semibold">
            Gear
          </span>
        </div>

        <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal text-[#00222C] leading-[0.95] sm:leading-[0.9] mb-4 sm:mb-6">
          Expedition Gear
        </h1>

        <p className="font-sans text-base sm:text-xl md:text-2xl text-[#003646] leading-relaxed max-w-3xl font-light">
          We provide all technical climbing hardware. Here is your complete packing guide and equipment checklist for climbing Mont Blanc.
        </p>
      </section>

      {/* Provided vs Personal Gear Tabs */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-14">
          <button
            type="button"
            onClick={() => {
              soundscape.playClick();
              setActiveCategory('provided');
            }}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 border font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeCategory === 'provided'
                ? 'border-[#004E64] bg-[#004E64] text-[#F4F7F9] shadow-md'
                : 'border-[#004E64]/20 bg-transparent text-[#003646] hover:border-[#004E64]'
            }`}
          >
            What We Provide (Included with Trip)
          </button>
          <button
            type="button"
            onClick={() => {
              soundscape.playClick();
              setActiveCategory('personal');
            }}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 border font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeCategory === 'personal'
                ? 'border-[#004E64] bg-[#004E64] text-[#F4F7F9] shadow-md'
                : 'border-[#004E64]/20 bg-transparent text-[#003646] hover:border-[#004E64]'
            }`}
          >
            What You Bring (Personal Clothing Checklist)
          </button>
        </div>

        {/* Provided Hardware Grid */}
        {activeCategory === 'provided' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
                INCLUDED TECHNICAL HARDWARE
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#00222C]">
                Inspected & Fitted on Day 1 in Chamonix
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {providedGear.map((item, idx) => (
                <div key={item.id || idx} className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-xs text-[#004E64] font-bold tracking-widest">
                        0{idx + 1}
                      </span>
                      <PackageCheck className="w-5 h-5 text-[#004E64]" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-[#00222C] mb-2">
                      {item.name}
                    </h3>
                    <p className="font-sans text-xs text-[#003646] leading-relaxed font-light mb-6">
                      {item.desc || item.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#004E64]/20 font-sans text-[11px] text-[#004E64] font-semibold uppercase">
                    {item.rating || 'UIAA / CE Certified'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Checklist Grid */}
        {activeCategory === 'personal' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
                PERSONAL CLOTHING CHECKLIST
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#00222C]">
                Clothing & Footwear Recommendations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {personalGear.map((item, idx) => (
                <div key={idx} className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-xs text-[#004E64] font-bold tracking-widest">
                        0{idx + 1}
                      </span>
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-[#00222C] mb-2">
                      {item.name}
                    </h3>
                    <p className="font-sans text-xs text-[#003646] leading-relaxed font-light mb-6">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#004E64]/20 font-sans text-[11px] text-[#003646] font-semibold">
                    {item.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Layering Guide Section */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="bg-[#F4F7F9] border border-[#004E64]/30 p-6 sm:p-10 md:p-14 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-[#004E64]" />
            <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase">
              The Alpine 3-Layer System
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-[#00222C] mb-6 sm:mb-8">
            How to Stay Warm & Dry at 4,808 Meters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <span className="font-sans text-xs text-[#004E64] font-bold uppercase tracking-wider block mb-1">
                Layer 1 // Base
              </span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-2">Moisture Management</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                Merino wool or synthetic thermals that pull sweat away from your skin so you never get cold while resting.
              </p>
            </div>

            <div>
              <span className="font-sans text-xs text-[#004E64] font-bold uppercase tracking-wider block mb-1">
                Layer 2 // Mid
              </span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-2">Thermal Insulation</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                A breathable fleece jacket or lightweight down sweater that traps body heat during cold pre-dawn climbs.
              </p>
            </div>

            <div>
              <span className="font-sans text-xs text-[#004E64] font-bold uppercase tracking-wider block mb-1">
                Layer 3 // Outer
              </span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-2">Wind & Storm Shield</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                A tough Gore-Tex waterproof jacket and pants that block 60 km/h summit winds and blowing snow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14">
        <div className="bg-[#00222C] text-[#E0E5E9] p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div>
            <span className="font-display text-xs text-mist tracking-widest uppercase font-bold block mb-2">
              Join the Expedition
            </span>
            <h3 className="font-cursive text-3xl sm:text-5xl md:text-6xl text-mist-pure font-normal leading-tight mb-3">
              Ready to Gear Up for Mont Blanc?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-mist-muted max-w-xl font-light">
              Check out our 2026 departure dates or explore live weather conditions on the mountain.
            </p>
          </div>

          <div className="flex flex-wrap w-full md:w-auto gap-3 sm:gap-4">
            <Link
              to="/weather"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 border border-mist/30 text-mist hover:border-mist hover:text-mist-pure transition-all font-sans font-semibold text-xs tracking-wider uppercase"
            >
              Live Weather
            </Link>
            <Link
              to="/dates"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] transition-all font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-2"
            >
              <span>View Dates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
