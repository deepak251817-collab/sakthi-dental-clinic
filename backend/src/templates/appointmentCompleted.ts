import {
  formatAppointmentSlot,
  renderEmail,
  type AppointmentEmailData,
  type EmailContent,
} from './shared'

/** Patient email sent when the clinic marks the visit as completed. */
export function appointmentCompletedEmail(data: AppointmentEmailData): EmailContent {
  return renderEmail(
    'Your visit is complete — thank you',
    [
      `Hello ${data.patientName}, your appointment on ${formatAppointmentSlot(data)} has been marked as completed.`,
      'Thank you for visiting Sakthi Dental Clinic. We recommend a routine check-up every six months to keep your teeth and gums healthy.',
    ],
  )
}
