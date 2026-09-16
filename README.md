# Sakthi Dental Clinic

## Project Overview

A modern, responsive dental clinic website created for **Sakthi Dental Clinic, Hosur**, as part of the **ShadowFox Intermediate Level Internship Project**.

The site presents the clinic's treatments, doctors, facilities and patient testimonials with a warm, trustworthy healthcare aesthetic — lavender/white pastel palette, generous whitespace and clean typography — and drives every page toward a single conversion action: **Fix an Appointment**.

## Features

* Responsive, mobile-first design (320px → large desktop)
* Modern healthcare UI with a consistent component system
* Prominent appointment CTAs across all pages
* Treatment directory (15 treatments) with learn-more cards
* Doctor profiles with graceful image fallbacks
* Patient testimonial carousel (accessible, autoplay-aware)
* Clinic facilities / amenities section
* FAQ accordion with semantic, accessible expand/collapse
* Contact form with client-side validation and success state
* Privacy Policy page
* SEO-friendly structure (meta, Open Graph, robots.txt, sitemap.xml)
* Accessible UI (semantic HTML, focus states, aria attributes)
* Animated mobile navigation (slide-in panel, scroll lock, Escape to close)
* Subtle Framer Motion animations that respect `prefers-reduced-motion`
* 404 fallback route

## Tech Stack

