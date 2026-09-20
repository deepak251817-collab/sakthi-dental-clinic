import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ApiError,
  fetchAppointments,
  fetchAppointmentStats,
  submitAppointment,
  updateAppointmentStatus,
} from '../lib/api'

// Unit tests for the shared API client. fetch is mocked; no server needed.
// The updateAppointmentStatus test is a regression guard for the Phase 4
// header-merge bug (Authorization replacing Content-Type → empty PATCH body).

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('fetchAppointmentStats', () => {
  it('normalizes uppercase backend status keys to the lowercase shape the UI consumes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(200, {
          success: true,
          data: { total: 4, PENDING: 3, CONFIRMED: 1, COMPLETED: 0, CANCELLED: 0 },
        }),
      ),
    )

    const stats = await fetchAppointmentStats('t')
    expect(stats).toEqual({ total: 4, pending: 3, confirmed: 1, completed: 0, cancelled: 0 })
  })
})

describe('updateAppointmentStatus', () => {
  it('sends a JSON body together with the Authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        success: true,
        data: { id: 'a1', status: 'CONFIRMED' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await updateAppointmentStatus('t', 'a1', 'CONFIRMED')

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = init.headers as Record<string, string>
    expect(init.method).toBe('PATCH')
    expect(headers.Authorization).toBe('Bearer t')
    expect(headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body as string)).toEqual({ status: 'CONFIRMED' })
  })
})

describe('submitAppointment', () => {
  it('maps per-field server validation errors onto the thrown ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(400, {
          success: false,
          message: 'Validation failed',
          errors: [
            { field: 'email', message: 'Invalid email address' },
            { field: 'phone', message: 'Phone must be a valid Indian mobile number' },
          ],
        }),
      ),
    )

    const error = await submitAppointment({ name: 'A', phone: '1', email: 'nope' }).catch(
      (e: unknown) => e,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(400)
    expect((error as ApiError).fieldErrors).toEqual({
      email: 'Invalid email address',
      phone: 'Phone must be a valid Indian mobile number',
    })
  })

  it('marks unreachable backends as network errors so the UI can show the offline message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    const error = await submitAppointment({ name: 'A', phone: '1', email: 'a@b.co' }).catch(
      (e: unknown) => e,
    )
    expect((error as ApiError).isNetworkError).toBe(true)
  })
})

describe('fetchAppointments', () => {
  it('builds the documented query string and passes the bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        success: true,
        data: { appointments: [], page: 2, limit: 20, total: 0, totalPages: 0 },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await fetchAppointments('t', { page: 2, limit: 20, status: 'PENDING', search: ' priya ' })

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/appointments?')
    expect(url).toContain('page=2')
    expect(url).toContain('limit=20')
    expect(url).toContain('status=PENDING')
    expect(url).toContain('search=priya')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer t')
  })
})
