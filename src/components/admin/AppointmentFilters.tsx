import { Search, X } from 'lucide-react'
import type { AppointmentStatus } from '../../lib/api'

interface AppointmentFiltersProps {
  status: AppointmentStatus | ''
  onStatusChange: (status: AppointmentStatus | '') => void
  search: string
  onSearchChange: (search: string) => void
  fromDate: string
  toDate: string
  onDateChange: (field: 'fromDate' | 'toDate', value: string) => void
  onClear: () => void
  hasActiveFilters: boolean
}

const STATUSES: Array<{ value: AppointmentStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const chipBase =
  'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
const chipIdle = 'bg-white text-slate-600 border border-primary-200 hover:bg-primary-50'
const chipActive = 'bg-primary-600 text-white'

/** Status chips, debounced search and preferred-date range filter. */
export default function AppointmentFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  fromDate,
  toDate,
  onDateChange,
  onClear,
  hasActiveFilters,
}: AppointmentFiltersProps) {
  const inputClasses =
    'w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-100'

  return (
    <section
      aria-label="Appointment filters"
      className="rounded-2xl border border-primary-100 bg-white p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {STATUSES.map(({ value, label }) => (
            <button
              key={value || 'all'}
              type="button"
              onClick={() => onStatusChange(value)}
              aria-pressed={status === value}
              className={`${chipBase} ${status === value ? chipActive : chipIdle}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative lg:ml-auto lg:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, phone, email…"
            aria-label="Search appointments"
            className={`${inputClasses} pl-9`}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="whitespace-nowrap font-medium">Preferred date</span>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => onDateChange('fromDate', event.target.value)}
            aria-label="From date"
            className={inputClasses}
          />
          <span aria-hidden="true">–</span>
          <input
            type="date"
            value={toDate}
            onChange={(event) => onDateChange('toDate', event.target.value)}
            aria-label="To date"
            className={inputClasses}
          />
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:ml-auto"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear Filters
          </button>
        )}
      </div>
    </section>
  )
}
