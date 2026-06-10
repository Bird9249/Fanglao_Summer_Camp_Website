import { findCampStyleForClassName } from '~/lib/camp-styles'

export type ScheduleTabId =
  | 'week1'
  | 'week2'
  | 'week3'
  | 'workshop'
  | 'event-day'

export type ScheduleTab = {
  id: ScheduleTabId
  label: string
  labelLao: string
  dateRange: string
  isEventDay?: boolean
}

export type ScheduleSlot = {
  time: string
  className: string
  studio?: 1 | 2
  styleId?: string
  isSpecial?: boolean
}

export type ScheduleDay = {
  date: string
  isoDate: string
  slots: ScheduleSlot[]
}

export type EventDaySlot = {
  time: string
  activity: string
  isSpecial?: boolean
  /** minutes from 10:00 on 18 Jul 2026 (Laos time) */
  startMinutes: number
  /** minutes from 10:00 on 18 Jul 2026 (Laos time) */
  endMinutes: number
}

export const scheduleTabs: ScheduleTab[] = [
  {
    id: 'week1',
    label: 'Week 1: Explore',
    labelLao: 'ສຳຫຼວດພື້ນຖານ',
    dateRange: '29 Jun – 3 Jul',
  },
  {
    id: 'week2',
    label: 'Week 2: Develop',
    labelLao: 'ພັດທະນາທັກສະ',
    dateRange: '6 – 10 Jul',
  },
  {
    id: 'week3',
    label: 'Week 3: Production',
    labelLao: 'ຮອບຊ້ອມແລະສະແດງ',
    dateRange: '13 – 15 Jul',
  },
  {
    id: 'workshop',
    label: '16–17: Workshop',
    labelLao: 'ເວິກຊັອບສາກົນ',
    dateRange: '16 – 17 Jul',
  },
  {
    id: 'event-day',
    label: '18 Jul: Event Day',
    labelLao: 'ວັນງານໃຫຍ່',
    dateRange: '18 Jul 2026',
    isEventDay: true,
  },
]

function resolveStyleId(className: string): string | undefined {
  const style = findCampStyleForClassName(className)
  if (style) return style.id

  const lower = className.toLowerCase()
  if (lower.includes('kid')) return 'kids'
  if (lower.includes('k-pop') || lower.includes('kpop')) return 'kpop'
  if (lower.includes('street jazz') || lower.includes('jazz')) return 'street-jazz'
  if (
    lower.includes('hiphop') ||
    lower.includes('hip-hop') ||
    lower.includes('hip hop')
  ) {
    return 'hip-hop'
  }
  if (lower.includes('breaking') || lower.includes('bboy')) return 'breaking'
  return undefined
}

function enrichSlot(
  slot: Omit<ScheduleSlot, 'styleId'>,
): ScheduleSlot {
  return {
    ...slot,
    styleId: resolveStyleId(slot.className),
  }
}

function enrichSlots(slots: Omit<ScheduleSlot, 'styleId'>[]): ScheduleSlot[] {
  return slots.map(enrichSlot)
}

function standardCampDaySlots(): Omit<ScheduleSlot, 'styleId'>[] {
  return [
    { time: '13:00 – 14:30', className: 'Kid Class', studio: 1 },
    { time: '13:00 – 14:30', className: 'Hiphop', studio: 2 },
    { time: '14:45 – 16:15', className: 'K-pop', studio: 1 },
    { time: '14:45 – 16:15', className: 'Breaking', studio: 2 },
    { time: '16:30 – 18:00', className: 'Street Jazz', studio: 1 },
  ]
}

function productionDaySlots(): Omit<ScheduleSlot, 'styleId'>[] {
  return [
    { time: '13:00 – 14:30', className: 'Kid Class Rehearsal', studio: 1 },
    { time: '13:00 – 14:30', className: 'Hiphop Rehearsal', studio: 2 },
    { time: '14:45 – 16:15', className: 'K-pop Rehearsal', studio: 1 },
    { time: '14:45 – 16:15', className: 'Breaking Rehearsal', studio: 2 },
    { time: '16:30 – 18:00', className: 'Street Jazz Rehearsal', studio: 1 },
  ]
}

function week2FridaySlots(): Omit<ScheduleSlot, 'styleId'>[] {
  return [
    { time: '13:00 – 14:30', className: 'Kid Class', studio: 1 },
    {
      time: '13:00 – 14:30',
      className: 'Hiphop Activity',
      studio: 2,
      isSpecial: true,
    },
    {
      time: '14:45 – 16:15',
      className: 'Random Play Dance',
      studio: 1,
      isSpecial: true,
    },
    {
      time: '14:45 – 16:15',
      className: 'Breaking Activity',
      studio: 2,
      isSpecial: true,
    },
    { time: '16:30 – 18:00', className: 'Street Jazz', studio: 1 },
  ]
}

function makeDay(
  date: string,
  isoDate: string,
  slots: Omit<ScheduleSlot, 'styleId'>[],
): ScheduleDay {
  return { date, isoDate, slots: enrichSlots(slots) }
}

const week1Days: ScheduleDay[] = [
  makeDay('Mon, 29 Jun', '2026-06-29', standardCampDaySlots()),
  makeDay('Tue, 30 Jun', '2026-06-30', standardCampDaySlots()),
  makeDay('Wed, 1 Jul', '2026-07-01', standardCampDaySlots()),
  makeDay('Thu, 2 Jul', '2026-07-02', standardCampDaySlots()),
  makeDay('Fri, 3 Jul', '2026-07-03', standardCampDaySlots()),
]

