/**
 * Notification workflow tests.
 *
 * The default 'logger' email provider succeeds, so the HTTP creation flow
 * should record SENT rows. Failure isolation is tested by injecting a
 * throwing transport at the service level: the appointment must survive and
 * the failure must be recorded as a FAILED log row.
 *
 * Requires: local PostgreSQL with migrations applied (see backend/README.md).
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Application } from 'express'
import request from 'supertest'
import { createApp } from '../src/app'
import { prisma } from '../src/lib/prisma'
import { deliverNotification, type EmailTransport } from '../src/services/notificationService'

let app: Application

const RUN_TAG = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const createdIds: string[] = []

const baseAppointment = {
  name: `Notification Patient ${RUN_TAG}`,
  phone: '+91 9862890897',
  email: `${RUN_TAG}@example.com`,
  treatment: 'Dental Cleaning',
}

async function createViaHttp(overrides: Record<string, unknown> = {}): Promise<string> {
  const res = await request(app)
    .post('/api/appointments')
    .send({ ...baseAppointment, ...overrides })
  expect(res.status).toBe(201)
  const id = res.body.data.id as string
  createdIds.push(id)
  return id
}

beforeAll(() => {
  app = createApp()
})

afterAll(async () => {
  // Deleting the appointments cascades to their notification logs.
  if (createdIds.length > 0) {
    await prisma.appointment.deleteMany({ where: { id: { in: createdIds } } })
  }
  await prisma.$disconnect()
})

describe('notification logging on appointment creation', () => {
  it('records a SENT email log for the patient (and the clinic team) after a public submission', async () => {
    const id = await createViaHttp()

    // Notification dispatch is fire-and-forget — wait for the log rows.
    const logs = await vi.waitFor(
      () =>
        prisma.notificationLog
          .findMany({ where: { appointmentId: id, type: 'APPOINTMENT_CREATED' } })
          .then((rows) => {
            expect(rows.length).toBeGreaterThan(0)
            return rows
          }),
      { timeout: 5000 },
    )

    const patientRow = logs.find((row) => row.recipient === baseAppointment.email)
    expect(patientRow).toBeDefined()
    expect(patientRow?.status).toBe('SENT')
    expect(patientRow?.channel).toBe('EMAIL')
    expect(patientRow?.errorMessage).toBeNull()
    // The clinic team (seeded admin) is also notified about new requests.
    expect(logs.length).toBeGreaterThan(1)
  })
})

describe('notification failure isolation', () => {
  it('records FAILED and leaves the appointment intact when the provider throws', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...baseAppointment, email: `${RUN_TAG}+fail@example.com` },
    })
    createdIds.push(appointment.id)

    const failingTransport: EmailTransport = async () => {
      throw new Error('provider down')
    }

    const outcomes = await deliverNotification(
      'APPOINTMENT_CONFIRMED',
      {
        appointmentId: appointment.id,
        patientName: appointment.name,
        patientEmail: appointment.email,
        treatment: appointment.treatment,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
      },
      { transport: failingTransport },
    )

    expect(outcomes).toEqual([
      { recipient: appointment.email, ok: false, error: 'provider down' },
    ])

    const log = await prisma.notificationLog.findFirst({
      where: { appointmentId: appointment.id, type: 'APPOINTMENT_CONFIRMED' },
    })
    expect(log?.status).toBe('FAILED')
    expect(log?.errorMessage).toBe('provider down')

    // The appointment itself is untouched by the notification failure.
    const stillThere = await prisma.appointment.findUnique({ where: { id: appointment.id } })
    expect(stillThere?.status).toBe('PENDING')
  })

  it('cascades log deletion with the appointment', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...baseAppointment, email: `${RUN_TAG}+cascade@example.com` },
    })
    createdIds.push(appointment.id)

    await deliverNotification(
      'APPOINTMENT_COMPLETED',
      {
        appointmentId: appointment.id,
        patientName: appointment.name,
        patientEmail: appointment.email,
      },
      { transport: async () => {} },
    )
    expect(
      await prisma.notificationLog.count({ where: { appointmentId: appointment.id } }),
    ).toBe(1)

    await prisma.appointment.delete({ where: { id: appointment.id } })
    expect(
      await prisma.notificationLog.count({ where: { appointmentId: appointment.id } }),
    ).toBe(0)
  })
})
