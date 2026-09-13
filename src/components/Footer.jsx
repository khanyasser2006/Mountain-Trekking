import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Compass, Radio, ShieldCheck } from 'lucide-react';
import { soundscape } from '../utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    soundscape.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#00171F] text-mist-muted font-sans border-t border-mist/15 pt-20 pb-12 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-mist/15">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-mist/20 bg-[#00222C] flex items-center justify-center">
                <Compass className="w-5 h-5 text-mist-pure" />
              </div>
              <div>
                <Link to="/" onClick={scrollToTop}>
                  <span className="font-cursive text-4xl sm:text-5xl text-mist-pure font-normal leading-none block">
                    Zenith
                  </span>
                </Link>
                <span className="font-sans text-xs text-mist tracking-wider uppercase block mt-1 font-medium">
                  Alpine Mountain Expeditions // 4,808M
                </span>
              </div>
            </div>

            <p className="font-sans text-sm text-mist max-w-md leading-relaxed font-light">
              Guiding climbers safely to the top of Mont Blanc with certified mountain guides, small personal groups, and top-tier safety equipment.
            </p>

            <div className="flex flex-wrap gap-4 font-sans text-xs pt-2 font-medium">
              <div className="px-3.5 py-1.5 bg-[#00222C] border border-mist/15 flex items-center gap-2 text-mist-muted">
                <Radio className="w-3.5 h-3.5 text-mist" />
                <span>Radio Link: 161.300 MHz</span>
              </div>
              <div className="px-3.5 py-1.5 bg-[#00222C] border border-mist/15 flex items-center gap-2 text-mist-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-mist" />
                <span>Certified UIAGM Mountain Guides</span>
              </div>
            </div>
          </div>

          {/* Navigation Links to Dedicated Pages */}
          <div className="md:col-span-3 space-y-4 font-sans text-xs tracking-wider uppercase font-semibold">
            <span className="text-mist-pure font-bold block mb-4">Expedition Pages</span>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  onClick={() => soundscape.playClick()}
                  className="hover:text-mist-pure transition-colors text-left block"
                >
                  About The Expedition
                </Link>
              </li>
              <li>
                <Link
                  to="/route"
                  onClick={() => soundscape.playClick()}
                  className="hover:text-mist-pure transition-colors text-left block"
                >
                  Summit Route Itinerary
                </Link>
              </li>
              <li>
                <Link
                  to="/gear"
                  onClick={() => soundscape.playClick()}
                  className="hover:text-mist-pure transition-colors text-left block"
                >
                  Equipment & Hardware
                </Link>
              </li>
              <li>
                <Link
                  to="/weather"
                  onClick={() => soundscape.playClick()}
                  className="hover:text-mist-pure transition-colors text-left block"
                >
                  Live Mountain Weather
                </Link>
              </li>
              <li>
                <Link
                  to="/dates"
                  onClick={() => soundscape.playClick()}
                  className="hover:text-mist-pure transition-colors text-left block"
                >
                  2026 Trip Dates
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordinates & Back to Top */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div className="text-left md:text-right font-sans text-xs space-y-1 font-normal">
              <span className="text-mist-pure font-bold block">Summit Location</span>
              <span className="text-mist block font-mono">45° 49' 58" N, 06° 51' 54" E</span>
              <span className="text-mist-muted block text-xs tracking-wider">Mont Blanc Massif, Chamonix</span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="mt-8 md:mt-0 px-6 py-3.5 border border-mist/20 bg-[#00222C] hover:border-mist hover:bg-[#002B38] transition-all group flex items-center justify-center gap-3 cursor-pointer shadow-sm font-sans w-full sm:w-auto"
            >
              <span className="text-xs text-mist-pure uppercase tracking-wider font-semibold">
                Back to Top
              </span>
              <ArrowUp className="w-4 h-4 text-mist group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans text-xs text-mist-muted tracking-wider">
          <div>
            © {new Date().getFullYear()} Zenith Alpine Expeditions. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-mist transition-colors cursor-pointer">Safety Guidelines</span>
            <span>/</span>
            <span className="hover:text-mist transition-colors cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
