import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../../lib/auth'

/**
 * Route guard for the admin area: unauthenticated visitors are redirected to
 * /admin/login (remembering where they were heading); authenticated admins
 * render the protected children.
 */
export default function RequireAdminAuth({ children }: { children: ReactNode }) {
  const token = getToken()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
