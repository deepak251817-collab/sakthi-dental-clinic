/**
 * Appointment notification service.
 *
 * Sends status-related notifications when appointment requests are created or
 * change status. Design goals (see Phase 5 brief):
 *
 * - Notifications are best-effort: a failure must never fail the appointment
 *   request that triggered them, so `notifyAppointmentEvent` never throws and
 *   callers do not need to await it.
 * - The delivery channel is pluggable via EMAIL_PROVIDER. The default 'logger'
 *   provider writes notifications to the server log, so no external email
 *   service is required to run the system. Setting EMAIL_PROVIDER=resend
 *   switches to the Resend HTTP API (no SDK dependency).
 * - Credentials live in environment variables only and are never logged.
 * - Notification outcomes are returned per recipient so callers (or a future
 *   log writer) can record exactly what happened.
 */
import { env } from '../config/env'
import { prisma } from '../lib/prisma'
import { appointmentCancelledEmail } from '../templates/appointmentCancelled'
import { appointmentCompletedEmail } from '../templates/appointmentCompleted'
import { appointmentConfirmedEmail } from '../templates/appointmentConfirmed'
import { appointmentCreatedEmail } from '../templates/appointmentCreated'
import type { AppointmentEmailData, EmailContent } from '../templates/shared'

export type NotificationEventType =
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_COMPLETED'

/** Minimal appointment data the templates and log rows need. */
export interface AppointmentNotificationData extends AppointmentEmailData {
  appointmentId: string
  patientEmail: string
}

export interface EmailMessage {
  to: string
  subject: string
  text: string
  html: string
}

/** Anything that can deliver an email. Injected in tests. */
export type EmailTransport = (message: EmailMessage) => Promise<void>

export type DeliveryOutcome =
  | { recipient: string; ok: true }
  | { recipient: string; ok: false; error: string }

const TEMPLATE_BY_EVENT: Record<NotificationEventType, (data: AppointmentEmailData) => EmailContent> = {
  APPOINTMENT_CREATED: appointmentCreatedEmail,
  APPOINTMENT_CONFIRMED: appointmentConfirmedEmail,
  APPOINTMENT_CANCELLED: appointmentCancelledEmail,
  APPOINTMENT_COMPLETED: appointmentCompletedEmail,
}

// eslint-disable-next-line no-console -- the logger provider's whole job is to log
const loggerTransport: EmailTransport = (message) => {
  console.info(
    `[notification:email] to=${message.to} subject="${message.subject}"\n${message.text}`,
  )
  return Promise.resolve()
}

/** Resend HTTP API — no SDK, credentials only from the environment. */
const resendTransport: EmailTransport = async (message) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY ?? ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  })
  if (!response.ok) {
    // Read the body as text to avoid coupling to provider error schemas.
    const detail = await response.text().catch(() => '')
    throw new Error(`Resend request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ''}`)
  }
}

function getEmailTransport(): EmailTransport {
  return env.EMAIL_PROVIDER === 'resend' ? resendTransport : loggerTransport
}

async function resolveRecipients(event: NotificationEventType, data: AppointmentNotificationData): Promise<string[]> {
  if (event !== 'APPOINTMENT_CREATED') {
    return [data.patientEmail]
  }
  // New requests also go to the clinic team (every admin on record).
  const admins = await prisma.adminUser.findMany({ select: { email: true } })
  const recipients = new Set<string>([data.patientEmail.toLowerCase()])
  for (const admin of admins) recipients.add(admin.email.toLowerCase())
  return [...recipients]
}

/**
 * Send one notification and persist a NotificationLog row per recipient.
 * Never throws: a provider or log-write failure is returned/contained so the
 * appointment request that triggered it is always safe.
 */
export async function deliverNotification(
  event: NotificationEventType,
  data: AppointmentNotificationData,
  options: { transport?: EmailTransport } = {},
): Promise<DeliveryOutcome[]> {
  const content = TEMPLATE_BY_EVENT[event](data)
  const transport = options.transport ?? getEmailTransport()
  const recipients = await resolveRecipients(event, data)

  const outcomes = await Promise.all(
    recipients.map(async (recipient): Promise<DeliveryOutcome> => {
      try {
        await transport({ to: recipient, subject: content.subject, text: content.text, html: content.html })
        return { recipient, ok: true }
      } catch (error) {
        return {
          recipient,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    }),
  )

  try {
    await prisma.notificationLog.createMany({
      data: outcomes.map((outcome) => ({
        appointmentId: data.appointmentId,
        type: event,
        channel: 'EMAIL',
        recipient: outcome.recipient,
        status: outcome.ok ? 'SENT' : 'FAILED',
        errorMessage: outcome.ok ? null : outcome.error.slice(0, 500),
      })),
    })
  } catch (error) {
    // A log-write failure is an operational problem, not a delivery failure —
    // surface it in the server log and keep the outcomes intact.
    // eslint-disable-next-line no-console -- failures must be visible server-side
    console.error(`[notification] could not write ${event} log rows:`, error)
  }

  return outcomes
}

/**
 * Fire-and-forget entry point for appointment lifecycle events.
 *
 * - Never throws and never rejects: any failure is logged and (from Phase 5's
 *   notification log) recorded, so the appointment request itself is safe.
 * - Callers should invoke without `await` so the request path is not delayed.
 */
export function notifyAppointmentEvent(
  event: NotificationEventType,
  data: AppointmentNotificationData,
  options: { transport?: EmailTransport } = {},
): void {
  void (async () => {
    try {
      const outcomes = await deliverNotification(event, data, options)
      for (const outcome of outcomes) {
        if (!outcome.ok) {
          // eslint-disable-next-line no-console -- failures must be visible server-side
          console.error(`[notification] ${event} email failed for ${outcome.recipient}: ${outcome.error}`)
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console -- unexpected failure must be visible, but must not propagate
      console.error(`[notification] ${event} dispatch failed unexpectedly:`, error)
    }
  })()
}
