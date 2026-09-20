# Roadmap

Completed work is listed factually below; everything under **Future work**
is *not implemented* — it is a record of direction, not a claim of features.

## Completed

* Public responsive website (Home, About, Treatments, FAQ, Contact, Gallery, Privacy Policy)
* Appointment request system with server-side validation and rate limiting
* PostgreSQL database (Prisma) with migrations and a seeded admin
* Secure admin authentication (JWT, bcrypt) and appointment dashboard
* Status workflow with guarded transitions and confirmation dialogs
* Notification service with pluggable transport and delivery logging
* Admin analytics (request trends, status distribution, top treatments) from real data
* Appointment activity audit trail
* Automated tests: 31 backend API tests, 8 frontend unit/component tests
* CI (GitHub Actions) with ephemeral Postgres; scheduled multi-Node build checks
* Security audit with fixes and documented accepted risks
* Documentation for humans and AI coding agents

## Future work (not implemented)

* **Real email delivery** — set `EMAIL_PROVIDER=resend` + `RESEND_API_KEY` + `EMAIL_FROM`; the transport already exists, no code changes needed
* **Production domain & hosting** — backend (e.g. Railway/Render) with hosted PostgreSQL; frontend on Vercel/Netlify wiring `VITE_API_URL` and `FRONTEND_URL`
* **Automated database backups** — responsibility of the chosen database host; document the schedule when configured
* **Role-based admin permissions** — currently a single admin role; introduce roles only if the clinic needs multiple distinct access levels
* **Richer reporting** — CSV export, monthly summaries, no-show tracking
* **Reminder notifications** — appointment-day reminders once email delivery is live
* **Breaking-major dependency upgrades** — Vite 6+/Vitest 5, react-router 7, Prisma 7 (see `SECURITY_AUDIT.md` for the accepted-risk analysis)
