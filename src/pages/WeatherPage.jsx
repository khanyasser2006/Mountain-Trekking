import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, RefreshCw, Calendar, ArrowRight } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

const weatherJsonLd = {
  '@context': 'https://schema.org',
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
      name: 'Mountain Weather',
      item: 'https://zenith-expeditions.com/weather',
    },
  ],
};

export default function WeatherPage() {
  const { cmsData } = useCms();
  const rawStations = cmsData?.weatherStations || {};
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stationsList = Object.values(rawStations);

  const seasons = [
    {
      name: 'June — Spring Acclimatization',
      temp: 'Mild in valley, cold snow on ridge',
      pros: 'Fewer climbers on trail, abundant clean snow pack on ridges.',
      cons: 'Slightly shorter weather windows.',
      status: 'Great for fit trekkers seeking quiet trails',
    },
    {
      name: 'July & August — Peak Midsummer',
      temp: 'Warmest overall temperatures',
      pros: 'Long daylight hours, warmest summit days, very stable high pressure.',
      cons: 'Most popular season, mountain huts book out quickly.',
      status: 'Most popular & reliable summit window',
    },
    {
      name: 'September — Autumn Freeze',
      temp: 'Crisp cold mornings, clear blue skies',
      pros: 'Incredible autumn colors, very stable air, hard firm snow.',
      cons: 'Colder morning wind chill.',
      status: 'Ideal for crisp, crystal-clear views',
    },
  ];

  const handleRefresh = () => {
    soundscape.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="pt-24 pb-20 select-none font-sans bg-[#00222C] text-[#E0E5E9]">
      <SEOHead
        title="Live Mont Blanc Weather & Altitude Refuges Telemetry | ZENITH"
        description="Real-time meteorological observations for Mont Blanc summit (4,808m), Goûter Refuge (3,835m), Tête Rousse (3,167m), and Chamonix Valley. Wind speeds, temperatures, and climbing season guide."
        keywords="Mont Blanc weather, Mont Blanc summit conditions, Goûter refuge live weather, Chamonix weather, alpine wind speed, Mont Blanc best time to climb"
        canonicalPath="/weather"
        jsonLd={weatherJsonLd}
      />
      {/* Page Header */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-mist/15">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="font-sans text-xs text-mist uppercase tracking-wider font-semibold hover:underline">
            Home
          </Link>
          <span className="text-mist/40">/</span>
          <span className="font-sans text-xs text-mist-pure uppercase tracking-wider font-semibold">
            Weather
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal text-mist-pure leading-[0.95] sm:leading-[0.9] mb-4">
              Mountain Weather
            </h1>
            <p className="font-sans text-base sm:text-xl md:text-2xl text-mist leading-relaxed max-w-3xl font-light">
              Live meteorological observations across four altitudes in the Mont Blanc massif.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="w-full sm:w-auto justify-center px-5 py-3 border border-mist/25 bg-[#002B38] text-mist hover:text-mist-pure hover:border-mist transition-all font-sans text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-mist-pure' : ''}`} />
            <span>Refresh Satellite Feed</span>
          </button>
        </div>
      </section>

      {/* 4 Altitude Weather Cards */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-mist/15">
        <div className="mb-8 sm:mb-10">
          <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
            LIVE ALTITUDE OBSERVATIONS
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-mist-pure">
            Current Summit & Refuge Conditions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stationsList.map((st, idx) => (
            <div key={idx} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="font-mono text-xs text-mist-muted block">{st.alt}</span>
                    <h3 className="font-sans text-xl font-bold text-mist-pure mt-0.5">{st.name}</h3>
                  </div>
                  <Thermometer className="w-5 h-5 text-mist" />
                </div>

                <div className="mb-6">
                  <span className="font-display text-5xl font-bold text-mist-pure block tracking-tight">
                    {st.temp}
                  </span>
                  <span className="font-sans text-xs text-mist-muted mt-1 block">
                    Feels like: <strong className="text-mist-pure">{st.feelsLike || st.temp}</strong>
                  </span>
                </div>

                <div className="space-y-2.5 font-sans text-xs text-mist-muted pt-4 border-t border-mist/10">
                  <div className="flex justify-between">
                    <span>Wind Speed:</span>
                    <strong className="text-mist-pure">{st.wind}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility:</span>
                    <strong className="text-mist-pure">{st.visibility || '40 km'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Freezing Line:</span>
                    <strong className="text-mist-pure">{st.freezeLevel || '2,200M'}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-mist/10 font-sans text-xs flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{st.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Season by Season Breakdown */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-mist/15">
        <div className="mb-8 sm:mb-12">
          <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
            CLIMBING SEASON GUIDE
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-mist-pure">
            When is the Best Time to Climb Mont Blanc?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {seasons.map((s, idx) => (
            <div key={idx} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <Calendar className="w-6 h-6 text-mist mb-4" />
                <h3 className="font-sans text-xl font-bold text-mist-pure mb-2">
                  {s.name}
                </h3>
                <span className="font-sans text-xs text-mist font-medium block mb-4">
                  {s.temp}
                </span>

                <div className="space-y-3 font-sans text-xs text-mist leading-relaxed font-light mb-6">
                  <div>
                    <strong className="text-mist-pure block font-semibold">Advantages:</strong>
                    <span>{s.pros}</span>
                  </div>
                  <div>
                    <strong className="text-mist-pure block font-semibold">Considerations:</strong>
                    <span>{s.cons}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-mist/10 font-sans text-xs text-mist-muted">
                <span className="text-mist-pure font-semibold block">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14">
        <div className="bg-[#00171F] border border-mist/20 p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div>
            <span className="font-display text-xs text-mist tracking-widest uppercase font-bold block mb-2">
              Book With Peace of Mind
            </span>
            <h3 className="font-cursive text-3xl sm:text-5xl md:text-6xl text-mist-pure font-normal leading-tight mb-3">
              Included Weather Buffer Guarantee
            </h3>
            <p className="font-sans text-xs sm:text-sm text-mist-muted max-w-xl font-light">
              Every 5-day booking incorporates a flexible extra weather reserve day to ensure maximum summit success.
            </p>
          </div>

          <div className="flex flex-wrap w-full md:w-auto gap-3 sm:gap-4">
            <Link
              to="/route"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 border border-mist/30 text-mist hover:border-mist hover:text-mist-pure transition-all font-sans font-semibold text-xs tracking-wider uppercase"
            >
              Route Breakdown
            </Link>
            <Link
              to="/dates"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] transition-all font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-2"
            >
              <span>View 2026 Dates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
