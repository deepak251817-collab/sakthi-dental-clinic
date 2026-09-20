import type { TrendPoint } from '../../lib/api'

interface TrendChartProps {
  points: TrendPoint[]
  loading: boolean
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Formats an IST ISO day (YYYY-MM-DD) without Date parsing, so no timezone shift. */
function formatDay(isoDay: string): string {
  const [year, month, day] = isoDay.split('-')
  const monthName = MONTHS[Number(month) - 1] ?? month
  return `${day} ${monthName}${year === String(new Date().getFullYear()) ? '' : ` ${year}`}`
}

/**
 * Appointment requests per calendar day. Bars are plain flex divs (responsive
 * with no SVG math), and the sr-only table gives assistive tech the exact data.
 */
export default function TrendChart({ points, loading }: TrendChartProps) {
  const max = Math.max(1, ...points.map((p) => p.count))
  const totalRequests = points.reduce((sum, p) => sum + p.count, 0)

  if (loading) {
    return (
      <div className="flex h-44 items-end gap-[2px]" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="min-h-[2px] flex-1 animate-pulse rounded-t bg-primary-100"
            style={{ height: `${20 + ((i * 37) % 70)}%` }}
          />
        ))}
      </div>
    )
  }

  if (totalRequests === 0) {
    return (
      <p className="flex h-44 items-center justify-center text-sm text-slate-500">
        No requests in this period.
      </p>
    )
  }

  return (
    <div>
      <div className="flex h-44 items-end gap-[2px]" role="img" aria-label={`Appointment requests per day over ${points.length} day${points.length === 1 ? '' : 's'}: ${totalRequests} total.`}>
        {points.map((point, index) => (
          <div
            key={point.day}
            className={`min-h-[2px] flex-1 rounded-t transition-colors ${
              index === points.length - 1 ? 'bg-primary-500' : 'bg-primary-300 hover:bg-primary-400'
            }`}
            style={{ height: `${Math.max(2, (point.count / max) * 100)}%` }}
            title={`${formatDay(point.day)}: ${point.count} request${point.count === 1 ? '' : 's'}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{formatDay(points[0].day)}</span>
        <span>{formatDay(points[points.length - 1].day)}</span>
      </div>

      <table className="sr-only">
        <caption>Appointment requests per day</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Requests</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.day}>
              <td>{formatDay(point.day)}</td>
              <td>{point.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
