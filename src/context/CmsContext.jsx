import React, { createContext, useContext, useState, useEffect } from 'react';

const CmsContext = createContext(null);

export const DEFAULT_CONTENT = {
  // 1. Hero Drone Sequence Phases
  heroPhases: [
    {
      id: 0,
      title: 'Valley Moraine',
      subtitle: 'Quiet pine trails and morning mist at the base of the mountains.',
    },
    {
      id: 1,
      title: 'Goûter Ridge',
      subtitle: 'Climbing the high alpine ridge toward the mountain huts.',
    },
    {
      id: 2,
      title: 'Glacial Dome',
      subtitle: 'Walking across pure blue ice fields under open alpine skies.',
    },
    {
      id: 3,
      title: 'Mont Blanc Summit',
      subtitle: 'Standing at 4,808 meters on the highest peak in the Alps.',
    },
  ],

  // 2. Manifesto & Philosophy
  manifesto: {
    heading: 'We don’t just climb mountains. We connect with nature.',
    subtitle: 'High Alpine Guiding Philosophy',
    description:
      'Climbing Mont Blanc is about pacing, calm decision-making, and respecting the raw forces of high-altitude nature. Guided by certified alpine experts with small personal groups.',
    stats: [
      { value: '4,808M', label: 'Mont Blanc Peak' },
      { value: '5 Days', label: 'Summit Itinerary' },
      { value: '1 : 2', label: 'Climber Ratio' },
      { value: '100%', label: 'Certified Guides' },
    ],
    pillars: [
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
    ],
  },

  // 3. Mountain Guides Team
  guides: [
    {
      id: 'g-1',
      name: 'Jean-Marc Reymond',
      role: 'Lead UIAGM Mountain Guide',
      experience: '22 Years Guiding in the Alps',
      summits: '140+ Mont Blanc Summits',
      bio: 'Born and raised in Chamonix, Jean-Marc has dedicated his life to guiding climbers safely across the glaciers and ridges of the Mont Blanc massif.',
      badge: 'Senior Guide',
    },
    {
      id: 'g-2',
      name: 'Eléonore Dupont',
      role: 'UIAGM Guide & Glaciologist',
      experience: '14 Years Alpine Experience',
      summits: '85+ Mont Blanc Summits',
      bio: 'An expert in high-altitude glacier dynamics and technical ice climbing, Eléonore ensures every climber develops confidence and smooth footwork on ice.',
      badge: 'Safety Director',
    },
    {
      id: 'g-3',
      name: 'Lukas Berger',
      role: 'UIAGM High Altitude Guide',
      experience: '16 Years International Guiding',
      summits: '95+ Mont Blanc Summits',
      bio: 'Specializing in cardiovascular pacing and pre-climb acclimatization, Lukas ensures climbers maintain steady energy and stamina throughout the 5-day climb.',
      badge: 'Acclimatization Lead',
    },
  ],

  // 4. Route Itinerary Days
  routes: [
    {
      id: 'r-1',
      roman: 'I',
      day: 'Day 1',
      name: 'Day 1 — Valley Trail & Base Camp',
      title: 'Valley Trail to Staging Camp',
      elevation: '1,840 M',
      climb: '+800m Ascent',
      distance: '6.0 KM',
      gradient: 'Moderate',
      grade: 'Easy Trail Hike',
      exposure: 'Low',
      time: '4 Hours',
      terrain: 'Forest Paths & Alpine Meadows',
      gear: 'Comfortable hiking boots, trekking poles, daypack',
      hazard: 'None (Getting used to the mountain altitude)',
      description:
        'The journey begins in the beautiful green valley of Les Houches. We hike through quiet pine forests, adjusting our breathing and settling into an easy, comfortable walking pace.',
      highlights: ['Gear check and safety briefing', 'Scenic pine forest hike', 'First view of the Bionnassay Glacier'],
      tips: 'Drink plenty of water and maintain a steady, relaxed walking pace.',
    },
    {
      id: 'r-2',
      roman: 'II',
      day: 'Day 2',
      name: 'Day 2 — Hike to Tête Rousse Refuge',
      title: 'Ascent to Tête Rousse Refuge',
      elevation: '3,167 M',
      climb: '+1,327m Ascent',
      distance: '6.4 KM',
      gradient: 'Steeper Trail',
      grade: 'Mountain Scramble',
      exposure: 'Medium',
      time: '3.5 Hours',
      terrain: 'Rocky Mountain Trail & Scree',
      gear: 'Mountaineering boots, warm layers, climbing helmet',
      hazard: 'Cooler temperatures and higher elevation',
      description:
        'We climb steadily above the tree line toward the rocky slopes. We spend the afternoon resting at the welcoming Tête Rousse mountain hut and enjoy a warm dinner before tomorrow’s climb.',
      highlights: ['Transition above the tree line', 'Crampon technique review on ice', 'Warm 3-course dinner in the high refuge'],
      tips: 'Rest well in the afternoon; altitude sleep is essential for acclimatization.',
    },
    {
      id: 'r-3',
      roman: 'III',
      day: 'Day 3',
      name: 'Day 3 — Ridge Climb to Goûter Hut',
      title: 'The Goûter Ridge Scramble',
      elevation: '3,835 M',
      climb: '+668m Scramble',
      distance: '3.2 KM',
      gradient: 'Steep Rock & Snow',
      grade: 'Guided Alpine Scramble',
      exposure: 'High',
      time: '3 Hours',
      terrain: 'Scrambling on Rock with Fixed Cables',
      gear: 'Roped cordée, climbing harness, ice axe, crampons',
      hazard: 'Loose rock section (guided with fixed safety cables)',
      description:
        'An exciting morning of guided scrambling. We cross the Grand Couloir and climb the scenic rocky ridge with fixed cables, arriving at the futuristic Goûter Hut perched high on the cliff.',
      highlights: ['Guided crossing of the Grand Couloir', 'Fun, exposed scrambling on solid rock', 'Stunning sunset above the sea of clouds'],
      tips: 'Keep 3 points of contact on rock and clip into safety cables when advised by your guide.',
    },
    {
      id: 'r-4',
      roman: 'IV',
      day: 'Day 4',
      name: 'Day 4 — Summit Push to Mont Blanc',
      title: 'Summit Push to Mont Blanc & Return',
      elevation: '4,808 M',
      climb: '+973m Summit / -2,968m Descent',
      distance: '8.5 KM',
      gradient: 'Snow & Glacier',
      grade: 'Snow Ridge Ascent',
      exposure: 'High (360° Views)',
      time: '4.5 Hours',
      terrain: 'Snow Slopes & Knife-Edge Snow Ridge',
      gear: 'Full thermal layers, warm gloves, glacier sunglasses, crampons',
      hazard: 'Cold morning wind chill (-15°C to -25°C)',
      description:
        'We start before dawn by headlamp. We walk along the gentle Dôme du Goûter and ascend the famous Bosses snow ridge, stepping onto the summit of Mont Blanc just as the sun rises across the Alps.',
      highlights: ['Walking by headlamp under starry skies', 'Sunrise over the highest peak in the Alps', 'Celebratory return to Chamonix'],
      tips: 'Dress in warm windproof layers and keep snacks in an accessible chest pocket.',
    },
  ],

  // 5. Gear & Atelier
  gear: {
    provided: [
      {
        id: 'g-p-1',
        roman: 'I',
        name: 'All-Weather Alpine Jacket',
        category: 'WIND & RAIN DEFENSE',
        weight: '420 grams',
        material: 'Gore-Tex Pro 3-Layer Shell',
        rating: '100% Waterproof & Windproof',
        tempRange: '-35°C to +5°C',
        features: [
          'Blocks freezing summit winds and heavy mountain snow',
          'Breathable fabric keeps you dry and comfortable during climbs',
          'Helmet-compatible storm hood with adjustable drawstrings',
          'Built-in electronic search reflector for emergency location',
        ],
        description:
          'Designed to keep you warm and dry in the harshest alpine weather. Completely windproof and waterproof while allowing sweat vapor to escape freely.',
      },
      {
        id: 'g-p-2',
        roman: 'II',
        name: 'Titanium Ice Crampons',
        category: 'GLACIER TRACTION',
        weight: '680 grams / pair',
        material: 'High-Strength Titanium Alloy',
        rating: 'Certified Alpine Safety Standards',
        tempRange: 'Rated for Arctic Sub-Zero Ice',
        features: [
          'Sharp front teeth for walking safely on solid blue glacier ice',
          'Anti-snow plates underneath prevent snow buildup under your boots',
          'Micro-adjustable heel strap for a secure, custom fit on boots',
          'Lightweight design reduces leg fatigue on long walking days',
        ],
        description:
          'Essential for walking safely across snow and ice slopes. Securely locks onto your mountaineering boots to give you solid, slip-free footing.',
      },
      {
        id: 'g-p-3',
        roman: 'III',
        name: 'Lightweight Alpine Ice Axes',
        category: 'BALANCE & STABILITY',
        weight: '495 grams',
        material: 'Carbon Fiber & Forged Steel',
        rating: 'High-Strength Certified Tool',
        tempRange: 'Extreme Cold Rated',
        features: [
          'Comfortable ergonomic grip that stays warm in your gloves',
          'Sharp laser-cut steel pick for secure placement in ice',
          'Bottom spike for extra balance when walking on steep snow slopes',
          'Ultralight carbon body absorbs shocks and minimizes strain',
        ],
        description:
          'Your trusted partner for balance and security on snowy mountain trails. Easy to hold and swing, giving you confidence with every step.',
      },
      {
        id: 'g-p-4',
        roman: 'IV',
        name: 'Emergency Satellite Communicator',
        category: 'LIVE SATELLITE CONNECTION',
        weight: '247 grams',
        material: 'Rugged Shockproof Polymer',
        rating: '100% Water & Freeze Resistant',
        tempRange: '-30°C to +60°C',
        features: [
          'Connects to global satellites where phone networks have no signal',
          'One-touch SOS button connected 24/7 to mountain rescue teams',
          'Live GPS location sharing with our valley base camp',
          'Cold-resistant battery with up to 72 hours of emergency life',
        ],
        description:
          'Your direct communication link from the top of the mountain to emergency rescue helicopters (PGHM Chamonix). Works anywhere on earth.',
      },
      {
        id: 'g-p-5',
        roman: 'V',
        name: 'Insulated Mountaineering Boots',
        category: 'WARMTH & FOOT COMFORT',
        weight: '980 grams / boot',
        material: 'Kevlar Upper + Thermal Aerogel Lining',
        rating: 'Cold Rated to -30°C',
        tempRange: 'High Altitude Snow & Ice',
        features: [
          'Thick insulated lining prevents cold feet and frostbite',
          'Waterproof integrated gaiter keeps snow from entering boots',
          'Deep-tread Vibram sole for maximum grip on mud and rock',
          'Rigid sole base designed specifically for crampon attachment',
        ],
        description:
          'Keep your feet warm, dry, and protected during long alpine walks. High-tech thermal insulation forms a cozy barrier against freezing snow.',
      },
    ],
    personal: [
      {
        name: 'Thermal Base Layers (Top & Bottom)',
        desc: 'Moisture-wicking merino wool or synthetic thermal underwear. Avoid cotton.',
        tip: '2 sets recommended',
      },
      {
        name: 'Insulating Mid-Layer Fleece or Down Jacket',
        desc: 'Warm fleece jacket or lightweight packable down jacket for rest stops and summit mornings.',
        tip: 'Essential warmth',
      },
      {
        name: 'Waterproof Gore-Tex Shell Jacket & Pants',
        desc: 'Breathable, 100% windproof and waterproof outer layers to protect against storms.',
        tip: 'Must have hood',
      },
      {
        name: 'Mountaineering Boots (Crampon-Compatible)',
        desc: 'Stiff-soled B2 or B3 rated leather or synthetic boots with ankle support.',
        tip: 'Available for hire in Chamonix',
      },
      {
        name: 'Category 4 Glacier Sunglasses',
        desc: 'High-protection lenses (Cat 4) with side shields to prevent snow glare and UV damage.',
        tip: 'Mandatory eye safety',
      },
      {
        name: '35L to 45L Mountain Backpack',
        desc: 'Comfortable daypack with ice axe attachments and rain cover.',
        tip: 'Keep total weight under 9kg',
      },
    ],
  },

  // 6. Weather Telemetry Stations
  weatherStations: {
    summit: {
      roman: 'I',
      name: 'Mont Blanc Summit (4,808m)',
      alt: '4,808 M',
      temp: '-18°C',
      feelsLike: '-28°C',
      wind: '40 km/h NW',
      gusts: '65 km/h',
      pressure: '594 hPa',
      uv: 'High (Sun Protection Needed)',
      freezeLevel: '2,200 Meters',
      visibility: '35 km (Clear Horizons)',
      avalanche: 'Low to Moderate',
      status: 'Great Summit Window',
    },
    gouter: {
      roman: 'II',
      name: 'Goûter High Refuge (3,835m)',
      alt: '3,835 M',
      temp: '-10°C',
      feelsLike: '-18°C',
      wind: '30 km/h NW',
      gusts: '45 km/h',
      pressure: '652 hPa',
      uv: 'High',
      freezeLevel: '2,200 Meters',
      visibility: '40 km (Clear View)',
      avalanche: 'Low Risk',
      status: 'Stable Conditions',
    },
    base: {
      roman: 'III',
      name: 'Valley Base Station (1,840m)',
      alt: '1,840 M',
      temp: '+7°C',
      feelsLike: '+6°C',
      wind: '10 km/h W',
      gusts: '18 km/h',
      pressure: '818 hPa',
      uv: 'Moderate',
      freezeLevel: '2,200 Meters',
      visibility: '50+ km (Sunny & Calm)',
      avalanche: 'No Risk',
      status: 'Ideal Departure Weather',
    },
  },

  // 7. 2026 Expeditions
  departures: [
    {
      id: 'dep-1',
      date: 'July 14 – July 18, 2026',
      subDate: 'Midsummer Summit Window',
      season: 'summer',
      guide: 'Jean-Marc Reymond (Certified Guide)',
      permitsLeft: 2,
      status: '2 Spots Available',
      price: '€2,450',
    },
    {
      id: 'dep-2',
      date: 'July 28 – August 01, 2026',
      subDate: 'Peak Summer Season',
      season: 'summer',
      guide: 'Eléonore Dupont (Certified Guide)',
      permitsLeft: 1,
      status: '1 Last Spot Left',
      price: '€2,450',
    },
    {
      id: 'dep-3',
      date: 'August 11 – August 15, 2026',
      subDate: 'Clear Sky Window',
      season: 'summer',
      guide: 'Lukas Berger (Certified Guide)',
      permitsLeft: 4,
      status: '4 Spots Available',
      price: '€2,450',
    },
    {
      id: 'dep-4',
      date: 'September 05 – September 09, 2026',
      subDate: 'Crisp Autumn Snow',
      season: 'autumn',
      guide: 'Maxime Morel (Certified Guide)',
      permitsLeft: 3,
      status: '3 Spots Available',
      price: '€2,250',
    },
    {
      id: 'dep-5',
      date: 'September 19 – September 23, 2026',
      subDate: 'Autumn Clear Sky',
      season: 'autumn',
      guide: 'Jean-Marc Reymond (Certified Guide)',
      permitsLeft: 2,
      status: '2 Spots Available',
      price: '€2,250',
    },
    {
      id: 'dep-6',
      date: 'June 16 – June 20, 2026',
      subDate: 'Early Season Opening',
      season: 'spring',
      guide: 'Eléonore Dupont (Certified Guide)',
      permitsLeft: 4,
      status: '4 Spots Available',
      price: '€2,150',
    },
  ],

  // 8. Received Reservations / Bookings
  reservations: [
    {
      id: 'res-101',
      bookingRef: 'ZEN-2026-4808',
      name: 'Thomas Anderson',
      email: 'thomas.anderson@example.com',
      departureDate: 'July 14 – July 18, 2026',
      teamSize: 2,
      experience: 'Intermediate',
      status: 'Confirmed & Hut Reserved',
      submittedAt: '2026-08-28',
    },
    {
      id: 'res-102',
      bookingRef: 'ZEN-2026-3167',
      name: 'Sophia Laurent',
      email: 'sophia.laurent@example.com',
      departureDate: 'August 11 – August 15, 2026',
      teamSize: 1,
      experience: 'Experienced Alpine',
      status: 'Provisional Review',
      submittedAt: '2026-09-01',
    },
  ],
};

