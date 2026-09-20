import {
  formatAppointmentSlot,
  renderEmail,
  type AppointmentEmailData,
  type EmailContent,
} from './shared'

/**
 * Patient email sent when an admin cancels the appointment request.
 * Keeps internal administrative reasons out of the message.
 */
export function appointmentCancelledEmail(data: AppointmentEmailData): EmailContent {
  return renderEmail(
    'Your appointment request has been cancelled',
    [
      `Hello ${data.patientName}, the appointment request for ${formatAppointmentSlot(data)} has been cancelled.`,
      'If this was unexpected, or if you would like to book another time, please contact the clinic directly and we will be glad to help.',
    ],
  )
}
