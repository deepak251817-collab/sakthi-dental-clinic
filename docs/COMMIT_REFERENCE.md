# Commit Reference

A human- and agent-readable log of meaningful commits. Because this project is
developed with AI coding assistance, each entry records the purpose, changes,
validation and impact behind the commit message so future agents never have to
guess (or invent) intent.

**Rules (see `docs/AI_PROJECT_CONTEXT.md`):** before describing a commit, read the
actual `git diff` and recent history; never invent changes; never claim tests
passed unless they ran; keep the commit *subject* short and put the explanation here.

Entry template:

```markdown
## <type>: <commit subject>

Date: YYYY-MM-DD · Phase: N

### Purpose
Why the change was made.

### Changes
- What changed (bullets).

### Validation
Actual checks run and their results.

### Impact
Who benefits and how.
```

---

## Phase 5

Entries are appended as work lands.

---

## Phase 4 (backfilled from history)

## fix: preserve JSON content-type and normalize admin stats keys

Date: 2026-09-18 · Phase: 4

### Purpose
Two bugs found during live browser end-to-end testing of the dashboard.

### Changes
- `src/lib/api.ts`: the `request()` helper spread `...init` after `headers`, so per-call headers (Authorization on PATCH) replaced the computed JSON headers — the status-change PATCH lost `Content-Type: application/json` and the backend rejected the body with 400. Merge order fixed.
- `src/lib/api.ts`: the backend groups stats by the Prisma enum (`PENDING`/`CONFIRMED`/…); the client interface expected lowercase keys, so cards showed 0. Normalised in `fetchAppointmentStats`.

### Validation
Live E2E in the browser: form submission → dashboard row, Confirm → Complete transitions, stats counts correct; backend `npm test` (21/21); frontend lint/build clean.

### Impact
Admins can actually change appointment statuses from the dashboard and see correct counts.

---

## docs: add API and full-stack setup documentation

Date: 2026-09-18 · Phase: 4

### Purpose
Document the real API surface and full-stack setup for developers and graders.

### Changes
- `docs/API.md`: every endpoint that actually exists, with auth requirements, request/response shapes and error formats.
- `backend/README.md`: backend setup, env vars, migrations, seed, tests.
- Root `README.md`: full-stack section (architecture, commands).

### Validation
Docs cross-checked against route/controller source; no invented endpoints.

### Impact
Onboarding and review no longer require reading the source to use the API.

---

## feat: harden API validation and security

Date: 2026-09-18 · Phase: 4

### Purpose
Close the security gaps an internship project usually ships with.

### Changes
- helmet, restricted CORS (`FRONTEND_URL`), 10 kB body limit, rate limits (10 appointments/15 min, 20 logins/15 min).
- Malformed JSON bodies now return 400 instead of 500 (`entity.parse.failed` handling).
- Test suite (`backend/tests/api.test.ts`): 21 tests covering validation, auth, workflow guards, 404s, pagination, filters, delete.

