import * as React from 'react'
import { cn } from '~/lib/utils'
import type { ScheduleDay } from '~/lib/camp-schedule'
import { getLaosDateKey, getLaosNow } from '~/lib/camp-schedule'
import { TimeSlotCard } from './TimeSlotCard'

type DayColumnProps = {
  day: ScheduleDay
  dayIndex: number
  animate?: boolean
}

export function DayColumn({ day, dayIndex, animate = true }: DayColumnProps) {
  const columnRef = React.useRef<HTMLDivElement>(null)
  const [isToday, setIsToday] = React.useState(false)

  React.useEffect(() => {
    setIsToday(getLaosDateKey(getLaosNow()) === day.isoDate)
  }, [day.isoDate])

  React.useEffect(() => {
    if (!isToday || !columnRef.current) return
    columnRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [isToday])

  return (
    <div
      ref={columnRef}
      className={cn(
        'schedule-day-column flex min-w-0 flex-col gap-3 rounded-xl border border-border/50 bg-background/20 p-3 sm:p-4',
        animate && 'schedule-day-column--animate',
        isToday && 'schedule-day-column--today',
      )}
    >
      <header className="border-b border-border/40 pb-2">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wide text-foreground sm:text-sm">
          {day.date}
        </h3>
        {isToday ? (
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
            Today
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-2.5">
        {day.slots.map((slot, slotIndex) => (
          <TimeSlotCard
            key={`${day.isoDate}-${slot.time}-${slot.studio ?? 'event'}-${slot.className}`}
            slot={slot}
            staggerIndex={dayIndex * 3 + slotIndex}
          />
        ))}
      </div>
    </div>
  )
}
