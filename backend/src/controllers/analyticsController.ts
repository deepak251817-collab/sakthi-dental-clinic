import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { getAppointmentTrends, getTopTreatments } from '../services/analyticsService'
import type { AnalyticsQuery } from '../schemas/appointmentSchema'

/** GET /api/appointments/analytics/trends?days=7|30|90 — admin only. */
export const getTrendsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query as unknown as AnalyticsQuery
  const data = await getAppointmentTrends(days)
  res.json({ success: true, message: 'Appointment trends fetched', data })
})

/** GET /api/appointments/analytics/treatments?days=7|30|90 — admin only. */
export const getTopTreatmentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query as unknown as AnalyticsQuery
  const data = await getTopTreatments(days)
  res.json({ success: true, message: 'Treatment analytics fetched', data })
})
