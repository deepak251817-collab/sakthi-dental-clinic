import rateLimit from 'express-rate-limit'

/** General API limiter — generous, guards against obvious floods. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

/** Public appointment creation — blocks bulk abuse without blocking normal users. */
export const appointmentLimiter = rateLimit({
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

/** Login limiter — slows down credential-guessing without locking people out. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
})
