import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

const routeJsonLd = {
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
          name: 'The Route',
          item: 'https://zenith-expeditions.com/route',
        },
      ],
    },
    {
      '@type': 'ItemList',
      name: '5-Day Mont Blanc Classic Goûter Route Stages',
      description: 'Day-by-day itinerary breakdown of the classic Goûter route to the summit of Mont Blanc (4,808m).',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Stage 1: Bellevue to Tête Rousse Refuge (3,167m)' },
        { '@type': 'ListItem', position: 2, name: 'Stage 2: Grand Couloir Crossing & Aiguille du Goûter (3,835m)' },
        { '@type': 'ListItem', position: 3, name: 'Stage 3: Dôme du Goûter, Bosses Ridge & Summit Ascent (4,808m)' },
        { '@type': 'ListItem', position: 4, name: 'Stage 4: Descent to Nid d\'Aigle & Tramway du Mont-Blanc' },
        { '@type': 'ListItem', position: 5, name: 'Stage 5: Weather Reserve & Celebration in Chamonix' },
      ],
    },
  ],
};

export default function RoutePage() {
  const { cmsData } = useCms();
  const days = cmsData?.routes || [];
  const [activeDay, setActiveDay] = useState(0);

  const current = days[activeDay] || days[0] || {};

  const handleSelectDay = (idx) => {
    soundscape.playClick();
    setActiveDay(idx);
  };

  return (
    <div className="pt-24 pb-20 select-none font-sans bg-[#00222C] text-[#E0E5E9]">
      <SEOHead
        title="Mont Blanc 5-Day Goûter Route Itinerary & Elevation Profile (4,808m) | ZENITH"
        description="Detailed 5-day stage itinerary for climbing Mont Blanc via the classic Goûter route. Elevation gains, walking times, Grand Couloir safety protocols, and refuge stays."
        keywords="Mont Blanc route, Goûter route itinerary, Grand Couloir crossing, Tête Rousse refuge, Goûter refuge, Mont Blanc elevation gain, Bosses ridge, summit 4808m"
        canonicalPath="/route"
        jsonLd={routeJsonLd}
      />
      {/* Page Header */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-mist/15">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="font-sans text-xs text-mist uppercase tracking-wider font-semibold hover:underline">
            Home
          </Link>
          <span className="text-mist/40">/</span>
          <span className="font-sans text-xs text-mist-pure uppercase tracking-wider font-semibold">
            The Route
          </span>
        </div>

        <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal text-mist-pure leading-[0.95] sm:leading-[0.9] mb-4 sm:mb-6">
          The Summit Route
        </h1>

        <p className="font-sans text-base sm:text-xl md:text-2xl text-mist leading-relaxed max-w-3xl font-light">
          A comprehensive breakdown of the classic 5-day Goûter route to the top of Mont Blanc (4,808m).
        </p>
      </section>

      {/* Interactive Day by Day Selector */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-mist/15">
        {/* Day Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12">
          {days.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => handleSelectDay(idx)}
              className={`px-3.5 sm:px-5 py-2 sm:py-3 border font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeDay === idx
                  ? 'border-mist bg-[#004E64] text-[#F4F7F9] shadow-md'
                  : 'border-mist/20 bg-[#002B38] text-mist-muted hover:border-mist/40 hover:text-mist-pure'
              }`}
            >
              <span>{item.day || `Day ${idx + 1}`}: {(item.name || item.title || '').split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Selected Day View */}
        <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-mist/15 pb-6 mb-6 sm:mb-8 gap-4">
            <div>
              <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block">
                {current.day || `STAGE 0${activeDay + 1}`} ITINERARY
              </span>
              <h2 className="font-sans text-2xl sm:text-4xl font-bold text-mist-pure mt-1">
                {current.name || current.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs">
              <span className="px-3 py-1.5 bg-[#00222C] border border-mist/20 text-mist-pure">
                {current.elevation}
              </span>
              <span className="px-3 py-1.5 bg-[#00222C] border border-mist/20 text-mist">
                {current.time}
              </span>
            </div>
          </div>

          <p className="font-sans text-sm sm:text-base md:text-lg text-mist leading-relaxed font-light mb-8 sm:mb-10 max-w-4xl">
            {current.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="bg-[#00222C] p-4 sm:p-6 border border-mist/10">
              <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-semibold mb-1">
                Elevation & Gain
              </span>
              <span className="font-sans text-base sm:text-lg font-bold text-mist-pure">{current.climb || current.elevation}</span>
            </div>
            <div className="bg-[#00222C] p-4 sm:p-6 border border-mist/10">
              <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-semibold mb-1">
                Terrain Type
              </span>
              <span className="font-sans text-base sm:text-lg font-bold text-mist">{current.terrain || current.gradient}</span>
            </div>
            <div className="bg-[#00222C] p-4 sm:p-6 border border-mist/10">
              <span className="font-sans text-xs text-mist-muted block uppercase tracking-wider font-semibold mb-1">
                Walking Duration
              </span>
              <span className="font-sans text-base sm:text-lg font-bold text-mist-pure">{current.time}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-mist/15">
            <div>
              <h4 className="font-sans text-sm font-bold text-mist-pure uppercase tracking-wider mb-4">
                Day Highlights
              </h4>
              <ul className="space-y-2.5">
                {(current.highlights || ['Guided safety protocols', 'Scenic high alpine trail']).map((h, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-xs text-mist">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-sm font-bold text-mist-pure uppercase tracking-wider mb-4">
                Guide Tips for the Day
              </h4>
              <p className="font-sans text-xs text-mist leading-relaxed bg-[#00222C] p-4 border border-mist/10 font-light">
                {current.tips || 'Maintain a relaxed, steady pace and stay well hydrated.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness & Preparation Guide */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14">
        <div className="bg-[#00171F] border border-mist/20 p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div>
            <span className="font-display text-xs text-mist tracking-widest uppercase font-bold block mb-2">
              Preparation
            </span>
            <h3 className="font-cursive text-3xl sm:text-5xl md:text-6xl text-mist-pure font-normal leading-tight mb-3">
              Need Gear or Booking Information?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-mist-muted max-w-xl font-light">
              Review our complete equipment guide to see what gear is provided, or reserve your 2026 climb date.
            </p>
          </div>

          <div className="flex flex-wrap w-full md:w-auto gap-3 sm:gap-4">
            <Link
              to="/gear"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 border border-mist/30 text-mist hover:border-mist hover:text-mist-pure transition-all font-sans font-semibold text-xs tracking-wider uppercase"
            >
              Explore Gear
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
