# Demo Script — 3–5 minutes

A focused walkthrough for reviewers and the ShadowFox submission review.
Everything shown is implemented and verified; no feature is faked.

## 1. Public website (~1 min)

1. Open the site (dev: `http://localhost:5173`).
2. **Home** — point out the hero value proposition ("Specialized Dental
   Care for Women, Children & Families"), the single prominent CTA
   ("Fix an Appointment") repeated across the page, facilities and
   testimonials.
3. **Treatments** — type in the search box (e.g. "braces") to show live
   filtering and the result count; clear it.
4. **FAQ** — search something ("cost"), then expand an answer.
5. **About** — open a doctor profile modal; close it with Escape.
6. **Gallery** — open the lightbox once; arrow keys work.
7. Shrink the window to phone width: mobile menu, stacked layout, fixed
   quick-contact bar (Call / WhatsApp / Appointment).

## 2. Appointment request (~1 min)

1. Click **Fix an Appointment**.
2. Submit empty to show inline required-field validation.
3. Fill valid details and submit — the modal switches to
   "Appointment Request Received" and explains the clinic will confirm by
   phone (a request, not an auto-booking).
4. Mention offline safety: with the API stopped, the form shows a
   "temporarily unavailable" state with the clinic phone number.

## 3. Admin dashboard (~1.5 min)

1. Go to `/admin/login` — sign in with the seeded admin.
2. **Dashboard**: find the request just submitted (newest first). Show
   search and the status filter chips.
3. Open the appointment and **Confirm** it — note the confirmation dialog,
   then the toast. The status chip changes and a notification fires
   (logger transport prints to the API console).
4. Point out **Analytics**: trends chart, status distribution, top
   treatments — all computed from the database.
5. Point out **Recent activity**: the audit entries for the actions just
   taken (who changed what, from which status to which).
6. **Logout.**

## 4. Engineering story (~30 sec)

1. GitHub repository: conventional commits by phase, `docs/` index
   (architecture, API reference, testing report, security audit, roadmap).
2. GitHub Actions CI: frontend + backend jobs (ephemeral Postgres),
   weekly build check.
3. Mention the numbers honestly: 31 backend + 8 frontend tests, 17-check
   E2E, zero horizontal overflow at 320–1280 px.

## If time is short

Show only: home → treatments search → submit an appointment → confirm it
in the dashboard → activity feed. That single loop demonstrates the full
stack end to end.

## Notes for the presenter

* Start the stack with the run book in the README (backend needs local
  PostgreSQL + seeded admin).
* Demo data: create one or two requests through the real form beforehand
  so analytics/tables show something meaningful. Do not seed fake
  "patients" — the platform displays only real database records by design.
* If asked about deployment/email: both are configuration-level follow-ups
  documented in `docs/ROADMAP.md` — say so plainly.