const week2Days: ScheduleDay[] = [
  makeDay('Mon, 6 Jul', '2026-07-06', standardCampDaySlots()),
  makeDay('Tue, 7 Jul', '2026-07-07', standardCampDaySlots()),
  makeDay('Wed, 8 Jul', '2026-07-08', standardCampDaySlots()),
  makeDay('Thu, 9 Jul', '2026-07-09', standardCampDaySlots()),
  makeDay('Fri, 10 Jul', '2026-07-10', week2FridaySlots()),
]

const week3Days: ScheduleDay[] = [
  makeDay('Mon, 13 Jul', '2026-07-13', productionDaySlots()),
  makeDay('Tue, 14 Jul', '2026-07-14', productionDaySlots()),
  makeDay('Wed, 15 Jul', '2026-07-15', productionDaySlots()),
]

const workshopDays: ScheduleDay[] = [
  makeDay('Thu, 16 Jul', '2026-07-16', [
    {
      time: '13:00 – 14:30',
      className: 'International Hiphop Workshop',
      studio: 1,
      isSpecial: true,
    },
    {
      time: '14:45 – 16:15',
      className: 'International Hiphop Workshop',
      studio: 1,
      isSpecial: true,
    },
    {
      time: '16:30 – 18:00',
      className: 'Q&A / Meet Artist',
      studio: 1,
      isSpecial: true,
    },
  ]),
  makeDay('Fri, 17 Jul', '2026-07-17', [
    {
      time: '13:00 – 14:30',
      className: 'International Workshop',
      studio: 1,
      isSpecial: true,
    },
    {
      time: '14:45 – 16:15',
      className: 'International Workshop',
      studio: 1,
      isSpecial: true,
    },
    {
      time: '16:30 – 18:00',
      className: 'Closing Jam & Photo Session',
      studio: 1,
      isSpecial: true,
    },
  ]),
]

export const scheduleByTab: Record<ScheduleTabId, ScheduleDay[]> = {
  week1: week1Days,
  week2: week2Days,
  week3: week3Days,
  workshop: workshopDays,
  'event-day': [],
}

export const eventDaySlots: EventDaySlot[] = [
  {
    time: '10:00 – 12:00',
    activity: 'Registration & Sound Check',
    startMinutes: 0,
    endMinutes: 120,
  },
  {
    time: '13:00 – 14:30',
    activity: 'Opening Ceremony',
    startMinutes: 180,
    endMinutes: 270,
  },
  {
    time: '14:30 – 15:30',
    activity: 'Summer Camp Student Showcase',
    isSpecial: true,
    startMinutes: 270,
    endMinutes: 330,
  },
  {
    time: '15:30 – 16:00',
    activity: 'International Guest Performance',
    isSpecial: true,
    startMinutes: 330,
    endMinutes: 360,
  },
  {
    time: '16:00 – 16:30',
    activity: 'Dance Battle / Random Play',
    isSpecial: true,
    startMinutes: 360,
    endMinutes: 390,
  },
  {
    time: '16:30 – 17:00',
    activity: 'Awards & Certificate Ceremony',
    startMinutes: 390,
    endMinutes: 420,
  },
  {
    time: '17:00 – 18:00',
    activity: 'Photo Session & Closing Celebration',
    startMinutes: 420,
    endMinutes: 480,
  },
]

/** Event Day window: 10:00–18:00 on 18 Jul 2026, Asia/Vientiane (UTC+7) */
export const EVENT_DAY_ISO = '2026-07-18'
export const EVENT_DAY_START_MINUTES = 10 * 60
export const EVENT_DAY_END_MINUTES = 18 * 60

export function getLaosNow(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Vientiane' }),
  )
}

export function getLaosDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Vientiane',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((p) => p.type === 'year')?.value ?? '2026'
  const month = parts.find((p) => p.type === 'month')?.value ?? '01'
  const day = parts.find((p) => p.type === 'day')?.value ?? '01'
  return `${year}-${month}-${day}`
}

export function getLaosMinutesOfDay(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Vientiane',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return hour * 60 + minute
}

export function daysUntilEventDay(from: Date = getLaosNow()): number | null {
  const todayKey = getLaosDateKey(from)
  if (todayKey >= EVENT_DAY_ISO) return null

  const today = new Date(`${todayKey}T12:00:00`)
  const event = new Date(`${EVENT_DAY_ISO}T12:00:00`)
  const diffMs = event.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function isEventDayLive(now: Date = getLaosNow()): boolean {
  if (getLaosDateKey(now) !== EVENT_DAY_ISO) return false
  const minutes = getLaosMinutesOfDay(now)
  return minutes >= EVENT_DAY_START_MINUTES && minutes < EVENT_DAY_END_MINUTES
}

export function getCurrentEventMinutes(now: Date = getLaosNow()): number | null {
  if (!isEventDayLive(now)) return null
  return getLaosMinutesOfDay(now) - EVENT_DAY_START_MINUTES
}

export function findActiveEventSlotIndex(
  elapsedMinutes: number,
): number | null {
  const index = eventDaySlots.findIndex(
    (slot) =>
      elapsedMinutes >= slot.startMinutes && elapsedMinutes < slot.endMinutes,
  )
  return index >= 0 ? index : null
}
