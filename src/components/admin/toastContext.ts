import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'error'

/**
 * Toast context lives in its own module so `Toast.tsx` only exports
 * components — react-refresh (and therefore fast refresh in development)
 * requires non-component exports to stay out of component files.
 */
export const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null)

/** Fire a quiet confirmation/error toast. Valid only inside <ToastProvider>. */
export function useToast() {
  const notify = useContext(ToastContext)
  if (!notify) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return notify
}