export function CmsProvider({ children }) {
  const [cmsData, setCmsData] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_cms_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          manifesto: { ...DEFAULT_CONTENT.manifesto, ...(parsed.manifesto || {}) },
          heroPhases: Array.isArray(parsed.heroPhases) && parsed.heroPhases.length > 0 ? parsed.heroPhases : DEFAULT_CONTENT.heroPhases,
          guides: Array.isArray(parsed.guides) && parsed.guides.length > 0 ? parsed.guides : DEFAULT_CONTENT.guides,
          routes: Array.isArray(parsed.routes) && parsed.routes.length > 0 ? parsed.routes : DEFAULT_CONTENT.routes,
          gear: {
            provided: parsed.gear?.provided || DEFAULT_CONTENT.gear.provided,
            personal: parsed.gear?.personal || DEFAULT_CONTENT.gear.personal,
          },
          weatherStations: { ...DEFAULT_CONTENT.weatherStations, ...(parsed.weatherStations || {}) },
          departures: Array.isArray(parsed.departures) && parsed.departures.length > 0 ? parsed.departures : DEFAULT_CONTENT.departures,
          reservations: Array.isArray(parsed.reservations) ? parsed.reservations : DEFAULT_CONTENT.reservations,
        };
      }
    } catch (err) {
      console.error('Failed to load CMS content from storage:', err);
    }
    return DEFAULT_CONTENT;
  });

  // Automatically save any changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenith_cms_content', JSON.stringify(cmsData));
    } catch (err) {
      console.error('Failed to persist CMS content:', err);
    }
  }, [cmsData]);

  // CRUD Actions:

  // 1. Hero
  const updateHeroPhase = (index, updatedPhase) => {
    setCmsData((prev) => {
      const newPhases = [...(prev.heroPhases || DEFAULT_CONTENT.heroPhases)];
      newPhases[index] = { ...newPhases[index], ...updatedPhase };
      return { ...prev, heroPhases: newPhases };
    });
  };

  // 2. Manifesto
  const updateManifesto = (updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      manifesto: { ...(prev.manifesto || DEFAULT_CONTENT.manifesto), ...updatedFields },
    }));
  };

  // 3. Guides (CRUD)
  const addGuide = (newGuide) => {
    const guideWithId = { ...newGuide, id: 'g-' + Date.now() };
    setCmsData((prev) => ({
      ...prev,
      guides: [...(prev.guides || []), guideWithId],
    }));
  };

  const updateGuide = (id, updatedGuide) => {
    setCmsData((prev) => ({
      ...prev,
      guides: (prev.guides || []).map((g) => (g.id === id ? { ...g, ...updatedGuide } : g)),
    }));
  };

  const deleteGuide = (id) => {
    setCmsData((prev) => ({
      ...prev,
      guides: (prev.guides || []).filter((g) => g.id !== id),
    }));
  };

  // 4. Routes / Itinerary (CRUD)
  const addRoute = (newRoute) => {
    const routeWithId = { ...newRoute, id: 'r-' + Date.now() };
    setCmsData((prev) => ({
      ...prev,
      routes: [...(prev.routes || []), routeWithId],
    }));
  };

  const updateRoute = (id, updatedRoute) => {
    setCmsData((prev) => ({
      ...prev,
      routes: (prev.routes || []).map((r) => (r.id === id ? { ...r, ...updatedRoute } : r)),
    }));
  };

  const deleteRoute = (id) => {
    setCmsData((prev) => ({
      ...prev,
      routes: (prev.routes || []).filter((r) => r.id !== id),
    }));
  };

  // 5. Gear (CRUD)
  const addGearItem = (category, newItem) => {
    const itemWithId = { ...newItem, id: 'g-' + Date.now() };
    setCmsData((prev) => ({
      ...prev,
      gear: {
        ...prev.gear,
        [category]: [...(prev.gear?.[category] || []), itemWithId],
      },
    }));
  };

  const updateGearItem = (category, idOrIndex, updatedItem) => {
    setCmsData((prev) => {
      const list = [...(prev.gear?.[category] || [])];
      if (typeof idOrIndex === 'number') {
        list[idOrIndex] = { ...list[idOrIndex], ...updatedItem };
      } else {
        const idx = list.findIndex((it) => it.id === idOrIndex);
        if (idx >= 0) list[idx] = { ...list[idx], ...updatedItem };
      }
      return {
        ...prev,
        gear: {
          ...prev.gear,
          [category]: list,
        },
      };
    });
  };

  const deleteGearItem = (category, idOrIndex) => {
    setCmsData((prev) => {
      let list = [...(prev.gear?.[category] || [])];
      if (typeof idOrIndex === 'number') {
        list.splice(idOrIndex, 1);
      } else {
        list = list.filter((it) => it.id !== idOrIndex);
      }
      return {
        ...prev,
        gear: {
          ...prev.gear,
          [category]: list,
        },
      };
    });
  };

  // 6. Weather Stations
  const updateWeatherStation = (stationKey, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      weatherStations: {
        ...prev.weatherStations,
        [stationKey]: { ...prev.weatherStations?.[stationKey], ...updatedFields },
      },
    }));
  };

  // 7. Departures (CRUD)
  const addDeparture = (newDeparture) => {
    const depWithId = { ...newDeparture, id: 'dep-' + Date.now() };
    setCmsData((prev) => ({
      ...prev,
      departures: [...(prev.departures || []), depWithId],
    }));
  };

  const updateDeparture = (id, updatedDeparture) => {
    setCmsData((prev) => ({
      ...prev,
      departures: (prev.departures || []).map((d) => (d.id === id ? { ...d, ...updatedDeparture } : d)),
    }));
  };

  const deleteDeparture = (id) => {
    setCmsData((prev) => ({
      ...prev,
      departures: (prev.departures || []).filter((d) => d.id !== id),
    }));
  };

  // 8. Reservations (CRUD)
  const addReservation = (reservation) => {
    const newRes = {
      id: 'res-' + Date.now(),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Provisional Review',
      ...reservation,
    };
    setCmsData((prev) => ({
      ...prev,
      reservations: [newRes, ...(prev.reservations || [])],
    }));
    return newRes;
  };

  const updateReservationStatus = (id, status) => {
    setCmsData((prev) => ({
      ...prev,
      reservations: (prev.reservations || []).map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  };

  const deleteReservation = (id) => {
    setCmsData((prev) => ({
      ...prev,
      reservations: (prev.reservations || []).filter((r) => r.id !== id),
    }));
  };

  // Reset all to default factory state
  const resetToDefaults = () => {
    setCmsData(DEFAULT_CONTENT);
    localStorage.setItem('zenith_cms_content', JSON.stringify(DEFAULT_CONTENT));
  };

  return (
    <CmsContext.Provider
      value={{
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
        addReservation,
        updateReservationStatus,
        deleteReservation,
        resetToDefaults,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
