import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import Modal from '../common/Modal'
import { StatusChip } from './StatusChip'
import type { AppointmentRecord, AppointmentStatus } from '../../lib/api'

interface AppointmentDetailsProps {
  appointment: AppointmentRecord | null
  onClose: () => void
  onStatusChange: (appointment: AppointmentRecord, status: AppointmentStatus) => Promise<void>
  onDelete: (appointment: AppointmentRecord) => Promise<void>
  busy: boolean
}

const NEXT_STATUSES: Record<AppointmentStatus, Array<{ status: AppointmentStatus; label: string }>> = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Confirm' },
    { status: 'CANCELLED', label: 'Cancel Request' },
  ],
  CONFIRMED: [
    { status: 'COMPLETED', label: 'Mark Completed' },
    { status: 'CANCELLED', label: 'Cancel Request' },
  ],
  COMPLETED: [],
  CANCELLED: [],
}

function formatDate(value: string | null): string {
  if (!value) return 'Not specified'
  return new Date(value).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatTime(value: string | null): string {
  if (!value) return 'Not specified'
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2 text-sm sm:grid-cols-[160px_1fr]">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="break-words text-slate-800">{children}</dd>
    </div>
  )
}

/**
 * Full appointment details in an accessible modal, with the same workflow
 * actions as the table plus a two-step delete (destructive → confirm).
 */
export default function AppointmentDetails({
  appointment,
  onClose,
  onStatusChange,
  onDelete,
  busy,
}: AppointmentDetailsProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (!appointment) return null

  const next = NEXT_STATUSES[appointment.status]

  return (
    <Modal
      isOpen
      onClose={onClose}
      label="Appointment Details"
      description="Full request information — visible to clinic staff only."
    >
      <div className="px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-800">{appointment.name}</h3>
          <StatusChip status={appointment.status} />
        </div>

        <dl className="mt-4 divide-y divide-primary-50">
          <DetailRow label="Phone">
            <a href={`tel:${appointment.phone.replace(/\s/g, '')}`} className="text-primary-700 hover:underline">
              {appointment.phone}
            </a>
          </DetailRow>
          <DetailRow label="Email">
            <a href={`mailto:${appointment.email}`} className="break-all text-primary-700 hover:underline">
              {appointment.email}
            </a>
          </DetailRow>
          <DetailRow label="Treatment">{appointment.treatment ?? 'Not specified'}</DetailRow>
          <DetailRow label="Preferred date">{formatDate(appointment.preferredDate)}</DetailRow>
          <DetailRow label="Preferred time">{formatTime(appointment.preferredTime)}</DetailRow>
          <DetailRow label="Message">{appointment.message?.trim() || '—'}</DetailRow>
          <DetailRow label="Submitted">
            {new Date(appointment.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </DetailRow>
        </dl>

        {next.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {next.map(({ status, label }) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy}
                  onClick={() => void onStatusChange(appointment, status)}
                  className={
                    status === 'CANCELLED'
                      ? 'rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600'
                      : 'rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-primary-50 pt-4">
          {confirmingDelete ? (
            <div role="alert" className="rounded-xl bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                Delete this appointment request permanently?
              </p>
              <p className="mt-1 text-xs text-red-600">
                This cannot be undone. Consider cancelling instead to keep a record.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onDelete(appointment)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  Confirm Deletion
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                >
                  Keep it
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete request
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
