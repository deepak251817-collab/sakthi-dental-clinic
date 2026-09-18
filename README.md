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
* SEO metadata per route (unique titles/descriptions, canonical URLs, Open Graph, Twitter cards, robots.txt, sitemap.xml)
* Local business structured data (Dentist JSON-LD with facts from the client brief only)
* Privacy/cookie consent notice (preference stored locally; no analytics or tracking loaded)
* Global error boundary with a branded fallback and recovery actions
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

### Backend

* Node.js + Express + TypeScript (REST API)
* PostgreSQL via Prisma ORM
* JWT authentication (8 h tokens) + bcrypt password hashing
* Zod request validation
* helmet / CORS / express-rate-limit security middleware
* Vitest + supertest API test suite

## Advanced Features

* **Appointment request flow** — one site-wide modal (keyboard accessible, Escape to close, focus handling, inline validation, submitting + success states). Every "Fix an Appointment" CTA on the site opens this same flow. Valid submissions are sent to the real backend (`POST /api/appointments`), stored in PostgreSQL, and reviewed by the clinic team in the admin dashboard — submission is a request, not an automatic booking. If the API is unreachable the form shows an offline state with the clinic phone number.
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
| `/admin/login` | Admin sign-in |
| `/admin` | Protected appointment dashboard |
| `*` | 404 not-found page |

## Project Status

**Full-stack implementation.** Public site, appointment API, PostgreSQL storage and the admin dashboard are complete and verified (lint, type-check, builds, API test suite). The contact form remains frontend-only; appointment requests are stored and must be confirmed by the clinic team — nothing is auto-booked.

## Client Content Note

The website content is based on the Sakthi Dental Clinic project brief supplied for the ShadowFox internship.

Note that the brief contains two different references to clinic availability hours. The Contact page specifies:

> Sunday to Saturday: 9 AM to 7 PM

The implementation uses the Contact page timing for contact information and structured data, and keeps the Home amenities wording "Doctors available daily" instead of displaying a conflicting hour.

## Full-Stack Architecture

Public Website → Appointment Form → REST API → PostgreSQL → Admin Dashboard → Status Management.

* **Frontend:** React + Vite + TypeScript (public site + admin dashboard under `/admin`)
* **Backend:** Node.js + Express + TypeScript — controllers, services, routes and Zod schemas kept in separate layers (`backend/README.md`)
* **Database:** PostgreSQL via Prisma (`Appointment`, `AdminUser` models; migration history in `backend/prisma/migrations`)
* **Authentication:** JWT bearer tokens (8 h) + bcrypt-hashed admin passwords
* **Validation:** Zod on every request body/query; strict schemas reject unknown properties
* **API reference:** [docs/API.md](docs/API.md)

## Performance

Optimizations actually implemented:

* Route-level code splitting — every page is its own lazy-loaded chunk
* Lazy-loaded non-critical images and the map iframe; hero imagery eagerly loaded
* Preconnected font delivery with `display=swap` to prevent layout shifts
* Memoized appointment context and filtered lists; shared icon-map module for treatment cards
* Compressed OG image and lightweight SVG brand assets (no heavy media)
* Global `prefers-reduced-motion` support — entrance animations and carousel autoplay respect it
* Zero new runtime dependencies added across Phases 2–3

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, assurance banner, why choose us, treatments preview, facilities, testimonials, final CTA |
| `/about` | Dr. Anupriya's story, mission & vision, doctors grid |
| `/treatments` | Complete treatment directory |
| `/faq` | 14 accessible FAQ accordion items |
| `/contact` | Contact form (validated) + reach-us information |
| `/gallery` | Clinic gallery with lightbox |
| `/privacy-policy` | Privacy policy |
| `*` | 404 not-found page |## Local Setup

**Frontend** (port 5173):

```bash
npm install
npm run dev
```

**Backend** (port 5000) — requires a local PostgreSQL on port 5432:

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (DATABASE_URL, JWT_SECRET,
# ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD for the dev seed)
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Then open http://localhost:5173 and sign in at http://localhost:5173/admin/login with the seeded dev admin.

**Tests** (backend, against the local database):

```bash
cd backend
npm test
```

### Environment variables

Frontend (`.env`, see `.env.example`):

* `VITE_API_URL` — backend base URL, defaults to `http://localhost:5000/api`
* `VITE_SITE_URL` — canonical site URL for SEO metadata

Backend (`backend/.env`, see `backend/.env.example`):

* `DATABASE_URL` — PostgreSQL connection string
* `JWT_SECRET` — random string, at least 32 characters
* `PORT` — API port (default 5000)
* `FRONTEND_URL` — allowed CORS origin (default `http://localhost:5173`)
* `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials used by `npm run db:seed` (development only)

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
5. Deep links are covered: the committed `vercel.json` rewrites all paths to `/index.html` for SPA routing.
6. Optional: set the `VITE_SITE_URL` environment variable in Vercel (Project → Settings → Environment Variables) to the final domain (e.g. `https://sakthidentalclinic.in`). It drives canonical links and Open Graph/Twitter URLs via `src/lib/siteConfig.ts` — see `.env.example`. Before submitting `public/sitemap.xml` to search engines, confirm the domain listed there matches the live one.

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
├── backend/              # Express + Prisma API (see backend/README.md)
│   ├── prisma/           # Schema, migrations, seed
│   ├── src/              # config, controllers, middleware, routes, schemas, services, utils
│   ├── tests/            # Vitest + supertest API suite
│   └── .env.example      # Documented backend variables (real .env is git-ignored)
├── docs/
│   └── API.md            # Full REST API reference
├── public/               # Static assets, favicon, robots.txt, sitemap.xml, images
├── src/
│   ├── components/
│   │   ├── layout/       # Navbar, Footer, MobileMenu, ScrollToTop
│   │   ├── common/       # Button, SectionHeading, PageHero, Container, AnimatedSection,
│   │   │                 # Modal, AppointmentButton, CookieConsent, ErrorBoundary
│   │   ├── seo/          # SEO (per-route metadata) + structuredData (Dentist JSON-LD)
│   │   ├── appointment/  # AppointmentModal, AppointmentForm, appointment context
│   │   ├── home/         # Hero, AssuranceBanner, WhyChooseUs, TreatmentsPreview,
│   │   │                 # Facilities, Testimonials, FinalCTA
│   │   ├── treatments/   # TreatmentCard, TreatmentGrid, TreatmentSearch, TreatmentFilters
│   │   ├── doctors/      # DoctorCard, DoctorModal
│   │   ├── faq/          # FAQItem, FAQSearch
│   │   ├── gallery/      # GalleryGrid, GalleryImage, GalleryLightbox
│   │   │   └── contact/      # ContactForm, ContactInfo, FloatingContactBar, LocationSection
│   │   └── admin/        # AdminHeader, AdminSidebar, DashboardStats, AppointmentTable,
│   │                     # AppointmentFilters, AppointmentDetails, StatusChip, RequireAdminAuth
│   ├── data/             # treatments, doctors, testimonials, faqs, facilities (typed data)
│   ├── lib/              # constants, utils, api client, auth token handling
│   ├── pages/            # …, AdminLogin, AdminDashboard
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

This project is created as an internship/client-style implementation based on the supplied project brief. All content shown is sourced from the brief; the appointment action is handled by the clinic team. The system stores only the information patients knowingly submit in the appointment form — no payment data, medical history or diagnosis features. Token handling in the admin area uses localStorage and is appropriate for a prototype, not enterprise-grade authentication.
