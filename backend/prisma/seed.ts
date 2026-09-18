/**
 * Development seed: creates the first admin from environment variables.
 * Usage:  npm run db:seed
 * Requires ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env.
 * Never commit the real values.
 */
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL?.toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!name || !email || !password) {
    console.error(
      'Seed skipped: set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first.',
    )
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('Seed skipped: ADMIN_PASSWORD must be at least 8 characters.')
    process.exit(1)
  }

  const passwordHash = await hashPassword(password)
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash },
  })

  console.log(`✔ Admin ready: ${admin.name} <${admin.email}>`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
