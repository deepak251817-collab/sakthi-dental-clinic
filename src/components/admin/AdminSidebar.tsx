import { Link } from 'react-router-dom'
import { CalendarDays, ExternalLink } from 'lucide-react'

/**
 * Admin sidebar navigation. Becomes a horizontal top nav on mobile so the
 * dashboard stays usable at 375px without a drawer.
 */
export default function AdminSidebar() {
  return (
    <nav aria-label="Admin navigation" className="lg:w-60 lg:shrink-0">
      <div className="rounded-2xl border border-primary-100 bg-surface p-4 lg:sticky lg:top-6">
        <p className="hidden text-xs font-semibold uppercase tracking-wide text-slate-400 lg:block">
          Clinic Admin
        </p>
        <ul className="mt-0 flex gap-2 overflow-x-auto lg:mt-3 lg:flex-col lg:overflow-visible">
          <li className="shrink-0">
            <Link
              to="/admin"
              aria-current="page"
              className="flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2 text-sm font-semibold text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Appointments
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Public Website
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
