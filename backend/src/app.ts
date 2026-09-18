import express, { type Application, type Request, type Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env'
import { apiLimiter } from './middleware/rateLimitMiddleware'
import authRoutes from './routes/authRoutes'
import appointmentRoutes from './routes/appointmentRoutes'
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware'

/**
 * Express application factory. Kept separate from server.ts so tests can
 * exercise the HTTP layer without binding a port.
 */
export function createApp(): Application {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '10kb' }))
  app.use('/api', apiLimiter)

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ success: true, message: 'API is healthy', data: null })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/appointments', appointmentRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
