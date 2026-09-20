import { useCallback, useEffect, useState } from 'react'
import { getToken } from '../../lib/auth'
import {
  fetchAppointmentTrends,
  fetchTopTreatments,
  ApiError,
  type AnalyticsRange,
  type AppointmentStats,
  type TreatmentCount,
  type TrendPoint,
} from '../../lib/api'
import TrendChart from './TrendChart'
import StatusDistribution from './StatusDistribution'
import TopTreatments from './TopTreatments'

interface AnalyticsPanelProps {
  stats: AppointmentStats | null
  /** Shared handling for expired sessions (redirect to login). */
  onAuthFailure: () => void
}

const RANGES: Array<{ days: AnalyticsRange; label: string }> = [
  { days: 1, label: 'Today' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

/**
 * Analytics section of the admin dashboard: requests-over-time chart, status
 * distribution and most-requested treatments — all real data from the API.
 */
export default function AnalyticsPanel({ stats, onAuthFailure }: AnalyticsPanelProps) {
  const [range, setRange] = useState<AnalyticsRange>(30)
  const [trends, setTrends] = useState<TrendPoint[]>([])
  const [treatments, setTreatments] = useState<TreatmentCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        onAuthFailure()
        return
      }
      const [trendsResult, treatmentsResult] = await Promise.all([
        fetchAppointmentTrends(token, range),
        fetchTopTreatments(token, range),
      ])
      setTrends(trendsResult)
      setTreatments(treatmentsResult)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthFailure()
        return
      }
      setError(
        err instanceof ApiError && err.isNetworkError
          ? 'Cannot reach the server. Check that the backend is running, then retry.'
          : 'Unable to load analytics. Please retry.',
      )
    } finally {
      setLoading(false)
    }
  }, [range, onAuthFailure])

  useEffect(() => {
    void loadAnalytics()
  }, [loadAnalytics])

  return (
    <section aria-labelledby="analytics-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="analytics-heading" className="text-lg font-bold text-slate-800">
          Analytics
        </h2>
        <div role="group" aria-label="Analytics period" className="flex flex-wrap gap-2">
          {RANGES.map(({ days, label }) => (
            <button
              key={days}
              type="button"
              aria-pressed={range === days}
              onClick={() => setRange(days)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                range === days
                  ? 'bg-primary-600 text-white'
                  : 'border border-primary-200 bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-primary-100 bg-white p-6 text-center">
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void loadAnalytics()}
            className="mt-3 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3" aria-live="polite">
          <div className="rounded-2xl border border-primary-100 bg-white p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-700">Requests over time</h3>
            <div className="mt-4">
              <TrendChart points={trends} loading={loading} />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border border-primary-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-700">Status distribution</h3>
              <div className="mt-4">
                <StatusDistribution stats={stats} loading={loading} />
              </div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-700">Most requested treatments</h3>
              <div className="mt-4">
                <TopTreatments
                  treatments={treatments}
                  loading={loading}
                  windowTotal={treatments.reduce((sum, t) => sum + t.count, 0)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