* [React 18](https://react.dev)
* [Vite 5](https://vitejs.dev)
* [TypeScript](https://www.typescriptlang.org)
* [Tailwind CSS 3](https://tailwindcss.com)
* [React Router 6](https://reactrouter.com)
* [Framer Motion](https://www.framer.com/motion/)
* [Lucide React](https://lucide.dev) icons

## Advanced Features

* **Appointment request flow** — one site-wide modal (keyboard accessible, Escape to close, focus handling, inline validation, submitting + success states). Every "Fix an Appointment" CTA on the site opens this same flow. This is a frontend request flow only — no booking backend is connected; submissions are simulated and the success message asks the clinic team to confirm by phone.
* **Floating quick contact actions** — desktop floating action group with tooltips and a mobile fixed bottom bar (Call `tel:+919862890897`, WhatsApp chat with a prefilled message, and Appointment). These are direct contact actions, not automated booking.
* **Location / directions section** — address card with a Google Maps **Get Directions** link built from the supplied address, plus a keyless Google Maps embed (no API key used or exposed).
* **Treatment search and filtering** — live search across treatment titles and descriptions, category filter chips (General, Restorative, Cosmetic, Orthodontics, Pediatric, Oral Surgery) derived from the existing data, result count ("Showing X of 15"), Clear Filters and a styled empty state.
* **FAQ search** — live filtering across all 14 questions and answers with Clear Search and an empty state; accordion behaviour unchanged.
* **Doctor profile modal** — every doctor card opens a modal showing only supplied information (name, role, focus line) with an appointment CTA wired to the shared flow. No degrees, years or affiliations are invented.
* **Clinic gallery** — dedicated `/gallery` page with category filters (Clinic / Treatment / Facilities / Team), responsive grid, and a full-screen lightbox (close, previous/next, arrow-key navigation, focus handling, image titles/alt text, lazy-loaded images). Ships with copyright-safe placeholder illustrations; drop the client's real photos into `public/images/gallery/` (same filenames) to go live.
* **Accessibility improvements** — skip-to-content link, `main` landmark id, labelled search inputs, `aria-pressed` filter chips, `aria-live` result counts, focus-visible outlines everywhere, Escape/focus-trap in all dialogs, and reduced-motion support via `MotionConfig reducedMotion="user"` plus CSS fallbacks.
* **Performance improvements** — route-level code splitting (lazy pages), lazy-loaded gallery images and map iframe, shared icon map module for treatment cards, memoized filtering, and no new runtime dependencies added in Phase 2.

## Current Routes

| Route | Description |
| --- | --- |
| `/` | Home |
| `/about` | About Dr. Anupriya + doctors |
| `/treatments` | Treatment directory with search & filters |
| `/faq` | FAQs with search |
| `/contact` | Contact form + location/map section |
| `/gallery` | Clinic gallery with lightbox |
| `/privacy-policy` | Privacy policy |
| `*` | 404 not-found page |

## Project Status

**Client-ready frontend implementation.** All features are complete and verified (lint, type-check, production build). The contact and appointment forms are frontend-only — submissions are not sent to a production backend and appointments are not auto-booked; the clinic team confirms requests by phone.

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, assurance banner, why choose us, treatments preview, facilities, testimonials, final CTA |
| `/about` | Dr. Anupriya's story, mission & vision, doctors grid |
| `/treatments` | Complete treatment directory |
| `/faq` | 14 accessible FAQ accordion items |
| `/contact` | Contact form (validated) + reach-us information |
| `/privacy-policy` | Privacy policy |
| `*` | 404 not-found page |

## Local Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (recommended)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** and import the repo.
3. Vercel auto-detects Vite. Keep the defaults:
   * Build command: `npm run build`
   * Output directory: `dist`
4. Click **Deploy**.
5. For client-side routing, the SPA already falls back gracefully; if you ever see 404s on deep links, add a rewrite of all paths to `/index.html` (Vercel handles this automatically for Vite projects).

### Netlify

1. Push to GitHub and import the site in Netlify.
2. Build command: `npm run build`, publish directory: `dist`.
3. Add a `_redirects` file in `public/` containing `/*  /index.html  200` for SPA routing.

### GitHub Pages

1. Install `gh-pages` as a dev dependency.
2. Add `"deploy": "gh-pages -d dist"` to scripts and set `base: '/sakthi-dental-clinic/'` in `vite.config.ts`.
3. Run `npm run build && npm run deploy`.

## Project Structure

```
sakthi-dental-clinic/
├── public/               # Static assets, favicon, robots.txt, sitemap.xml, images
├── src/
│   ├── components/
│   │   ├── layout/       # Navbar, Footer, MobileMenu, ScrollToTop
│   │   ├── common/       # Button, SectionHeading, PageHero, Container, AnimatedSection
│   │   ├── home/         # Hero, AssuranceBanner, WhyChooseUs, TreatmentsPreview,
│   │   │                 # Facilities, Testimonials, FinalCTA
│   │   ├── treatments/   # TreatmentCard, TreatmentGrid
│   │   ├── doctors/      # DoctorCard
│   │   ├── faq/          # FAQItem
│   │   └── contact/      # ContactForm, ContactInfo
│   ├── pages/            # Home, About, Treatments, FAQ, Contact, PrivacyPolicy, NotFound
│   ├── data/             # treatments, doctors, testimonials, faqs, facilities (typed data)
│   ├── lib/              # constants (site info, nav/footer links), utils
│   ├── App.tsx           # Routes + layout shell
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind layers + base styles
├── tailwind.config.js    # Lavender brand palette, fonts, shadows
└── index.html            # SEO meta, Open Graph, fonts
```

All clinic content (treatments, doctors, testimonials, FAQs, facilities, contact details) lives in typed files under `src/data/` and `src/lib/constants.ts`, so text can be updated without touching components.

## GitHub

Repository: https://github.com/<YOUR_GITHUB_USERNAME>/sakthi-dental-clinic

Suggested topics: `react` `vite` `typescript` `tailwindcss` `healthcare` `dental-clinic` `frontend` `responsive-design` `shadowfox` `website`

## Client

Sakthi Dental Clinic
B2/8, SBM Layout, Anthivadi,
Hosur, Tamil Nadu 635109, India

## Internship

ShadowFox Internship — Intermediate Level

## Disclaimer

This project is created as a frontend internship/client-style implementation based on the supplied project brief. All content shown is sourced from the brief; the appointment action is handled by the clinic team.
