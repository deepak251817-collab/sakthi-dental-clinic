import { Router } from 'express'
import { loginHandler } from '../controllers/authController'
import { validateBody } from '../middleware/validationMiddleware'
import { loginSchema } from '../schemas/authSchema'
import { loginLimiter } from '../middleware/rateLimitMiddleware'

const router = Router()

router.post('/login', loginLimiter, validateBody(loginSchema), loginHandler)

export default router
