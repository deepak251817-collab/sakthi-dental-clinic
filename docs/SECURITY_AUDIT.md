# Security Audit — Phase 6 (2026-09-20)

Scope: backend API, authentication, database access, dependencies.
Method: manual code review of every middleware, service and route, plus
`npm audit` on both packages. Real findings fixed; theoretical ones documented.

## Verified secure (no change needed)

| Area | Finding |
| --- | --- |
| Password storage | bcrypt cost 12 (`src/utils/password.ts`); plaintext never stored or logged |
| Hash exposure | `passwordHash` never selected into API responses; login returns id/name/email only |
| User enumeration | Identical 401 `Invalid email or password` for unknown email and wrong password |
| CORS | Pinned to `FRONTEND_URL` — no wildcard |
| Security headers | `helmet()` enabled; `x-powered-by` disabled |
| Rate limiting | Global 300/15min; appointments 10/15min; login 20/15min; pass-through only under `NODE_ENV=test` |
| Body size | `express.json({ limit: '10kb' })` |
| Admin routes | All behind `requireAuth` (Bearer JWT, signature + expiry verified) |
| SQL injection | Prisma parameterized queries only; no raw SQL anywhere |
| Error responses | Uniform `{ success, message }` envelope; stack traces and internals never sent; malformed JSON → 400 |
| Secrets | No `.env` committed (`.gitignore` verified); `.env.example` placeholders only; JWT secret length enforced at boot |
| Migrations | Additive only; no destructive operations in normal startup |

## Fixed

1. **JWT algorithm confusion risk** — `jwt.verify` now pins `algorithms: ['HS256']`,
   so a forged token with a modified `alg` header is rejected rather than being
   verified against the HMAC secret (`src/utils/jwt.ts`).
2. **Dependency vulnerabilities (safe subset)** — `npm audit fix` applied within
   existing major versions; full test suites re-run green (39/39) after updates.

## Analyzed and accepted (documented, not theater-fixed)

| Finding | Why accepted |
| --- | --- |
| `prisma` CLI dependency chain reports 3 high-severity advisories via `deepmerge-ts` (stack exhaustion while merging recursive object graphs) | Prisma CLI is a dev/build-time tool only — not part of the runtime API server; no untrusted input reaches it. Fix requires Prisma 7 (breaking major). |
| `react-router` 6.30.6 advisories (open redirect via backslash `Link`; SSR `deserializeErrors` constructor injection) | Both require SSR frameworks or untrusted redirect targets; this project is a client-rendered SPA with static internal routes. Fix requires react-router 7 (breaking major). |
| `vite`/`esbuild` dev-server advisory | Dev-server-only exposure (never runs in production); fix requires Vite 6+ major upgrade. |

These are revisited whenever a non-breaking patch lands or a major upgrade is
scheduled with full test coverage.
