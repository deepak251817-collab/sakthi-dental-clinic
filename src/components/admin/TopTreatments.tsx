import type { TreatmentCount } from '../../lib/api'

interface TopTreatmentsProps {
  treatments: TreatmentCount[]
  loading: boolean
  /** Total requests in the selected window, for the sample-size note. */
  windowTotal: number
}

/**
 * Treatment demand over the selected window. The "based on N requests" note is
 * always shown so the ranking is never read as more significant than its
 * sample size.
 */
export default function TopTreatments({ treatments, loading, windowTotal }: TopTreatmentsProps) {
  if (loading) {
    return (
      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-6 w-full animate-pulse rounded bg-primary-100" />
        ))}
      </div>
    )
  }

  if (treatments.length === 0) {
    return <p className="text-sm text-slate-500">No treatment requests in this period.</p>
  }

  const max = Math.max(...treatments.map((t) => t.count))

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="sr-only">
            <th scope="col">Treatment</th>
            <th scope="col">Requests</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map(({ treatment, count }) => (
            <tr key={treatment} className="border-b border-slate-100 last:border-0">
              <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-700">
                {treatment}
              </th>
              <td className="py-2 text-right whitespace-nowrap text-slate-600">
                <span className="mr-2 inline-block h-1.5 w-16 max-w-full overflow-hidden rounded-full bg-primary-100 align-middle" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-primary-400"
                    style={{ width: `${Math.max(8, (count / max) * 100)}%` }}
                  />
                </span>
                {count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        Based on {windowTotal} request{windowTotal === 1 ? '' : 's'} in this period.
      </p>
    </div>
  )
}
