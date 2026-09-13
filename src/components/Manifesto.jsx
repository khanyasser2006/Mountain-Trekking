import React from 'react';
import { Shield, Users, Heart } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export default function Manifesto() {
  const { cmsData } = useCms();
  const manifesto = cmsData?.manifesto || {};

  const stats = manifesto.stats || [
    { value: '4,808M', label: 'Mont Blanc Peak' },
    { value: '5 Days', label: 'Summit Itinerary' },
    { value: '1 : 2', label: 'Climber Ratio' },
    { value: '100%', label: 'Certified Guides' },
  ];

  const pillars = manifesto.pillars || [
    {
      title: 'Small Personal Groups',
      desc: 'We limit our teams to 2 climbers per guide on technical summit ridges, ensuring personalized pace, attention, and security.',
    },
    {
      title: 'Leave No Trace',
      desc: 'Every piece of gear and waste is packed out. We protect the high alpine glaciers for future generations of mountain lovers.',
    },
    {
      title: 'Safety First',
      desc: 'Equipped with direct satellite tracking, real-time weather monitoring, and certified UIAGM alpine mountain guides.',
    },
  ];

  return (
    <section id="manifesto" className="relative bg-[#E0E5E9] text-[#00222C] py-16 sm:py-24 md:py-40 border-t border-[#004E64]/20 select-none font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 relative z-10">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-[#004E64]" />
          <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase">
            {manifesto.subtitle || 'High Alpine Guiding Philosophy'}
          </span>
        </div>

        {/* Big Cursive Headline */}
        <div className="mb-10 sm:mb-14 max-w-5xl">
          <h2 className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-normal text-[#00222C] leading-[0.95] sm:leading-[0.9] tracking-normal mb-4 sm:mb-6">
            {manifesto.heading || 'We don’t just climb mountains. We connect with nature.'}
          </h2>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#003646] max-w-3xl leading-relaxed font-light">
            {manifesto.description ||
              'Climbing Mont Blanc is about pacing, calm decision-making, and respecting the raw forces of high-altitude nature. Guided by certified alpine experts with small personal groups.'}
          </p>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-10 border-y border-[#004E64]/20 mb-14 sm:mb-20 bg-[#F4F7F9] px-4 sm:px-6 md:px-10 shadow-sm">
          {stats.map((st, i) => (
            <div key={i} className="border-r border-[#004E64]/15 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:last:border-r-0 pr-2 sm:pr-4">
              <span className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#00222C] block tracking-tight">
                {st.value}
              </span>
              <span className="font-sans text-[10px] sm:text-xs text-[#004E64] uppercase tracking-wider block mt-1 font-semibold">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#F4F7F9] border border-[#004E64]/25 p-6 sm:p-8 md:p-10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 border border-[#004E64]/30 bg-[#E0E5E9] flex items-center justify-center mb-6">
                  {idx === 0 && <Users className="w-5 h-5 text-[#004E64]" />}
                  {idx === 1 && <Heart className="w-5 h-5 text-[#004E64]" />}
                  {idx === 2 && <Shield className="w-5 h-5 text-[#004E64]" />}
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#00222C] mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-[#003646] leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
