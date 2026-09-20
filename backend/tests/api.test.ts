/**
 * API test suite — exercises the HTTP layer through createApp() against the
 * local development database (prisma migrate dev has created the schema).
 *
 * The suite is self-contained: it reads the seeded admin's credentials from
 * environment variables, generates a unique email per appointment to avoid
 * interference, and cleans up only the rows it created.
 *
 * Run with:  npm test          (from backend/)
 * Requires:  backend/.env with DATABASE_URL and ADMIN_* credentials.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Application } from 'express'
import request from 'supertest'
import { createApp } from '../src/app'
import { prisma } from '../src/lib/prisma'

let app: Application
let token: string

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/** Unique marker so cleanup removes exactly this run's rows. */
const RUN_TAG = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const createdIds: string[] = []

const validAppointment = {
  name: `Test Patient ${RUN_TAG}`,
  phone: '+91 9862890897',
  email: `${RUN_TAG}@example.com`,
  preferredDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
  preferredTime: '10:30',
  treatment: 'Dental Cleaning',
  message: `Automated test submission ${RUN_TAG}`,
}

async function createTestAppointment(
  overrides: Record<string, unknown> = {},
): Promise<string> {
  const res = await request(app)
    .post('/api/appointments')
    .send({ ...validAppointment, email: `${RUN_TAG}+${createdIds.length}@example.com`, ...overrides })
  expect(res.status).toBe(201)
  createdIds.push(res.body.data.id)
  return res.body.data.id
}

beforeAll(async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running tests.')
  }
  app = createApp()
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  expect(login.status).toBe(200)
  token = login.body.data.token
})

afterAll(async () => {
  if (createdIds.length > 0) {
    await prisma.appointment.deleteMany({
      where: { id: { in: createdIds } },
    })
  }
  await prisma.$disconnect()
})

describe('POST /api/appointments (public)', () => {
  it('creates an appointment and returns its id', async () => {
    const res = await request(app).post('/api/appointments').send(validAppointment)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(typeof res.body.data.id).toBe('string')
    createdIds.push(res.body.data.id)
  })

  it('accepts an appointment with only the required fields', async () => {
    const res = await request(app).post('/api/appointments').send({
      name: `Required Only ${RUN_TAG}`,
      phone: '9862890897',
      email: `${RUN_TAG}-min@example.com`,
    })
    expect(res.status).toBe(201)
    createdIds.push(res.body.data.id)
  })

  it('rejects an invalid email with a field error', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ ...validAppointment, email: 'not-an-email' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
    )
  })

  it('rejects a name that is too short', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ ...validAppointment, name: 'A' })
    expect(res.status).toBe(400)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })]),
    )
  })

  it('rejects a past preferred date', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        ...validAppointment,
        preferredDate: new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10),
      })
    expect(res.status).toBe(400)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'preferredDate' })]),
    )
  })

  it('rejects unknown properties (strict schema)', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ ...validAppointment, isAdmin: true })
    expect(res.status).toBe(400)
  })

  it('returns 400 (not 500) for a malformed JSON body', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Content-Type', 'application/json')
      .send('{"name": broken')
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})

describe('Admin authentication', () => {
  it('rejects unknown credentials without revealing which field failed', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: `nobody-${RUN_TAG}@example.com`, password: 'WrongPassword1!' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')
  })

  it('rejects a wrong password for a real admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: 'WrongPassword1!' })
    expect(res.status).toBe(401)
  })

  it('rejects a malformed login body', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' })
    expect(res.status).toBe(400)
  })
})

