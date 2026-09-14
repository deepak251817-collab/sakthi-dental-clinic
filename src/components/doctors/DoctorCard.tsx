import type { Doctor } from '../../data/doctors'
import { cn } from '../../lib/utils'

interface DoctorCardProps {
  doctor: Doctor
  image?: string
}

function initialsOf(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Doctor card. Shows the doctor's photo when provided; otherwise a clean
 * initials avatar so missing images never break the layout.
 */
export default function DoctorCard({ doctor, image }: DoctorCardProps) {
  return (
    <div className="h-full rounded-3xl border border-primary-100 bg-white p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-primary-100">
        {image ? (
          <img
            src={image}
            alt={`Portrait of ${doctor.name}`}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              const img = event.currentTarget
              img.onerror = null
              img.style.display = 'none'
              img.parentElement?.classList.add('flex', 'items-center', 'justify-center')
            }}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-xl font-bold text-primary-700"
            aria-hidden="true"
          >
            {initialsOf(doctor.name)}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-800">{doctor.name}</h3>
      <p
        className={cn(
          'mt-1 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700',
        )}
      >
        {doctor.role}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{doctor.focus}</p>
    </div>
  )
}
