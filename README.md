# Sakthi Dental Clinic

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?logo=githubactions&logoColor=white)

**Sakthi Dental Clinic** is a modern full-stack healthcare web application developed for Sakthi Dental Clinic in Hosur. The project combines a responsive public-facing dental clinic website with an appointment request system, secure admin dashboard, analytics, notifications and operational management features.

## Overview

Built for **Sakthi Dental Clinic, Hosur** as part of the **ShadowFox Intermediate Level Internship Project**.

The site presents the clinic's treatments, doctors, facilities and patient testimonials with a warm, trustworthy healthcare aesthetic — lavender/white pastel palette, generous whitespace and clean typography — and drives every page toward a single conversion action: **Fix an Appointment**. Appointment requests are stored in PostgreSQL, reviewed by clinic staff in a protected admin dashboard, tracked through a status workflow, and accompanied by patient notifications, analytics and an audit trail.

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

## Architecture

```
Patient
  ↓
React Frontend (Vite, :5173)
  ↓  HTTPS / JSON
REST API  ← →  React Admin Dashboard (:5173/admin)
  ↓
Express Backend (Node.js, :5000)
  ↓
Prisma ORM
  ↓
PostgreSQL

Admin
  ↓
Admin Login (/admin/login)
  ↓
JWT Authentication (8 h, HS256, bcrypt-hashed credentials)
  ↓
Admin Dashboard
  ↓
Protected APIs (requireAuth)

Notification flow (optional, environment-dependent)
Appointment event → Appointment Service → Notification Service
                                          → logger (default, always on)
                                          → email provider (only when EMAIL_PROVIDER is set)
```

Every layer above is implemented exactly as shown; the email provider box is the only optional component.

## Appointment System

* Site-wide accessible modal (keyboard support, inline validation, submitting + success states); every "Fix an Appointment" CTA opens the same flow
* `POST /api/appointments` with Zod server-side validation, Indian phone/date/time rules, and rate limiting (10 requests / 15 min per IP)
* Submissions are **requests, not bookings** — stored as `PENDING` and confirmed by clinic staff
* Offline-safe: if the API is unreachable the form says so and offers the clinic phone number

## Admin Dashboard

* Protected SPA routes (`/admin/login`, `/admin`) outside the public site chrome
* Paginated, searchable, sortable appointment table (desktop table / mobile cards) with status chips communicating status through text, not color alone
* Workflow-guarded status transitions (PENDING → CONFIRMED → COMPLETED, CANCELLED from pending/confirmed) with confirm-then-act dialogs
* Toast feedback on login, logout and every status change
* Loading, error (with retry), and empty states throughout

## Notifications

Every appointment event (created, confirmed, completed, cancelled) triggers a best-effort notification with a status-accurate message. The default `logger` transport writes deliveries to the server log; setting `EMAIL_PROVIDER=resend` plus `RESEND_API_KEY` and `EMAIL_FROM` enables real email with zero code changes. Every attempt is recorded in the `NotificationLog` table (SENT/FAILED), and a notification failure never fails the appointment itself.

## Analytics

Dashboard analytics computed server-side with Prisma aggregation — real database data only, never fake numbers:

* Request trends (7/30/90-day ranges, Asia/Kolkata day buckets)
* Status distribution (pending / confirmed / completed / cancelled)
* Most-requested treatments (top 8, with a small-sample note when data is thin)
* Status count cards for the whole table

## Audit Trail

Every appointment creation and status transition writes an `AppointmentActivity` row: what changed, from which status to which, by which administrator, and when. The dashboard's activity panel lists the newest entries.

## Authentication

* JWT bearer tokens (8 h expiry, HS256 pinned on verify, ≥32-char secret enforced at boot)
* bcrypt (cost 12) password hashing; hashes never leave the database
* Identical error for unknown email and wrong password (no user enumeration)
* All admin data endpoints behind `requireAuth`; analytics, audit logs and patient data are never public

## Database

PostgreSQL via Prisma with a versioned migration history:

| Model | Purpose |
| --- | --- |
| `Appointment` | Patient requests — contact, treatment, preferred date/time, status workflow; indexed on status, createdAt, email, preferredDate |
| `AdminUser` | Clinic staff accounts (bcrypt hashes, unique email) |
| `NotificationLog` | One row per notification attempt (type, channel, SENT/FAILED) |
| `AppointmentActivity` | Audit trail for creations and status transitions |

## API

