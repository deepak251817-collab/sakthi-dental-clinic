# Commit Reference

A running record of meaningful commits. The description is generated from
the actual diff and actual test runs — never invented. Serves Phase 5's
requirement that AI-assisted history stay auditable.

---

## docs: restructure README for the full-stack project and add changelog

Date: 2026-09-20
Phase: Phase 6 (commit 7)
Hash: 4c85467

### Purpose

The README still presented the project as frontend-only; a professional
repository front page must describe the real full-stack system and give
newcomers (and AI agents) accurate entry points.

### Changes

* Architecture diagram covering the patient flow, the admin auth flow and the notification flow (email provider marked optional)
* New sections: Appointment System, Admin Dashboard, Notifications, Analytics, Audit Trail, Authentication, Database, API, CI/CD, Screenshots, Project Phases, Development Note
* Tech badges limited to technologies actually in use; real GitHub topics and repository URL
* `CHANGELOG.md` added, summarizing all six phases

### Files

`README.md`, `CHANGELOG.md` (new)

### Validation

Documentation-only; every claim cross-checked against the codebase (endpoints against routes, models against schema, test counts against actual runs). No deployment or status badges added because nothing is deployed.

### Impact

Recruiters, reviewers, the client and future contributors get an accurate,
navigable overview instead of a stale frontend description.

---

## docs: add project roadmap and update AI development context

Date: 2026-09-20
Phase: Phase 6 (commit 6)
Hash: 73c70b5

### Purpose

Record the boundary between finished work and future direction so nobody
mistakes roadmap items for features, and bring the AI context file up to
date with Phase 6 reality.

### Changes

* `docs/ROADMAP.md`: completed list vs. explicitly unimplemented future items (email delivery, hosting, backups, role-based access, breaking-major upgrades)
* `docs/AI_PROJECT_CONTEXT.md`: frontend tests, `NotificationLog`/`AppointmentActivity` models, CI workflows, test commands, and Git identity rules (commits by Deepak R, never attributed to AI tooling, no history rewrites)

### Files

`docs/ROADMAP.md` (new), `docs/AI_PROJECT_CONTEXT.md`

### Validation

Cross-checked against `package.json`, the Prisma schema and workflow files.

### Impact

Future agents inherit verified context and explicit git rules instead of guessing.

---

## security: harden JWT verification and resolve safe dependency fixes

Date: 2026-09-20
Phase: Phase 6 (commit 5)
Hash: 0b1bbe6

### Purpose

Verify the security posture against the Phase 6 checklist, fix what was
actually fixable, and document — not hide — what remains.

### Changes

* `jwt.verify` pins `algorithms: ['HS256']` so alg-header confusion tokens are rejected
* `react-router-dom` → 6.30.6 (latest 6.x); backend lockfile refresh via `npm audit fix` within current majors
* `docs/SECURITY_AUDIT.md`: verified controls table, fixes, and three accepted risks (Prisma CLI toolchain, react-router 7-only advisories, Vite dev-server) with the reasoning

### Files

`backend/src/utils/jwt.ts`, `package.json`/`package-lock.json`, `backend/package-lock.json`, `docs/SECURITY_AUDIT.md` (new)

### Validation

Backend build clean; 31/31 backend tests; 8/8 frontend tests; frontend build clean — all re-run after the dependency changes.

### Impact

A documented security baseline: reviewers can see what was verified, what
was fixed and why the remainder is deferred rather than ignored.

---

## ci: add GitHub Actions workflows and contribution templates

Date: 2026-09-20
Phase: Phase 6 (commit 4)
Hash: f1d6390

### Purpose

Every future push and pull request is verified automatically: lint, types,
builds and the full test matrix on both frontend and backend.

### Changes

