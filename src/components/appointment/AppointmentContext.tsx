import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import AppointmentModal from './AppointmentModal'

interface AppointmentContextValue {
  openAppointment: (source?: string) => void
  closeAppointment: () => void
  isOpen: boolean
  source: string | undefined
}

const AppointmentContext = createContext<AppointmentContextValue | null>(null)

/**
 * Single appointment flow for the whole site. Any CTA can call
 * openAppointment() and the same modal opens — one form, one source of truth.
 */
export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState<string | undefined>(undefined)

  const openAppointment = useCallback((from?: string) => {
    setSource(from)
    setIsOpen(true)
  }, [])

  const closeAppointment = useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = useMemo(
    () => ({ openAppointment, closeAppointment, isOpen, source }),
    [openAppointment, closeAppointment, isOpen, source],
  )

  return (
    <AppointmentContext.Provider value={value}>
      {children}
      <AppointmentModal />
    </AppointmentContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook co-location is a standard pattern
export function useAppointment(): AppointmentContextValue {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider')
  }
  return context
}
