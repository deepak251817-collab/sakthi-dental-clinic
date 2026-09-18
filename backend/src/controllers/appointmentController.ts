import type { Request, Response } from 'express'
import type { AppointmentStatus } from '@prisma/client'
import { asyncHandler } from '../utils/asyncHandler'
import {
  createAppointment,
  listAppointments,
  getAppointmentById,
  getAppointmentStats,
  updateAppointmentStatus,
  deleteAppointment,
} from '../services/appointmentService'
import type {
  CreateAppointmentInput,
  ListAppointmentsQuery,
} from '../schemas/appointmentSchema'

/** POST /api/appointments — public. Creates a guest appointment request. */
export const createAppointmentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as CreateAppointmentInput
    const appointment = await createAppointment(input)
    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      data: { id: appointment.id },
    })
  },
)

/** GET /api/appointments — admin only. Paginated list with search/filters. */
export const listAppointmentsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as ListAppointmentsQuery
    const result = await listAppointments(query)
    res.json({ success: true, message: 'Appointments fetched', data: result })
  },
)

/** GET /api/appointments/stats — admin only. Real counts per status. */
export const getAppointmentStatsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getAppointmentStats()
    res.json({ success: true, message: 'Appointment stats fetched', data: stats })
  },
)

/** GET /api/appointments/:id — admin only. Full appointment detail. */
export const getAppointmentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const appointment = await getAppointmentById(req.params.id)
    res.json({ success: true, message: 'Appointment fetched', data: appointment })
  },
)

/** PATCH /api/appointments/:id/status — admin only. Workflow-guarded transition. */
export const updateStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body as { status: AppointmentStatus }
    const appointment = await updateAppointmentStatus(req.params.id, status)
    res.json({ success: true, message: `Status updated to ${status}`, data: appointment })
  },
)

/** DELETE /api/appointments/:id — admin only. Permanently removes the record. */
export const deleteAppointmentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteAppointment(req.params.id)
    res.json({ success: true, message: 'Appointment deleted', data: null })
  },
)
