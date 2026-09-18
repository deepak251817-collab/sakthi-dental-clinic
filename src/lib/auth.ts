/**
 * Admin authentication token storage.
 *
 * Internship-prototype scope: the JWT is kept in localStorage, isolated in
 * this module so the rest of the app never touches storage directly.
 * Passwords are never stored anywhere. Token expiry is handled by the API
 * layer (a 401 clears the token and the admin is redirected to sign in).
 *
 * NOTE: this is not enterprise-grade auth; production systems should use
 * httpOnly cookies with refresh-token rotation.
 */

const TOKEN_KEY = 'sdc_admin_token'
const EMAIL_KEY = 'sdc_admin_email'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setSession(token: string, email: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(EMAIL_KEY, email)
  } catch {
    // Storage unavailable (private mode) — session simply won't persist.
  }
}

export function getAdminEmail(): string | null {
  try {
    return localStorage.getItem(EMAIL_KEY)
  } catch {
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  } catch {
    // Nothing to clear.
  }
}
