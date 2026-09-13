# DESIGN.md — ZENITH // Mountain Trekking Expeditions

## 1. Brand Identity & Vision
A premium mountain expedition guide company offering safe, unforgettable ascents of the Alps (Mont Blanc 4,808m). We combine world-class certified mountain guides, top-quality safety gear, and clear, respectful alpine trekking. Clean, accessible language with an inspiring, luxurious tone.

---

## 2. Dual Color Palette Specification (Strict Two-Tone System)

### Palette 1: Deep Teal (`#004E64`)
- **Primary Deep Teal**: `#004E64` (RGB: 0, 78, 100) — Primary brand color
- **Deep Teal Shade**: `#003646` (RGB: 0, 54, 70) — Secondary shade for cards and depth
- **Deep Teal Dark**: `#00222C` (RGB: 0, 34, 44) — Deep dark background for hero and dark sections
- **Deep Teal Translucent**: `rgba(0, 78, 100, 0.4)` — Clean borders and accents

### Palette 2: Mist Gray (`#E0E5E9`)
- **Primary Mist Gray**: `#E0E5E9` (RGB: 224, 229, 233) — Bright alpine mist surface & text
- **Mist Clean White**: `#F4F7F9` (RGB: 244, 247, 249) — Clean white highlight cards
- **Mist Muted**: `#8A9AA5` (RGB: 138, 154, 165) — Subdued labels and notes
- **Mist Border**: `rgba(224, 229, 233, 0.2)` — Clean hairline borders

### Dual-Palette Alternation
- **Hero Canvas**: Deep Teal environment (`#00222C` / `#004E64`) with Mist Gray text.
- **About & Philosophy**: **MIST GRAY SURFACE (`#E0E5E9`)** with deep teal text and white cards.
- **Summit Route**: **DEEP TEAL CHAMBER (`#00222C`)** with clear route breakdown and profile.
- **Expedition Gear**: **MIST GRAY SURFACE (`#E0E5E9`)** with clean equipment cards.
- **Live Mountain Weather**: **DEEP TEAL CHAMBER (`#00222C`)** with real-time station metrics.
- **Expedition Dates & Booking**: **MIST GRAY SURFACE (`#E0E5E9`)** with reservation cards.
- **Footer**: Deep Teal Foundation (`#00171F`).

---

## 3. Typography Rules: Big Headlines in Cursive, Everything Else Simple & Readable

### Typeface Roles
- **Big Main Headlines Only**: `'Alex Brush'`, `'Pinyon Script'`, cursive (`.font-cursive`) — Used **ONLY** for big section headlines and hero title markers.
- **Subheadings & Labels**: `'Cinzel'`, serif (`.font-display`) or `'Outfit'`, sans-serif — Clean, structured, highly readable uppercase subtitles.
- **Body Text & Card Titles**: `'Outfit'`, sans-serif (`.font-sans`) — Clear, high-contrast, effortless readability for all descriptions, gear names, dates, and buttons.
- **Telemetry & Numbers**: `'JetBrains Mono'`, monospace (`.font-mono`) — Precision elevations and metrics.

### Typography Hierarchy Tokens
- **Big Hero Heading (Cursive)**: `clamp(4.5rem, 11vw, 10rem)` / `font-cursive` / `leading-none`
- **Section Big Headline (Cursive)**: `clamp(3.5rem, 8vw, 7.5rem)` / `font-cursive` / `leading-tight`
- **Subheadings (Readable)**: `0.75rem` to `1rem` / `font-display` / `tracking-widest` / `uppercase`
- **Card Titles & Names**: `1.125rem` to `1.5rem` / `font-sans` / `font-bold` / `leading-snug`
- **Body Copy**: `0.875rem` to `1.125rem` / `font-sans` / `leading-relaxed` / simple English

---

## 4. Spacing & Layout
- **Container Max Width**: `1440px`
- **Section Padding**: `py-28 md:py-40`
- **Borders**: Clean `1px solid rgba(0, 78, 100, 0.15)` on light / `1px solid rgba(224, 229, 233, 0.18)` on dark
