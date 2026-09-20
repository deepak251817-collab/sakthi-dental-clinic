/**
 * Shared building blocks for appointment email templates.
 *
 * Templates produce clean plain-text plus a minimal, inline-styled HTML
 * alternative (many email clients strip <style> blocks). No secrets and no
 * dynamic content beyond appointment details ever enters a template.
 */

export interface AppointmentEmailData {
  patientName: string
  treatment?: string | null
  preferredDate?: Date | null
  preferredTime?: string | null
}

export interface EmailContent {
  subject: string
  text: string
  html: string
}

const CLINIC_NAME = 'Sakthi Dental Clinic'

/** Renders the appointment slot exactly as stored (date-only semantics → UTC). */
export function formatAppointmentSlot(data: AppointmentEmailData): string {
  const parts: string[] = []
  if (data.preferredDate) {
    parts.push(
      new Intl.DateTimeFormat('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(data.preferredDate),
    )
  }
  if (data.preferredTime) {
    const [hours, minutes] = data.preferredTime.split(':').map(Number)
    const suffix = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    parts.push(`${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`)
  }
  return parts.length > 0 ? parts.join(', ') : 'a date to be confirmed with you'
}

/** Optional line describing the requested treatment, if the patient chose one. */
export function treatmentLine(data: AppointmentEmailData): string | null {
  return data.treatment ? `Treatment requested: ${data.treatment}` : null
}

/**
 * Renders body paragraphs as plain text and a minimal HTML alternative.
 * Paragraphs are plain sentences; the heading opens the message.
 */
export function renderEmail(heading: string, paragraphs: Array<string | null>): EmailContent {
  const body = paragraphs.filter((line): line is string => line !== null && line !== '')
  const text = [heading, '', ...body].join('\n\n')

  const htmlParagraphs = [heading, ...body]
    .map(
      (line, index) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;${
          index === 0 ? 'font-size:18px;font-weight:700;color:#47347F;' : ''
        }">${line}</p>`,
    )
    .join('')

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff">
${htmlParagraphs}
<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#64748b">
${CLINIC_NAME}, Hosur, Tamil Nadu</p>
</div>`

  return { subject: heading, text, html }
}
