# Changelog

All notable changes to this project, documented per development phase.
Format based on [Keep a Changelog](https://keepachangelog.com); per-commit
details live in [docs/COMMIT_REFERENCE.md](docs/COMMIT_REFERENCE.md).

## Phase 8 — Theme & final UX (2026-09-21)

### Added
- Light/Dark/System theme support across the public website and admin dashboard: token-based palette (RGB-triplet CSS variables mapped through `tailwind.config.js`), inline bootstrap in `index.html` (no flash of wrong theme), persisted `sakthi-theme` preference with safe fallback, navbar toggle + mobile-menu segmented control, live system-preference following
- Appointment confirmation improvements: request ID, submitted treatment/date/time summary, clinic contact details, "Back to Home" and "Contact Clinic" actions, and a print-friendly request summary

### Changed
- ~40 components migrated from hardcoded light colors (`bg-white`, light-only text/border utilities) to theme tokens; status badges, stats cards, charts and toasts gained intentional dark variants
- Dark overlays (modals, lightbox, mobile menu) use theme-independent dark literals so they stay dark in both themes
- `color-scheme` set per theme for native date/time pickers, selects and scrollbars

### Fixed
- Opacity modifiers on themed utilities (`bg-surface/95`, `bg-primary-50/60`) now work in both themes by storing tokens as RGB triplets with `<alpha-value>`

## Phase 7 — Final QA, screenshots & submission (2026-09-21)

### Added
- 11 real screenshots of the running app in `docs/screenshots/` (home desktop/mobile, about, treatments, FAQ, contact, gallery, admin login, dashboard, appointment management, analytics), captured with headless Chrome against a temporary QA session that was removed afterwards
- `docs/ARCHITECTURE.md` — verified system architecture, flows and deployment targets
- `docs/TESTING.md` — what the suites cover plus the full Phase 7 QA report (browser E2E, 17-check API E2E, responsive audit, negative tests)
- `docs/SHADOWFOX_SUBMISSION.md` — internship submission summary with only verified claims
- `docs/DEMO_SCRIPT.md` — 3–5 minute demonstration walkthrough
- `docs/CLIENT_CONTENT_NOTES.md` — operating-hours discrepancy and other items needing client confirmation

### Changed
- `docs/API.md` rewritten to match the actual implementation (correct analytics paths, list/activity response shapes, validation rules, 409 transition conflicts, error copy)
- README: screenshots section, corrected API summary table, Phase 7 status, expanded docs index
- Phase tracker and AI context updated with the Phase 7 record and the `.env` `#` quoting gotcha

### Verified (final QA)
- Full public flow, appointment submit (incl. negative validation) and admin dashboard flow in a real browser
- Automated 17/17 API E2E (auth, guards, CRUD, transitions, 409s, audit trail, cleanup)
- Responsive: zero horizontal overflow across 15 route/viewport combinations (320–1280 px)
- SEO audit: per-route titles/descriptions/canonical/OG, robots.txt, sitemap, valid Dentist JSON-LD (9 AM–7 PM)
- Frontend lint + typecheck + build clean; backend build clean; 31/31 + 8/8 tests passing

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
