import rateLimit from 'express-rate-limit'
import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env'

/** Pass-through middleware used instead of a limiter when NODE_ENV=test. */
function noopLimiter(_req: Request, _res: Response, next: NextFunction): void {
  next()
}

/** Wrap a limiter so the test suite (which makes many rapid calls) is not throttled. */
function limiterFor(productionLimiter: ReturnType<typeof rateLimit>) {
  return env.NODE_ENV === 'test' ? noopLimiter : productionLimiter
}

/** General API limiter — generous, guards against obvious floods. */
const apiLimiterBase = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})
export const apiLimiter = limiterFor(apiLimiterBase)

/** Public appointment creation — blocks bulk abuse without blocking normal users. */
const appointmentLimiterBase = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many appointment requests from this address. Please try again later or call the clinic.',
  },
})
export const appointmentLimiter = limiterFor(appointmentLimiterBase)

/** Login limiter — slows down credential-guessing without locking people out. */
const loginLimiterBase = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
})
export const loginLimiter = limiterFor(loginLimiterBase)
