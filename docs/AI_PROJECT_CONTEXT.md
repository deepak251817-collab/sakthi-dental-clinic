# AI Project Context

Canonical context for AI coding agents (Freebuff and others) working on this repository.
Read this file before modifying anything, then `docs/PROJECT_PHASES.md` and
`docs/COMMIT_REFERENCE.md`. Update this file whenever the architecture changes.

---

## Project Identity

| Field | Value |
| --- | --- |
| Project | Sakthi Dental Clinic Website & Appointment Management System |
| Client | Sakthi Dental Clinic, Hosur, Tamil Nadu, India |
| Audience | Patients (women, children, families) and clinic administrators |
| Project type | Client-style healthcare website + internal appointment management |
| Internship | ShadowFox Intermediate Level Internship |
| Current phase | Phase 7 complete (final QA, screenshots, submission docs) — see `docs/PROJECT_PHASES.md` |
| Production status | Not deployed; deployment targets documented in README + `docs/ROADMAP.md` |

---

## Current Architecture

Verified against the repository. Do not write technologies that are not present here.

### Frontend (repository root)

- React 18 + Vite 5 + TypeScript
- Tailwind CSS 3 (design tokens in `tailwind.config.js` — `primary` lavender scale, `ink` deep-lavender heading scale)
- React Router 6 (`src/App.tsx` — public routes under `PublicLayout`, admin routes standalone)
- Framer Motion (scroll-reveal sections), Lucide React icons
- API client: `src/lib/api.ts` (all fetches, `VITE_API_URL` base), admin token storage: `src/lib/auth.ts`
- Admin pages: `src/pages/AdminLogin.tsx`, `src/pages/AdminDashboard.tsx`
- Admin components: `src/components/admin/*` (stats, analytics panel, activity feed, filters, table, toast, details modal, status chips)
- Tests: Vitest 2 + Testing Library (`src/test/`, run with `npm test`); pinned to Vitest 2 to match the project's Vite 5

### Backend (`backend/`)

- Node.js + Express 4 + TypeScript (ESM), built with `tsc` to `dist/`
- PostgreSQL via Prisma ORM (`backend/prisma/schema.prisma`, migrations in `backend/prisma/migrations/`)
- Zod request validation (`backend/src/schemas/`) with strict object shapes
- JWT auth (8 h tokens, `JWT_SECRET` ≥ 32 chars enforced at boot) + bcrypt password hashing
- Middleware: helmet, restricted CORS (`FRONTEND_URL`), express-rate-limit
  (10 appointments / 15 min, 20 logins / 15 min; disabled when `NODE_ENV=test`)
- Tests: Vitest + supertest against the real local database (`backend/tests/api.test.ts`)
- Config: `backend/src/config/env.ts` validates env at boot and exits on invalid config

### Database (Prisma models)

- `Appointment` — public guest requests; status workflow PENDING → CONFIRMED → COMPLETED, with CANCELLED from pending/confirmed; indexes on status, createdAt, email, preferredDate
- `AdminUser` — clinic staff; bcrypt `passwordHash`, unique email; seeded by `backend/prisma/seed.ts` from `ADMIN_*` env vars
- `NotificationLog` — one row per notification attempt (type, channel, status SENT/FAILED, errorMessage); cascade-deleted with its appointment
- `AppointmentActivity` — audit trail (action, previousStatus, newStatus, appointmentId, adminId) written on creation and every status transition

### Environment variables

- Frontend: `VITE_API_URL` (see `.env.example`)
- Backend: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (seed only), optional email-provider vars (see `backend/.env.example`)
- Never commit real `.env` values. `backend/.env` is git-ignored.
- Gotcha: quote `.env` values containing `#` — dotenv truncates unquoted values at `#` (this bit the dev seed once: the seeded hash was built from a truncated password).

### Deployment

- Frontend: Vercel-ready (`vercel.json` rewrites all routes to `index.html` for React Router)
- Backend: any Node host; requires platform env vars and a hosted PostgreSQL
- Not yet deployed to production — local development only so far
- CI: GitHub Actions (`.github/workflows/ci.yml`) runs frontend lint/build/tests and backend migrate/seed/build/tests on push and PRs to main, with an ephemeral Postgres 16 service container; `.github/workflows/build.yml` verifies builds weekly on Node 20 and 22

---

## Key Invariants (do not break)

1. Dashboard numbers, lists and trends come from real database data. Never fake analytics, patient counts or statistics.
2. Appointment submissions are requests, not confirmations. Public copy must never say an appointment is confirmed.
3. Notification or logging failures must never fail the appointment request itself (fire-and-forget with safe logging).
4. Admin-only data (appointments, patients, audit, analytics) stays behind `requireAuth`.
5. Status transitions follow `ALLOWED_TRANSITIONS` in `backend/src/services/appointmentService.ts`.
6. The public website's design system (lavender/white pastel identity, see `.freebuff/design-notes.md`) is intentional; admin UI is deliberately neutral slate.
7. Treatment names come from `src/data/treatments.ts` on the frontend; the backend accepts free text up to 100 chars and does not duplicate the catalogue.
8. No secrets in code, templates or docs. No fabricated patient data in commits or seeds.

---

## Coding Rules

1. Inspect before modifying — read the relevant service, schema, route and component first.
2. Reuse existing components, services and schemas; do not duplicate implementations or data.
3. Do not invent client information, medical advice, diagnosis or health scoring.
4. Never expose secrets in code, templates, docs or commit messages.
5. Run relevant checks for each change: backend `npm test` / `npm run build`, frontend `npm run lint` / `npm run build`, `npx prisma generate` after schema edits.
6. Never claim tests passed without running them; report actual results.
7. Update documentation (`README.md`, `docs/*`) when the architecture changes.
8. Use Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, `test:`, `chore:`); subject ≤ ~72 chars; explanation goes in the body or `docs/COMMIT_REFERENCE.md`.
9. Append a real entry to `docs/COMMIT_REFERENCE.md` after each meaningful commit (read the diff first; never invent changes).
10. Separate logical commits; never commit unrelated files together.

---

## Git Rules

- Repository-local identity: `Deepak R <deepak251817@gmail.com>` (verified via `git config user.name` / `user.email` before committing).
- Never attribute commits to Freebuff or any AI tool; no co-author or bot trailers.
- Never rewrite history or force-push; commits are append-only records.
- For contribution-graph attribution the commit email must stay connected to the owner's GitHub account.

---

## Useful Commands

```bash
# Frontend (repo root)
npm run dev            # Vite dev server on :5173
npm run lint           # ESLint
npm run build          # tsc -b + vite build
npm test               # Vitest (unit + component, jsdom)

# Backend (backend/)
npm run dev            # tsx watch on :5000
npm run build          # tsc → dist/
npm test               # vitest (needs local PostgreSQL + backend/.env)
npm run db:seed        # upsert dev admin from ADMIN_* env vars
npx prisma migrate dev # apply schema changes
```
