/**
 * Centralized API client for the clinic appointment backend.
 *
 * Base URL comes from VITE_API_URL (see .env.example); it falls back to the
 * documented development server. All network access goes through here so no
 * component hardcodes fetch URLs.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

/** Error thrown for any non-successful API interaction. */
export class ApiError extends Error {
  readonly status: number
  /** True when the backend could not be reached at all (offline / not running). */
  readonly isNetworkError: boolean
  /** Per-field messages returned by server-side validation (status 400). */
  readonly fieldErrors?: Record<string, string>

  constructor(
    status: number,
    message: string,
    options?: { isNetworkError?: boolean; fieldErrors?: Record<string, string> },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isNetworkError = options?.isNetworkError ?? false
    this.fieldErrors = options?.fieldErrors
  }
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface AppointmentRecord {
  id: string
  name: string
  phone: string
  email: string
  treatment: string | null
  preferredDate: string | null
  preferredTime: string | null
  message: string | null
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

export interface AppointmentStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

export interface AppointmentListResult {
  data: AppointmentRecord[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListAppointmentsParams {
  page?: number
  limit?: number
  status?: AppointmentStatus | ''
  search?: string
  fromDate?: string
  toDate?: string
}

export interface SubmitAppointmentPayload {
  name: string
  phone: string
  email: string
  preferredDate?: string
  preferredTime?: string
  treatment?: string
  message?: string
}

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{ field?: string; message: string }>
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      // Merge AFTER the init spread so per-call headers (e.g. Authorization)
      // extend rather than replace the JSON defaults.
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers ?? {}),
      },
    })
  } catch {
    // fetch only throws here for network-level failures (offline, server down).
    throw new ApiError(0, 'The appointment service could not be reached.', {
      isNetworkError: true,
    })
  }

  let body: ApiEnvelope<T> | null = null
  try {
    body = (await response.json()) as ApiEnvelope<T>
  } catch {
    // Non-JSON body — handled below via response.ok.
  }

  if (!response.ok || !body?.success) {
    const fieldErrors: Record<string, string> | undefined = body?.errors
      ? Object.fromEntries(
          body.errors.filter((e) => e.field).map((e) => [e.field as string, e.message]),
        )
      : undefined
    throw new ApiError(response.status, body?.message ?? 'Something went wrong. Please try again.', {
      fieldErrors,
    })
  }

  return body.data as T
}

function authHeader(token: string): RequestInit['headers'] {
  return { Authorization: `Bearer ${token}` }
}

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

export function submitAppointment(payload: SubmitAppointmentPayload): Promise<{ id: string }> {
  return request<{ id: string }>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ---------------------------------------------------------------------------
// Admin endpoints (Bearer auth)
// ---------------------------------------------------------------------------

export interface LoginResult {
  token: string
  admin: { id: string; name: string; email: string }
}

export function loginAdmin(email: string, password: string): Promise<LoginResult> {
  return request<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchAppointments(
  token: string,
  params: ListAppointmentsParams = {},
): Promise<AppointmentListResult> {
  const search = new URLSearchParams()
  if (params.page && params.page > 1) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))
  if (params.status) search.set('status', params.status)
  if (params.search?.trim()) search.set('search', params.search.trim())
  if (params.fromDate) search.set('fromDate', params.fromDate)
  if (params.toDate) search.set('toDate', params.toDate)
  const qs = search.toString()
  return request<AppointmentListResult>(`/appointments${qs ? `?${qs}` : ''}`, {
    headers: authHeader(token),
  })
}

export function fetchAppointment(token: string, id: string): Promise<AppointmentRecord> {
  return request<AppointmentRecord>(`/appointments/${id}`, { headers: authHeader(token) })
}

export function fetchAppointmentStats(token: string): Promise<AppointmentStats> {
  return request<Record<string, number>>('/appointments/stats', { headers: authHeader(token) }).then(
    (raw) => ({
      total: raw.total ?? 0,
      // Backend groups by the Prisma enum (PENDING/CONFIRMED/…); normalize so
      // components can consume stable lowercase keys.
      pending: raw.PENDING ?? 0,
      confirmed: raw.CONFIRMED ?? 0,
      completed: raw.COMPLETED ?? 0,
      cancelled: raw.CANCELLED ?? 0,
    }),
  )
}

export function updateAppointmentStatus(
  token: string,
  id: string,
  status: AppointmentStatus,
): Promise<AppointmentRecord> {
  return request<AppointmentRecord>(`/appointments/${id}/status`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ status }),
  })
}

export function deleteAppointment(token: string, id: string): Promise<void> {
  return request<void>(`/appointments/${id}`, { method: 'DELETE', headers: authHeader(token) })
}

export interface TrendPoint {
  /** ISO calendar day (YYYY-MM-DD, IST) the count belongs to. */
  day: string
  count: number
}

export interface TreatmentCount {
  treatment: string
  count: number
}

export type AnalyticsRange = 1 | 7 | 30 | 90

export function fetchAppointmentTrends(
  token: string,
  days: AnalyticsRange,
): Promise<TrendPoint[]> {
  return request<TrendPoint[]>(`/appointments/analytics/trends?days=${days}`, {
    headers: authHeader(token),
  })
}

export function fetchTopTreatments(
  token: string,
  days: AnalyticsRange,
): Promise<TreatmentCount[]> {
  return request<TreatmentCount[]>(`/appointments/analytics/treatments?days=${days}`, {
    headers: authHeader(token),
  })
}

export interface ActivityEntry {
  id: string
  action: 'REQUEST_CREATED' | 'STATUS_CHANGED' | 'APPOINTMENT_DELETED'
  actorName: string | null
  previousStatus: AppointmentStatus | null
  newStatus: AppointmentStatus | null
  createdAt: string
  appointment: { id: string; name: string; phone: string }
}

export function fetchActivity(token: string): Promise<ActivityEntry[]> {
  return request<ActivityEntry[]>('/appointments/activity', { headers: authHeader(token) })
}
