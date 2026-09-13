import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { useCms, DEFAULT_CONTENT } from '../context/CmsContext';
import {
  Shield,
  LayoutDashboard,
  Sparkles,
  Users,
  Mountain,
  Package,
  Sun,
  Calendar,
  ClipboardList,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  LogOut,
  ExternalLink,
  X,
  Save,
} from 'lucide-react';
import { soundscape } from '../utils/audio';
import SEOHead from '../components/SEOHead';

export default function AdminPage() {
  const { currentUser, isAdmin, logout } = useAuth();
  const {
    cmsData,
    updateHeroPhase,
    updateManifesto,
    addGuide,
    updateGuide,
    deleteGuide,
    addRoute,
    updateRoute,
    deleteRoute,
    addGearItem,
    updateGearItem,
    deleteGearItem,
    updateWeatherStation,
    addDeparture,
    updateDeparture,
    deleteDeparture,
    updateReservationStatus,
    deleteReservation,
    resetToDefaults,
  } = useCms();

  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Local draft states with bulletproof fallbacks
  const [heroDrafts, setHeroDrafts] = useState(
    cmsData?.heroPhases || DEFAULT_CONTENT.heroPhases
  );
  const [manifestoDraft, setManifestoDraft] = useState(
    cmsData?.manifesto || DEFAULT_CONTENT.manifesto
  );
  const [weatherDrafts, setWeatherDrafts] = useState(
    cmsData?.weatherStations || DEFAULT_CONTENT.weatherStations
  );

  useEffect(() => {
    if (cmsData?.heroPhases) setHeroDrafts(cmsData.heroPhases);
    if (cmsData?.manifesto) setManifestoDraft(cmsData.manifesto);
    if (cmsData?.weatherStations) setWeatherDrafts(cmsData.weatherStations);
  }, [cmsData]);

  // Ensure scroll is at top when entering admin panel
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  // Modals for CRUD
  const [editingItem, setEditingItem] = useState(null); // { type, item, index }
  const [addModalOpen, setAddModalOpen] = useState(null); // 'guide' | 'route' | 'gear' | 'departure'

  const navigate = useNavigate();

  const showToast = (msg) => {
    soundscape.playClick();
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Safe collections
  const safeGuides = Array.isArray(cmsData?.guides) ? cmsData.guides : DEFAULT_CONTENT.guides;
  const safeRoutes = Array.isArray(cmsData?.routes) ? cmsData.routes : DEFAULT_CONTENT.routes;
  const safeProvidedGear = Array.isArray(cmsData?.gear?.provided) ? cmsData.gear.provided : DEFAULT_CONTENT.gear.provided;
  const safeDepartures = Array.isArray(cmsData?.departures) ? cmsData.departures : DEFAULT_CONTENT.departures;
  const safeReservations = Array.isArray(cmsData?.reservations) ? cmsData.reservations : [];

  // If not logged in as admin:
  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#00222C] text-[#E0E5E9] flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="bg-[#002B38] border border-mist/20 p-10 sm:p-14 max-w-lg w-full text-center shadow-2xl">
          <Shield className="w-14 h-14 text-amber-400 mx-auto mb-4" />
          <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
            RESTRICTED ACCESS
          </span>
          <h1 className="font-cursive text-6xl text-mist-pure mb-4 leading-none">
            Admin CMS Login
          </h1>
          <p className="font-sans text-xs text-mist-muted leading-relaxed mb-8 font-light">
            This Control Panel is restricted to authorized expedition administrators. Please sign in with your administrative credentials.
          </p>
          <Link
            to="/auth"
            className="w-full py-3.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider block transition-all shadow-md"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00171F] text-[#E0E5E9] font-sans flex flex-col pt-24 pb-32 select-none">
      <SEOHead
        title="Expedition Control CMS | ZENITH"
        noindex={true}
        canonicalPath="/admin"
      />
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#004E64] text-[#F4F7F9] px-6 py-4 border border-mist/40 shadow-2xl font-sans text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header Bar */}
      <div className="max-w-[1500px] w-full mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-mist/15 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[1px] bg-mist/40" />
              <span className="font-display text-xs text-mist font-bold tracking-widest uppercase">
                Content Management System
              </span>
            </div>
            <h1 className="font-cursive text-5xl sm:text-7xl md:text-[6.5rem] font-normal text-mist-pure leading-[0.95] sm:leading-[0.9]">
              Expedition Control
            </h1>
          </div>

          {/* Quick Global Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              className="px-3.5 sm:px-5 py-2 sm:py-3 border border-mist/20 bg-[#00222C] hover:border-mist text-mist-pure transition-all font-sans text-xs uppercase tracking-wider font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="px-3.5 sm:px-5 py-2 sm:py-3 border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 transition-all font-sans text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundscape.playClick();
                logout();
                if (window.__lenis) {
                  window.__lenis.scrollTo(0, { immediate: true });
                  window.__lenis.start();
                }
                window.location.href = '/';
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-3 border border-mist/20 bg-[#00222C] text-mist-muted hover:text-mist-pure hover:border-mist transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold uppercase"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace Layout (Natural Window Scroll - No Nested Scrollbar!) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1500px] w-full mx-auto px-4 sm:px-6 md:px-12 gap-6 sm:gap-10 items-start">
        
        {/* Sticky Left Navigation Tabs (Horizontal swipe on mobile, vertical aside on desktop) */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28 font-sans text-xs font-semibold flex flex-row overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0">
          {[
            { id: 'overview', label: 'System Overview', sub: 'Metrics & Live Status', icon: LayoutDashboard },
            { id: 'hero_manifesto', label: 'Hero & Manifesto', sub: 'Headlines & Slogans', icon: Sparkles },
            { id: 'guides', label: 'Guides Team (CRUD)', sub: 'UIAGM Certified Staff', icon: Users },
            { id: 'routes', label: 'Route Itinerary (CRUD)', sub: '5-Day Summit Stages', icon: Mountain },
            { id: 'gear', label: 'Gear Atelier (CRUD)', sub: 'Technical Hardware', icon: Package },
            { id: 'weather', label: 'Live Weather', sub: 'Altitude Stations', icon: Sun },
            { id: 'departures', label: '2026 Expeditions (CRUD)', sub: 'Dates & Permits', icon: Calendar },
            { id: 'bookings', label: 'Climber Bookings', sub: 'Reservations Received', icon: ClipboardList },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundscape.playClick();
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`shrink-0 lg:w-full text-left p-3 sm:p-4 border transition-all flex items-start gap-2.5 sm:gap-3.5 cursor-pointer whitespace-nowrap lg:whitespace-normal ${
                  isActive
                    ? 'border-mist bg-[#004E64] text-[#F4F7F9] shadow-lg ring-1 ring-mist/30'
                    : 'border-mist/15 bg-[#00222C] text-mist-muted hover:border-mist/40 hover:text-mist-pure'
                }`}
              >
                <div className={`p-1.5 sm:p-2 border shrink-0 ${isActive ? 'border-mist/30 bg-[#003646]' : 'border-mist/10 bg-[#00171F]'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4F7F9]' : 'text-mist'}`} />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm leading-tight">{tab.label}</span>
                  <span className={`text-[10px] sm:text-[11px] block mt-0.5 font-light ${isActive ? 'text-mist' : 'text-mist-muted'}`}>
                    {tab.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Main Content Area (Natural Page Scroll) */}
        <main className="flex-1 w-full bg-[#00222C] border border-mist/20 p-4 sm:p-8 md:p-12 shadow-2xl">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div>
                <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                  CMS DASHBOARD METRICS
                </span>
                <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                  System Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-[#002B38] p-4 sm:p-6 border border-mist/20 shadow-sm">
                  <span className="font-display text-xs text-mist uppercase tracking-widest block font-bold">
                    Expeditions
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-bold text-mist-pure mt-2 block">
                    {safeDepartures.length}
                  </span>
                  <span className="font-sans text-xs text-mist-muted mt-1 block">Scheduled 2026 Dates</span>
                </div>

                <div className="bg-[#002B38] p-4 sm:p-6 border border-mist/20 shadow-sm">
                  <span className="font-display text-xs text-mist uppercase tracking-widest block font-bold">
                    Guide Roster
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-bold text-mist-pure mt-2 block">
                    {safeGuides.length}
                  </span>
                  <span className="font-sans text-xs text-mist-muted mt-1 block">UIAGM Certified Leads</span>
                </div>

                <div className="bg-[#002B38] p-4 sm:p-6 border border-mist/20 shadow-sm">
                  <span className="font-display text-xs text-mist uppercase tracking-widest block font-bold">
                    Route Days
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-bold text-mist-pure mt-2 block">
                    {safeRoutes.length}
                  </span>
                  <span className="font-sans text-xs text-mist-muted mt-1 block">4,808M Summit Itinerary</span>
                </div>

                <div className="bg-[#002B38] p-4 sm:p-6 border border-mist/20 shadow-sm">
                  <span className="font-display text-xs text-mist uppercase tracking-widest block font-bold">
                    Reservations
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-bold text-emerald-400 mt-2 block">
                    {safeReservations.length}
                  </span>
                  <span className="font-sans text-xs text-mist-muted mt-1 block">Climbers Registered</span>
                </div>
              </div>

              <div className="bg-[#00171F] p-5 sm:p-8 border border-mist/20 space-y-3 font-sans">
                <div className="flex items-center gap-2 text-mist-pure font-bold text-xs sm:text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-Time Website Synchronization Active</span>
                </div>
                <p className="font-light text-xs text-mist-muted leading-relaxed max-w-3xl">
                  Every change you save in this admin panel will automatically update the live landing page, subpages, itineraries, and gear checklists across all devices without needing a server rebuild.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & MANIFESTO */}
          {activeTab === 'hero_manifesto' && (
            <div className="space-y-8 sm:space-y-12 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-mist/15 pb-6">
                <div>
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    CORE BRAND HEADLINES & COPY
                  </span>
                  <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                    Hero & Manifesto
                  </h2>
                </div>
              </div>

              {/* Manifesto Content */}
              <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-mist/15 pb-4 gap-3">
                  <div>
                    <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block">
                      SECTION COPY
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-mist-pure">
                      Manifesto & Guiding Philosophy
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateManifesto(manifestoDraft);
                      showToast('Manifesto copy successfully published to live site!');
                    }}
                    className="w-full sm:w-auto justify-center px-6 py-2.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Manifesto</span>
                  </button>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="text-mist block uppercase tracking-wider mb-1.5 font-bold">
                      Main Cursive Headline
                    </label>
                    <input
                      type="text"
                      value={manifestoDraft?.heading || ''}
                      onChange={(e) => setManifestoDraft({ ...manifestoDraft, heading: e.target.value })}
                      className="w-full bg-[#00171F] border border-mist/30 px-4 py-3 text-mist-pure text-sm focus:outline-none focus:border-mist"
                    />
                  </div>

                  <div>
                    <label className="text-mist block uppercase tracking-wider mb-1.5 font-bold">
                      Philosophy Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={manifestoDraft?.description || ''}
                      onChange={(e) => setManifestoDraft({ ...manifestoDraft, description: e.target.value })}
                      className="w-full bg-[#00171F] border border-mist/30 px-4 py-3 text-mist-pure text-sm focus:outline-none focus:border-mist leading-relaxed font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Hero 4-Phase Overlay Titles */}
              <div className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-mist/15 pb-4 gap-3">
                  <div>
                    <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block">
                      DRONE CANVAS OVERLAYS
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-mist-pure">
                      Hero Video Scroll Phases (4 Phases)
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      (heroDrafts || []).forEach((phase, idx) => updateHeroPhase(idx, phase));
                      showToast('Hero phases published to live canvas sequence!');
                    }}
                    className="w-full sm:w-auto justify-center px-6 py-2.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All 4 Phases</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {(heroDrafts || []).map((phase, idx) => (
                    <div key={phase?.id ?? idx} className="bg-[#00171F] p-4 sm:p-6 border border-mist/20 space-y-4 shadow-sm">
                      <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block">
                        Phase 0{idx + 1}
                      </span>
                      <div>
                        <label className="text-mist-muted block text-[11px] uppercase tracking-wider mb-1 font-semibold">
                          Cursive Title
                        </label>
                        <input
                          type="text"
                          value={phase?.title || ''}
                          onChange={(e) => {
                            const copy = [...heroDrafts];
                            copy[idx] = { ...copy[idx], title: e.target.value };
                            setHeroDrafts(copy);
                          }}
                          className="w-full bg-[#00222C] border border-mist/30 px-3 py-2 text-mist-pure text-sm focus:outline-none focus:border-mist"
                        />
                      </div>
                      <div>
                        <label className="text-mist-muted block text-[11px] uppercase tracking-wider mb-1 font-semibold">
                          Readable Subtitle
                        </label>
                        <input
                          type="text"
                          value={phase?.subtitle || ''}
                          onChange={(e) => {
                            const copy = [...heroDrafts];
                            copy[idx] = { ...copy[idx], subtitle: e.target.value };
                            setHeroDrafts(copy);
                          }}
                          className="w-full bg-[#00222C] border border-mist/30 px-3 py-2 text-mist-pure text-xs focus:outline-none focus:border-mist font-light"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GUIDES TEAM (CRUD) */}
          {activeTab === 'guides' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-mist/15 pb-6">
                <div>
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    STAFF & LEADERSHIP
                  </span>
                  <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                    Mountain Guides Team
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen('guide')}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Mountain Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {safeGuides.map((guide) => (
                  <div key={guide.id} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-2.5 py-0.5 bg-[#00171F] border border-mist/20 text-mist text-[10px] uppercase font-bold tracking-wider">
                          {guide.badge}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem({ type: 'guide', item: guide })}
                            className="p-2 border border-mist/20 bg-[#00171F] text-mist hover:text-mist-pure cursor-pointer"
                            title="Edit Guide"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete guide ${guide.name}?`)) {
                                deleteGuide(guide.id);
                                showToast(`Deleted guide ${guide.name}`);
                              }
                            }}
                            className="p-2 border border-red-500/30 bg-[#00171F] text-red-400 hover:text-red-300 cursor-pointer"
                            title="Delete Guide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-mist-pure mb-1">
                        {guide.name}
                      </h3>
                      <span className="font-sans text-xs text-mist font-semibold block mb-4">
                        {guide.role}
                      </span>
                      <p className="font-sans text-xs text-mist-muted leading-relaxed font-light mb-6">
                        {guide.bio}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-mist/10 font-sans text-xs text-mist space-y-1.5">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <strong className="text-mist-pure">{guide.experience}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Summits:</span>
                        <strong className="text-emerald-400">{guide.summits}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ROUTES / ITINERARY (CRUD) */}
          {activeTab === 'routes' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-mist/15 pb-6">
                <div>
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    SUMMIT TOPOLOGY & STAGES
                  </span>
                  <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                    Route Itinerary
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen('route')}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Route Stage</span>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {safeRoutes.map((route, idx) => (
                  <div key={route.id || idx} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2.5 py-1 bg-[#00171F] border border-mist/20 text-mist-pure font-bold">
                          {route.day || `Day ${idx + 1}`}
                        </span>
                        <h3 className="font-sans text-xl sm:text-2xl font-bold text-mist-pure">
                          {route.name || route.title}
                        </h3>
                      </div>
                      <p className="font-sans text-xs text-mist leading-relaxed font-light">
                        {route.description}
                      </p>
                      <div className="flex flex-wrap gap-4 sm:gap-5 pt-2 font-mono text-xs text-mist-muted">
                        <span>Elevation: <strong className="text-mist-pure">{route.elevation}</strong></span>
                        <span>Duration: <strong className="text-mist-pure">{route.time}</strong></span>
                        <span>Terrain: <strong className="text-mist-pure">{route.terrain || route.gradient}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingItem({ type: 'route', item: route })}
                        className="px-4 py-2 border border-mist/25 bg-[#00171F] text-mist hover:text-mist-pure transition-colors text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete stage ${route.name}?`)) {
                            deleteRoute(route.id);
                            showToast(`Deleted ${route.name}`);
                          }
                        }}
                        className="px-4 py-2 border border-red-500/30 bg-[#00171F] text-red-400 hover:bg-red-950/40 transition-colors text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GEAR & ATELIER (CRUD) */}
          {activeTab === 'gear' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-mist/15 pb-6">
                <div>
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    TECHNICAL ATELIER & HARDWARE
                  </span>
                  <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                    Expedition Gear
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen('gear')}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hardware Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {safeProvidedGear.map((item, idx) => (
                  <div key={item.id || idx} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-xs text-mist font-bold">
                          ITEM 0{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem({ type: 'gear', item, index: idx })}
                            className="p-1.5 border border-mist/20 bg-[#00171F] text-mist hover:text-mist-pure cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete gear item ${item.name}?`)) {
                                deleteGearItem('provided', item.id || idx);
                                showToast(`Deleted ${item.name}`);
                              }
                            }}
                            className="p-1.5 border border-red-500/30 bg-[#00171F] text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-sans text-xl font-bold text-mist-pure mb-1">
                        {item.name}
                      </h3>
                      <span className="font-sans text-xs text-mist font-semibold block mb-4">
                        {item.category}
                      </span>
                      <p className="font-sans text-xs text-mist-muted leading-relaxed font-light mb-6">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-mist/10 font-mono text-xs text-mist space-y-1.5">
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <strong className="text-mist-pure">{item.weight}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <strong className="text-emerald-400">{item.rating}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: WEATHER TELEMETRY */}
          {activeTab === 'weather' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-mist/15 pb-6">
                <div>
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    METEOROLOGICAL SENSORS
                  </span>
                  <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                    Live Weather Stations
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    Object.entries(weatherDrafts || {}).forEach(([key, st]) => updateWeatherStation(key, st));
                    showToast('All weather stations updated on the live website!');
                  }}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Weather Metrics</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {Object.entries(weatherDrafts || {}).map(([key, st]) => (
                  <div key={key} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 space-y-5 shadow-md">
                    <div className="border-b border-mist/15 pb-4">
                      <span className="font-mono text-xs text-mist block">{st?.alt || ''}</span>
                      <h3 className="font-sans text-xl font-bold text-mist-pure mt-0.5">{st?.name || ''}</h3>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <label className="text-mist-muted block uppercase tracking-wider mb-1 font-semibold">
                          Current Temperature
                        </label>
                        <input
                          type="text"
                          value={st?.temp || ''}
                          onChange={(e) => {
                            setWeatherDrafts({
                              ...weatherDrafts,
                              [key]: { ...weatherDrafts[key], temp: e.target.value },
                            });
                          }}
                          className="w-full bg-[#00171F] border border-mist/30 px-3 py-2 text-mist-pure text-sm focus:outline-none focus:border-mist font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-mist-muted block uppercase tracking-wider mb-1 font-semibold">
                          Wind Speed & Direction
                        </label>
                        <input
                          type="text"
                          value={st?.wind || ''}
                          onChange={(e) => {
                            setWeatherDrafts({
                              ...weatherDrafts,
                              [key]: { ...weatherDrafts[key], wind: e.target.value },
                            });
                          }}
                          className="w-full bg-[#00171F] border border-mist/30 px-3 py-2 text-mist-pure text-sm focus:outline-none focus:border-mist"
                        />
                      </div>

                      <div>
                        <label className="text-mist-muted block uppercase tracking-wider mb-1 font-semibold">
                          Climbing Status Label
                        </label>
                        <input
                          type="text"
                          value={st?.status || ''}
                          onChange={(e) => {
                            setWeatherDrafts({
                              ...weatherDrafts,
                              [key]: { ...weatherDrafts[key], status: e.target.value },
                            });
                          }}
                          className="w-full bg-[#00171F] border border-mist/30 px-3 py-2 text-emerald-400 text-sm focus:outline-none focus:border-mist font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: EXPEDITIONS & PRICING (CRUD) */}
          {activeTab === 'departures' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-mist/15 pb-6">
                <div>
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    SEASON SCHEDULE & PERMITS
                  </span>
                  <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                    2026 Expeditions
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen('departure')}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule 2026 Departure</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {safeDepartures.map((dep) => (
                  <div key={dep.id} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-2.5 py-1 bg-[#00171F] text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider">
                          {dep.permitsLeft} Spots Available
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem({ type: 'departure', item: dep })}
                            className="p-1.5 border border-mist/20 bg-[#00171F] text-mist hover:text-mist-pure cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete departure ${dep.date}?`)) {
                                deleteDeparture(dep.id);
                                showToast(`Deleted departure ${dep.date}`);
                              }
                            }}
                            className="p-1.5 border border-red-500/30 bg-[#00171F] text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-mist-pure mb-1">
                        {dep.date}
                      </h3>
                      <span className="font-sans text-xs text-mist font-medium block mb-4">
                        {dep.subDate}
                      </span>

                      <div className="space-y-1.5 font-sans text-xs text-mist-muted pt-4 border-t border-mist/10 mb-6">
                        <div className="flex justify-between">
                          <span>Lead Guide:</span>
                          <strong className="text-mist-pure">{dep.guide}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Season:</span>
                          <strong className="text-mist-pure uppercase">{dep.season}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-mist/15 flex justify-between items-center">
                      <span className="font-display text-2xl sm:text-3xl font-bold text-mist-pure">
                        {dep.price}
                      </span>
                      <span className="font-sans text-xs text-mist uppercase font-semibold">
                        Per Climber
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BOOKINGS & CLIMBER RESERVATIONS */}
          {activeTab === 'bookings' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in">
              <div className="border-b border-mist/15 pb-6">
                <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                  RESERVATION DOSSIERS
                </span>
                <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl font-normal text-mist-pure leading-tight">
                  Climber Bookings & Permits
                </h2>
              </div>

              {safeReservations.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {safeReservations.map((res) => (
                    <div key={res.id} className="bg-[#002B38] border border-mist/20 p-5 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#004E64] bg-[#F4F7F9] px-2.5 py-0.5 font-bold">
                            {res.bookingRef || 'ZEN-2026'}
                          </span>
                          <h3 className="font-sans text-xl sm:text-2xl font-bold text-mist-pure">
                            {res.name}
                          </h3>
                        </div>
                        <div className="font-sans text-xs text-mist-muted flex flex-wrap gap-4 sm:gap-5 pt-1">
                          <span>Email: <strong className="text-mist-pure">{res.email}</strong></span>
                          <span>Departure: <strong className="text-mist-pure">{res.departureDate || 'July 2026'}</strong></span>
                          <span>Team Size: <strong className="text-mist-pure">{res.teamSize || 1} Climber(s)</strong></span>
                          <span>Experience: <strong className="text-mist">{res.experience || 'Intermediate'}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
                        <select
                          value={res.status}
                          onChange={(e) => {
                            updateReservationStatus(res.id, e.target.value);
                            showToast(`Updated reservation status for ${res.name}`);
                          }}
                          className="flex-1 md:flex-initial bg-[#00171F] border border-mist/30 px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-mist-pure font-sans font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="Provisional Review">Provisional Review</option>
                          <option value="Confirmed & Hut Reserved">Confirmed & Hut Reserved</option>
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove reservation for ${res.name}?`)) {
                              deleteReservation(res.id);
                              showToast(`Removed booking for ${res.name}`);
                            }
                          }}
                          className="p-2 sm:p-2.5 border border-red-500/30 bg-[#00171F] text-red-400 hover:text-red-300 cursor-pointer shadow-sm"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#002B38] p-8 sm:p-16 text-center border border-mist/10 text-mist-muted font-sans text-sm">
                  No reservations received yet. Bookings submitted by climbers on the website will appear here in real time.
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD / EDIT DIALOG */}
      {(addModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 bg-[#00171F]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in">
          <div className="bg-[#002B38] border border-mist/30 max-w-xl w-full p-5 sm:p-8 md:p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(null);
                setEditingItem(null);
              }}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-mist hover:text-mist-pure cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Guide Form */}
            {(addModalOpen === 'guide' || editingItem?.type === 'guide') && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const data = {
                    name: form.name.value,
                    role: form.role.value,
                    experience: form.experience.value,
                    summits: form.summits.value,
                    bio: form.bio.value,
                    badge: form.badge.value,
                  };
                  if (editingItem) {
                    updateGuide(editingItem.item.id, data);
                    showToast(`Updated guide ${data.name}`);
                  } else {
                    addGuide(data);
                    showToast(`Added new guide ${data.name}`);
                  }
                  setAddModalOpen(null);
                  setEditingItem(null);
                }}
                className="space-y-4 font-sans text-xs"
              >
                <div className="border-b border-mist/15 pb-4 mb-4">
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    GUIDE DOSSIER
                  </span>
                  <h3 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-mist-pure leading-tight">
                    {editingItem ? 'Edit Guide Profile' : 'Add New Mountain Guide'}
                  </h3>
                </div>

                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Guide Name</label>
                  <input name="name" defaultValue={editingItem?.item?.name || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Role / Title</label>
                  <input name="role" defaultValue={editingItem?.item?.role || 'UIAGM Mountain Guide'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Years of Experience</label>
                  <input name="experience" defaultValue={editingItem?.item?.experience || '15 Years Guiding in the Alps'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Mont Blanc Summits</label>
                  <input name="summits" defaultValue={editingItem?.item?.summits || '75+ Mont Blanc Summits'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Badge Title</label>
                  <input name="badge" defaultValue={editingItem?.item?.badge || 'Senior Guide'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Biography</label>
                  <textarea name="bio" rows={3} defaultValue={editingItem?.item?.bio || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm leading-relaxed" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-bold text-xs uppercase tracking-wider cursor-pointer mt-4 shadow-md flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Create Guide'}</span>
                </button>
              </form>
            )}

            {/* Departure Form */}
            {(addModalOpen === 'departure' || editingItem?.type === 'departure') && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const data = {
                    date: form.date.value,
                    subDate: form.subDate.value,
                    season: form.season.value,
                    guide: form.guide.value,
                    permitsLeft: parseInt(form.permitsLeft.value, 10),
                    price: form.price.value,
                    status: `${form.permitsLeft.value} Spots Available`,
                  };
                  if (editingItem) {
                    updateDeparture(editingItem.item.id, data);
                    showToast(`Updated departure ${data.date}`);
                  } else {
                    addDeparture(data);
                    showToast(`Added new departure ${data.date}`);
                  }
                  setAddModalOpen(null);
                  setEditingItem(null);
                }}
                className="space-y-4 font-sans text-xs"
              >
                <div className="border-b border-mist/15 pb-4 mb-4">
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    EXPEDITION SCHEDULE
                  </span>
                  <h3 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-mist-pure leading-tight">
                    {editingItem ? 'Edit Expedition Date' : 'Schedule 2026 Departure'}
                  </h3>
                </div>

                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Dates (e.g. July 14 – July 18, 2026)</label>
                  <input name="date" defaultValue={editingItem?.item?.date || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Sub-Description</label>
                  <input name="subDate" defaultValue={editingItem?.item?.subDate || 'Midsummer Peak Window'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Season Category</label>
                  <select name="season" defaultValue={editingItem?.item?.season || 'summer'} className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm">
                    <option value="spring">June (Spring Opening)</option>
                    <option value="summer">July & August (Peak Season)</option>
                    <option value="autumn">September (Autumn Freeze)</option>
                  </select>
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Lead Mountain Guide</label>
                  <input name="guide" defaultValue={editingItem?.item?.guide || 'Jean-Marc Reymond (Certified Guide)'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Permits Available</label>
                  <input name="permitsLeft" type="number" min="1" max="4" defaultValue={editingItem?.item?.permitsLeft || 2} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Price per Climber</label>
                  <input name="price" defaultValue={editingItem?.item?.price || '€2,450'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-bold text-xs uppercase tracking-wider cursor-pointer mt-4 shadow-md flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Schedule Departure'}</span>
                </button>
              </form>
            )}

            {/* Route Stage Form */}
            {(addModalOpen === 'route' || editingItem?.type === 'route') && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const data = {
                    day: form.day.value,
                    name: form.name.value,
                    title: form.name.value,
                    elevation: form.elevation.value,
                    time: form.time.value,
                    terrain: form.terrain.value,
                    description: form.description.value,
                    tips: form.tips.value,
                    highlights: ['Certified guide leadership', 'Scenic alpine views'],
                  };
                  if (editingItem) {
                    updateRoute(editingItem.item.id, data);
                    showToast(`Updated stage ${data.name}`);
                  } else {
                    addRoute(data);
                    showToast(`Added stage ${data.name}`);
                  }
                  setAddModalOpen(null);
                  setEditingItem(null);
                }}
                className="space-y-4 font-sans text-xs"
              >
                <div className="border-b border-mist/15 pb-4 mb-4">
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    TOPOLOGY STAGE
                  </span>
                  <h3 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-mist-pure leading-tight">
                    {editingItem ? 'Edit Itinerary Stage' : 'Add New Route Stage'}
                  </h3>
                </div>

                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Day (e.g. Day 1)</label>
                  <input name="day" defaultValue={editingItem?.item?.day || 'Day 1'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Stage Title</label>
                  <input name="name" defaultValue={editingItem?.item?.name || editingItem?.item?.title || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Elevation Target</label>
                  <input name="elevation" defaultValue={editingItem?.item?.elevation || '3,167 M'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Walking Duration</label>
                  <input name="time" defaultValue={editingItem?.item?.time || '4 Hours'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Terrain Type</label>
                  <input name="terrain" defaultValue={editingItem?.item?.terrain || editingItem?.item?.gradient || 'Mountain Scramble'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Description</label>
                  <textarea name="description" rows={3} defaultValue={editingItem?.item?.description || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm leading-relaxed" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Guide Tips</label>
                  <input name="tips" defaultValue={editingItem?.item?.tips || 'Maintain a relaxed, steady pace.'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-bold text-xs uppercase tracking-wider cursor-pointer mt-4 shadow-md flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Add Stage'}</span>
                </button>
              </form>
            )}

            {/* Gear Form */}
            {(addModalOpen === 'gear' || editingItem?.type === 'gear') && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const data = {
                    name: form.name.value,
                    category: form.category.value,
                    weight: form.weight.value,
                    material: form.material.value,
                    rating: form.rating.value,
                    tempRange: form.tempRange.value,
                    description: form.description.value,
                  };
                  if (editingItem) {
                    updateGearItem('provided', editingItem.item.id || editingItem.index, data);
                    showToast(`Updated gear item ${data.name}`);
                  } else {
                    addGearItem('provided', data);
                    showToast(`Added new gear item ${data.name}`);
                  }
                  setAddModalOpen(null);
                  setEditingItem(null);
                }}
                className="space-y-4 font-sans text-xs"
              >
                <div className="border-b border-mist/15 pb-4 mb-4">
                  <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
                    TECHNICAL EQUIPMENT
                  </span>
                  <h3 className="font-cursive text-3xl sm:text-4xl md:text-5xl text-mist-pure leading-tight">
                    {editingItem ? 'Edit Gear Item' : 'Add Technical Hardware Item'}
                  </h3>
                </div>

                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Item Name</label>
                  <input name="name" defaultValue={editingItem?.item?.name || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Category</label>
                  <input name="category" defaultValue={editingItem?.item?.category || 'GLACIER TRACTION'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Weight</label>
                  <input name="weight" defaultValue={editingItem?.item?.weight || '450 grams'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Materials</label>
                  <input name="material" defaultValue={editingItem?.item?.material || 'High-Strength Titanium Alloy'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Rating</label>
                  <input name="rating" defaultValue={editingItem?.item?.rating || 'Certified Alpine Standards'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Temperature Range</label>
                  <input name="tempRange" defaultValue={editingItem?.item?.tempRange || '-30°C Rated'} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm" />
                </div>
                <div>
                  <label className="text-mist block uppercase tracking-wider mb-1 font-bold">Description</label>
                  <textarea name="description" rows={3} defaultValue={editingItem?.item?.description || ''} required className="w-full bg-[#00171F] border border-mist/30 px-3 py-2.5 text-mist-pure text-sm leading-relaxed" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-bold text-xs uppercase tracking-wider cursor-pointer mt-4 shadow-md flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Add Item'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-[#00171F]/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
          <div className="bg-[#002B38] border border-amber-500/40 max-w-md w-full p-8 sm:p-10 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="font-sans text-2xl font-bold text-mist-pure mb-2">
              Reset Content to Defaults?
            </h3>
            <p className="font-sans text-xs text-mist-muted leading-relaxed mb-6 font-light">
              This will restore all hero titles, manifesto texts, guides, route stages, gear items, and departures back to their original factory defaults.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-3 border border-mist/20 text-mist hover:text-mist-pure font-sans text-xs uppercase font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  setResetConfirmOpen(false);
                  showToast('All website content restored to factory defaults!');
                  setTimeout(() => window.location.reload(), 300);
                }}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs uppercase font-bold cursor-pointer shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
