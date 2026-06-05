/** Summer Camp opening — 29 June 2026, 08:00 Asia/Vientiane (UTC+7) */
export const CAMP_OPEN_DATE = new Date('2026-06-29T08:00:00+07:00')

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  totalMs: number
}

export function getCountdownParts(target: Date, now = new Date()): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime())
  const totalMinutes = Math.floor(totalMs / 60_000)

  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
    totalMs,
  }
}
