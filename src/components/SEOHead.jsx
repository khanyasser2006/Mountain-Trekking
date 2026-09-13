import { useEffect } from 'react';

const DEFAULT_ORIGIN = 'https://zenith-expeditions.com';
const DEFAULT_IMAGE = `${DEFAULT_ORIGIN}/cabinet_frames_600fps/frame_0001.webp`;

function setMetaTag(name, content, isProperty = false) {
  if (!content) return;
  const attribute = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    // 1. Document Title
    const formattedTitle = title
      ? (title.includes('ZENITH') ? title : `${title} | ZENITH // Mont Blanc Expeditions`)
      : 'ZENITH // Guided Mont Blanc Expeditions (4,808m) | UIAGM Alpine Trekking';
    document.title = formattedTitle;

    // 2. Canonical URL
    const fullCanonical = canonicalPath.startsWith('http')
      ? canonicalPath
      : `${DEFAULT_ORIGIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    setCanonical(fullCanonical);

    // 3. Primary Meta Tags
    setMetaTag('title', formattedTitle);
    if (description) {
      setMetaTag('description', description);
    }
    if (keywords) {
      setMetaTag('keywords', keywords);
    }
    setMetaTag(
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 4. Open Graph Tags
    setMetaTag('og:title', formattedTitle, true);
    if (description) {
      setMetaTag('og:description', description, true);
    }
    setMetaTag('og:url', fullCanonical, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', 'ZENITH Haute Alpine Expeditions', true);

    // 5. Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', formattedTitle);
    if (description) {
      setMetaTag('twitter:description', description);
    }
    setMetaTag('twitter:image', ogImage);

    // 6. Schema.org JSON-LD Structured Data
    const SCRIPT_ID = 'seo-structured-data-jsonld';
    let scriptTag = document.getElementById(SCRIPT_ID);

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType, noindex, jsonLd]);

  return null;
}