Full reference in [docs/API.md](docs/API.md). Summary:

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/login` | Public (rate-limited) |
| POST | `/api/appointments` | Public (rate-limited) |
| GET | `/api/appointments` (paginated, filterable) | Admin |
| GET | `/api/appointments/stats` | Admin |
| GET | `/api/appointments/trends` | Admin |
| GET | `/api/appointments/treatments` | Admin |
| GET | `/api/appointments/activity` | Admin |
| GET | `/api/appointments/:id` | Admin |
| PATCH | `/api/appointments/:id/status` | Admin |
| DELETE | `/api/appointments/:id` | Admin |
| GET | `/api/health` | Public |

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

**Tests** (39 total):

```bash
npm test          # frontend: 8 Vitest unit/component tests (jsdom, no server needed)
cd backend
npm test          # backend: 31 Vitest + supertest API tests (needs local PostgreSQL + backend/.env)
```

Backend tests run against the local development database and clean up only the rows they create; CI (below) uses an ephemeral throwaway database instead.

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
npm run build          # frontend: tsc -b && vite build
npm run preview

cd backend
npm run build          # backend: tsc → dist/
```

## CI/CD

GitHub Actions (`.github/workflows/`) runs on every push and PR to `main`:

* **Frontend job** — `npm ci`, lint, typecheck + build, unit/component tests
* **Backend job** — ephemeral PostgreSQL 16 service container, `prisma generate`, `prisma migrate deploy`, seed, build, all 31 API tests. CI-only credentials exist solely inside the throwaway container; no repository secrets are used.
* **Scheduled build check** — weekly multi-Node (20/22) build verification to catch dependency drift

## Screenshots

Not committed yet. Run locally (`npm run dev`) or open the deployed URL to see the site; screenshots to be added once the production domain is live.

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
├── .github/
│   ├── workflows/        # ci.yml (push/PR) + build.yml (scheduled)
│   ├── ISSUE_TEMPLATE/   # bug_report.md, feature_request.md
│   └── pull_request_template.md
├── docs/
│   ├── API.md            # Full REST API reference
│   ├── AI_PROJECT_CONTEXT.md  # Canonical context for AI coding agents
│   ├── PROJECT_PHASES.md      # Phase tracker
│   ├── COMMIT_REFERENCE.md    # Per-commit purpose/changes/validation record
│   ├── SECURITY_AUDIT.md      # Findings, fixes and accepted risks
│   └── ROADMAP.md             # Completed work vs. unimplemented future items
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
│   │   └── admin/        # AdminHeader, AdminSidebar, DashboardStats, AnalyticsPanel, ActivityFeed,
│   │                     # AppointmentTable, AppointmentFilters, AppointmentDetails, StatusChip,
│   │                     # Toast, RequireAdminAuth
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

## Project Phases

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Public responsive website | Complete |
| 2 | Interactive UX (search, filters, modals, gallery, floating contact) | Complete |
| 3 | SEO, accessibility, performance, deployment prep | Complete |
| 4 | Full-stack appointment management (API, PostgreSQL, admin auth + dashboard) | Complete |
| 5 | Notifications, analytics, audit trail, admin UX | Complete |
| 6 | Testing, CI/CD, security audit, GitHub polish | Complete |

Details: [docs/PROJECT_PHASES.md](docs/PROJECT_PHASES.md) · per-commit record: [docs/COMMIT_REFERENCE.md](docs/COMMIT_REFERENCE.md) · future work: [docs/ROADMAP.md](docs/ROADMAP.md) · security posture: [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md)

## Development Note

AI-assisted development tools were used during implementation, with project architecture, requirements, testing and final integration reviewed as part of the development workflow. Commits are authored by the repository owner; see `docs/AI_PROJECT_CONTEXT.md` for the maintenance rules future contributors (human or AI) are expected to follow.

## GitHub

Repository: https://github.com/deepak251817-collab/sakthi-dental-clinic

Topics: `react` `typescript` `vite` `tailwindcss` `nodejs` `express` `postgresql` `prisma` `healthcare` `dental-clinic` `appointment-system` `full-stack` `responsive-design` `shadowfox` `frontend` `backend`

## Client

Sakthi Dental Clinic
B2/8, SBM Layout, Anthivadi,
Hosur, Tamil Nadu 635109, India

## Internship

ShadowFox Internship — Intermediate Level

## Disclaimer

This project is created as an internship/client-style implementation based on the supplied project brief. All content shown is sourced from the brief; the appointment action is handled by the clinic team. The system stores only the information patients knowingly submit in the appointment form — no payment data, medical history or diagnosis features. Token handling in the admin area uses localStorage and is appropriate for a prototype, not enterprise-grade authentication.
