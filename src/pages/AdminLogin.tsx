import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Loader2, Lock, ShieldCheck } from 'lucide-react'
import { ApiError, loginAdmin } from '../lib/api'
import { setSession } from '../lib/auth'
import { useToast } from '../components/admin/Toast'

/**
 * Admin sign-in page (/admin/login).
 *
 * Error states: invalid credentials and server/network failures. To avoid
 * revealing whether an email exists, both wrong-email and wrong-password
 * cases show the same message.
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const redirectTo = location.state?.from ?? '/admin'

  const notify = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      const { token, admin } = await loginAdmin(email.trim(), password)
      setSession(token, admin.email)
      notify('Signed in successfully')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.isNetworkError) {
        setError('Cannot reach the server right now. Please try again later.')
      } else if (err instanceof ApiError && err.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError('Sign in failed. Please try again.')
      }
      setSubmitting(false)
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-100'

  return (
    <div className="flex min-h-[calc(100dvh-68px)] items-center justify-center bg-primary-50/60 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-lifted">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100">
              <ShieldCheck className="h-5 w-5 text-primary-700" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-ink-800">Admin Sign In</h1>
              <p className="text-xs text-slate-500">Sakthi Dental Clinic — staff area</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@sakthidentalclinic.in"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={inputClasses}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Staff access only.{' '}
          <Link to="/" className="underline underline-offset-2 hover:text-primary-600">
            Return to the clinic website
          </Link>
        </p>
      </div>
    </div>
  )
}