### Validation
`npm test` 21/21 (rate-limit bypass under `NODE_ENV=test` added so the suite doesn't trip the appointment limiter); `tsc --noEmit` clean.

### Impact
The API resists common abuse patterns and its error contract is tested, not assumed.

---

## feat: connect appointment form to backend

Date: 2026-09-18 · Phase: 4

### Purpose
Replace the simulated submission with the real API while keeping the public UX intact.

### Changes
- `AppointmentForm.tsx` submits to `POST /api/appointments` via `src/lib/api.ts`.
- Server field errors map back onto inputs; network failure shows an offline state with the clinic phone number.
- `.env.example` gains `VITE_API_URL`.

### Validation
Frontend lint/build clean; live form submission verified against the running backend.

### Impact
Requests reach the database instead of disappearing; patients get honest feedback.

---

## feat: add appointment search and status filters

Date: 2026-09-18 · Phase: 4

### Purpose
Admins need to find specific requests without paging through everything.

### Changes
- `GET /api/appointments` supports `search` (name/phone/email/treatment/message), `status`, `fromDate`/`toDate`, pagination — all server-side.
- Dashboard: debounced search box, status chips, preferred-date range, clear-filters, pagination controls.

### Validation
Backend tests for search/status filters and pagination; manual filter checks in the dashboard.

### Impact
Filtering happens in PostgreSQL, not in the browser; the dashboard stays fast as data grows.

---

## feat: add admin appointment dashboard

Date: 2026-09-18 · Phase: 4

### Purpose
Give clinic staff a real management view of appointment requests.

### Changes
- `/admin` dashboard: live stats cards, desktop table + mobile card list, details modal, workflow actions (confirm/complete/cancel) with a confirmation dialog for cancellation, two-step delete, logout.
- Public chrome extracted into `PublicLayout` so admin routes render standalone.

### Validation
Frontend lint/build clean (dashboard its own 5.8 kB chunk); live browser E2E of the full workflow.

### Impact
Statuses can be managed with guardrails; destructive actions require explicit confirmation.

---

## feat: add admin authentication

Date: 2026-09-18 · Phase: 4

### Purpose
Only clinic staff may see appointment data.

### Changes
- `POST /api/auth/login` returns a signed 8 h JWT; `requireAuth` guards admin routes and attaches the verified identity to `req.admin`.
- Identical 401 for unknown email vs wrong password (no user enumeration).
- `/admin/login` page; protected routes redirect there; `AdminUser` model with bcrypt hashes.

### Validation
Backend auth tests (wrong email/password, malformed body, invalid token, unauthenticated access).

### Impact
Appointment data is not public; sessions expire after 8 hours.

---

## feat: add appointment management API

Date: 2026-09-18 · Phase: 4

### Purpose
REST endpoints for creating and managing appointment requests.

### Changes
- Controllers → services → Prisma layering; Zod schemas for body/query validation (strict, no unknown fields).
- Workflow guard: only PENDING → CONFIRMED/CANCELLED and CONFIRMED → COMPLETED/CANCELLED transitions allowed (409 otherwise).
- Endpoints: `POST /appointments` (public), `GET /appointments`, `GET /appointments/stats`, `GET /appointments/:id`, `PATCH /appointments/:id/status`, `DELETE /appointments/:id` (admin).

### Validation
Backend tests for creation, validation errors, workflow transitions and 404s.

### Impact
A clean, validated API the frontend and future integrations can rely on.

---

## feat: add Prisma appointment database schema

Date: 2026-09-18 · Phase: 4

### Purpose
Persistent storage for appointment requests and admin users.

### Changes
- `Appointment` model (all brief fields, status enum, indexes on status/createdAt/email) and `AdminUser` (bcrypt hash only).
- Initial migration applied to the local `sakthi_dental_clinic` database; seed script upserts the dev admin from env vars.

### Validation
`prisma migrate dev` applied cleanly; seed run; queries verified through the API.

### Impact
Real persistence with indexes that match the actual query patterns.

---

## feat: initialize clinic appointment backend

Date: 2026-09-18 · Phase: 4

### Purpose
Add the backend as a sibling of the frontend without touching the public site.

### Changes
- Express + TypeScript scaffold: app factory (test-friendly), server entry, centralized env validation (boot fails on missing/invalid config), error middleware with a clean JSON error contract, asyncHandler utility, health endpoint.

### Validation
`tsc` build clean; `/api/health` returns 200 against the built dist.

### Impact
A typed, validated server foundation that later phases extend rather than replace.

---

## Phase 3 (summary — see git history for individual diffs)

Date: 2026-09-17 · Phase: 3

SEO metadata + local-business structured data (`37985af`, `b6c11c3`), accessibility pass
(`6155d98`), image/media and loading performance (`8a2e2c3`, `736fd9a`), privacy/cookie
consent UI (`9f61080`), error and fallback states (`29ce35f`), deployment prep with
`vercel.json` + `.env.example` (`8a49980`) and production setup docs (`2a41be3`).
Frontend-only: no database or API changes.

## Phase 2 (summary — see git history for individual diffs)

Date: 2026-09-16 · Phase: 2

Treatment search/filters (`12bcce2`), FAQ search (`6ddf4cd`), interactive doctor profiles
(`e54ea7d`), responsive gallery (`46bf499`), accessibility/keyboard navigation
(`7235637`), performance (`3d40180`), error/loading/empty states (`6257eff`).
Frontend-only: no database or API changes.

## Phase 1 (summary — see git history for individual diffs)

Date: 2026-09-14 → 2026-09-16 · Phase: 1

Initial website (`d6267f0`, `ab4d1fc`), appointment request flow (`08c2384`), floating
quick-contact actions (`8414de0`), location/directions (`1a0e42a`). Frontend-only:
no database or API changes.
