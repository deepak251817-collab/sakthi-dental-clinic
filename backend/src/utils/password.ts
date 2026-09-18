import bcrypt from 'bcryptjs'

/**
 * bcrypt cost factor. 12 provides strong, future-resistant hashing while
 * keeping login/seed operations responsive.
 */
const BCRYPT_ROUNDS = 12

/** Hash a plaintext password. Plaintext is never stored or logged. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

/** Constant-time-ish comparison of a plaintext attempt against a stored hash. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
