import type { AppointmentStats } from '../../lib/api'

interface DashboardStatsProps {
  stats: AppointmentStats | null
  loading: boolean
}

const CARDS: Array<{
  key: keyof Omit<AppointmentStats, 'total'>
  label: string
  totalLabel: string
  chipClass: string
  dotClass: string
}> = [
  {
    key: 'pending',
    label: 'Pending',
    totalLabel: 'Total Requests',
    chipClass: 'bg-amber-100 text-amber-800',
    dotClass: 'bg-amber-400',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    totalLabel: 'Confirmed Requests',
    chipClass: 'bg-emerald-100 text-emerald-800',
    dotClass: 'bg-emerald-400',
  },
  {
    key: 'completed',
    label: 'Completed',
    totalLabel: 'Completed Requests',
    chipClass: 'bg-sky-100 text-sky-800',
    dotClass: 'bg-sky-400',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    totalLabel: 'Cancelled Requests',
    chipClass: 'bg-rose-100 text-rose-800',
    dotClass: 'bg-rose-400',
  },
]

/** Live summary counts straight from the API — never fabricated. */
export default function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const skeleton = (
    <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-primary-100" aria-hidden="true" />
  )

  return (
    <section aria-label="Appointment summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div className="rounded-2xl border border-primary-100 bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Requests</p>
        <p className="mt-2 text-2xl font-bold text-slate-800" aria-live="polite">
          {loading && !stats ? skeleton : stats?.total ?? 0}
        </p>
      </div>
      {CARDS.map(({ key, label, totalLabel, chipClass, dotClass }) => (
        <div key={key} className="rounded-2xl border border-primary-100 bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {loading && !stats ? skeleton : stats?.[key] ?? 0}
          </p>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${chipClass}`}>
            {totalLabel}
          </span>
        </div>
      ))}
    </section>
  )
}
