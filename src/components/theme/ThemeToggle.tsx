import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/useTheme'
import type { ThemeMode } from '../../lib/theme'

const OPTIONS: Array<{ mode: ThemeMode; label: string; Icon: typeof Sun }> = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'system', label: 'System', Icon: Monitor },
]

function activeIcon(mode: ThemeMode, resolved: 'light' | 'dark') {
  if (mode === 'system') return Monitor
  return resolved === 'dark' ? Moon : Sun
}

/**
 * Theme switcher — Light / Dark / System.
 *
 * `icon` renders the compact navbar button (shows the current mode's icon,
 * cycles on click, tooltip "Switch theme"). `segmented` renders the labelled
 * three-way control used in the mobile menu. Both are keyboard accessible.
 */
export default function ThemeToggle({ variant }: { variant: 'icon' | 'segmented' }) {
  const { mode, resolvedMode, systemPrefersDark, setMode } = useTheme()

  if (variant === 'icon') {
    const Current = activeIcon(mode, resolvedMode)
    const next: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    const ariaLabel = `Switch theme. Current: ${mode}${mode === 'system' ? ` (${systemPrefersDark ? 'dark' : 'light'} on this device)` : ''}. Activating switches to ${next}.`

    return (
      <button
        type="button"
        onClick={() => setMode(next)}
        aria-label={ariaLabel}
        title="Switch theme"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <Current className="h-5 w-5" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div role="group" aria-label="Theme">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Theme</p>
      <div className="grid grid-cols-3 gap-1.5">
        {OPTIONS.map(({ mode: option, label, Icon }) => {
          const active = mode === option
          const hint = option === 'system' ? `System (${systemPrefersDark ? 'dark' : 'light'} now)` : label
          return (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={active}
              title={hint}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                active
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-surface text-slate-600 ring-1 ring-primary-200 hover:bg-primary-50 hover:text-accent'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
