import {
  formatAppointmentSlot,
  renderEmail,
  treatmentLine,
  type AppointmentEmailData,
  type EmailContent,
} from './shared'

/** Patient email sent when an admin confirms the appointment request. */
export function appointmentConfirmedEmail(data: AppointmentEmailData): EmailContent {
  return renderEmail(
    'Your appointment request has been confirmed',
    [
      `Hello ${data.patientName}, your appointment request for ${formatAppointmentSlot(data)} has been confirmed.`,
      'The clinic will contact you if any additional information is required.',
      treatmentLine(data),
      'If you need to reschedule or cancel, please call the clinic so we can offer the slot to another patient.',
    ],
  )
}
