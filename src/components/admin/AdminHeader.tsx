import { LogOut } from 'lucide-react'

interface AdminHeaderProps {
  adminEmail: string | null
  onLogout: () => void
}

/** Dashboard top bar: title, signed-in admin and logout. */
export default function AdminHeader({ adminEmail, onLogout }: AdminHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-surface p-4">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Appointment Dashboard</h1>
        <p className="text-xs text-slate-500">
          {adminEmail ? `Signed in as ${adminEmail}` : 'Sakthi Dental Clinic — internal use'}
        </p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </button>
    </header>
  )
}
