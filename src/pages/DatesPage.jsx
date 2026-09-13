import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, CheckCircle2, X, HelpCircle, Check } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';
import { sanitizeInput, sanitizeEmail } from '../utils/crypto';

const datesJsonLd = {
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
          name: '2026 Expeditions',
          item: 'https://zenith-expeditions.com/dates',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How fit do I need to be to climb Mont Blanc?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You should have good cardiovascular stamina. Regular running, cycling, or hill walking for 6 to 8 hours comfortably will prepare you well for the 5-day climb.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is included in the Mont Blanc climb price?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Everything is included: certified UIAGM mountain guide fees, all mountain refuge hut bookings, half-board meals (breakfast and 3-course dinners), technical gear hire (harness, helmet, crampons, ice axe), and satellite emergency links.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I join as a solo climber?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! You can join an existing cordée of 2 climbers, or book a private 1:1 guide for a bespoke personal itinerary.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens if the weather is bad on summit day?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every 5-day itinerary includes a built-in extra reserve day to adjust for weather changes. Your guide will time the summit push for the safest, clearest window.',
          },
        },
      ],
    },
  ],
};

export default function DatesPage() {
  const { cmsData, addReservation } = useCms();
  const departures = cmsData?.departures || [];

  const [selectedSeason, setSelectedSeason] = useState('summer');
  const [teamSize, setTeamSize] = useState(2);
  const [selectedDeparture, setSelectedDeparture] = useState(departures[0]?.id || 'dep-1');
  const [modalOpen, setModalOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [climberName, setClimberName] = useState('');
  const [climberEmail, setClimberEmail] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [cramponProficiency, setCramponProficiency] = useState(true);
  const [cardioPrepared, setCardioPrepared] = useState(true);

  const faqs = [
    {
      q: 'How fit do I need to be to climb Mont Blanc?',
      a: 'You should have good cardiovascular stamina. Regular running, cycling, or hill walking for 6 to 8 hours comfortably will prepare you well for the 5-day climb.',
    },
    {
      q: 'What is included in the price?',
      a: 'Everything is included: certified UIAGM mountain guide fees, all mountain refuge hut bookings, half-board meals (breakfast and 3-course dinners), technical gear hire (harness, helmet, crampons, ice axe), and satellite emergency links.',
    },
    {
      q: 'Can I join as a solo climber?',
      a: 'Yes! You can join an existing cordée of 2 climbers, or book a private 1:1 guide for a bespoke personal itinerary.',
    },
    {
      q: 'What happens if the weather is bad on summit day?',
      a: 'Every 5-day itinerary includes a built-in extra reserve day to adjust for weather changes. Your guide will time the summit push for the safest, clearest window.',
    },
  ];

  const filtered = departures.filter((d) => d.season === selectedSeason);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    soundscape.playClick();

    const selectedDepObj = departures.find((d) => d.id === selectedDeparture) || departures[0];

    // Sanitize user inputs before storage
    const safeName = sanitizeInput(climberName, 100);
    const safeEmail = sanitizeEmail(climberEmail);

    const newRes = addReservation({
      bookingRef: 'ZEN-2026-' + Math.floor(1000 + Math.random() * 9000),
      name: safeName,
      email: safeEmail,
      departureDate: selectedDepObj?.date || 'July 2026',
      teamSize,
      experience: experienceLevel,
    });

    setConfirmedBooking(newRes);
    setIsBooked(true);
  };

  const handleCloseModal = () => {
    soundscape.playClick();
    setModalOpen(false);
    setIsBooked(false);
  };

  return (
    <div className="pt-24 pb-20 select-none font-sans bg-[#E0E5E9] text-[#00222C]">
      <SEOHead
        title="2026 Mont Blanc Expedition Dates, Permits & Booking | ZENITH"
        description="Book your guided 2026 ascent of Mont Blanc (4,808m). Small cordées of 2 climbers per UIAGM guide. All hut reservations, permits, half-board meals, and gear included."
        keywords="Mont Blanc 2026 dates, Mont Blanc booking, climb Mont Blanc permits, guided climbing calendar Alps, UIAGM expedition dates, Mont Blanc prices 2026"
        canonicalPath="/dates"
        jsonLd={datesJsonLd}
      />
      {/* Page Header */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="font-sans text-xs text-[#004E64] uppercase tracking-wider font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#004E64]/40">/</span>
          <span className="font-sans text-xs text-[#003646] uppercase tracking-wider font-semibold">
            Dates
          </span>
        </div>

        <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal text-[#00222C] leading-[0.95] sm:leading-[0.9] mb-4 sm:mb-6">
          2026 Expeditions
        </h1>

        <p className="font-sans text-base sm:text-xl md:text-2xl text-[#003646] leading-relaxed max-w-3xl font-light">
          Reserve your guided spot on Mont Blanc. All departures are limited to small cordées of 2 to 4 climbers with certified UIAGM mountain guides.
        </p>
      </section>

      {/* Season Filters & Departure Grid */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6 mb-10 sm:mb-14 bg-[#F4F7F9] border border-[#004E64]/25 p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {[
              { id: 'spring', label: 'June Climbs' },
              { id: 'summer', label: 'July & August (Peak Season)' },
              { id: 'autumn', label: 'September Climbs' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  soundscape.playClick();
                  setSelectedSeason(s.id);
                }}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 font-sans text-xs tracking-wider uppercase border transition-all cursor-pointer font-semibold ${
                  selectedSeason === s.id
                    ? 'border-[#004E64] bg-[#004E64] text-[#F4F7F9]'
                    : 'border-[#004E64]/20 bg-transparent text-[#003646] hover:border-[#004E64]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-sans text-xs font-semibold">
            <span className="text-[#003646] uppercase tracking-wider">Number of Climbers:</span>
            <div className="flex items-center border border-[#004E64]/30">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    soundscape.playClick();
                    setTeamSize(num);
                  }}
                  className={`w-9 h-8 font-medium transition-colors cursor-pointer ${
                    teamSize === num
                      ? 'bg-[#004E64] text-[#F4F7F9]'
                      : 'bg-[#F4F7F9] text-[#003646] hover:text-[#004E64]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Departure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-20">
          {filtered.map((dep) => (
            <div
              key={dep.id}
              className={`bg-[#F4F7F9] border p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 ${
                selectedDeparture === dep.id
                  ? 'border-[#004E64] shadow-xl ring-1 ring-[#004E64]'
                  : 'border-[#004E64]/25 hover:border-[#004E64]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-sans text-xs font-bold text-[#004E64] uppercase tracking-wider">
                    {dep.status || `${dep.permitsLeft} Spots Available`}
                  </span>
                  <span className="font-sans text-xs px-2.5 py-0.5 bg-[#004E64] text-[#F4F7F9] tracking-wider font-semibold">
                    {dep.permitsLeft} Left
                  </span>
                </div>

                <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#00222C] leading-snug mb-1">
                  {dep.date}
                </h3>

                <span className="font-sans text-xs text-[#004E64] font-medium block mb-4">
                  {dep.subDate}
                </span>

                <div className="space-y-2.5 pt-4 sm:pt-5 border-t border-[#004E64]/20 font-sans text-xs text-[#003646] mb-6 sm:mb-8">
                  <div className="flex justify-between">
                    <span className="text-[#003646]">Lead Guide:</span>
                    <span className="text-[#00222C] font-semibold">{dep.guide}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#003646]">Group Ratio:</span>
                    <span className="text-[#00222C] font-semibold">1 Guide for {teamSize} Climbers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#003646]">Mountain Huts:</span>
                    <span className="text-[#004E64] font-semibold">All Hut Bookings Included</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-[#004E64]/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-sans text-[11px] sm:text-xs text-[#003646] uppercase tracking-wider block font-semibold">
                    Price Per Climber
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-[#00222C]">
                    {dep.price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundscape.playClick();
                    setSelectedDeparture(dep.id);
                    setModalOpen(true);
                  }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#004E64] text-[#F4F7F9] hover:bg-[#003646] transition-colors font-sans font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Book Spot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 max-w-[1440px] mx-auto px-6 md:px-14 border-b border-[#004E64]/20">
        <div className="mb-10">
          <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
            ALL-INCLUSIVE PACKAGES
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#00222C]">
            Everything Included With Your Booking
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'UIAGM Certified Mountain Guide for all 5 days',
            'All High Mountain Refuge Hut reservations & lodging',
            'Half-board meals (Warm breakfasts and 3-course dinners)',
            'Technical gear hire (Harness, helmet, crampons, ice axe)',
            'Bellevue cable car & mountain tramway transport tickets',
            '24/7 Satellite emergency tracking & mountain rescue link',
          ].map((item, idx) => (
            <div key={idx} className="bg-[#F4F7F9] border border-[#004E64]/25 p-6 flex items-start gap-3 shadow-sm">
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-sans text-sm text-[#003646] font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14">
        <div className="mb-8 sm:mb-12">
          <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
            FAQ & GUIDELINES
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-[#00222C]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#F4F7F9] border border-[#004E64]/25 p-5 sm:p-8 shadow-sm">
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#00222C] mb-3 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-[#004E64] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#003646] leading-relaxed font-light pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#00171F]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in">
          <div className="bg-[#E0E5E9] border border-[#004E64]/30 max-w-xl w-full p-5 sm:p-8 md:p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-[#003646] hover:text-[#00222C] border border-[#004E64]/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isBooked ? (
              <form onSubmit={handleBookingSubmit}>
                <div className="border-b border-[#004E64]/20 pb-4 mb-5 sm:mb-6">
                  <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block">
                    Expedition Reservation
                  </span>
                  <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#00222C] leading-tight mt-1">
                    Reserve Your Spot
                  </h3>
                </div>

                <div className="space-y-4 mb-6 font-sans text-xs">
                  <div>
                    <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={climberName}
                      onChange={(e) => setClimberName(e.target.value)}
                      className="w-full bg-[#F4F7F9] border border-[#004E64]/30 px-4 py-3 text-[#00222C] focus:outline-none focus:border-[#004E64] font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john.miller@example.com"
                      value={climberEmail}
                      onChange={(e) => setClimberEmail(e.target.value)}
                      className="w-full bg-[#F4F7F9] border border-[#004E64]/30 px-4 py-3 text-[#00222C] focus:outline-none focus:border-[#004E64] font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-[#003646] block uppercase tracking-wider mb-1 font-semibold">
                      Your Hiking & Climbing Experience
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full bg-[#F4F7F9] border border-[#004E64]/30 px-4 py-3 text-[#00222C] focus:outline-none focus:border-[#004E64] font-sans text-sm"
                    >
                      <option value="intermediate">Beginner / Good Fitness (Regular hill walker, good stamina)</option>
                      <option value="advanced">Intermediate (Hiked 3,000m peaks, used crampons before)</option>
                      <option value="expert">Experienced (Multiple alpine climbs and multi-day treks)</option>
                    </select>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cramponProficiency}
                        onChange={(e) => setCramponProficiency(e.target.checked)}
                        className="accent-[#004E64] w-4 h-4"
                      />
                      <span className="text-[#003646] text-xs">
                        I am excited to learn alpine crampon technique during Day 1 training.
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardioPrepared}
                        onChange={(e) => setCardioPrepared(e.target.checked)}
                        className="accent-[#004E64] w-4 h-4"
                      />
                      <span className="text-[#003646] text-xs">
                        I have good physical fitness for 6 to 8 hours of mountain walking.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-[#004E64]/20 pt-5 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="font-sans text-xs text-[#003646] font-semibold">
                    <span>Selected Slots: <strong className="text-[#00222C]">{teamSize} Person</strong></span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-[#004E64] text-[#F4F7F9] hover:bg-[#003646] transition-colors font-sans font-bold text-xs tracking-wider uppercase cursor-pointer text-center"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#004E64] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <CheckCircle2 className="w-8 h-8 text-[#F4F7F9]" />
                </div>
                <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
                  Reservation Received
                </span>
                <h3 className="font-sans text-3xl font-bold text-[#00222C] mb-3">
                  Welcome to the Team, {climberName || 'Climber'}!
                </h3>
                <p className="font-sans text-sm text-[#003646] leading-relaxed mb-6 max-w-md mx-auto font-light">
                  Your provisional spot for {teamSize} climber(s) is locked. Our lead mountain guide will review your details and send you the complete preparation guide and gear checklist via email.
                </p>
                <div className="bg-[#F4F7F9] border border-[#004E64]/20 p-4 font-sans text-xs text-left mb-6 space-y-1 text-[#003646]">
                  <div>Booking Reference: <span className="text-[#00222C] font-bold">{confirmedBooking?.bookingRef || 'ZEN-2026'}</span></div>
                  <div>Destination: <span className="text-[#004E64] font-bold">Mont Blanc (4,808 Meters)</span></div>
                  <div>Team Size: <span className="text-[#00222C] font-semibold">{teamSize} Climbers</span></div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-3.5 bg-[#004E64] text-[#F4F7F9] font-sans font-bold text-xs tracking-wider uppercase cursor-pointer"
                >
                  Close & View Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
