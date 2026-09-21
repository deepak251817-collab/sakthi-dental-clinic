import type { AppointmentStatus } from '../../lib/api'

/**
 * Status chips. Color pairs are tuned per theme (light pastel fills with dark
 * text; dark translucent fills with light text) while the label always states
 * the status in words — meaning never relies on color alone.
 */
const STATUS_CHIP: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  CONFIRMED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  COMPLETED: 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300',
  CANCELLED: 'bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300',
}

export function StatusChip({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CHIP[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
