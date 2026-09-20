import { Router } from 'express'
import {
  createAppointmentHandler,
  listAppointmentsHandler,
  getAppointmentStatsHandler,
  getAppointmentHandler,
  updateStatusHandler,
  deleteAppointmentHandler,
  getActivityHandler,
} from '../controllers/appointmentController'
import { getTrendsHandler, getTopTreatmentsHandler } from '../controllers/analyticsController'
import { validateBody, validateQuery } from '../middleware/validationMiddleware'
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  listAppointmentsQuerySchema,
  analyticsQuerySchema,
} from '../schemas/appointmentSchema'
import { requireAuth } from '../middleware/authMiddleware'
import { appointmentLimiter } from '../middleware/rateLimitMiddleware'

const router = Router()

// Public
router.post('/', appointmentLimiter, validateBody(createAppointmentSchema), createAppointmentHandler)

// Admin only
router.use(requireAuth)
router.get('/', validateQuery(listAppointmentsQuerySchema), listAppointmentsHandler)
// Declared before /:id so 'stats' is not captured as an id parameter.
router.get('/stats', getAppointmentStatsHandler)
// Declared before /:id for the same reason — 'activity' is not an appointment id.
router.get('/activity', getActivityHandler)
router.get('/analytics/trends', validateQuery(analyticsQuerySchema), getTrendsHandler)
router.get('/analytics/treatments', validateQuery(analyticsQuerySchema), getTopTreatmentsHandler)
router.get('/:id', getAppointmentHandler)
router.patch('/:id/status', validateBody(updateAppointmentStatusSchema), updateStatusHandler)
router.delete('/:id', deleteAppointmentHandler)

export default router
