import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, Heart, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

const aboutJsonLd = {
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
      name: 'About Zenith',
      item: 'https://zenith-expeditions.com/about',
    },
  ],
};

export default function AboutPage() {
  const { cmsData } = useCms();
  const guides = cmsData?.guides || [];
  const manifesto = cmsData?.manifesto || {};

  return (
    <div className="pt-24 pb-20 select-none font-sans bg-[#E0E5E9] text-[#00222C]">
      <SEOHead
        title="About ZENITH | World-Class UIAGM Mountain Guides & Alpine Heritage"
        description="Learn about ZENITH's certified UIAGM alpine mountain guides, strict safety protocols, 1:2 guide-to-climber ratio, and decades of Mont Blanc expedition legacy."
        keywords="UIAGM mountain guides, Chamonix guides, Mont Blanc safety ratio, alpine heritage, certified mountain guides Alps, French mountaineering guides"
        canonicalPath="/about"
        jsonLd={aboutJsonLd}
      />
      {/* Top Header */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="font-sans text-xs text-[#004E64] uppercase tracking-wider font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#004E64]/40">/</span>
          <span className="font-sans text-xs text-[#003646] uppercase tracking-wider font-semibold">
            About
          </span>
        </div>

        <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal text-[#00222C] leading-[0.95] sm:leading-[0.9] mb-4 sm:mb-6">
          About Zenith
        </h1>

        <p className="font-sans text-base sm:text-xl md:text-2xl text-[#003646] leading-relaxed max-w-3xl font-light">
          We are a Chamonix-based alpine guide company dedicated to leading safe, inspiring, and unforgettable climbs to the summit of Mont Blanc (4,808m).
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase">
              Our Climbing Philosophy
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-bold text-[#00222C] leading-tight">
              {manifesto.heading || 'Safety, small groups, and deep respect for the mountains.'}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#003646] leading-relaxed font-light">
              {manifesto.description ||
                'We believe mountaineering should be an empowering personal journey, not an extreme endurance stunt. That means proper acclimatization, top-tier certified guides, and patience.'}
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#004E64] block mb-2">1 : 2</span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-1">Strict Climber Ratio</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                Never more than 2 climbers per certified alpine guide on technical summit ridges.
              </p>
            </div>

            <div className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#004E64] block mb-2">100%</span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-1">UIAGM Certified</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                Every guide holds the highest global credential in high-altitude mountain guiding.
              </p>
            </div>

            <div className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#004E64] block mb-2">5 Days</span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-1">Acclimatization First</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                Two days of progressive altitude adaptation before attempting the summit ridge.
              </p>
            </div>

            <div className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#004E64] block mb-2">0</span>
              <h3 className="font-sans text-lg font-bold text-[#00222C] mb-1">Trace Left Behind</h3>
              <p className="font-sans text-xs text-[#003646] leading-relaxed font-light">
                Strict environmental stewardship on every glacier, hut, and ridge we traverse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Team Section */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14 gap-4">
          <div>
            <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
              Leadership
            </span>
            <h2 className="font-cursive text-4xl sm:text-6xl md:text-8xl font-normal text-[#00222C] leading-none">
              Meet Your Mountain Guides
            </h2>
          </div>
          <p className="font-sans text-sm text-[#003646] max-w-md font-light">
            You will climb alongside seasoned professionals who know every ridge, weather pattern, and safe route on Mont Blanc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-sans text-xs px-2.5 py-0.5 bg-[#004E64] text-[#F4F7F9] font-medium tracking-wider uppercase">
                    {guide.badge || 'Senior Guide'}
                  </span>
                  <span className="font-mono text-xs text-[#004E64] font-bold">UIAGM</span>
                </div>

                <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#00222C] mb-1">
                  {guide.name}
                </h3>
                <span className="font-sans text-xs text-[#004E64] font-semibold block mb-4">
                  {guide.role}
                </span>

                <p className="font-sans text-sm text-[#003646] leading-relaxed font-light mb-6">
                  {guide.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#004E64]/20 space-y-1 font-sans text-xs text-[#003646]">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <strong className="text-[#00222C]">{guide.experience}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Summit Record:</span>
                  <strong className="text-[#004E64]">{guide.summits}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14">
        <div className="bg-[#00222C] text-[#E0E5E9] p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div>
            <span className="font-display text-xs text-mist tracking-widest uppercase font-bold block mb-2">
              Ready for the Adventure?
            </span>
            <h3 className="font-cursive text-3xl sm:text-5xl md:text-6xl text-mist-pure font-normal leading-tight mb-3">
              Explore the 2026 Summit Schedule
            </h3>
            <p className="font-sans text-xs sm:text-sm text-mist-muted max-w-xl font-light">
              Spaces are limited to ensure small team ratios. Check available dates or explore the full route itinerary.
            </p>
          </div>

          <div className="flex flex-wrap w-full md:w-auto gap-3 sm:gap-4">
            <Link
              to="/route"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 border border-mist/30 text-mist hover:border-mist hover:text-mist-pure transition-all font-sans font-semibold text-xs tracking-wider uppercase"
            >
              View Route
            </Link>
            <Link
              to="/dates"
              className="flex-1 sm:flex-initial text-center justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] transition-all font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-2"
            >
              <span>Book Expedition</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
