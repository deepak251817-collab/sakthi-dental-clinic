import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { login } from '../services/authService'

/** POST /api/auth/login — verify credentials, return a JWT. */
export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token, admin } = await login(req.body)
  res.json({
    success: true,
    message: 'Signed in successfully',
    data: { token, admin },
  })
})
