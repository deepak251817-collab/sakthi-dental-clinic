import { PrismaClient } from '@prisma/client'

/** Shared Prisma client instance for the whole backend. */
export const prisma = new PrismaClient()
