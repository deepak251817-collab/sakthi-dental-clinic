import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  applyThemeMode,
  getStoredThemeMode,
  storeThemeMode,
  systemPrefersDark,
} from '../lib/theme'
import { ThemeContext } from './useTheme'

/**
 * Theme provider for the Light / Dark / System system. Reads the stored
 * preference on mount (the inline bootstrap in index.html has already set
 * the initial `html.dark` before first paint), then keeps the document in
 * sync with changes — including live OS changes while in System mode.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState(() => getStoredThemeMode())
  const [systemDark, setSystemDark] = useState(() => systemPrefersDark())

  // Track the OS preference so the System option's UI stays truthful.
  // applyThemeMode (lib/theme) additionally re-resolves the document class
  // for System mode via its own listener.
  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  const setMode = useCallback((next: Parameters<typeof storeThemeMode>[0]) => {
    storeThemeMode(next)
    setModeState(next)
  }, [])

  const value = useMemo(
    () => ({
      mode,
      resolvedMode: mode === 'system' ? (systemDark ? 'dark' : 'light') : mode,
      systemPrefersDark: systemDark,
      setMode,
    }),
    [mode, systemDark, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
