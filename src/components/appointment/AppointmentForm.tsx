import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Printer } from 'lucide-react'
import Button from '../common/Button'
import { treatments } from '../../data/treatments'
import { ApiError, submitAppointment } from '../../lib/api'
import { site } from '../../lib/constants'
import type {
  AppointmentFormErrors,
  AppointmentRequest,
  SubmissionStatus,
} from './appointmentTypes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s-]{6,14}$/

/**
 * Appointment REQUEST form. Client-side validation covers name, phone, email
 * and a not-in-the-past date; a valid submit is sent to the clinic API
 * (POST /api/appointments). A success state confirms the REQUEST was received
 * — it is not a confirmed booking. Network failures show an offline state
 * with the clinic phone number as fallback.
 *
 * The modal owns closing (overlay click, Escape, X button); the success panel
 * navigates with Back to Home, so this component takes no props.
 */
export default function AppointmentForm() {
  const [values, setValues] = useState<AppointmentRequest>({
    name: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<AppointmentFormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<{ id: string; submittedAt: Date } | null>(null)

  const validate = (): AppointmentFormErrors => {
    const next: AppointmentFormErrors = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    else if (values.name.trim().length < 2) next.name = 'Name must be at least 2 characters.'

    if (!values.phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!PHONE_PATTERN.test(values.phone.trim()))
      next.phone = 'Please enter a valid phone number.'

    if (!values.email.trim()) next.email = 'Please enter your email address.'
    else if (!EMAIL_PATTERN.test(values.email.trim()))
      next.email = 'Please enter a valid email address.'

    if (values.preferredDate) {
      const selected = new Date(`${values.preferredDate}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (Number.isNaN(selected.getTime()) || selected < today) {
        next.preferredDate = 'Please choose today or a future date.'
      }
    }
    return next
  }

  const setField =
    (field: keyof AppointmentRequest) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    setServerError(null)
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const result = await submitAppointment({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        preferredDate: values.preferredDate || undefined,
        preferredTime: values.preferredTime || undefined,
        treatment: values.treatment || undefined,
        message: values.message?.trim() || undefined,
      })
      setReceipt({ id: result.id, submittedAt: new Date() })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      if (err instanceof ApiError) {
        // Surface server-side field errors beneath the matching inputs.
        if (err.fieldErrors) {
          setErrors((current) => ({
            ...current,
            ...err.fieldErrors,
          }))
        }
        setServerError(
          err.isNetworkError
            ? 'Appointment services are temporarily unavailable. Please call the clinic directly.'
            : err.message,
        )
      } else {
        setServerError(
          'Unable to submit your request right now. Please try again or contact the clinic directly.',
        )
      }
    }
  }

  const inputClasses = (hasError: boolean) =>
    `w-full rounded-xl border bg-surface-input px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-300 focus:ring-red-200 dark:border-red-500/60 dark:focus:ring-red-500/30'
        : 'border-primary-200 focus:border-primary-400 focus:ring-primary-100 dark:focus:ring-primary-100/40'
    }`

  const labelClasses = 'mb-1.5 block text-sm font-medium text-slate-700'

  if (status === 'success' && receipt) {
    const details: Array<{ label: string; value: string }> = []
    if (values.treatment) details.push({ label: 'Treatment', value: values.treatment })
    if (values.preferredDate) {
      // Display the calendar date as chosen, avoiding timezone drift from
      // Date parsing (e.g. '2026-10-02' rendered as Oct 1 in negative offsets).
      const [y, m, d] = values.preferredDate.split('-').map(Number)
      details.push({
        label: 'Preferred date',
        value: `${d} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y}`,
      })
    }
    if (values.preferredTime) details.push({ label: 'Preferred time', value: values.preferredTime })

    const printSummary = () => {
      const win = window.open('', '_blank', 'width=640,height=760')
      if (!win) return
      const row = (label: string, value?: string) =>
        value
          ? `<tr><th scope="row">${label}</th><td>${value.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td></tr>`
          : ''
      win.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Appointment Request ${receipt.id} — ${site.name}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #1e1b2e; margin: 48px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .clinic { color: #6d28d9; font-size: 13px; margin: 0 0 2px; }
  .meta { color: #555; font-size: 12px; margin: 0 0 28px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; padding: 8px 0; border-bottom: 1px solid #ddd; font-size: 13px; }
  th { width: 38%; color: #555; font-weight: normal; }
  footer { margin-top: 32px; font-size: 11px; color: #777; line-height: 1.6; }
  @media print { body { margin: 24px; } }
</style>
</head>
<body>
  <p class="clinic">${site.name}</p>
  <h1>Appointment Request Summary</h1>
  <p class="meta">Submitted ${receipt.submittedAt.toLocaleString()}</p>
  <table>
    <tr><th scope="row">Request ID</th><td>${receipt.id}</td></tr>
    ${row('Patient name', values.name.trim())}
    ${row('Treatment', values.treatment)}
    ${row('Preferred date', values.preferredDate)}
    ${row('Preferred time', values.preferredTime)}
  </table>
  <footer>
    ${site.name} — ${site.address.line1} ${site.address.line2}<br>
    ${site.phones.join(' / ')} · ${site.email}<br>
    This is a request, not a confirmed booking. The clinic will confirm your slot by phone.
  </footer>
</body>
</html>`)
      win.document.close()
      win.focus()
      win.print()
    }

    return (
      <div className="px-6 py-10 text-center sm:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-ink-800">Appointment Request Received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Thank you. Your request has been submitted successfully. Our team will contact you to
          confirm your appointment.
        </p>

        {receipt && (
          <p className="mt-4 text-sm text-slate-500">
            Request ID:{' '}
            <span className="font-mono text-xs font-semibold text-slate-700 select-all">
              {receipt.id}
            </span>
          </p>
        )}

        {details.length > 0 && (
          <dl className="mx-auto mt-5 max-w-sm space-y-2 rounded-xl border border-primary-100 bg-primary-50/60 px-5 py-4 text-left text-sm dark:border-primary-100/20 dark:bg-primary-100/5">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start justify-between gap-4">
                <dt className="shrink-0 text-slate-500">{detail.label}</dt>
                <dd className="text-right font-medium text-slate-700">{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mx-auto mt-5 max-w-sm rounded-xl bg-surface-input px-5 py-4 text-left text-sm text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {site.phones.join(' / ')}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {site.email}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {site.address.line1} {site.address.line2}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {site.timings}
          </p>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" to="/">
            Back to Home
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = `tel:${site.phones[0].replace(/\s/g, '')}`
            }}
          >
            Contact Clinic
          </Button>
          {receipt && (
            <Button variant="ghost" onClick={printSummary}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print Request Summary
            </Button>
          )}
        </div>

        <p className="mt-6 text-xs text-slate-400">
          This is a request, not a confirmed booking — our team will confirm your slot by phone.
        </p>
        <p aria-live="polite" className="sr-only">
          Appointment request received successfully.
        </p>
      </div>
    )
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 px-6 py-6 sm:px-8">
      <div>
        <label htmlFor="appt-name" className={labelClasses}>
          Name <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id="appt-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={setField('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'appt-name-error' : undefined}
          placeholder="Your full name"
          className={inputClasses(Boolean(errors.name))}
        />
        {errors.name && (
          <p id="appt-name-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="appt-phone" className={labelClasses}>
          Phone Number <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id="appt-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={setField('phone')}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'appt-phone-error' : undefined}
          placeholder="+91 98765 43210"
          className={inputClasses(Boolean(errors.phone))}
        />
        {errors.phone && (
          <p id="appt-phone-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="appt-email" className={labelClasses}>
          Email <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id="appt-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={setField('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'appt-email-error' : undefined}
          placeholder="you@example.com"
          className={inputClasses(Boolean(errors.email))}
        />
        {errors.email && (
          <p id="appt-email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="appt-date" className={labelClasses}>
            Preferred Date <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="appt-date"
            name="preferredDate"
            type="date"
            value={values.preferredDate ?? ''}
            onChange={setField('preferredDate')}
            aria-invalid={Boolean(errors.preferredDate)}
            aria-describedby={errors.preferredDate ? 'appt-date-error' : undefined}
            className={inputClasses(Boolean(errors.preferredDate))}
          />
          {errors.preferredDate && (
            <p id="appt-date-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.preferredDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="appt-time" className={labelClasses}>
            Preferred Time <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="appt-time"
            name="preferredTime"
            type="time"
            value={values.preferredTime ?? ''}
            onChange={setField('preferredTime')}
            className={inputClasses(false)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="appt-treatment" className={labelClasses}>
          Treatment <span className="text-slate-400">(optional)</span>
        </label>
        <select
          id="appt-treatment"
          name="treatment"
          value={values.treatment ?? ''}
          onChange={setField('treatment')}
          className={inputClasses(false)}
        >
          <option value="">Not sure yet</option>
          {treatments.map((treatment) => (
            <option key={treatment.title} value={treatment.title}>
              {treatment.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="appt-message" className={labelClasses}>
          Message <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="appt-message"
          name="message"
          rows={3}
          value={values.message ?? ''}
          onChange={setField('message')}
          placeholder="Anything we should know before your visit?"
          className={`${inputClasses(false)} resize-y`}
        />
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {serverError}
            {serverError.includes('temporarily unavailable') && (
              <>
                {' '}
                <a
                  href={`tel:${site.phones[0].replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  <Phone className="inline h-3.5 w-3.5" aria-hidden="true" />
                  {site.phones[0]}
                </a>
              </>
            )}
          </span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'submitting'}
        className="w-full aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          'Submit Request'
        )}
      </Button>

      <p className="text-center text-xs text-slate-400">
        Submitting this form sends a request — our team will confirm your appointment by phone.
      </p>
    </form>
  )
}
