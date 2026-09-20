# Sakthi Dental Clinic — API Reference

Base URL: `http://localhost:5000/api` (development; configurable via `PORT`).

All request and response bodies are JSON. Every response has a `success`
boolean and a human-readable `message`. All timestamps are UTC ISO 8601.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public (rate-limited) | Returns `{ token, admin }`, 8 h JWT |
| GET | `/health` | Public | Liveness probe |
| POST | `/appointments` | Public (rate-limited) | Create appointment request |
| GET | `/appointments` | Admin | Paginated list |
| GET | `/appointments/stats` | Admin | Status counts |
| GET | `/appointments/trends` | Admin | Day buckets, `days` = 7/30/90 |
| GET | `/appointments/treatments` | Admin | Top treatments, `days` = 7/30/90 |
| GET | `/appointments/activity` | Admin | Audit trail |
| GET | `/appointments/:id` | Admin | Single appointment |
| PATCH | `/appointments/:id/status` | Admin | Workflow-guarded transitions |
| DELETE | `/appointments/:id` | Admin | Permanent delete |

## Authentication

`Authorization: Bearer <token>` on every admin route. Tokens expire after
8 hours. Unknown email and wrong password return the identical
`401 { success: false, message: "Invalid credentials" }`.

## POST /appointments

```json
{
  "name": "Priya R",
  "phone": "9876543210",
  "email": "priya@example.com",
  "existing": "no",
  "treatment": "Braces & Orthodontics",
  "preferredDate": "2026-09-25",
  "preferredTime": "10:00",
  "message": "Consultation for braces"
}
```

Validation (Zod): name 2–80 chars; valid email; Indian phone
(10 digits, optional +91); treatment from the site's treatment list;
`preferredDate` a real date, today or later; `preferredTime` `HH:mm`
(24 h) within 10:00–20:00; optional message ≤ 500 chars.
Errors return 400 with per-field messages.

## GET /appointments

Query params: `page` (default 1), `limit` (default 10, max 100),
`status` (PENDING/CONFIRMED/COMPLETED/CANCELLED), `search` (name/phone/email),
`fromDate`, `toDate` (inclusive, filters on `preferredDate`).
Response:

```json
{
  "success": true,
  "data": {
    "appointments": [...],
    "pagination": { "page": 1, "limit": 10, "total": 12, "totalPages": 2 }
  }
}
```

## Status workflow

PATCH `/appointments/:id/status` with `{ "status": "CONFIRMED" }`.

Allowed transitions:

| From | To |
| --- | --- |
| PENDING | CONFIRMED, CANCELLED |
| CONFIRMED | COMPLETED, CANCELLED |
| COMPLETED | — (terminal) |
| CANCELLED | — (terminal) |

Invalid transitions and unknown IDs return 400/404 respectively.
Every successful transition writes an `AppointmentActivity` row
(actor: the authenticated admin).

## GET /appointments/trends

`?days=7|30|90` (default 30). Returns `[{ date, count }]` — one bucket per
day in Asia/Kolkata (the clinic's calendar), zero-filled, oldest first.
`count` = appointments created that day.

## GET /appointments/treatments

`?days=7|30|90`. Returns `[{ treatment, count }]` descending,
top 8. Rows with no treatment are grouped as "Not specified".

## GET /appointments/activity

Query: `limit` (default 20, max 100). Returns the newest audit entries:
action (`STATUS_CHANGED` with previous/new status, or `APPOINTMENT_CREATED`),
appointment name, admin name, timestamp.

## Notifications

Status events trigger patient email notifications (created, confirmed,
completed, cancelled). Delivery is best-effort: the `logger` transport logs
to the server console by default; a provider is only used when
`EMAIL_PROVIDER` is set. Every attempt is recorded in the
`NotificationLog` table (SENT/FAILED + error message). A notification
failure never fails the appointment request that triggered it.

## Error format

Consistent envelope on all failures:

```json
{ "success": false, "message": "Unable to process request" }
```

No stack traces, database errors, or internal paths are returned.
Malformed JSON bodies return 400 with a parse-safe message.
