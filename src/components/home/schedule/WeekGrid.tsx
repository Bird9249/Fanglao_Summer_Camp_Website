import { cn } from '~/lib/utils'
import type { ScheduleDay } from '~/lib/camp-schedule'
import { DayColumn } from './DayColumn'

type WeekGridProps = {
  days: ScheduleDay[]
  direction: 1 | -1
  tabId: string
}

function getGridClass(dayCount: number) {
  if (dayCount <= 2) {
    return 'sm:grid-cols-2 lg:max-w-3xl lg:mx-auto'
  }
  if (dayCount === 3) {
    return 'sm:grid-cols-2 lg:grid-cols-3 lg:max-w-5xl lg:mx-auto'
  }
  return 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
}

export function WeekGrid({ days, direction, tabId }: WeekGridProps) {
  return (
    <div
      key={tabId}
      className={cn(
        'schedule-panel grid gap-4',
        direction >= 0 ? 'schedule-panel--in-right' : 'schedule-panel--in-left',
        getGridClass(days.length),
      )}
      role="tabpanel"
      aria-label="Weekly camp schedule"
    >
      {days.map((day, index) => (
        <DayColumn key={day.isoDate} day={day} dayIndex={index} />
      ))}
    </div>
  )
}
