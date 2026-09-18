import type { AppointmentStatus } from '../../lib/api'

const STATUS_CHIP: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-sky-100 text-sky-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
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
