import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'

export interface AdminTokenPayload extends JwtPayload {
  sub: string
  email: string
  name: string
}

const TOKEN_TTL: SignOptions['expiresIn'] = '8h'

/** Sign an admin access token. Never log the token or secret. */
export function signAdminToken(payload: { sub: string; email: string; name: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL })
}

/** Verify a token and return its payload, or null when invalid/expired. */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    if (typeof decoded === 'string') return null
    if (typeof decoded.sub !== 'string' || typeof decoded.email !== 'string') return null
    return decoded as AdminTokenPayload
  } catch {
    return null
  }
}
