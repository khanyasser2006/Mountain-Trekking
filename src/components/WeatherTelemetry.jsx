import React, { useState } from 'react';
import { Wind, Thermometer, Sun, AlertTriangle, Radio, Compass, RefreshCw } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';

export default function WeatherTelemetry() {
  const { cmsData } = useCms();
  const stations = cmsData?.weatherStations || {};
  const [selectedStation, setSelectedStation] = useState('summit');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const current = stations[selectedStation] || stations['summit'] || {};

  const handleRefresh = () => {
    soundscape.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectStation = (st) => {
    soundscape.playClick();
    setSelectedStation(st);
  };

  return (
    <section id="weather" className="relative bg-[#00222C] text-[#E0E5E9] py-16 sm:py-24 md:py-40 border-t border-mist/15 select-none font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 relative z-10">
        {/* Section Header with Big Cursive Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-mist/15 pb-5 mb-10 sm:mb-16 gap-4">
          <div>
            <span className="font-display text-xs text-mist tracking-widest uppercase block mb-1 font-bold">
              Live Mountain Updates
            </span>
            <h2 className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-normal text-mist-pure leading-[0.95] sm:leading-[0.9] tracking-normal">
              Live Mountain Weather
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2.5 border border-mist/20 bg-[#002B38] text-mist-muted hover:text-mist-pure hover:border-mist transition-colors flex items-center gap-2 font-sans text-xs cursor-pointer tracking-wider uppercase font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-mist-pure' : ''}`} />
              <span>Update Weather</span>
            </button>
            <div className="font-sans text-xs text-mist-pure flex items-center gap-2 tracking-wider font-medium uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live Satellite Link</span>
            </div>
          </div>
        </div>

        {/* Station Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {[
            { id: 'summit', roman: 'I', label: 'Summit Ridge', alt: stations.summit?.alt || '4,808M' },
            { id: 'gouter', roman: 'II', label: 'Goûter High Hut', alt: stations.gouter?.alt || '3,835M' },
            { id: 'base', roman: 'III', label: 'Valley Base Camp', alt: stations.base?.alt || '1,840M' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleSelectStation(st.id)}
              className={`p-4 sm:p-6 border transition-all text-left cursor-pointer ${
                selectedStation === st.id
                  ? 'border-mist bg-[#003646] text-mist-pure shadow-md translate-y-[-2px]'
                  : 'border-mist/15 bg-[#002B38] text-mist-muted hover:border-mist/40 hover:text-mist-pure'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-xs text-mist tracking-widest font-bold">LOCATION {st.roman}</span>
                <span className="font-mono text-xs font-light text-mist-pure">{st.alt}</span>
              </div>
              <span className="font-sans font-bold text-base sm:text-lg text-mist-pure block leading-tight mt-1">
                {st.label}
              </span>
            </button>
          ))}
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14">
          <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="font-sans text-xs text-mist-muted uppercase tracking-wider font-semibold">Temperature</span>
              <Thermometer className="w-5 h-5 text-mist" />
            </div>
            <div>
              <span className="font-display text-4xl sm:text-5xl font-bold text-mist-pure block tracking-tight">
                {current.temp}
              </span>
              <span className="font-sans text-sm text-mist-muted mt-2 block font-normal">
                Feels like: <strong className="text-mist-pure">{current.feelsLike}</strong>
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-mist/10 font-sans text-xs text-mist-muted font-light">
              Freezing Line: {current.freezeLevel}
            </div>
          </div>

          <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="font-sans text-xs text-mist-muted uppercase tracking-wider font-semibold">Wind Speed</span>
              <Wind className="w-5 h-5 text-mist" />
            </div>
            <div>
              <span className="font-display text-3xl sm:text-4xl font-bold text-mist-pure block tracking-tight">
                {current.wind}
              </span>
              <span className="font-sans text-sm text-mist-muted mt-2 block font-normal">
                Peak gusts: <strong className="text-mist-pure">{current.gusts}</strong>
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-mist/10 font-sans text-xs text-mist-muted flex items-center gap-1.5 font-light">
              <Compass className="w-3.5 h-3.5 text-mist" />
              <span>Northwest Breeze</span>
            </div>
          </div>

          <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="font-sans text-xs text-mist-muted uppercase tracking-wider font-semibold">Air Pressure</span>
              <Radio className="w-5 h-5 text-mist" />
            </div>
            <div>
              <span className="font-display text-4xl sm:text-5xl font-bold text-mist-pure block tracking-tight">
                {current.pressure}
              </span>
              <span className="font-sans text-sm text-mist-muted mt-2 block font-normal">
                Trend: <strong className="text-mist-pure">Stable & Clear</strong>
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-mist/10 font-sans text-xs text-mist-muted font-light">
              Visibility: {current.visibility}
            </div>
          </div>

          <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="font-sans text-xs text-mist-muted uppercase tracking-wider font-semibold">Climbing Status</span>
              <Sun className="w-5 h-5 text-mist" />
            </div>
            <div>
              <span className="font-sans text-xl font-bold text-mist-pure block">
                {current.status}
              </span>
              <span className="font-sans text-xs text-mist mt-2 block font-light">
                Avalanche Risk: {current.avalanche}
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-mist/10 font-sans text-xs text-mist-pure flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Safe for Guided Climbing</span>
            </div>
          </div>
        </div>

        {/* Radio Emergency Strip */}
        <div className="bg-[#00171F] border border-mist/20 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-mist shrink-0 mt-1" />
            <div>
              <h4 className="font-sans font-bold text-base text-mist-pure">
                Emergency Mountain Rescue Direct Radio
              </h4>
              <p className="font-sans text-xs text-mist-muted mt-1 font-light">
                Continuous 24/7 radio connection with the Chamonix High Mountain Rescue Service (PGHM) and rescue helicopters.
              </p>
            </div>
          </div>
          <div className="font-mono text-xs px-4 py-2 border border-mist/30 text-mist-pure shrink-0 tracking-widest uppercase bg-[#002B38]">
            CHANNEL E: 161.300 MHZ
          </div>
        </div>
      </div>
    </section>
  );
}
