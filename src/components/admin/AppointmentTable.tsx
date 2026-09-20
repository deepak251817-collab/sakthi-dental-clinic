import { useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from 'lucide-react'
import type { AppointmentRecord, AppointmentStatus } from '../../lib/api'
import { StatusChip } from './StatusChip'

interface AppointmentTableProps {
  appointments: AppointmentRecord[]
  loading: boolean
  error: string | null
  onOpenDetails: (appointment: AppointmentRecord) => void
  onStatusChange: (appointment: AppointmentRecord, status: AppointmentStatus) => void
  /** Which row has an in-flight status change (disables its action buttons). */
  busyId: string | null
}

export type SortKey = 'createdAt' | 'name' | 'preferredDate'

type SortDirection = 'asc' | 'desc'

/** Sensible workflow: PENDING → CONFIRMED → COMPLETED; cancellation from pending/confirmed. */
const NEXT_STATUSES: Record<AppointmentStatus, Array<{ status: AppointmentStatus; label: string }>> = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Confirm' },
    { status: 'CANCELLED', label: 'Cancel' },
  ],
  CONFIRMED: [
    { status: 'COMPLETED', label: 'Complete' },
    { status: 'CANCELLED', label: 'Cancel' },
  ],
  COMPLETED: [],
  CANCELLED: [],
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatTime(value: string | null): string {
  if (!value) return '—'
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function ActionButtons({ appointment, onStatusChange, busyId }: Pick<AppointmentTableProps, 'onStatusChange' | 'busyId'> & { appointment: AppointmentRecord }) {
  const next = NEXT_STATUSES[appointment.status]
  if (next.length === 0) {
    return <span className="text-xs text-slate-400">No actions</span>
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {next.map(({ status, label }) => (
        <button
          key={status}
          type="button"
          disabled={busyId === appointment.id}
          onClick={() => onStatusChange(appointment, status)}
          className={
            status === 'CANCELLED'
              ? 'rounded-full border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600'
              : 'rounded-full border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/**
 * Appointment list: semantic table on desktop, stacked cards on mobile.
 * Both views expose view + workflow actions for the same records.
 * Column sorting is a display concern (the backend returns the newest page),
 * so it sorts the current page client-side.
 */
export default function AppointmentTable({
  appointments,
  loading,
  error,
  onOpenDetails,
  onStatusChange,
  busyId,
}: AppointmentTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'createdAt' ? 'desc' : 'asc')
    }
  }

  const sorted = [...appointments].sort((a, b) => {
    let result = 0
    if (sortKey === 'name') {
      result = a.name.localeCompare(b.name)
    } else {
      const av = sortKey === 'preferredDate' ? (a.preferredDate ?? '') : a.createdAt
      const bv = sortKey === 'preferredDate' ? (b.preferredDate ?? '') : b.createdAt
      result = av.localeCompare(bv)
    }
    return sortDir === 'asc' ? result : -result
  })
  const sortIcon = (key: SortKey) =>
    sortKey === key ? (
      sortDir === 'asc' ? (
        <ArrowUp className="h-3 w-3" aria-hidden="true" />
      ) : (
        <ArrowDown className="h-3 w-3" aria-hidden="true" />
      )
    ) : (
      <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />
    )

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="space-y-3" aria-label="Loading appointments" role="status">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-primary-50" />
        ))}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-700">No appointments found</p>
        <p className="mt-1 text-sm text-slate-500">
          New requests will appear here as patients submit them.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-primary-100 bg-white md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Appointment requests</caption>
          <thead>
            <tr className="border-b border-primary-100 bg-primary-50/60 text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" aria-sort={sortKey === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Patient {sortIcon('name')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">Contact</th>
              <th scope="col" className="px-4 py-3 font-semibold">Treatment</th>
              <th scope="col" aria-sort={sortKey === 'preferredDate' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort('preferredDate')}
                  className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Preferred {sortIcon('preferredDate')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" aria-sort={sortKey === 'createdAt' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort('createdAt')}
                  className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Created {sortIcon('createdAt')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((appointment) => (
              <tr key={appointment.id} className="border-b border-primary-50 last:border-0 hover:bg-primary-50/40">
                <td className="px-4 py-3 font-semibold text-slate-800">{appointment.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{appointment.phone}</div>
                  <div className="text-xs text-slate-500">{appointment.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{appointment.treatment ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{formatDate(appointment.preferredDate)}</div>
                  <div className="text-xs text-slate-500">{formatTime(appointment.preferredTime)}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusChip status={appointment.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(appointment.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(appointment)}
                      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary-200 px-2.5 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      View
                    </button>
                    <ActionButtons appointment={appointment} onStatusChange={onStatusChange} busyId={busyId} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {sorted.map((appointment) => (
          <li key={appointment.id} className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{appointment.name}</p>
                <p className="text-xs text-slate-500">{appointment.phone}</p>
              </div>
              <StatusChip status={appointment.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <dt className="font-medium text-slate-400">Treatment</dt>
                <dd>{appointment.treatment ?? '—'}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-400">Preferred</dt>
                <dd>
                  {formatDate(appointment.preferredDate)}
                  <br />
                  {formatTime(appointment.preferredTime)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-primary-50 pt-3">
              <button
                type="button"
                onClick={() => onOpenDetails(appointment)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 px-2.5 py-1 text-xs font-semibold text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                View
              </button>
              <ActionButtons appointment={appointment} onStatusChange={onStatusChange} busyId={busyId} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