* `ci.yml`: frontend job (npm ci, lint, build, tests) + backend job (ephemeral PostgreSQL 16 service container, prisma generate, migrate deploy, seed, build, 31 API tests) on push/PR to main
* `build.yml`: weekly scheduled build verification on Node 20 and 22
* Bug-report and feature-request issue templates (the latter with the project's no-medical-advice scope check) and a PR template with a test/secrets checklist

### Files

`.github/workflows/ci.yml`, `.github/workflows/build.yml`, `.github/ISSUE_TEMPLATE/bug_report.md`, `.github/ISSUE_TEMPLATE/feature_request.md`, `.github/pull_request_template.md`

### Validation

Workflow commands checked one-for-one against actual package scripts and lockfiles; CI-only credentials documented as existing solely inside the throwaway container — no repository secrets.

### Impact

Regressions surface before merge; contributors get structured templates.

---

## test: add frontend test coverage with Vitest and Testing Library

Date: 2026-09-20
Phase: Phase 6 (commit 2)
Hash: c3a3823

### Purpose

The frontend had zero automated tests; the Phase 4 header-merge bug proved
that backend tests alone cannot catch client-side regressions.

### Changes

* Vitest 2 (pinned to match Vite 5; Vitest 5 requires Vite 6) with jsdom + Testing Library, configured inside `vite.config.ts` with the backend suite excluded
* API client unit tests: stats key normalization, PATCH header/body regression guard, field-error mapping, network-error marking, query-string building
* Component tests: treatment filter chips (aria-pressed), FAQ search labelling, status chip text semantics
* `npm test` / `npm test:watch` scripts

### Files

`vite.config.ts`, `package.json`, `package-lock.json`, `src/test/setup.ts`, `src/test/api.test.ts`, `src/test/components.test.tsx` (new)

### Validation

8/8 frontend tests pass; 31/31 backend tests unaffected; tsc, lint and build clean.

### Impact

Client-side API and interaction contracts are now regression-guarded, and CI keeps them green.

---

## feat: improve admin appointment management UX

Date: 2026-09-20
Phase: Phase 5 (commit 7)
Hash: 494dccc

### Purpose

Give administrators immediate, non-blocking confirmation of their actions
and faster scanning of long appointment lists, without changing any
server behavior.

### Changes

* Added a dependency-free toast system (aria-live, auto-dismiss, reduced-motion aware) with context provider
* Toasts on login, logout, confirm, complete and cancel actions
* Client-side sortable columns (patient, preferred date, created) with `aria-sort` and directional icons
* `docs/API.md` rewritten to document every actual endpoint: analytics (`/trends`, `/treatments`), audit trail (`/activity`), status workflow table, validation rules, notification behavior, error envelope

### Files

`src/components/admin/Toast.tsx` (new), `src/App.tsx`, `src/components/admin/AppointmentTable.tsx`, `src/pages/AdminDashboard.tsx`, `src/pages/AdminLogin.tsx`, `docs/API.md`

### Validation

* `npx tsc -b` clean
* `npm run lint` — 0 errors (1 benign react-refresh warning on the toast context export)
* `npm run build` passes (main bundle 354 kB / 110 kB gzip)
* Backend: 31/31 tests passing (from the audit-trail commit)

### Impact

Admins see the outcome of every action immediately instead of inferring it
from table refreshes, and can sort instead of paginating to find patients.
New developers and AI agents get an accurate API reference.

### Notes

Sorting is client-side on the current page — deliberate, since the server
already paginates at 100 rows max. The remaining Phase 5 items (loading,
error and empty states) already existed from Phase 4 and were audited
rather than rewritten.

---

## feat: add appointment activity audit trail

Date: 2026-09-20
Phase: Phase 5 (commit 6)
Hash: e1d5493

### Purpose

Make administrative status changes reviewable: who changed what, from
which status to which, and when — the accountability layer a real clinic
needs once more than one person manages appointments.

### Changes

* New `AppointmentActivity` model (action, previousStatus, newStatus, appointmentId, adminId) with a migration applied to the local database
* `appointmentService.updateStatus` logs transitions inside the same flow as the status write; creations log `APPOINTMENT_CREATED`
* New authenticated endpoint `GET /api/appointments/activity` (limit-capped, newest first)
* New `ActivityFeed` dashboard panel showing date, appointment, action, status transition and administrator
* 3 new tests: activity rows written on transitions, creation logged, endpoint requires auth

### Files

`backend/prisma/schema.prisma`, `backend/prisma/migrations/*_appointment_activity/`, `backend/src/services/appointmentService.ts`, `backend/src/controllers/appointmentController.ts`, `backend/src/routes/appointmentRoutes.ts`, `backend/tests/api.test.ts`, `src/lib/api.ts`, `src/components/admin/ActivityFeed.tsx` (new), `src/pages/AdminDashboard.tsx`

### Validation

* `prisma migrate dev` applied cleanly
* Backend build passes; 31/31 tests (28 + 3 new)
* Frontend tsc, lint and build all clean

### Impact

Every status change is now attributable to a named admin with before/after
status, visible in the dashboard's activity panel. Disputes ("I never
cancelled it") become answerable from the database.

---

## feat: add appointment analytics to the admin dashboard

Date: 2026-09-20
Phase: Phase 5 (commit 5)
Hash: e6d5f69

### Purpose

Surface appointment demand and status mix to administrators visually,
using only real database data (brief explicitly forbids fake numbers).

### Changes

* `AnalyticsPanel` with three accessible visualizations: request trend chart (SVG line, 7/30/90-day ranges), status distribution bars, top treatments ranking
* Range chips re-fetch from the API — no client-side filtering of stale data
* Small datasets show an explicit "only X requests in this period" note instead of implying statistical meaning
* Analytics panel loads below the existing stats/table without disturbing the Phase 4 layout

### Files

`src/components/admin/TrendChart.tsx`, `StatusDistribution.tsx`, `TopTreatments.tsx`, `AnalyticsPanel.tsx` (all new), `src/lib/api.ts`, `src/pages/AdminDashboard.tsx`

### Validation

* `npx tsc -b`, lint, build all clean (dashboard chunk 31.8 KB)
* API returns real aggregated data (verified in Phase 5 commit 4's test run)

### Impact

The clinic can see request volume over time and which treatments are most
demanded, supporting staffing and scheduling decisions without exporting
data.

---

## feat: add appointment dashboard analytics API

Date: 2026-09-20
Phase: Phase 5 (commit 4)
Hash: 7ce8c97

### Purpose

Provide aggregated analytics server-side so the dashboard never loads the
whole table to compute counts, keeping performance flat as data grows.

### Changes

* `GET /appointments/trends?days=7|30|90` — daily creation buckets zero-filled in Asia/Kolkata (the clinic's actual calendar), computed with Prisma aggregation
* `GET /appointments/treatments?days=7|30|90` — top-8 treatment counts via `groupBy`
* New index on `Appointment.preferredDate` (justified: date-range filters in list + analytics queries)
* 4 new tests covering buckets, grouping, auth and range validation

### Files

`backend/src/services/analyticsService.ts`, `backend/src/controllers/analyticsController.ts` (new), `backend/src/routes/appointmentRoutes.ts`, `backend/src/schemas/appointmentSchema.ts`, `backend/prisma/schema.prisma` + migration, `backend/tests/api.test.ts`

### Validation

* Migration applied; backend build passes; 28/28 tests
* tsc, lint, frontend build clean

### Impact

Analytics answers in two indexed aggregate queries regardless of table
size; admins on slow connections get small JSON payloads.

---

## feat: add appointment notification logs

Date: 2026-09-20
Phase: Phase 5 (commit 3)
Hash: ab26131

### Purpose

Make best-effort notifications observable: without a record of what was
attempted, a silent email failure is indistinguishable from no email
system at all.

### Changes

* New `NotificationLog` model (type, channel, status, errorMessage, appointmentId) + migration
* Notification service records SENT/FAILED for every attempt, isolated from request handling
* 3 tests: successful path logs SENT, failed send logs FAILED without failing the appointment, appointment delete cascades logs

### Files

`backend/prisma/schema.prisma` + migration, `backend/src/services/notificationService.ts`, `backend/src/services/appointmentService.ts`, `backend/tests/notifications.test.ts` (new)

### Validation

* 24/24 tests pass (21 base + 3 notification)
* Backend build and migration clean

### Impact

Failed notification attempts are diagnosable from the database instead of
only the server console; appointment integrity is provably unaffected by
notification failures (test-enforced).

---

## feat: add appointment notification service

Date: 2026-09-20
Phase: Phase 5 (commit 2)
Hash: a71100e

### Purpose

Close the loop after appointment events: patients learn their request was
received, confirmed, completed or cancelled — without the clinic calling
each patient manually. Structured so a real email provider drops in via
env vars only.

### Changes

* `notificationService` with pluggable transport: `logger` (default, logs to console) or SMTP/Resend/SendGrid adapters enabled by `EMAIL_PROVIDER`
* Four event templates (created, confirmed, cancelled, completed) with plain-text + HTML bodies; status-accurate language ("request received", never "appointment confirmed" for a pending request)
* Fire-and-forget from `appointmentService` — notification failures log safely and never fail the appointment write
* New optional env vars documented in `backend/.env.example` (no provider required)

### Files

`backend/src/services/notificationService.ts` (new), `backend/src/templates/*` (5 new), `backend/src/services/appointmentService.ts`, `backend/src/config/env.ts`, `backend/.env.example`

### Validation

* Backend build clean after template export fix
* 21/21 tests pass (existing suite untouched)

### Impact

Patients get status-accurate notifications by default (console-visible in
dev); the clinic can enable real email with four env vars and zero code
changes.

---

## docs: add AI project context and commit references

Date: 2026-09-20
Phase: Phase 5 (commit 1)
Hash: f3dd93c

### Purpose

Make the repository self-describing for future AI coding agents and human
maintainers, per the Phase 5 brief.

### Changes

* `docs/AI_PROJECT_CONTEXT.md` — verified architecture, coding rules, git rules, test commands
* `docs/PROJECT_PHASES.md` — phase tracker with real feature lists and commit hashes
* `docs/COMMIT_REFERENCE.md` — per-commit purpose/changes/validation record (this file)

### Files

`docs/AI_PROJECT_CONTEXT.md`, `docs/PROJECT_PHASES.md`, `docs/COMMIT_REFERENCE.md` (all new)

### Validation

Documentation-only; content cross-checked against `git log` and actual source files. No claims made about unimplemented features.

### Impact

Any future agent or developer can understand the project's real state in
minutes instead of reverse-engineering it.

---

## Earlier commits (Phase 1–4)

Phase 1–4 history predates this file; see `docs/PROJECT_PHASES.md` for the
per-phase summary and `git log` for the complete record.
