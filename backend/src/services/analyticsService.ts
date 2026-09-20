/**
 * Dashboard analytics — all numbers come from real database aggregation.
 *
 * Daily buckets use the clinic's own calendar (Asia/Kolkata), because "how
 * many requests arrived today" must match the day the staff in Hosur are
 * actually looking at. Windows are limited to 1/7/30/90 days (validated in
 * the query schema) so every query stays cheap and index-friendly.
 */
import { prisma } from '../lib/prisma'

export interface TrendPoint {
  /** Calendar day in YYYY-MM-DD (IST). */
  day: string
  count: number
}

export interface TreatmentCount {
  treatment: string
  count: number
}

/** Instant → YYYY-MM-DD of the IST calendar day. */
function istDayKey(instant: Date): string {
  return new Date(instant.getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10)
}

/** The inclusive IST day window [today-(days-1) … today], plus its UTC start instant. */
function istWindow(days: number): { startIst: string; todayIst: string; startInstant: Date } {
  const todayIst = istDayKey(new Date())
  const startInstant = new Date(Date.parse(`${todayIst}T00:00:00+05:30`) - (days - 1) * 86_400_000)
  return { startIst: istDayKey(startInstant), todayIst, startInstant }
}

/** Appointment requests per calendar day (IST), including zero-request days. */
export async function getAppointmentTrends(days: number): Promise<TrendPoint[]> {
  const { startIst, todayIst, startInstant } = istWindow(days)

  const rows = await prisma.$queryRaw<Array<{ day: string; count: number }>>`
    SELECT to_char((created_at AT TIME ZONE 'Asia/Kolkata')::date, 'YYYY-MM-DD') AS day,
           COUNT(*)::int AS count
    FROM appointments
    WHERE created_at >= ${startInstant}
    GROUP BY 1
    ORDER BY 1`

  const byDay = new Map(rows.map((row) => [row.day, Number(row.count)]))

  const trend: TrendPoint[] = []
  for (let i = 0; i < days; i++) {
    const day = new Date(Date.parse(`${startIst}T00:00:00Z`) + i * 86_400_000)
      .toISOString()
      .slice(0, 10)
    trend.push({ day, count: byDay.get(day) ?? 0 })
  }
  if (trend.length > 0) {
    trend[trend.length - 1].day = todayIst
  }
  return trend
}

/** Most requested treatments within the window, highest count first. */
export async function getTopTreatments(days: number, limit = 5): Promise<TreatmentCount[]> {
  const { startInstant } = istWindow(days)

  const rows = await prisma.$queryRaw<Array<{ treatment: string; count: number }>>`
    SELECT treatment, COUNT(*)::int AS count
    FROM appointments
    WHERE treatment IS NOT NULL AND created_at >= ${startInstant}
    GROUP BY treatment
    ORDER BY count DESC, treatment ASC
    LIMIT ${limit}`

  return rows.map((row) => ({ treatment: row.treatment, count: Number(row.count) }))
}