describe('Appointment admin endpoints (auth required)', () => {
  it('blocks list, detail, status update and delete without a token', async () => {
    const id = await createTestAppointment()
    const checks = [
      request(app).get('/api/appointments'),
      request(app).get(`/api/appointments/${id}`),
      request(app)
        .patch(`/api/appointments/${id}/status`)
        .send({ status: 'CONFIRMED' }),
      request(app).delete(`/api/appointments/${id}`),
    ]
    for (const check of checks) {
      const res = await check
      expect(res.status).toBe(401)
    }
  })

  it('rejects an invalid bearer token', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })

  it('lists appointments with pagination metadata', async () => {
    await createTestAppointment()
    const res = await request(app)
      .get('/api/appointments?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ page: 1, limit: 5 })
    expect(typeof res.body.data.total).toBe('number')
    expect(Array.isArray(res.body.data.data)).toBe(true)
  })

  it('filters by search and status', async () => {
    await createTestAppointment()
    const res = await request(app)
      .get(`/api/appointments?search=${encodeURIComponent(RUN_TAG)}&status=PENDING`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    for (const row of res.body.data.data) {
      expect(row.status).toBe('PENDING')
    }
    expect(res.body.data.data.length).toBeGreaterThan(0)
  })

  it('returns the full record for a detail request', async () => {
    const id = await createTestAppointment({ message: `Detail check ${RUN_TAG}` })
    const res = await request(app)
      .get(`/api/appointments/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id, status: 'PENDING' })
    expect(res.body.data.message).toBe(`Detail check ${RUN_TAG}`)
  })

  it('returns 404 for a missing appointment', async () => {
    const res = await request(app)
      .get('/api/appointments/00000000-0000-4000-8000-000000000000')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })

  it('walks the status workflow PENDING → CONFIRMED → COMPLETED', async () => {
    const id = await createTestAppointment()
    for (const status of ['CONFIRMED', 'COMPLETED'] as const) {
      const res = await request(app)
        .patch(`/api/appointments/${id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status })
      expect(res.status).toBe(200)
      expect(res.body.data.status).toBe(status)
    }
  })

  it('allows PENDING → CANCELLED', async () => {
    const id = await createTestAppointment()
    const res = await request(app)
      .patch(`/api/appointments/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'CANCELLED' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('CANCELLED')
  })

  it('rejects nonsensical transitions with 409', async () => {
    const id = await createTestAppointment()
    const res = await request(app)
      .patch(`/api/appointments/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'COMPLETED' })
    expect(res.status).toBe(409)
  })

  it('rejects an invalid status value with 400', async () => {
    const id = await createTestAppointment()
    const res = await request(app)
      .patch(`/api/appointments/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'TELEPORTED' })
    expect(res.status).toBe(400)
  })

  it('deletes an appointment', async () => {
    const id = await createTestAppointment()
    const del = await request(app)
      .delete(`/api/appointments/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(del.status).toBe(200)
    const get = await request(app)
      .get(`/api/appointments/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(get.status).toBe(404)
  })
})

describe('Appointment analytics (auth required)', () => {
  it('blocks trends and treatment analytics without a token', async () => {
    for (const path of ['/api/appointments/analytics/trends', '/api/appointments/analytics/treatments']) {
      const res = await request(app).get(path)
      expect(res.status).toBe(401)
    }
  })

  it('rejects an unsupported days value', async () => {
    const res = await request(app)
      .get('/api/appointments/analytics/trends?days=5')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
  })

  it('returns daily trend buckets covering the requested window', async () => {
    await createTestAppointment()
    const res = await request(app)
      .get('/api/appointments/analytics/trends?days=7')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(7)
    for (const point of res.body.data) {
      expect(point.day).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof point.count).toBe('number')
    }
    // The bucket for today (IST) includes the appointments created by this run.
    const todayIst = new Date(Date.now() + 5.5 * 3_600_000).toISOString().slice(0, 10)
    const today = res.body.data.find((point: { day: string }) => point.day === todayIst)
    expect(today.count).toBeGreaterThan(0)
  })

  it('returns top treatments including one just created, highest count first', async () => {
    await createTestAppointment({ treatment: 'Teeth Whitening' })
    const res = await request(app)
      .get('/api/appointments/analytics/treatments?days=7')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    const counts: number[] = res.body.data.map((row: { count: number }) => row.count)
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i - 1]).toBeGreaterThanOrEqual(counts[i])
    }
    expect(res.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ treatment: 'Teeth Whitening' })]),
    )
  })
})
