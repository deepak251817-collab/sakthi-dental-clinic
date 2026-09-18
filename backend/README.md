# Sakthi Dental Clinic — Backend

Express + TypeScript + Prisma + PostgreSQL API powering appointment requests and the admin dashboard.

## Stack

- **Node.js + Express + TypeScript** — REST API
- **PostgreSQL** via **Prisma** ORM
- **JWT** (8 h access tokens) + **bcrypt** password hashing
- **Zod** — request validation (strict schemas, no unknown properties)
- **helmet / CORS / express-rate-limit** — security middleware

## Setup

```bash
cd backend
npm install

# 1. Create backend/.env (see .env.example):
#    DATABASE_URL   – PostgreSQL connection string
#    JWT_SECRET     – random string, ≥ 32 characters
#    PORT           – default 5000
#    FRONTEND_URL   – allowed CORS origin (default http://localhost:5173)
#    ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD – dev admin for the seed

# 2. Create the schema and the development admin account:
npx prisma generate
npx prisma migrate dev
npm run db:seed

# 3. Run the API:
npm run dev        # tsx watch (development)
npm run build      # tsc → dist/
npm start          # node dist/server.js (production)
```

Never commit `backend/.env` — it holds the database credentials, JWT secret and dev admin password.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server with auto-reload |
| `npm run build` | Type-check and compile to `dist/` |
| `npm start` | Run the compiled server |
| `npm test` | Run the API test suite (vitest + supertest) |
| `npm run db:seed` | Create/update the dev admin from `.env` credentials |

## API

Full endpoint reference: [`docs/API.md`](../docs/API.md) at the repository root.

## Tests

`npm test` runs 21 end-to-end API tests against the local database (public validation, auth guards, status workflow, pagination, search filters, deletion). They read the seeded admin's credentials from environment variables and clean up their own rows. Rate limiters are bypassed automatically under `NODE_ENV=test`.
