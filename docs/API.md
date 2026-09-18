# Sakthi Dental Clinic — API Reference

Base URL (development): `http://localhost:5000/api` — configure `PORT` in `backend/.env`.

All request and response bodies are JSON. Every response contains a `success` boolean and a human-readable `message`. Authentication uses a JWT bearer token: `Authorization: Bearer <token>` (valid for 8 hours).

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/health` | Public |
| POST | `/auth/login` | Public (rate-limited) |
| POST | `/appointments` | Public (rate-limited) |
| GET | `/appointments` | Admin |
| GET | `/appointments/stats` | Admin |
| GET | `/appointments/:id` | Admin |
| PATCH | `/appointments/:id/status` | Admin |
| DELETE | `/appointments/:id` | Admin |

## Authentication

### `POST /auth/login`

Verify admin credentials and receive a JWT access token.

**Request body**

```json
{
  "email": "admin@example.com",
  "password": "********"
}
```

**Success — 200**

```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "token": "<jwt>",
    "admin": { "id": "…", "name": "Clinic Admin", "email": "admin@example.com" }
  }
}
```

**Errors**

| Status | When |
| --- | --- |
| 400 | Body fails validation (missing/invalid email or password) |
| 401 | Unknown email or wrong password — same message for both, so the endpoint does not reveal which emails exist |
| 429 | More than 20 attempts from one address within 15 minutes |

The token is also required for every `/appointments` operation below. Send it as `Authorization: Bearer <token>`; missing or invalid tokens return **401**.

## Appointments

### `POST /appointments` — public

Submit an appointment request. The request is stored with status `PENDING`; submission is **not** a confirmed booking.

**Request body** (`name`, `phone`, `email` required; the rest optional)

```json
{
  "name": "Priya R",
  "phone": "+91 9862890897",
  "email": "priya@example.com",
  "preferredDate": "2026-09-25",
  "preferredTime": "10:30",
  "treatment": "Dental Cleaning",
  "message": "Tooth sensitivity for the past week."
}
```

Validation rules: `name` 2–80 chars · `phone` 7–20 digits/symbols · valid `email` (max 120) · `preferredDate` in `YYYY-MM-DD` format, a real calendar date, not in the past · `preferredTime` in 24h `HH:MM` · `message` max 1000 chars · unknown properties are rejected.

**Success — 201**

```json
{
  "success": true,
  "message": "Appointment request submitted successfully",
  "data": { "id": "<appointment id>" }
}
```

**Errors**

| Status | When |
| --- | --- |
| 400 | Validation failed — `errors[]` lists `{ field, message }` per offending field; also returned for a malformed JSON body |
| 429 | More than 10 submissions from one address within 15 minutes |

### `GET /appointments` — admin

Paginated appointment list with search, status filter and preferred-date range.

**Query parameters**

| Param | Type | Notes |
| --- | --- | --- |
| `page` | integer ≥ 1 | default `1` |
| `limit` | integer 1–100 | default `20` |
| `status` | enum | `PENDING` / `CONFIRMED` / `COMPLETED` / `CANCELLED` |
| `search` | string ≤ 100 | case-insensitive match on name, phone, email, treatment or message |
| `fromDate` | `YYYY-MM-DD` | preferred date ≥ fromDate |
| `toDate` | `YYYY-MM-DD` | preferred date ≤ toDate |

**Success — 200**

```json
{
  "success": true,
  "message": "Appointments fetched",
  "data": {
    "data": [
      {
        "id": "…",
        "name": "Priya R",
        "phone": "+91 9862890897",
        "email": "priya@example.com",
        "treatment": "Dental Cleaning",
        "preferredDate": "2026-09-25T00:00:00.000Z",
        "preferredTime": "10:30",
        "status": "PENDING",
        "createdAt": "2026-09-18T12:00:00.000Z",
        "updatedAt": "2026-09-18T12:00:00.000Z",
        "message": "Tooth sensitivity for the past week."
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

**Errors:** `400` invalid query parameters.

### `GET /appointments/stats` — admin

Real counts per status for the dashboard summary cards.

**Success — 200**

```json
{
  "success": true,
  "message": "Appointment stats fetched",
  "data": { "total": 12, "PENDING": 5, "CONFIRMED": 4, "COMPLETED": 2, "CANCELLED": 1 }
}
```

### `GET /appointments/:id` — admin

Full record for one appointment (same shape as a list row).

**Errors:** `404` no appointment with that id.

### `PATCH /appointments/:id/status` — admin

Transition an appointment's status. The workflow is enforced server-side:

```
PENDING   → CONFIRMED | CANCELLED
CONFIRMED → COMPLETED  | CANCELLED
COMPLETED → (terminal)
CANCELLED → (terminal)
```

**Request body**

```json
{ "status": "CONFIRMED" }
```

**Success — 200** — returns the updated appointment (list-row shape) with `message: "Status updated to CONFIRMED"`.

**Errors**

| Status | When |
| --- | --- |
| 400 | `status` is not one of the four enum values |
| 404 | Appointment does not exist |
| 409 | Transition not allowed by the workflow (or the appointment already has that status) |

### `DELETE /appointments/:id` — admin

Permanently remove an appointment record.

**Success — 200** — `{ "success": true, "message": "Appointment deleted", "data": null }`

**Errors:** `404` no appointment with that id.

## Common error shape

All errors are JSON with `success: false` and a safe `message`. Validation failures additionally include an `errors` array:

```json
{
  "success": false,
  "message": "Invalid request data",
  "errors": [{ "field": "email", "message": "Enter a valid email address" }]
}
```

Unexpected server failures return `500` with a generic message — stack traces are never exposed. Security headers (helmet), a restricted CORS origin (`FRONTEND_URL`), a 10 kb JSON body limit and per-endpoint rate limits apply to all routes.
