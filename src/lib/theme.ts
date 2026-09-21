/**
 * Theme preference store — Light / Dark / System.
 *
 * Single source of truth for the theme keys and application logic so the
 * inline bootstrap in index.html and the React provider stay in sync:
 * `sakthi-theme` in localStorage; `html.dark` decides the actual mode;
 * System follows the OS and reacts to live `prefers-color-scheme` changes.
 *
 * The bootstrap script in index.html mirrors this logic (inline, before
 * first paint) so there is no flash of the wrong theme on load.
 */

export type ThemeMode = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'sakthi-theme'

const VALID_MODES: readonly ThemeMode[] = ['light', 'dark', 'system']

/** Parse a stored value; anything invalid falls back to System. */
export function parseThemeMode(value: string | null | undefined): ThemeMode {
  return VALID_MODES.includes(value as ThemeMode) ? (value as ThemeMode) : 'system'
}

/** Read the stored preference (System when nothing valid is stored). */
export function getStoredThemeMode(): ThemeMode {
  try {
    return parseThemeMode(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

export function storeThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // Storage unavailable (private mode) — the choice lives for this session only.
  }
}

/** Does the current OS/browser preference want dark? */
export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches === true
}

/**
 * Apply a mode to the document: toggle `html.dark`, keep the mobile browser
 * chrome tint (`meta[name=theme-color]`) in sync, and remember the listener
 * to detach when System stops being active.
 */
let detachSystemListener: (() => void) | null = null

export function applyThemeMode(mode: ThemeMode): void {
  const dark = mode === 'dark' || (mode === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#17142a' : '#f6f5fe')

  detachSystemListener?.()
  detachSystemListener = null

  if (mode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', event.matches)
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', event.matches ? '#17142a' : '#f6f5fe')
    }
    media.addEventListener('change', onChange)
    detachSystemListener = () => media.removeEventListener('change', onChange)
  }
}
