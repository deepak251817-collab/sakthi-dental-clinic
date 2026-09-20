import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import DashboardStats from '../components/admin/DashboardStats'
import AnalyticsPanel from '../components/admin/AnalyticsPanel'
import ActivityFeed from '../components/admin/ActivityFeed'
import AppointmentFilters from '../components/admin/AppointmentFilters'
import AppointmentTable from '../components/admin/AppointmentTable'
import AppointmentDetails from '../components/admin/AppointmentDetails'
import Modal from '../components/common/Modal'
import {
  ApiError,
  deleteAppointment,
  fetchActivity,
  fetchAppointmentStats,
  fetchAppointments,
  updateAppointmentStatus,
  type AppointmentListResult,
  type AppointmentRecord,
  type AppointmentStats,
  type AppointmentStatus,
  type ActivityEntry,
} from '../lib/api'
import { clearSession, getAdminEmail, getToken } from '../lib/auth'
import { useToast } from '../components/admin/Toast'

const SEARCH_DEBOUNCE_MS = 350

/**
 * Admin appointment dashboard (/admin). All data comes live from the API —
 * counts, lists and status changes are never faked.
 */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = getToken()
  const notify = useToast()

  const [list, setList] = useState<AppointmentListResult | null>(null)
  const [stats, setStats] = useState<AppointmentStats | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)

  const [details, setDetails] = useState<AppointmentRecord | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<{
    appointment: AppointmentRecord
    status: AppointmentStatus
  } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  // Debounce the search box so server requests fire after typing settles.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const handleAuthFailure = useCallback(() => {
    clearSession()
    navigate('/admin/login', { replace: true })
  }, [navigate])

  const loadData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [listResult, statsResult, activityResult] = await Promise.all([
        fetchAppointments(token, {
          page,
          status: statusFilter || undefined,
          search: search || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        }),
        fetchAppointmentStats(token),
        fetchActivity(token),
      ])
      setList(listResult)
      setStats(statsResult)
      setActivity(activityResult)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleAuthFailure()
        return
      }
      setError(
        err instanceof ApiError && err.isNetworkError
          ? 'Cannot reach the server. Check that the backend is running, then retry.'
          : 'Could not load appointments. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [token, page, statusFilter, search, fromDate, toDate, handleAuthFailure])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const performStatusChange = async (
    appointment: AppointmentRecord,
    status: AppointmentStatus,
  ) => {
    if (!token) return
    setBusyId(appointment.id)
    setActionError(null)
    try {
      const updated = await updateAppointmentStatus(token, appointment.id, status)
      setConfirmTarget(null)
      setDetails((current) => (current?.id === updated.id ? updated : current))
      const label =
        status === 'CONFIRMED'
          ? 'Appointment confirmed'
          : status === 'COMPLETED'
            ? 'Appointment completed'
            : 'Appointment cancelled'
      notify(label)
      await loadData()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleAuthFailure()
        return
      }
      setConfirmTarget(null)
      notify(
        err instanceof ApiError && err.isNetworkError
          ? 'Cannot reach the server. The status was not changed — please retry.'
          : 'The status could not be updated. Please try again.',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const handleStatusChange = (appointment: AppointmentRecord, status: AppointmentStatus) => {
    // Cancellation is a meaningful change — require an explicit confirmation.
    if (status === 'CANCELLED') {
      setConfirmTarget({ appointment, status })
      return
    }
    void performStatusChange(appointment, status)
  }

  const handleDelete = async (appointment: AppointmentRecord) => {
    if (!token) return
    setBusyId(appointment.id)
    setActionError(null)
    try {
      await deleteAppointment(token, appointment.id)
      setDetails(null)
      notify('Appointment request deleted')
      await loadData()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleAuthFailure()
        return
      }
      notify('The request could not be deleted. Please try again.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleLogout = () => {
    clearSession()
    notify('Signed out')
    navigate('/admin/login', { replace: true })
  }

  const clearFilters = () => {
    setStatusFilter('')
    setSearchInput('')
    setFromDate('')
    setToDate('')
    setPage(1)
  }

  const hasActiveFilters = Boolean(statusFilter || searchInput || fromDate || toDate)
  const appointments = list?.data ?? []
  const totalPages = list?.totalPages ?? 1

  return (
    <div className="min-h-dvh bg-primary-50/40">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
        <AdminHeader adminEmail={getAdminEmail()} onLogout={handleLogout} />
        <DashboardStats stats={stats} loading={loading} />
        <AnalyticsPanel stats={stats} onAuthFailure={handleAuthFailure} />

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="space-y-4 lg:w-60 lg:shrink-0">
            <AdminSidebar />
            <ActivityFeed entries={activity} loading={loading} />
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <h2 className="sr-only">Appointment requests</h2>
            <AppointmentFilters
              status={statusFilter}
              onStatusChange={(next) => {
                setStatusFilter(next)
                setPage(1)
              }}
              search={searchInput}
              onSearchChange={setSearchInput}
              fromDate={fromDate}
              toDate={toDate}
              onDateChange={(field, value) => {
                if (field === 'fromDate') setFromDate(value)
                else setToDate(value)
                setPage(1)
              }}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {actionError && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </p>
            )}

            <AppointmentTable
              appointments={appointments}
              loading={loading}
              error={error}
              onOpenDetails={setDetails}
              onStatusChange={handleStatusChange}
              busyId={busyId}
            />

            {list && list.total > 0 && (
              <nav
                aria-label="Appointment pages"
                className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600"
              >
                <p>
                  Showing {appointments.length} of {list.total} request
                  {list.total === 1 ? '' : 's'} — page {list.page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || loading}
                    className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-white px-3.5 py-1.5 font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages || loading}
                    className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-white px-3.5 py-1.5 font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>

      <AppointmentDetails
        appointment={details}
        onClose={() => setDetails(null)}
        onStatusChange={performStatusChange}
        onDelete={handleDelete}
        busy={busyId !== null}
      />

      <Modal
        isOpen={confirmTarget !== null}
        onClose={() => setConfirmTarget(null)}
        label="Cancel this appointment request?"
        description="The patient's request will stay in the system with a Cancelled status, but no appointment will take place."
      >
        <div className="px-6 py-5 sm:px-8">
          <p className="text-sm text-slate-600">
            {confirmTarget
              ? `Cancel the request from ${confirmTarget.appointment.name} (${confirmTarget.appointment.phone})?`
              : ''}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId !== null}
              onClick={() =>
                confirmTarget &&
                void performStatusChange(confirmTarget.appointment, confirmTarget.status)
              }
              className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              Confirm Cancellation
            </button>
            <button
              type="button"
              onClick={() => setConfirmTarget(null)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
            >
              Back
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
