import type { NextFunction, Request, Response } from 'express'
import { verifyAdminToken } from '../utils/jwt'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Express type augmentation requires this
  namespace Express {
    interface Request {
      admin?: { id: string; email: string; name: string }
    }
  }
}

/**
 * Guards admin-only endpoints:
 * 1. extract the Bearer token
 * 2. verify its signature and expiry (never trust a client-claimed admin id)
 * 3. reject with 401 when missing/invalid/expired
 * 4. attach the verified identity to req.admin
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' })
    return
  }

  const payload = verifyAdminToken(header.slice('Bearer '.length).trim())
  if (!payload) {
    res.status(401).json({ success: false, message: 'Session expired or invalid. Please sign in again.' })
    return
  }

  req.admin = { id: payload.sub, email: payload.email, name: payload.name }
  next()
}
