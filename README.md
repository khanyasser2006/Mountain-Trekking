# 🏔️ Zenith

A cinematic site for a premium Mont Blanc trekking expedition company — a 300-frame drone-flythrough scroll hero, an interactive route itinerary, expedition dates and gear pages, procedurally synthesized alpine wind ambience, and a client-side admin CMS for managing content.

![React](https://img.shields.io/badge/-React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)
![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)

---

## 🧰 Technologies

- React 18
- Vite 6
- JavaScript
- React Router
- Tailwind CSS
- GSAP (ScrollTrigger) + Lenis
- Web Crypto API (PBKDF2 password hashing)
- Playwright (end-to-end smoke testing)

---

## ✨ Features

- **300-Frame Drone Hero**: A summit-approach drone flythrough, motion-interpolated to 600 synthetic frames via FFmpeg, then down-sampled to 300 optimized WebP frames, scrubbed against scroll with GSAP and Lenis.
- **Interactive Route Itinerary**: A stage-by-stage breakdown of the expedition route with a soft click sound on each selection.
- **Procedural Alpine Wind Ambience**: A generative wind and telemetry soundscape synthesized live via the Web Audio API, not a looped recording.
- **Expedition Dates & Gear Pages**: Dedicated pages for upcoming departure dates and required equipment.
- **PBKDF2 Password Hashing**: Account passwords are hashed client-side with 100,000 PBKDF2 iterations and a random salt, with constant-time verification.
- **Login Rate Limiting**: Failed sign-ins lock out for 15 minutes after 5 attempts.
- **Admin CMS**: A dashboard for editing site content, including the weather station readouts and route stages.
- **Automated Navigation Smoke Test**: A Playwright script that loads the site, scrolls, clicks through to booking, and checks for console errors, capturing screenshots along the way.
- **CDN-Level Security Headers**: A `public/_headers` file configures response headers at the hosting layer, since there's no application server to set them in code.
- **SEO Basics Included**: A sitemap, `robots.txt`, a web manifest, and a dedicated `SEOHead` component with canonical URLs and social preview tags.
- **Dual-Palette Editorial Design**: An alternating deep-teal/mist-gray section rhythm with cursive display headlines, documented in a written design spec.

---

## 🪜 The Process

I started with the hero, using the same technique as the other cinematic sites in this series but a different source: a ten-second drone clip flying toward the summit. Rather than just extracting frames at the video's native rate, I ran it through FFmpeg's motion-interpolation filter to synthesize a smooth 600-frame sequence, then wrote a second pass that down-sampled it to 300 evenly spaced frames and re-encoded them as WebP — which took the frame directory from 181MB down to 24MB with no visible loss in scrubbing smoothness.

With the hero performant, I built the rest of the site as a proper multi-page app with React Router this time, rather than the hand-rolled routers or conditional rendering I'd used before, since the page count here didn't justify reinventing that wheel again.

The route itinerary and weather sections needed to feel alive without a real backend, so both read from the same CMS content object — the "live" weather readouts are admin-editable data rather than a real meteorological feed, which felt like a more honest way to demo the interaction than pretending to integrate a weather API I hadn't actually built.

For the account system, I adapted the same alpine-wind soundscape technique from an earlier project, but pushed the password hashing further this time: PBKDF2 at 100,000 iterations with a random salt and constant-time verification, plus input sanitization and rate limiting, all built as one small, dependency-free crypto module.

The last piece was writing an actual Playwright script to smoke-test navigation — load the homepage, scroll past the preloader, click through to booking — since I wanted at least one automated check that scrolling and routing hadn't silently broken, rather than relying on manually clicking through the site before every change.

---

## 📚 What I Learned

- **Motion-Interpolated Frame Synthesis**: Used FFmpeg's `minterpolate` filter to generate smooth intermediate frames from a lower-frame-rate source clip, instead of being limited to the video's native frame count.
- **Measuring an Optimization, Not Just Doing It**: Down-sampled and re-encoded the frame sequence to WebP and measured the actual result — 181MB down to 24MB — rather than assuming the optimization pass helped.
- **PBKDF2 Over a Single Hash Pass**: Chose PBKDF2 with 100,000 iterations specifically because it's deliberately slow, unlike a single SHA-256 pass, which matters if a stored hash ever leaks.
- **Being Honest About Simulated Data**: Wired the "live" weather station display to admin-editable CMS content rather than dressing up static numbers as a real API integration.
- **Automated Smoke Testing with Playwright**: Wrote a script that actually drives a browser — scrolling, clicking, checking console errors — instead of testing only by hand.
- **Setting Security Headers Without a Server**: Used a hosting-platform `_headers` file to apply security headers at the CDN level, since a static site has no backend process to set them in code.
- **Reusing a Proven Audio Technique, Re-Themed**: Adapted an existing generative noise-synthesis approach to a new context — alpine wind instead of ambient hum — rather than treating every project's sound design as a blank page.

---

## 🔧 How Can It Be Improved?

- The admin gate still only checks `isAdmin` from client-side auth state — the password hashing is genuinely strong, but there's no server to verify it against, so access remains bypassable from the browser console, the same limitation as the other client-side-only sites in this series.
- Replace the hardcoded `zenith-expeditions.com` origin in `SEOHead.jsx` and `Home.jsx` with the real production domain (or an environment variable) before deploying, since canonical URLs and social preview images currently point at a placeholder.
- Move CMS-edited content from `localStorage` into a real backend, so an admin's changes are visible to actual site visitors rather than just the browser that made them.
- Connect the "Live Mountain Weather" display to an actual weather API if real-time conditions matter for trip planning, since it currently reflects admin-entered data rather than live readings.
- Expand the Playwright script beyond a single navigation smoke test into a small suite that also covers the auth and booking flows.
- Consider a progressive loading strategy for the 300 hero frames instead of loading them all before the sequence becomes scrubbable.

---

## 🚀 Running the Project

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/zenith-expeditions.git
cd zenith-expeditions
```

---

### Step 2 — Install Dependencies

**Prerequisites:** Node.js 18+

```bash
npm install
```

---

### Step 3 — Run the Development Server

```bash
npm run dev
```

---

### Step 4 — Open the Application

```
http://localhost:3000
```

*(This project pins Vite to port 3000 in `vite.config.js`, rather than the usual 5173 default.)*

---

## 🎥 Demo

*Add a screen recording of the hero flythrough here — the `tests/` folder already has a few reference screenshots (`screenshot_admin.png`, `screenshot_dates.png`) worth including too.*

---
