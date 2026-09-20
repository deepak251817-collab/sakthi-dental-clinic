import { z } from 'zod'

/** Shared status enum mirroring the Prisma enum. */
export const appointmentStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
])

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(80, 'Name must be at most 80 characters')

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+]?[\d\s().-]{7,20}$/, 'Enter a valid phone number')

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .max(120, 'Email must be at most 120 characters')

/** Date string in YYYY-MM-DD, a real calendar date, not in the past. */
const preferredDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Preferred date must be in YYYY-MM-DD format')
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()), {
    message: 'Preferred date is not a valid calendar date',
  })
  .refine((value) => {
    const todayUtc = new Date(new Date().toDateString())
    return new Date(`${value}T00:00:00Z`) >= todayUtc
  }, 'Preferred date cannot be in the past')

/** Time string in 24h HH:MM as produced by <input type="time">. */
const preferredTimeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Preferred time must be in HH:MM format')

/** Treatment names come from the frontend's single source of truth (src/data/treatments.ts). */
const treatmentSchema = z.string().trim().min(1).max(100)

const messageSchema = z.string().trim().max(1000, 'Message must be at most 1000 characters')

export const createAppointmentSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema,
    preferredDate: preferredDateSchema.optional().nullable(),
    preferredTime: preferredTimeSchema.optional().nullable(),
    treatment: treatmentSchema.optional().nullable(),
    message: messageSchema.optional().nullable(),
  })
  .strict()

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>

export const updateAppointmentStatusSchema = z
  .object({ status: appointmentStatusSchema })
  .strict()

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>

/** Admin list/query parameters (search, filters, pagination, date range). */
export const listAppointmentsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: appointmentStatusSchema.optional(),
    search: z.string().trim().max(100).optional(),
    fromDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    toDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
  .strict()

export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>

/** Analytics window (days back, today included). Kept to a small fixed set so
 * responses stay cheap and cacheable for a small clinic's dashboard. */
export const analyticsQuerySchema = z
  .object({
    days: z.coerce
      .number()
      .int()
      .refine((value) => [1, 7, 30, 90].includes(value), {
        message: 'days must be one of 1, 7, 30 or 90',
      })
      .default(30),
  })
  .strict()

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
