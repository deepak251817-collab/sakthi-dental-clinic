# Changelog

All notable changes to this project, documented per development phase.
Format based on [Keep a Changelog](https://keepachangelog.com); per-commit
details live in [docs/COMMIT_REFERENCE.md](docs/COMMIT_REFERENCE.md).

## Phase 6 — Testing, CI/CD, security & GitHub polish (2026-09-20)

### Added
- Frontend test suite: Vitest 2 + Testing Library — API client unit tests (stats normalization, PATCH header merge regression guard, field-error mapping, network errors, query building) and component tests (treatment filters, FAQ search, status chips)
- CI workflow (`.github/workflows/ci.yml`): frontend lint/build/tests + backend migrate/seed/build/tests on an ephemeral PostgreSQL 16 service container, on push and PRs to main
- Scheduled build workflow (`.github/workflows/build.yml`): weekly build verification on Node 20 and 22
- GitHub issue templates (bug report, feature request) and pull request template
- `docs/SECURITY_AUDIT.md` — verified controls, fixes, and analyzed accepted risks
- `docs/ROADMAP.md` — completed work vs. explicitly unimplemented future items
- `CHANGELOG.md` (this file)

### Changed
- `jwt.verify` now pins the HS256 algorithm, rejecting alg-header confusion tokens
- `react-router-dom` raised to 6.30.6 (latest 6.x)
- README restructured for a professional repository front page (architecture diagram, full-stack sections, phases, badges)
- `docs/API.md` rewritten to document every actual endpoint including analytics and the audit trail

### Security
- Dependency audit: safe in-major fixes applied; remaining advisories (Prisma CLI toolchain, react-router 7-only, Vite dev-server) analyzed and documented in `docs/SECURITY_AUDIT.md`
- Verified: bcrypt-12 hashing, no hash exposure, uniform auth errors, pinned CORS, helmet, rate limits, parameterized queries, 10kb body cap, no secrets in the repository

## Phase 5 — Clinic operations (2026-09-20)

### Added
- Appointment notification service with pluggable transport (console logger default; Resend/SMTP via env vars) and status-accurate templates for created/confirmed/completed/cancelled events
- `NotificationLog` model recording every attempt (SENT/FAILED) with failure-isolation tests
- Analytics: `GET /appointments/trends` (IST day buckets) and `GET /appointments/treatments` (top treatments) with a `preferredDate` index; dashboard analytics panel (trend chart, status distribution, top treatments, 7/30/90-day ranges)
- `AppointmentActivity` audit trail + `GET /appointments/activity` endpoint + dashboard activity feed
- Admin UX: toast feedback on login/logout/status changes; sortable appointment columns with `aria-sort`

### Fixed
- Dashboard stats casing mismatch (backend `PENDING` → frontend `pending`) surfaced during live browser E2E

## Phase 4 — Full-stack appointment management (2026-09-20)

### Added
- Express + TypeScript REST API (`backend/`) with Zod validation, JWT auth (8 h), bcrypt, helmet, CORS pinning, and rate limits
- PostgreSQL via Prisma: `Appointment` and `AdminUser` models, migrations, dev seed
- Public appointment API (`POST /appointments`) wired to the existing form, with offline fallback state
- Admin dashboard (`/admin`): stats cards, debounced search, status/date filters, pagination, details modal, workflow-guarded status updates, confirm-then-act destructive actions, logout, mobile card layout, protected routes
- 21 API tests (validation, auth, unauthorized access, workflow, pagination, filters, delete)

### Fixed
- API client header-merge bug found in live browser testing (Authorization header replaced Content-Type, breaking PATCH bodies)

## Phase 3 — Production readiness (2026-09-20)

### Added
- Per-route SEO metadata (titles, descriptions, canonicals, Open Graph, Twitter cards), robots.txt, sitemap.xml, Dentist JSON-LD structured data
- Cookie/privacy consent notice; global error boundary with branded fallback
- Vercel SPA rewrites (`vercel.json`), `.env.example` files

### Changed
- Performance: route-level code splitting, lazy images/map iframe, font `display=swap`
- Accessibility: skip link, labelled controls, focus-visible outlines, reduced-motion support

## Phase 2 — Interactive frontend features (2026-09-20)

### Added
- Treatment live search + category filters with result counts and empty states
- FAQ live search; doctor profile modals; gallery page with lightbox and filters
- Floating quick-contact actions (call, WhatsApp, appointment) on desktop and mobile
- Testimonial carousel polish; appointment modal shared across every CTA

## Phase 1 — Public website (2026-09-20)

### Added
- React + Vite + TypeScript + Tailwind responsive site: Home, About, Treatments, FAQ, Contact, Gallery, Privacy Policy, 404
- Lavender/white healthcare design system; accessible components; Framer Motion animations with reduced-motion support
- Mobile-first layout with animated navigation and site-wide appointment CTAs
