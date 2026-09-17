/**
 * Centralized canonical site URL.
 *
 * Set VITE_SITE_URL in your environment (see .env.example) to override.
 * The fallback is the clinic's own domain as supplied in the client brief
 * (matching the clinic's email address) — it is never a fabricated domain.
 */
export const SITE_URL: string = (
  import.meta.env.VITE_SITE_URL ?? 'https://sakthidentalclinic.in'
).replace(/\/+$/, '')

/** Build an absolute URL for the given route path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
