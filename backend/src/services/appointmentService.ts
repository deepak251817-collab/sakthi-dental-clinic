import type { AppointmentStatus } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { CreateAppointmentInput, ListAppointmentsQuery } from '../schemas/appointmentSchema'
import { throwApiError } from '../middleware/errorMiddleware'
import { notifyAppointmentEvent, type NotificationEventType } from './notificationService'

/** Sensible status workflow: PENDING → CONFIRMED → COMPLETED, with cancellation. */
const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

export interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

const LIST_SELECT = {
  id: true,
  name: true,
  phone: true,
  email: true,
  treatment: true,
  preferredDate: true,
  preferredTime: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  message: true,
} as const

export async function createAppointment(input: CreateAppointmentInput) {
  // The audit row is written in the same transaction as the request, so the
  // activity trail cannot drift from what actually happened.
  const appointment = await prisma.$transaction(async (tx) => {
    const created = await tx.appointment.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        preferredDate: input.preferredDate ? new Date(`${input.preferredDate}T00:00:00Z`) : null,
        preferredTime: input.preferredTime ?? null,
        treatment: input.treatment ?? null,
        message: input.message ?? null,
        status: 'PENDING',
      },
      select: { id: true, status: true, createdAt: true },
    })
    await tx.appointmentActivity.create({
      data: {
        appointmentId: created.id,
        action: 'REQUEST_CREATED',
        newStatus: 'PENDING',
      },
    })
    return created
  })

  // Best-effort notifications fire after the record is safely stored; they are
  // not awaited and can never fail the request (see notificationService).
  notifyAppointmentEvent('APPOINTMENT_CREATED', {
    appointmentId: appointment.id,
    patientName: input.name,
    patientEmail: input.email,
    treatment: input.treatment,
    preferredDate: input.preferredDate ? new Date(`${input.preferredDate}T00:00:00Z`) : null,
    preferredTime: input.preferredTime,
  })

  return appointment
}

export async function listAppointments(
  query: ListAppointmentsQuery,
): Promise<PaginatedResult<unknown>> {
  const { page, limit, status, search, fromDate, toDate } = query

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { treatment: { contains: search, mode: 'insensitive' as const } },
            { message: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(fromDate || toDate
      ? {
          preferredDate: {
            ...(fromDate ? { gte: new Date(`${fromDate}T00:00:00Z`) } : {}),
            ...(toDate ? { lte: new Date(`${toDate}T23:59:59.999Z`) } : {}),
          },
        }
      : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: LIST_SELECT,
    }),
    prisma.appointment.count({ where }),
  ])

  return { data, page, limit, total, totalPages: Math.ceil(total / limit) }
}

export async function getAppointmentById(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    select: LIST_SELECT,
  })
  if (!appointment) {
    throwApiError(404, 'Appointment not found')
  }
  return appointment
}

const EVENT_BY_NEW_STATUS: Partial<Record<AppointmentStatus, NotificationEventType>> = {
  CONFIRMED: 'APPOINTMENT_CONFIRMED',
  CANCELLED: 'APPOINTMENT_CANCELLED',
  COMPLETED: 'APPOINTMENT_COMPLETED',
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  actor?: { id: string; name: string },
) {
  const existing = await prisma.appointment.findUnique({
    where: { id },
    select: { id: true, status: true },
  })
  if (!existing) {
    throwApiError(404, 'Appointment not found')
  }

  if (existing.status === status) {
    throwApiError(409, `Appointment is already ${status.toLowerCase()}`)
  }
  if (!ALLOWED_TRANSITIONS[existing.status].includes(status)) {
    throwApiError(
      409,
      `Cannot change status from ${existing.status} to ${status}. Allowed: ${ALLOWED_TRANSITIONS[existing.status].join(', ') || 'none'}`,
    )
  }

  // Status change and its audit row commit together or not at all.
  const appointment = await prisma.$transaction(async (tx) => {
    const updated = await tx.appointment.update({
      where: { id },
      data: { status },
      select: LIST_SELECT,
    })
    await tx.appointmentActivity.create({
      data: {
        appointmentId: id,
        adminId: actor?.id,
        actorName: actor?.name,
        action: 'STATUS_CHANGED',
        previousStatus: existing.status,
        newStatus: status,
      },
    })
    return updated
  })

  const event = EVENT_BY_NEW_STATUS[status]
  if (event) {
    notifyAppointmentEvent(event, {
      appointmentId: id,
      patientName: appointment.name,
      patientEmail: appointment.email,
      treatment: appointment.treatment,
      preferredDate: appointment.preferredDate,
      preferredTime: appointment.preferredTime,
    })
  }

  return appointment
}

export async function getAppointmentStats() {
  const grouped = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { _all: true },
  })

  const counts: Record<AppointmentStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  }
  for (const row of grouped) {
    counts[row.status] = row._count._all
  }
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0)

  return { total, ...counts }
}

export async function deleteAppointment(
  id: string,
  actor?: { id: string; name: string },
) {
  const existing = await prisma.appointment.findUnique({
    where: { id },
    select: { id: true, status: true },
  })
  if (!existing) {
    throwApiError(404, 'Appointment not found')
  }
  // The DELETED activity row is written inside the same transaction that
  // removes the appointment, then cascades away with it — giving the trail a
  // final entry without leaving orphaned history behind.
  await prisma.$transaction(async (tx) => {
    await tx.appointmentActivity.create({
      data: {
        appointmentId: id,
        adminId: actor?.id,
        actorName: actor?.name,
        action: 'APPOINTMENT_DELETED',
        previousStatus: existing.status,
      },
    })
    await tx.appointment.delete({ where: { id } })
  })
}

export interface ActivityEntry {
  id: string
  action: 'REQUEST_CREATED' | 'STATUS_CHANGED' | 'APPOINTMENT_DELETED'
  actorName: string | null
  previousStatus: AppointmentStatus | null
  newStatus: AppointmentStatus | null
  createdAt: Date
  appointment: { id: string; name: string; phone: string }
}

export async function listActivity(limit = 50): Promise<ActivityEntry[]> {
  return prisma.appointmentActivity.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      action: true,
      actorName: true,
      previousStatus: true,
      newStatus: true,
      createdAt: true,
      appointment: { select: { id: true, name: true, phone: true } },
    },
  })
}
