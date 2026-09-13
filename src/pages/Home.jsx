import React from 'react';
import SEOHead from '../components/SEOHead';
import HeroSequence from '../components/HeroSequence';
import Manifesto from '../components/Manifesto';
import RouteTelemetry from '../components/RouteTelemetry';
import GearManifesto from '../components/GearManifesto';
import WeatherTelemetry from '../components/WeatherTelemetry';
import DepartureRegistry from '../components/DepartureRegistry';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TravelAgency',
      '@id': 'https://zenith-expeditions.com/#organization',
      name: 'ZENITH Haute Alpine Expedition Maison',
      url: 'https://zenith-expeditions.com',
      logo: 'https://zenith-expeditions.com/favicon.svg',
      image: 'https://zenith-expeditions.com/cabinet_frames_600fps/frame_0001.webp',
      description:
        'Premier alpine mountaineering guide service in Chamonix. Guided ascents of Mont Blanc (4,808m) with certified UIAGM guides, full refuge bookings, and certified technical safety gear.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Place de l\'Église',
        addressLocality: 'Chamonix-Mont-Blanc',
        addressRegion: 'Haute-Savoie',
        postalCode: '74400',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 45.9237,
        longitude: 6.8694,
      },
      telephone: '+33-4-50-53-00-00',
      priceRange: '€€€',
    },
    {
      '@type': 'TouristTrip',
      '@id': 'https://zenith-expeditions.com/#mont-blanc-trip',
      name: 'Classic 5-Day Mont Blanc Summit Ascent (4,808m)',
      description:
        'Guided 5-day classic Goûter route ascent of Mont Blanc including Day 1 glacier training, refuge hut lodging, half-board meals, and UIAGM mountain guide leadership.',
      touristType: 'Alpine Climbers, Hikers, Mountaineers',
      offers: {
        '@type': 'Offer',
        price: '2450',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: 'https://zenith-expeditions.com/dates',
      },
      provider: {
        '@id': 'https://zenith-expeditions.com/#organization',
      },
    },
  ],
};

export default function Home({ onProgressUpdate }) {
  return (
    <>
      <SEOHead
        title="ZENITH // Guided Mont Blanc Expeditions (4,808m) | UIAGM Alpine Trekking"
        description="Ascend Mont Blanc (4,808m) with certified UIAGM mountain guides. Classic 5-day Goûter route, high mountain refuge bookings, technical gear hire, and live alpine weather telemetry."
        keywords="Mont Blanc expedition, Mont Blanc guided climb, UIAGM mountain guides, Chamonix trekking, Goûter route, climb Mont Blanc 2026, French Alps mountaineering, alpine climbing packages"
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      <HeroSequence onProgressUpdate={onProgressUpdate} onLoaded={() => {}} />
      <Manifesto />
      <RouteTelemetry />
      <GearManifesto />
      <WeatherTelemetry />
      <DepartureRegistry />
    </>
  );
}

