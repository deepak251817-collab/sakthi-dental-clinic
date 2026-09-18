import { UserRound } from 'lucide-react'
import Modal from '../common/Modal'
import AppointmentButton from '../common/AppointmentButton'
import type { Doctor } from '../../data/doctors'

interface DoctorModalProps {
  doctor: Doctor | null
  onClose: () => void
}

/**
 * Doctor profile modal. Shows ONLY supplied information: name, role and the
 * short focus line from the doctors data file — no invented credentials.
 */
export default function DoctorModal({ doctor, onClose }: DoctorModalProps) {
  return (
    <Modal
      isOpen={doctor !== null}
      onClose={onClose}
      label={doctor?.name ?? 'Doctor profile'}
      description={doctor ? `${doctor.role} at Sakthi Dental Clinic` : undefined}
    >
      {doctor && (
        <div className="px-6 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
            <UserRound className="h-10 w-10" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-ink-800">{doctor.name}</h3>
          <p className="mt-2 inline-block rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
            {doctor.role}
          </p>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            {doctor.focus}
          </p>

          <div className="mt-6 border-t border-primary-100 pt-6">
            <p className="mb-4 text-sm text-slate-500">
              Would you like to consult {doctor.name.replace(/^Dr\.\s*/i, 'Dr. ')}?
            </p>
            <AppointmentButton
              source={`Doctor modal — ${doctor.name}`}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
