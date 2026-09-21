# Sakthi Dental Clinic — API Reference

Base URL: `http://localhost:5000/api` in development (port configurable via
`PORT`). All request and response bodies are JSON. Every response has a
`success` boolean and a human-readable `message`. Timestamps are UTC ISO 8601.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/health` | Public | Liveness probe |
| POST | `/auth/login` | Public (rate-limited) | Returns `{ token, admin }`; JWT valid 8 h |
| POST | `/appointments` | Public (rate-limited) | Create an appointment request |
| GET | `/appointments` | Admin | Paginated, filterable list |
| GET | `/appointments/stats` | Admin | Real counts per status |
| GET | `/appointments/activity` | Admin | Audit trail (newest first) |
| GET | `/appointments/analytics/trends` | Admin | Requests per day, IST buckets |
| GET | `/appointments/analytics/treatments` | Admin | Most requested treatments |
| GET | `/appointments/:id` | Admin | Single appointment |
| PATCH | `/appointments/:id/status` | Admin | Workflow-guarded transition |
| DELETE | `/appointments/:id` | Admin | Permanent delete |

## Authentication

`Authorization: Bearer <token>` on every admin route. Tokens expire after
8 hours. Unknown email and wrong password return the identical
`401 { "success": false, "message": "Invalid email or password" }` so the
endpoint does not reveal which emails exist. The response never includes the
password hash.

## POST /appointments

Public. Creates a guest appointment request (patients are not accounts).

```json
{
  "name": "Priya R",
  "phone": "9876543210",
  "email": "priya@example.com",
  "treatment": "Orthodontic Treatment",
  "preferredDate": "2026-09-25",
  "preferredTime": "10:00",
  "message": "Consultation for braces"
}
```

Only `name`, `phone` and `email` are required. Validation (Zod, strict —
unknown fields are rejected with 400):

* `name` — 2–80 characters
* `phone` — valid phone number, 7–20 characters (digits, spaces, `+`, `()`, `-`, `.`)
* `email` — valid email, ≤ 120 characters
* `treatment` — optional, 1–100 characters (the UI sends names from `src/data/treatments.ts`)
* `preferredDate` — optional `YYYY-MM-DD`, a real calendar date, today or later
* `preferredTime` — optional 24 h `HH:MM`
* `message` — optional, ≤ 1000 characters

Validation failures return `400` with per-field messages. Success returns
`201` with the created appointment.

## GET /appointments

Query params:

* `page` (default 1), `limit` (default 20, max 100)
* `status` — `PENDING` | `CONFIRMED` | `COMPLETED` | `CANCELLED`
* `search` — case-insensitive match on name, phone, email, treatment or message
* `fromDate`, `toDate` — inclusive range on `preferredDate` (`YYYY-MM-DD`)

Response:

```json
{
  "success": true,
  "data": {
    "data": [ { "id": "…", "name": "…", "status": "PENDING", "…": "…" } ],
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

## GET /appointments/stats

Returns real counts from a database `GROUP BY`:

```json
{ "success": true, "data": { "total": 12, "PENDING": 4, "CONFIRMED": 5, "COMPLETED": 2, "CANCELLED": 1 } }
```

## Status workflow

`PATCH /appointments/:id/status` with `{ "status": "CONFIRMED" }`.

Allowed transitions:

| From | To |
| --- | --- |
| PENDING | CONFIRMED, CANCELLED |
| CONFIRMED | COMPLETED, CANCELLED |
| COMPLETED | — (terminal) |
| CANCELLED | — (terminal) |

Responses: success `200`; unknown id `404`; setting the same status or an
invalid transition `409` (the message lists the allowed transitions). The
status change and its `AppointmentActivity` audit row commit in the same
transaction; the actor is the authenticated admin.

## GET /appointments/analytics/trends

`?days=1|7|30|90` (default 30; anything else is rejected). Returns one
bucket per day, zero-filled, oldest first:

```json
{ "success": true, "data": [ { "day": "2026-09-20", "count": 3 } ] }
```

Days are bucketed in `Asia/Kolkata` — the clinic's own calendar — and
`count` is the number of requests **created** that day.

## GET /appointments/analytics/treatments

`?days=1|7|30|90` (default 30). Returns the top 5 requested treatments in
the window, highest count first, excluding appointments without a
treatment:

```json
{ "success": true, "data": [ { "treatment": "Tooth Filling", "count": 4 } ] }
```

## GET /appointments/activity

Returns the newest audit entries (last 50), newest first:

```json
{
  "success": true,
  "data": [
    {
      "id": "…",
      "action": "STATUS_CHANGED",
      "actorName": "Clinic Admin",
      "previousStatus": "PENDING",
      "newStatus": "CONFIRMED",
      "createdAt": "2026-09-21T06:12:45.101Z",
      "appointment": { "id": "…", "name": "Priya R", "phone": "9876543210" }
    }
  ]
}
```

`action` is one of `REQUEST_CREATED`, `STATUS_CHANGED`,
`APPOINTMENT_DELETED`. Only name and phone of the appointment are exposed —
no message contents or contact email in the trail.

## Notifications

Appointment events (created, confirmed, cancelled, completed) trigger a
patient notification. Delivery is best-effort: the default `logger`
provider writes the message to the server log; setting
`EMAIL_PROVIDER=resend` with `RESEND_API_KEY` and `EMAIL_FROM` switches to
real email with no other code change. Every attempt is recorded in the
`NotificationLog` table (`SENT`/`FAILED` plus the error message on
failure). A notification failure never fails the appointment request that
triggered it.

## Error format

Consistent envelope on all failures:

```json
{ "success": false, "message": "Unable to process request" }
```

No stack traces, database errors, or internal paths are returned.
Malformed JSON bodies return 400 with a parse-safe message. Rate limits:
general API and login (public), stricter budget on appointment creation.
