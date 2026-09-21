# ShadowFox Internship Submission — Sakthi Dental Clinic

Intermediate Level Internship Project. This document summarizes the
deliverable for submission and review. Every claim here is backed by the
record in `docs/COMMIT_REFERENCE.md` and the test results in
`docs/TESTING.md`.

## Project

**Sakthi Dental Clinic** — Hosur, Tamil Nadu, India.

## Objective

The client brief describes a professional, warm, responsive dental
healthcare website focused on women, children and families, with prominent
appointment CTAs, treatments, amenities, testimonials and contact
functionality — built to production standards (mobile-first, fast,
SEO-friendly, accessible, deployment-ready).

## Implemented solution

A full-stack clinic platform:

* **Public website** — home (hero, why-choose-us, treatments preview,
  facilities, testimonials, CTA), about with doctor profiles, treatments
  directory with live search and category filters, FAQ with search,
  contact with location/directions, gallery with lightbox, privacy
  policy, 404 page
* **Appointment request system** — one accessible site-wide modal wired to
  a real backend; submissions are stored requests (never auto-bookings)
* **Backend** — Express + TypeScript REST API with Zod validation, rate
  limiting, helmet/CORS security, JWT + bcrypt admin authentication
* **Database** — PostgreSQL via Prisma with versioned migrations and four
  models (`Appointment`, `AdminUser`, `NotificationLog`,
  `AppointmentActivity`)
* **Admin dashboard** — protected `/admin` area: paginated/searchable/
  sortable appointment table, workflow-guarded status transitions with
  confirm dialogs and toasts, analytics from real database aggregation,
  audit-trail activity feed
* **Notifications** — best-effort, failure-isolated notification service
  (logger transport by default; Resend email via environment variables)
* **Quality** — 39 automated tests, GitHub Actions CI, security audit,
  responsive at 320–1440 px, SEO metadata + Dentist JSON-LD

## Major features

* Responsive public website (7 routes + 404) with lavender healthcare
  design system
* Appointment request flow (modal → API → PostgreSQL → admin review)
* Admin authentication (JWT 8 h, bcrypt cost 12, uniform 401s)
* Appointment management: filters, search, sorting, pagination, details,
  status badges, confirmation dialogs
* Analytics: request trends (IST day buckets), status distribution, top
  treatments — real data only
* Audit trail for creations, transitions and deletions
* Notification workflow with delivery logging
* Floating quick-contact actions (call / WhatsApp / appointment)
* Cookie consent notice, error boundary, offline-aware appointment form

## Technical stack

React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · React Router 6 ·
Framer Motion · Lucide — Node.js · Express · PostgreSQL · Prisma ORM ·
Zod · JWT · bcrypt · Vitest · supertest · GitHub Actions

## Deployment

No production deployment exists yet. Deployment targets and procedures are
documented in the README (Vercel/Netlify for the frontend; any Node host
for the backend; managed PostgreSQL) — marked honestly as future work in
`docs/ROADMAP.md`.

## GitHub

Repository: `sakthi-dental-clinic` (see README for the canonical URL).
Conventional commits, phase-tracked documentation, CI workflows, issue/PR
templates.

## Testing

Actual results (Phase 7, 2026-09-21):

* Backend suite: **31/31 passing**
* Frontend suite: **8/8 passing**
* Automated E2E workflow check: **17/17 passing**
* Responsive audit: **zero horizontal overflow** in 15 viewport/route
  combinations (320–1280 px)
* Frontend lint + typecheck + build: clean; backend build: clean

Full detail: `docs/TESTING.md`.

## Known limitations

* No production deployment or real email delivery yet (both are
  configuration-level follow-ups, documented in the roadmap)
* Admin JWT stored in localStorage — internship-prototype scope, noted in
  `src/lib/auth.ts`; production should use httpOnly cookies
* Gallery/testimonial content ships with copyright-safe placeholders and
  brief-supplied text pending client confirmation
  (`docs/CLIENT_CONTENT_NOTES.md`)
* No Lighthouse or WCAG certification claims — see `docs/TESTING.md` for
  the honest scope of what was measured

## Documentation index

`README.md` (project overview) · `docs/ARCHITECTURE.md` ·
`docs/API.md` · `docs/TESTING.md` · `docs/PROJECT_PHASES.md` ·
`docs/COMMIT_REFERENCE.md` · `docs/AI_PROJECT_CONTEXT.md` ·
`docs/ROADMAP.md` · `docs/SECURITY_AUDIT.md` ·
`docs/CLIENT_CONTENT_NOTES.md` · `CHANGELOG.md`
