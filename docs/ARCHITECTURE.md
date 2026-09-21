# Architecture

How the system is actually wired, verified during the Phase 7 audit. Every
component shown here exists in the repository; the only optional box is the
email provider.

## System overview

```text
Patient
  ↓
Public Website (React + Vite, :5173)
  │   treatments, doctors, gallery, FAQ, contact — all content from src/data/
  ↓  Fix an Appointment  (POST /api/appointments)
REST API  ←→  Admin Dashboard (React, :5173/admin)
  ↓
Express Backend (Node.js + TypeScript, :5000)
  │   routes → controllers → services → Zod schemas (validation)
  ↓
Prisma ORM
  ↓
PostgreSQL

Admin
  ↓
Admin Login (/admin/login)  →  JWT (8 h, HS256, bcrypt-verified)
  ↓
Admin Dashboard  →  Protected APIs (requireAuth)
                    list · stats · status transitions · analytics · audit trail

Notification flow (best-effort, failure-isolated)
Appointment event → Appointment Service → Notification Service
                                          → logger (default, always on)
                                          → Resend email (only when EMAIL_PROVIDER=resend)
```

## Frontend

* React 18 + Vite 5 + TypeScript, Tailwind CSS with a lavender brand palette
* Route-level code splitting (every page a lazy chunk); React Router 6 SPA
  with a 404 fallback and (for production) a `vercel.json` rewrite
* `src/lib/api.ts` is the single API client (token handling, error
  normalization); `src/lib/auth.ts` is the only module that touches
  localStorage
* Public site and admin dashboard are separate route trees; admin routes
  sit outside the public site chrome and are guarded client-side by
  `RequireAdminAuth` and server-side by `requireAuth`

## Backend

* Express + TypeScript, layered: `routes → controllers → services`
  with Zod schemas in `schemas/` and cross-cutting concerns in
  `middleware/` (auth, validation, rate limiting, error envelope)
* Boot-time environment validation (`config/env.ts`) — the server refuses
  to start with missing/invalid configuration
* Security middleware: helmet, CORS pinned to `FRONTEND_URL`,
  `express.json` (10 kb), rate limits on the whole API and a stricter
  budget on appointment creation and login
* Error handler returns a uniform `{ success, message }` envelope; no
  stack traces or internals leak

## Database

PostgreSQL via Prisma, versioned migrations in `backend/prisma/migrations`:

| Model | Role |
| --- | --- |
| `Appointment` | Guest requests; indexed on status, createdAt, email, preferredDate |
| `AdminUser` | Staff accounts (bcrypt cost 12, unique email) |
| `NotificationLog` | One row per notification attempt (type, channel, SENT/FAILED) |
| `AppointmentActivity` | Audit trail (action, actor, previous/new status) |

Seed: `backend/prisma/seed.ts` upserts the dev admin from the `ADMIN_*`
environment variables (never committed). Note for operators: quote values
containing `#` in `.env` — dotenv truncates unquoted values at `#`.

## Appointment flow

```text
Patient submits form (client-side validation)
  → POST /api/appointments (Zod validation, rate limit)
  → Appointment saved (status PENDING) + REQUEST_CREATED audit row
  → Notification attempt (created) — never blocks or fails the request
  → Admin reviews in /admin (search, filters, pagination)
  → PATCH /:id/status  PENDING→CONFIRMED (workflow-guarded, 409 on invalid)
  → STATUS_CHANGED audit row + patient notification (confirmed)
  → CONFIRMED→COMPLETED or →CANCELLED (terminal states)
```

## Admin dashboard

* Stats cards from `GROUP BY status` (real counts, never fake numbers)
* Analytics: IST-day trend buckets (1/7/30/90-day windows validated
  server-side), status distribution, top treatments — all database
  aggregations, no per-row API calls
* Appointment table: pagination, search, status chips, date filters,
  sortable columns, confirm-then-act dialogs, toasts
* Activity panel showing the newest audit entries

## Deployment (target)

* **Frontend** — static build on Vercel/Netlify; `vercel.json` (committed)
  rewrites all paths to `/index.html` so deep links work
* **Backend** — any Node host (Railway/Render/Fly) running
  `npm run build && node dist/server.js`, with `DATABASE_URL`, `JWT_SECRET`,
  `FRONTEND_URL`, `PORT` set on the platform
* **Database** — managed PostgreSQL; `npx prisma migrate deploy` on release
* No production deployment exists yet — see `docs/ROADMAP.md`
