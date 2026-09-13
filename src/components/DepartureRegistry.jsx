import React, { useState } from 'react';
import { Calendar, Users, ShieldCheck, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { soundscape } from '../utils/audio';
import { useCms } from '../context/CmsContext';

export default function DepartureRegistry() {
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

  const filtered = departures.filter((d) => d.season === selectedSeason);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    soundscape.playClick();

    const selectedDepObj = departures.find((d) => d.id === selectedDeparture) || departures[0];

    const newRes = addReservation({
      bookingRef: 'ZEN-2026-' + Math.floor(1000 + Math.random() * 9000),
      name: climberName,
      email: climberEmail,
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
    <section id="departures" className="relative bg-[#E0E5E9] text-[#00222C] py-16 sm:py-24 md:py-40 border-t border-[#004E64]/20 select-none font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-14 relative z-10">
        {/* Section Header with Big Cursive Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#004E64]/20 pb-5 mb-10 sm:mb-16 gap-4">
          <div>
            <span className="font-display text-xs text-[#004E64] font-bold tracking-widest uppercase block mb-1">
              Book Your Climb
            </span>
            <h2 className="font-cursive text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-normal text-[#00222C] leading-[0.95] sm:leading-[0.9] tracking-normal">
              2026 Expedition Dates
            </h2>
          </div>
          <div className="font-sans text-xs text-[#003646] tracking-wider uppercase font-medium">
            Small Groups: Maximum 4 Climbers per Guide
          </div>
        </div>

        {/* Season Filter & Team Size */}
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

        {/* Departures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-20">
          {filtered.map((dep) => (
            <div
              key={dep.id}
              className={`bg-[#F4F7F9] border p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 ${
                selectedDeparture === dep.id
                  ? 'border-[#004E64] shadow-xl ring-1 ring-[#004E64]'
                  : 'border-[#004E64]/25 hover:border-[#004E64] hover:shadow-md'
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

        {/* Guarantees */}
        <div className="bg-[#F4F7F9] border border-[#004E64]/25 p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#004E64] shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-base text-[#00222C] mb-1">
                Certified Mountain Guides
              </h4>
              <p className="font-sans text-xs text-[#003646] font-light leading-relaxed">
                Every trip is led by fully certified UIAGM alpine guides with years of Mont Blanc experience.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-[#004E64] shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-base text-[#00222C] mb-1">
                Flexible Weather Day
              </h4>
              <p className="font-sans text-xs text-[#003646] font-light leading-relaxed">
                Every 5-day itinerary includes a built-in extra day to wait out weather and maximize summit success.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-[#004E64] shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-base text-[#00222C] mb-1">
                Preparation & Training
              </h4>
              <p className="font-sans text-xs text-[#003646] font-light leading-relaxed">
                We spend Day 1 reviewing crampon technique, rope security, and safety basics before climbing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#00171F]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
          <div className="bg-[#E0E5E9] border border-[#004E64]/30 max-w-xl w-full p-5 sm:p-8 md:p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
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
    </section>
  );
}
