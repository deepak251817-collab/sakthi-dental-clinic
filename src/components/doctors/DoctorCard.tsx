import { ChevronRight } from 'lucide-react'
import type { Doctor } from '../../data/doctors'

interface DoctorCardProps {
  doctor: Doctor
  onOpen: (doctor: Doctor) => void
}

/**
 * Interactive doctor card. Shows the doctor's photo when provided; otherwise
 * a clean initials avatar. Clicking opens the doctor profile modal.
 */
export default function DoctorCard({ doctor, onOpen }: DoctorCardProps) {
  const initials = doctor.name
    .replace(/^Dr\.\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <button
      type="button"
      onClick={() => onOpen(doctor)}
      aria-label={`View profile of ${doctor.name}`}
      className="group h-full w-full rounded-3xl border border-primary-100 bg-white p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-primary-100">
        <span
          className="flex h-full w-full items-center justify-center text-xl font-bold text-primary-700"
          aria-hidden="true"
        >
          {initials}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold text-ink-800">{doctor.name}</h3>
      <p className="mt-1 text-sm font-medium text-primary-700">{doctor.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{doctor.focus}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-primary-800">
        View Profile
        <ChevronRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </button>
  )
}
