import { MessageCircle, Phone, CalendarPlus } from 'lucide-react'
import { useAppointment } from '../appointment/AppointmentContext'

const WHATSAPP_URL =
  'https://wa.me/919862890897?text=' +
  encodeURIComponent('Hello Sakthi Dental Clinic, I would like to enquire about an appointment.')

const PHONE_TEL = 'tel:+919862890897'

interface QuickAction {
  label: string
  href?: string
  onClick?: () => void
  Icon: typeof Phone
  /** Visual emphasis for the primary appointment action. */
  primary?: boolean
}

/**
 * Floating quick-contact actions.
 * Desktop: a vertical action group on the lower right.
 * Mobile: a fixed bottom bar — Call, WhatsApp and Appointment are one tap away.
 * These are direct contact actions, not automated booking.
 */
export default function FloatingContactBar() {
  const { openAppointment } = useAppointment()

  const actions: QuickAction[] = [
    { label: 'Call the clinic', href: PHONE_TEL, Icon: Phone },
    { label: 'Chat on WhatsApp', href: WHATSAPP_URL, Icon: MessageCircle },
    { label: 'Fix an Appointment', onClick: () => openAppointment('Floating contact bar'), Icon: CalendarPlus, primary: true },
  ]

  const shellClasses =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

  return (
    <>
      {/* Mobile: fixed bottom action bar */}
      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-primary-100 bg-white/95 shadow-lifted backdrop-blur supports-[backdrop-filter]:bg-white/90 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-3">
          {actions.map(({ label, href, onClick, Icon, primary }) => (
            <li key={label}>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={label}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${shellClasses} ${
                    primary ? 'text-primary-700' : 'text-slate-600 hover:text-primary-700'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {label.replace(' the clinic', '').replace('Chat on ', '')}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onClick}
                  aria-label={label}
                  className={`flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${shellClasses} ${
                    primary ? 'text-primary-700' : 'text-slate-600 hover:text-primary-700'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  Appointment
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop: floating action group, lower right */}
      <nav
        aria-label="Quick contact"
        className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 lg:flex"
      >
        {actions.map(({ label, href, onClick, Icon, primary }) => (
          <div key={label} className="group relative flex items-center">
            <span
              role="tooltip"
              className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {label}
            </span>
            {href ? (
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lifted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${shellClasses} ${
                  primary
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-white text-primary-700 ring-1 ring-primary-100 hover:bg-primary-50'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                onClick={onClick}
                aria-label={label}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lifted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${shellClasses} ${
                  primary
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-white text-primary-700 ring-1 ring-primary-100 hover:bg-primary-50'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
