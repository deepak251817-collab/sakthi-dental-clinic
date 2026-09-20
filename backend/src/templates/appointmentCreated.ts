import {
  formatAppointmentSlot,
  renderEmail,
  treatmentLine,
  type AppointmentEmailData,
  type EmailContent,
} from './shared'

/**
 * Patient email for a newly submitted appointment request.
 * Wording must never imply the appointment is confirmed — it is a request
 * the clinic team will review.
 */
export function appointmentCreatedEmail(data: AppointmentEmailData): EmailContent {
  return renderEmail(
    "We've received your appointment request",
    [
      `Hello ${data.patientName}, thank you for choosing Sakthi Dental Clinic.`,
      `Your request for ${formatAppointmentSlot(data)} has been received. Our team will review it and contact you to confirm the appointment.`,
      treatmentLine(data),
      'No payment or confirmation is needed from your side right now. If you would like to change or cancel the request, simply call the clinic.',
    ],
  )
}
