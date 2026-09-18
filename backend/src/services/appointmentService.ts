import type { AppointmentStatus } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { CreateAppointmentInput, ListAppointmentsQuery } from '../schemas/appointmentSchema'
import { throwApiError } from '../middleware/errorMiddleware'

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
  return prisma.appointment.create({
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

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
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

  return prisma.appointment.update({
    where: { id },
    data: { status },
    select: LIST_SELECT,
  })
}

export async function deleteAppointment(id: string) {
  const existing = await prisma.appointment.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) {
    throwApiError(404, 'Appointment not found')
  }
  await prisma.appointment.delete({ where: { id } })
}
