import type { AppointmentStats } from '../../lib/api'

interface StatusDistributionProps {
  stats: AppointmentStats | null
  loading: boolean
}

const SEGMENTS: Array<{
  key: keyof Omit<AppointmentStats, 'total'>
  label: string
  colorClass: string
  textClass: string
}> = [
  { key: 'pending', label: 'Pending', colorClass: 'bg-amber-400', textClass: 'text-amber-800 dark:text-amber-300' },
  { key: 'confirmed', label: 'Confirmed', colorClass: 'bg-emerald-400', textClass: 'text-emerald-800 dark:text-emerald-300' },
  { key: 'completed', label: 'Completed', colorClass: 'bg-sky-400', textClass: 'text-sky-800 dark:text-sky-300' },
  { key: 'cancelled', label: 'Cancelled', colorClass: 'bg-rose-400', textClass: 'text-rose-800 dark:text-rose-300' },
]

/**
 * Stacked status bar over all appointments. The legend always states each
 * count in text, so the chart is never the only way to read the numbers.
 */
export default function StatusDistribution({ stats, loading }: StatusDistributionProps) {
  if (loading && !stats) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="h-4 w-40 animate-pulse rounded bg-primary-100" />
        <div className="h-3 w-full animate-pulse rounded-full bg-primary-100" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-primary-100" />
      </div>
    )
  }

  const total = stats ? stats.pending + stats.confirmed + stats.completed + stats.cancelled : 0

  if (total === 0) {
    return <p className="text-sm text-slate-500">No appointments yet, so there is nothing to distribute.</p>
  }

  const summary = SEGMENTS.map(({ key, label }) => `${stats?.[key] ?? 0} ${label.toLowerCase()}`).join(', ')

  return (
    <div>
      <div
        role="img"
        aria-label={`Status distribution: ${summary}.`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
      >
        {SEGMENTS.map(({ key, colorClass }) => {
          const count = stats?.[key] ?? 0
          if (count === 0) return null
          return <span key={key} className={`h-full ${colorClass}`} style={{ width: `${(count / total) * 100}%` }} />
        })}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {SEGMENTS.map(({ key, label, colorClass, textClass }) => {
          const count = stats?.[key] ?? 0
          const share = Math.round((count / total) * 100)
          return (
            <li key={key} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colorClass}`} aria-hidden="true" />
              <span className="text-slate-600">{label}</span>
              <span className={`ml-auto font-semibold ${textClass}`}>
                {count} <span className="font-normal text-slate-400">({share}%)</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
