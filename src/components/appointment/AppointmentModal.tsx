import { useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import Modal from '../common/Modal'
import AppointmentForm from './AppointmentForm'
import { useAppointment } from './AppointmentContext'

/**
 * The site-wide appointment request modal. Opened from any CTA via
 * useAppointment(). Key remount resets the form between opens.
 */
export default function AppointmentModal() {
  const { isOpen, closeAppointment, source } = useAppointment()
  const [formKey, setFormKey] = useState(0)

  const handleClose = () => {
    closeAppointment()
    // Reset the form the next time the modal opens.
    window.setTimeout(() => setFormKey((key) => key + 1), 300)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      label="Fix an Appointment"
      description={
        source
          ? `Request a visit — ${source}. Our team will confirm by phone.`
          : 'Request a visit — our team will confirm your slot by phone.'
      }
    >
      <p className="flex items-center gap-2 px-6 pt-4 text-xs font-medium text-primary-700 sm:px-8">
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Appointment request — takes under a minute
      </p>
      <AppointmentForm key={formKey} onReset={handleClose} />
    </Modal>
  )
}
