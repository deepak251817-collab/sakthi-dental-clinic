import { createApp } from './app'
import { env } from './config/env'
import { prisma } from './lib/prisma'

const app = createApp()

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console -- server startup log is intentional
  console.log(
    `🦷 Sakthi Dental Clinic API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
  )
})

async function shutdown(signal: string): Promise<void> {
  server.close()
  await prisma.$disconnect()
  // eslint-disable-next-line no-console -- shutdown log is intentional
  console.log(`\n${signal} received — server closed cleanly`)
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
