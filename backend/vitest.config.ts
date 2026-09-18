import { defineConfig } from 'vitest/config'

/**
 * Test configuration. NODE_ENV=test before modules load so the rate-limit
 * middleware switches to pass-through (tests make many rapid API calls that
 * would otherwise trip the production limiters).
 */
export default defineConfig({
  test: {
    env: { NODE_ENV: 'test' },
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
})
