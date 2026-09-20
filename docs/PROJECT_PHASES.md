# Project Phases

What each phase delivered, with the actual files and commits. Commit hashes refer to
`git log` on `main`. Do not invent details — this file only records shipped work.

---

## Phase 1 — Public website (2026-09-14/16)

**Purpose:** a complete, responsive, client-facing website for the clinic.

**Major features:** home (hero, treatments preview, why-choose-us, doctors, testimonials, facilities, final CTA), treatments, doctors with detail modals, gallery, FAQ, contact + location/directions, privacy policy, floating quick-contact actions, appointment request flow (modal form).

**Important files:** `src/pages/*`, `src/components/home/*`, `src/components/layout/{Navbar,Footer}.tsx`, `src/components/appointment/*`, `src/data/*`.

**Commits:** `d6267f0` initial commit … `08c2384` appointment request flow … `1a0e42a` location/directions (phase 1 core); gallery/doctors/FAQ/search features land early in phase 2's date range.

---

## Phase 2 — Interactive frontend features (2026-09-16)

**Purpose:** richer UX on top of the static site.

**Major features:** treatment search and filters, FAQ search, interactive doctor profiles, responsive clinic gallery, error/loading/empty states, accessibility and keyboard navigation, image/frontend performance optimisation.

**Important files:** `src/components/treatments/*`, `src/components/gallery/*`, `src/components/doctors/*`, `src/components/common/*`, `src/data/*`.

**Database changes:** none (frontend-only phase).

**API changes:** none.

**Commits:** `12bcce2`, `6ddf4cd`, `e54ea7d`, `46bf499`, `7235637`, `3d40180`, `6257eff`, `40c4141`, `81ef63a`.

---

## Phase 3 — Production readiness (2026-09-17)

**Purpose:** SEO, accessibility, performance and deployment preparation.

**Major features:** page metadata/SEO component, local-business structured data, accessibility pass, image/media optimisation, loading performance, privacy & cookie consent UI, error and fallback states, production deployment prep.

**Important files:** `src/components/seo/SEO.tsx`, `index.html`, `vercel.json`, `.env.example`, `public/*` (favicons/OG assets), `README.md`.

**Database changes:** none.

**API changes:** none.

**Commits:** `37985af`, `b6c11c3`, `6155d98`, `8a2e2c3`, `736fd9a`, `9f61080`, `29ce35f`, `8a49980`, `2a41be3`.

---

## Phase 4 — Full-stack appointment management (2026-09-18)

**Purpose:** a real backend, PostgreSQL database, admin authentication and an internal appointment dashboard.

**Major features:** Express REST API with Zod validation and security middleware; appointment CRUD with workflow-guarded status transitions; paginated admin list with search/status/date filters; JWT admin login; admin dashboard (stats cards, table + mobile cards, details modal, confirm-then-act cancellation/deletion); public form wired to the backend with offline fallback; Vitest + supertest suite (21 tests); API documentation.

**Important files:** `backend/**` (routes, controllers, services, schemas, middleware, prisma), `src/lib/api.ts`, `src/lib/auth.ts`, `src/pages/Admin{Login,Dashboard}.tsx`, `src/components/admin/*`, `src/components/layout/PublicLayout.tsx`, `docs/API.md`.

**Database changes:** `Appointment` and `AdminUser` models; initial migration; admin seed script.

**API changes:** `POST /api/auth/login`, `GET /api/health`, `POST /api/appointments` (public), `GET /api/appointments`, `GET /api/appointments/stats`, `GET /api/appointments/:id`, `PATCH /api/appointments/:id/status`, `DELETE /api/appointments/:id` (admin).

**Commits:** `1e66020`, `001c57f`, `bb609cf`, `a78efff`, `6303fdb`, `3831ec7`, `1653b60`, `018d0dc`, `b7e6829`, `96cd885`.

---

## Phase 5 — Notifications, analytics & audit trail (2026-09-20)

**Purpose:** operational improvements — appointment notifications, dashboard analytics, activity/audit trail, admin UX polish and AI-agent documentation.

**Major features:** notification service with pluggable email provider (off by default), notification logging, dashboard analytics (status counts, request trends, most-requested treatments, status distribution, date-range views), appointment activity audit log with admin activity view, list sorting, toast feedback, loading/error/empty state improvements.

**Important files:** `backend/src/services/notificationService.ts`, `backend/src/templates/*`, `backend/prisma/schema.prisma` (NotificationLog, AppointmentActivity), `src/components/admin/Analytics*`, `src/components/admin/RecentActivity.tsx`, `src/components/admin/Toast.tsx`, `docs/*`.

**Database changes:** `NotificationLog` and `AppointmentActivity` models with enums; migration(s); index on `appointments.preferred_date`.

**API changes:** `GET /api/appointments/analytics/trends`, `GET /api/appointments/analytics/treatments`, `GET /api/appointments/activity`, `sortBy`/`sortOrder` params on `GET /api/appointments`.

**Commits:** `f3dd93c` (docs context), `a71100e` (notification service), `ab26131` (notification logs), `7ce8c97` (analytics API), `e6d5f69` (analytics UI), `e1d5493` (audit trail), `494dccc` (admin UX).

---

## Phase 6 — Testing, CI/CD, security & GitHub polish (2026-09-20)

**Purpose:** make the repository reliable, testable, secure, CI-verified and professionally documented for humans and AI agents.

**Major features:** frontend test suite (Vitest 2 + Testing Library: API client units + component tests), GitHub Actions CI with ephemeral PostgreSQL for backend tests, scheduled multi-Node build checks, issue/PR templates, JWT algorithm pinning, dependency audit with documented accepted risks, README overhaul, CHANGELOG, ROADMAP, security audit doc.

**Important files:** `src/test/*`, `vite.config.ts` (test config), `.github/workflows/ci.yml`, `.github/workflows/build.yml`, `.github/ISSUE_TEMPLATE/*`, `.github/pull_request_template.md`, `backend/src/utils/jwt.ts`, `docs/SECURITY_AUDIT.md`, `docs/ROADMAP.md`, `CHANGELOG.md`, `README.md`, `docs/AI_PROJECT_CONTEXT.md`.

**Database changes:** none (no schema changes this phase).

**API changes:** none (endpoint set unchanged; docs updated to match).

**Commits:** `c3a3823` (frontend tests), `f1d6390` (CI + templates), `0b1bbe6` (security hardening), `73c70b5` (roadmap + AI context), `4c85467` (README + CHANGELOG).

---

## Backlog / known limitations

- No real email provider configured — notifications log to the server console until `EMAIL_PROVIDER` is set (see `backend/.env.example`).
- No email/SMS confirmations to patients beyond the notification pipeline.
- Token storage is localStorage (prototype-grade auth; production should use httpOnly cookies with rotation).
- Production deployment (hosted PostgreSQL + backend host + Vercel) is prepared but not executed.
- Dependency advisories needing breaking majors (Vite 6/Vitest 5, react-router 7, Prisma 7) are analyzed in `docs/SECURITY_AUDIT.md` and deliberately deferred.
