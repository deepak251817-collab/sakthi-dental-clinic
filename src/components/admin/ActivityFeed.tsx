import { CalendarClock } from 'lucide-react'
import type { ActivityEntry } from '../../lib/api'

interface ActivityFeedProps {
  entries: ActivityEntry[] | null
  loading: boolean
}

const ACTION_LABELS: Record<ActivityEntry['action'], string> = {
  REQUEST_CREATED: 'Request created',
  STATUS_CHANGED: 'Status changed',
  APPOINTMENT_DELETED: 'Request deleted',
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Audit trail of appointment lifecycle events, straight from the
 * AppointmentActivity table. Shows who changed what and when — the
 * operational memory of the dashboard.
 */
export default function ActivityFeed({ entries, loading }: ActivityFeedProps) {
  return (
    <section aria-labelledby="activity-heading" className="rounded-2xl border border-primary-100 bg-white p-4">
      <h2 id="activity-heading" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <CalendarClock className="h-4 w-4 text-primary-600" aria-hidden="true" />
        Recent activity
      </h2>

      {loading && !entries ? (
        <div className="mt-3 space-y-3" aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-primary-50" />
          ))}
        </div>
      ) : !entries || entries.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No activity yet. Actions on appointments will appear here.</p>
      ) : (
        <ol className="mt-3 space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="border-l-2 border-primary-100 pl-3">
              <p className="text-sm text-slate-700">
                <span className="font-medium">{ACTION_LABELS[entry.action]}</span>
                {' — '}
                <span className="text-slate-600">
                  {entry.appointment.name} ({entry.appointment.phone})
                </span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatWhen(entry.createdAt)}
                {entry.action === 'STATUS_CHANGED' && entry.previousStatus && entry.newStatus && (
                  <>
                    {' · '}
                    {entry.previousStatus.toLowerCase()} → {entry.newStatus.toLowerCase()}
                  </>
                )}
                {entry.actorName && <> · by {entry.actorName}</>}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
