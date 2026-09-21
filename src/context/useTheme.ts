import { createContext, useContext } from 'react'
import type { ThemeMode } from '../lib/theme'

export interface ThemeContextValue {
  /** The selected preference: light, dark or system. */
  mode: ThemeMode
  /** What is actually on screen (system resolves to light or dark). */
  resolvedMode: 'light' | 'dark'
  /** OS currently prefers dark (drives the System option's icon/label). */
  systemPrefersDark: boolean
  setMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Access the theme state. Throws outside <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
