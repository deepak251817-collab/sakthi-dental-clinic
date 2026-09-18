import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Button from '../common/Button'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
}

type SubmissionStatus = 'idle' | 'submitting' | 'success'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s-]{6,14}$/

/**
 * Client-side validated contact form. No backend is connected — on a valid
 * submission a clear success message is shown (frontend-only success state).
 */
export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Please enter your name.'
    if (!email.trim()) next.email = 'Please enter your email address.'
    else if (!EMAIL_PATTERN.test(email.trim()))
      next.email = 'Please enter a valid email address.'
    if (!phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!PHONE_PATTERN.test(phone.trim()))
      next.phone = 'Please enter a valid phone number.'
    return next
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      // No backend is connected — simulate a short submit, then show success.
      setStatus('submitting')
      window.setTimeout(() => {
        setStatus('success')
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
      }, 700)
    }
  }

  const inputClasses = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-300 focus:ring-red-200'
        : 'border-primary-200 focus:border-primary-400 focus:ring-primary-100'
    }`

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-7 shadow-card sm:p-9">
      <h2 className="text-xl font-bold text-ink-800">Send us a message</h2>
      <p className="mt-1.5 text-sm text-slate-500">
        Fill in the form and our team will get back to you.
      </p>

      {status === 'success' && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-green-800">Thank you — message sent!</p>
            <p className="mt-0.5 text-sm text-green-700">
              Our team will reach out to you shortly. For urgent needs, please call the clinic.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            placeholder="Your full name"
            className={inputClasses(Boolean(errors.name))}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            placeholder="you@example.com"
            className={inputClasses(Boolean(errors.email))}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone Number <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            placeholder="+91 98765 43210"
            className={inputClasses(Boolean(errors.phone))}
          />
          {errors.phone && (
            <p id="contact-phone-error" className="mt-1.5 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Your Message <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="How can we help you?"
            className={`${inputClasses(false)} resize-y`}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </div>
  )
}
