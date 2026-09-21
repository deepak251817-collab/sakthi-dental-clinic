# Testing

What the project's test suites cover and what was actually run during the
final Phase 7 QA. Everything below reflects real executed commands and
their real results — nothing here is aspirational.

## Automated suites

### Backend — Vitest + supertest (31 tests)

Run: `cd backend && npm test` (needs local PostgreSQL + `backend/.env`;
CI uses an ephemeral Postgres 16 service container instead).

Covers, against the real Express app and database:

* Public appointment creation + Zod validation failures (missing fields,
  bad email/phone, past dates, unknown fields)
* Admin authentication: login success/failure, identical 401 for unknown
  email vs wrong password
* Authorization guards: every admin route rejects unauthenticated and
  invalid-token requests
* Appointment CRUD, pagination, search, status/date filters
* Workflow-guarded status transitions (valid transitions, 409 on invalid
  or same-status, 404 on unknown ids)
* Analytics endpoints (trends day-buckets, top treatments)
* Audit trail entries written for creations, transitions and deletes
* Notification behavior: logger-provider delivery, failure isolation (a
  failing notification never fails the appointment), NotificationLog rows,
  cascade cleanup with their appointments

Last verified: **31/31 passing** (Phase 7, 2026-09-21).

### Frontend — Vitest + Testing Library (8 tests, jsdom)

Run: `npm test` (no server needed; `fetch` is mocked).

Covers:

* API client behavior: stats normalization, field-error mapping, network
  error handling, query-string building, and a regression guard for the
  PATCH header-merge bug (Authorization replacing Content-Type)
* Component behavior: treatment filter chips (`aria-pressed` state),
  FAQ search input labelling, status-chip text semantics

Last verified: **8/8 passing** (Phase 7, 2026-09-21).

## Phase 7 end-to-end QA (executed 2026-09-21)

### Public flow (real browser, live dev server)

* Home renders fully (hero, sections, footer, quick-contact bar); skip
  link present and first focusable
* Treatments: live search filters the grid ("braces" → 2 of 15 shown)
* FAQ: search shows a proper empty state ("No matching questions found")
  and matching results expand correctly
* Doctor modal on `/about`: opens with focus inside, closes on Escape
* Gallery: 8/8 images load (zero broken); lightbox opens with focus
  handling and captions
* Contact page: exact address, both phone numbers, email, and 9 AM–7 PM
  hours verified in the DOM
* 404 page: exact required copy ("Page Not Found", "Back to Home",
  "View Treatments"); app stays alive on bad URLs
* Privacy policy renders complete

### Appointment request (form → API → database → admin)

* Empty submit → blocked with `aria-invalid` on the three required fields
  and inline messages
* Bad phone + bad email → inline errors, no network call
* Valid submit → modal success state ("Your request has been submitted
  successfully"), `POST /api/appointments` → **201**
* The created request appeared in the admin list (verified via the API)
* Modal dismisses via its Close button and via the overlay; scroll lock
  releases

### Backend workflow (17-check automated E2E)

Health → bad-login 401 → real login 200 → no-hash-in-response → 401
guards → public create 201 → search finds it → stats counts → analytics
trends/treatments → activity → PENDING→CONFIRMED 200 → invalid transition
409 → CONFIRMED→COMPLETED 200 → audit entries recorded → delete 200.
Result: **17/17 passing**.

### Admin dashboard (real browser, real session)

* Login page: labelled inputs, proper autocomplete, wrong-password error
  shown inline, empty-submit handled
* Dashboard: stats cards, analytics chips, filters, empty states all
  render; session token handled via `src/lib/auth.ts`
* Admin UI verified at 320–1280px via the responsive harness below

### Responsive audit

All three route trees (home, treatments, admin login) measured at
320 / 375 / 425 / 768 / 1280 px viewport widths: **zero horizontal
overflow in all 15 combinations**; mobile menu button present at every
width on public pages.

### Form validation (negative cases)

Required-field, invalid-email and invalid-phone paths verified in the
browser; server-side Zod rejection of the same cases covered by the
backend suite; oversized/oversized-message cases enforced by the shared
schema (1000-char cap) and covered by API tests.

### Production build

* Frontend: `npm run lint` clean, `tsc -b` clean, `vite build` succeeds
* Backend: `npm run build` (tsc) clean, `npx prisma generate` clean

## Browser coverage (honest scope)

Verified in Chromium (headless Chrome captures + the preview browser).
Firefox/Safari were not executed in this environment; the CSS uses
standard features (flex/grid/custom properties) with no browser-specific
hacks, and cross-browser smoke-testing remains recommended before launch.

## Not claimed

* No Lighthouse score is claimed (Lighthouse was not run)
* No WCAG certification is claimed (accessibility was reviewed and tested
  for keyboard/focus/labels/landmarks, which is not a certification)
