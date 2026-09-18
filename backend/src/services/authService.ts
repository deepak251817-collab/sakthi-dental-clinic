import { prisma } from '../lib/prisma'
import type { LoginInput } from '../schemas/authSchema'
import { throwApiError } from '../middleware/errorMiddleware'
import { verifyPassword } from '../utils/password'
import { signAdminToken } from '../utils/jwt'

/**
 * Verify credentials and issue an admin JWT.
 * Deliberately returns the same error for unknown email and wrong password
 * so the endpoint does not reveal which emails exist.
 */
export async function login(input: LoginInput) {
  const admin = await prisma.adminUser.findUnique({ where: { email: input.email } })

  const passwordMatches = admin
    ? await verifyPassword(input.password, admin.passwordHash)
    : false

  if (!admin || !passwordMatches) {
    throwApiError(401, 'Invalid email or password')
  }

  const token = signAdminToken({ sub: admin.id, email: admin.email, name: admin.name })

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email },
  }
}
