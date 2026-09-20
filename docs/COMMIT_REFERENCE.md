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

## feat: add appointment dashboard analytics

Date: 2026-09-20 · Phase: 5

### Purpose
Give the clinic real, database-backed analytics — appointment request trends and the most requested treatments — instead of guesswork, while keeping every query cheap enough for a small clinic's dashboard.

### Changes
- `backend/src/services/analyticsService.ts`: daily trend buckets computed in SQL (`date_trunc` in the clinic's Asia/Kolkata calendar, zero-filled in JS) and top-treatment aggregation (`GROUP BY` + `LIMIT`), both bounded to a validated 1/7/30/90-day window.
- `GET /api/appointments/analytics/trends` and `GET /api/appointments/analytics/treatments` (admin-only, before `/:id` in the router); `analyticsQuerySchema` restricts `days` to the supported set.
- Index on `appointments.preferred_date` (justified by the existing date-range list filter); migration `add_preferred_date_index` applied.
- 4 new API tests: auth required, invalid `days` rejected, 7 buckets with today's IST bucket non-zero, top-treatments ordering.

### Validation
`tsc` build clean; backend suite 28/28.

### Impact
Administrators can see demand over time and which treatments patients actually ask for, with no per-row API calls and no fabricated numbers.

## feat: add appointment analytics to the admin dashboard

Date:
2026-09-20

Phase:
Phase 5

### Purpose

Give clinic administrators a live view of appointment demand — requests over time, status distribution and most-requested treatments — so staffing and follow-up decisions are based on real data instead of memory.

### Changes

* Added analytics fetchers and types to the frontend API client (`fetchAppointmentTrends`, `fetchTopTreatments`)
* Added `AnalyticsPanel` with Today / 7 / 30 / 90-day range chips, retry on failure and auth-failure handling
* Added `TrendChart` — CSS bar chart with an sr-only data table as the accessible alternative
* Added `StatusDistribution` — stacked bar whose legend always states each count in text
* Added `TopTreatments` — ranked table that always shows its sample size ("Based on N requests in this period")
* Wired the panel into `AdminDashboard` below the summary cards

### Validation

* `npx tsc -b` — clean
* `npm run lint` — no errors or warnings
* `npm run build` — passes; AdminDashboard chunk 31.8 kB (7.5 kB gzip)
* Live UI verification in the preview (renders with real database data, range switching refetches)

### Impact

Administrators can see demand patterns at a glance without exporting or counting rows manually. Charts degrade gracefully: empty periods say so in words, and every chart has a text equivalent for screen readers.

## feat: add appointment activity audit trail

Date:
2026-09-20

Phase:
Phase 5

### Purpose

Give the clinic a verifiable record of every appointment lifecycle event — creation, status changes and deletions — with the responsible administrator, so disputed changes can be traced.

### Changes

* Added `AppointmentActivity` model (action, actor, previous/new status) with a migration
* Activity rows are written in the same transaction as the change they describe, so the trail cannot drift from reality
* Delete writes its `APPOINTMENT_DELETED` entry inside the deleting transaction before cascade cleanup
* Added authenticated `GET /api/appointments/activity` endpoint (declared before `/:id`)
* Status-change and delete handlers now pass the authenticated admin as the audit actor
* Added `ActivityFeed` dashboard component and activity fetcher to the API client

### Validation

* Backend build + **31/31 tests** (3 new: endpoint auth, REQUEST_CREATED recording, STATUS_CHANGED actor/statuses)
* Frontend `tsc -b`, lint and production build clean

### Impact

Administrators get an accountable history of who changed what and when, directly in the dashboard sidebar. Patients are unaffected; the trail is internal and never exposed publicly.

## feat: add appointment notification logs

Date: 2026-09-20 · Phase: 5

### Purpose
Make notification delivery observable and debuggable: every attempted delivery is recorded, so the clinic can see what was sent, to whom, and what failed — without touching the appointment itself.

### Changes
- Prisma: `NotificationLog` model (type/channel/recipient/status/errorMessage) with `SENT`/`FAILED` statuses and cascade delete alongside its appointment; migration `add_notification_logs` applied.
- `notificationService.deliverNotification` now persists one log row per recipient after sending; log-write failures are contained and logged server-side.
- New test suite `backend/tests/notifications.test.ts`: SENT rows after a public submission (patient + clinic team), FAILED row with the provider error when the transport throws (appointment left intact), cascade cleanup.

### Validation
`npx prisma migrate dev` applied cleanly; backend suite 24/24 (21 prior + 3 new).

### Impact
Notification failures are diagnosable from the database instead of only the console, and the guarantee that a notification problem can never invalidate an appointment is now tested.

## feat: add appointment notification service

Date: 2026-09-20 · Phase: 5

### Purpose
Close the loop between the clinic and the patient: when a request is created or its status changes, the patient (and, for new requests, the clinic team) is notified — without any external email provider being required to run the system.

### Changes
- `backend/src/services/notificationService.ts`: fire-and-forget notification dispatch for `APPOINTMENT_CREATED` / `CONFIRMED` / `CANCELLED` / `COMPLETED`. Never throws, never fails the appointment request; per-recipient outcomes returned for future logging.
- Pluggable transport: default `logger` provider writes notifications to the server log; `EMAIL_PROVIDER=resend` switches to the Resend HTTP API (no SDK). Credentials only from env vars.
- `backend/src/templates/`: plain-text + inline-styled HTML templates for the four events with professional, non-confirming patient wording.
- `appointmentService` triggers notifications after the database write; env config gains optional `EMAIL_PROVIDER` / `EMAIL_FROM` / `RESEND_API_KEY` (validated only when resend is selected).

### Validation
`tsc` build clean; existing backend suite 21/21 (notification paths fire-and-forget, so no HTTP behaviour change); resend requirement validated via config schema.

### Impact
Patients get clear status feedback and the clinic team learns of new requests the moment they arrive — as soon as a real provider is configured; until then everything is observable in the server log.

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
