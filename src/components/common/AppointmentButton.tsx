import type { ButtonHTMLAttributes } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useAppointment } from '../appointment/AppointmentContext'
import { cn } from '../../lib/utils'

interface AppointmentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  source?: string
  size?: 'md' | 'lg'
  variant?: 'primary' | 'onDark' | 'onDarkSecondary'
  label?: string
}

/**
 * The one appointment CTA used everywhere. Calls openAppointment(source) so
 * every entry point opens the SAME appointment flow.
 */
export default function AppointmentButton({
  source,
  size = 'lg',
  variant = 'primary',
  label = 'Fix an Appointment',
  className,
  ...rest
}: AppointmentButtonProps) {
  const { openAppointment } = useAppointment()

  const variantClasses = {
    primary: 'bg-primary-600 text-white shadow-soft hover:bg-primary-700 focus-visible:outline-primary-600',
    onDark:
      'bg-white text-primary-700 hover:bg-primary-50 focus-visible:outline-white',
    onDarkSecondary:
      'bg-transparent text-white ring-1 ring-white/40 hover:bg-white/10 focus-visible:outline-white',
  } as const

  const sizeClasses = {
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  } as const

  return (
    <button
      type="button"
      onClick={() => openAppointment(source)}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
}
