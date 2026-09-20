/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest configuration (run with `npm test`). jsdom + Testing Library
  // for component tests; the API client suite mocks fetch. Kept in this
  // file so the dev server and tests share one config.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Backend has its own Vitest config (node environment) — run it via
    // `npm test` inside backend/, not from here.
    exclude: ['**/node_modules/**', 'backend/**'],
  },
})
