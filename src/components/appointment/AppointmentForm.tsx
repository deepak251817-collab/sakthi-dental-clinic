import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Phone } from 'lucide-react'
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

interface AppointmentFormProps {
  onReset: () => void
}

/**
 * Appointment REQUEST form. Client-side validation covers name, phone, email
 * and a not-in-the-past date; a valid submit is sent to the clinic API
 * (POST /api/appointments). A success state confirms the REQUEST was received
 * — it is not a confirmed booking. Network failures show an offline state
 * with the clinic phone number as fallback.
 */
export default function AppointmentForm({ onReset }: AppointmentFormProps) {
  const [values, setValues] = useState<AppointmentRequest>({
    name: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<AppointmentFormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

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
      await submitAppointment({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        preferredDate: values.preferredDate || undefined,
        preferredTime: values.preferredTime || undefined,
        treatment: values.treatment || undefined,
        message: values.message?.trim() || undefined,
      })
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
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-300 focus:ring-red-200'
        : 'border-primary-200 focus:border-primary-400 focus:ring-primary-100'
    }`

  const labelClasses = 'mb-1.5 block text-sm font-medium text-slate-700'

  if (status === 'success') {
    return (
      <div className="px-6 py-10 text-center sm:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-slate-800">Appointment Request Received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Thank you. Your request has been submitted successfully. Our team will contact you to
          confirm your appointment.
        </p>
        <Button variant="secondary" className="mt-7" onClick={onReset}>
          Close
        </Button>
        <p className="mt-5 text-xs text-slate-400">
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
          Name <span className="text-red-500" aria-hidden="true">*</span>
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
          <p id="appt-name-error" className="mt-1.5 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="appt-phone" className={labelClasses}>
          Phone Number <span className="text-red-500" aria-hidden="true">*</span>
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
          <p id="appt-phone-error" className="mt-1.5 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="appt-email" className={labelClasses}>
          Email <span className="text-red-500" aria-hidden="true">*</span>
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
          <p id="appt-email-error" className="mt-1.5 text-sm text-red-600">
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
            <p id="appt-date-error" className="mt-1.5 text-sm text-red-600">
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
          className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
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
