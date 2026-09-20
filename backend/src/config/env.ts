/**
 * Centralized environment configuration, validated at startup.
 * The server refuses to boot with missing/invalid configuration so
 * misconfigurations surface immediately instead of at request time.
 */
import dotenv from 'dotenv'
import { z } from 'zod'

/**
 * .env values win over any ambient shell variables of the same name — the
 * documented file is the local source of truth. In production deployments
 * there is no .env file, so platform-provided variables simply apply.
 */
// NODE_ENV describes the execution context the launcher chose for THIS process
// (e.g. vitest sets 'test'), so it must win over any value in .env. Capture it
// before dotenv runs, then restore it.
const shellNodeEnv = process.env.NODE_ENV
dotenv.config({ override: true })
if (shellNodeEnv !== undefined) {
  process.env.NODE_ENV = shellNodeEnv
}

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z
      .string()
      .min(32, 'JWT_SECRET must be at least 32 characters'),
    PORT: z
      .preprocess((value) => (value === '' ? undefined : value), z.coerce.number().int().positive().default(5000)),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    // Email notifications are optional: with the default 'logger' provider the
    // service only writes to the server log. Provider credentials are read at
    // send time and never logged or embedded in templates.
    EMAIL_PROVIDER: z.enum(['logger', 'resend']).default('logger'),
    EMAIL_FROM: z.string().trim().optional(),
    RESEND_API_KEY: z.string().trim().optional(),
  })
  .superRefine((config, ctx) => {
    // Only the variables the selected provider actually needs are required.
    if (config.EMAIL_PROVIDER === 'resend') {
      if (!config.RESEND_API_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['RESEND_API_KEY'],
          message: 'RESEND_API_KEY is required when EMAIL_PROVIDER=resend',
        })
      }
      if (!config.EMAIL_FROM) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['EMAIL_FROM'],
          message: 'EMAIL_FROM is required when EMAIL_PROVIDER=resend',
        })
      }
    }
  })

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // eslint-disable-next-line no-console -- startup failure must be visible
  console.error('❌ Invalid environment configuration:')
  for (const issue of parsed.error.issues) {
    // eslint-disable-next-line no-console -- startup failure must be visible
    console.error(`   ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const env = parsed.data
