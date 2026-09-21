import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { ToastContext, type ToastTone } from './toastContext'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

const AUTO_DISMISS_MS = 4000
const MAX_VISIBLE = 3

/**
 * Small toast layer for admin action feedback (status changes, sign in/out,
 * deletions). Success items are role="status", errors role="alert", so screen
 * readers announce them with the right urgency without an aria-live wrapper.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = nextId.current++
    setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, AUTO_DISMISS_MS)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-start gap-2 rounded-xl border border-primary-100 bg-surface p-3 text-sm shadow-lifted"
          >
            {toast.tone === 'error' ? (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            )}
            <span className={toast.tone === 'error' ? 'text-red-700' : 'text-slate-700'}>
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
