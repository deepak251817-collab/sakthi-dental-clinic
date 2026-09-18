import { Router } from 'express'
import {
  createAppointmentHandler,
  listAppointmentsHandler,
  getAppointmentHandler,
  updateStatusHandler,
  deleteAppointmentHandler,
} from '../controllers/appointmentController'
import { validateBody, validateQuery } from '../middleware/validationMiddleware'
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  listAppointmentsQuerySchema,
} from '../schemas/appointmentSchema'
import { requireAuth } from '../middleware/authMiddleware'
import { appointmentLimiter } from '../middleware/rateLimitMiddleware'

const router = Router()

// Public
router.post('/', appointmentLimiter, validateBody(createAppointmentSchema), createAppointmentHandler)

// Admin only
router.use(requireAuth)
router.get('/', validateQuery(listAppointmentsQuerySchema), listAppointmentsHandler)
router.get('/:id', getAppointmentHandler)
router.patch('/:id/status', validateBody(updateAppointmentStatusSchema), updateStatusHandler)
router.delete('/:id', deleteAppointmentHandler)

export default router
