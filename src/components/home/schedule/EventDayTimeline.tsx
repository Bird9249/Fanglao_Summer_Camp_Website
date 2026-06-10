import * as React from 'react'
import { cn } from '~/lib/utils'
import {
  daysUntilEventDay,
  eventDaySlots,
  findActiveEventSlotIndex,
  getCurrentEventMinutes,
  getLaosNow,
  isEventDayLive,
} from '~/lib/camp-schedule'
import { useLiveEventPosition } from '~/hooks/use-live-event-position'

type EventDayTimelineProps = {
  direction: 1 | -1
}

export function EventDayTimeline({ direction }: EventDayTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const slotRefs = React.useRef<(HTMLElement | null)[]>([])
  const { mounted, isLive, trackerTop, activeSlotIndex } = useLiveEventPosition(
    containerRef,
    slotRefs,
  )

  const [daysUntil, setDaysUntil] = React.useState<number | null>(null)
  const [elapsedMinutes, setElapsedMinutes] = React.useState<number | null>(
    null,
  )

  React.useEffect(() => {
    const update = () => {
      const now = getLaosNow()
      setDaysUntil(daysUntilEventDay(now))
      setElapsedMinutes(getCurrentEventMinutes(now))
    }
    update()
    const interval = window.setInterval(update, 45_000)
    return () => window.clearInterval(interval)
  }, [])

  const resolvedActiveIndex =
    activeSlotIndex ??
    (elapsedMinutes !== null ? findActiveEventSlotIndex(elapsedMinutes) : null)

  return (
    <div
      className={cn(
        'schedule-panel mx-auto w-full max-w-2xl',
        direction >= 0 ? 'schedule-panel--in-right' : 'schedule-panel--in-left',
      )}
      role="tabpanel"
      aria-label="Event day schedule"
    >
      {mounted && daysUntil !== null && daysUntil > 0 ? (
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-primary">
          ອີກ {daysUntil} ວັນສູ່ວັນງານ · Lao National Circus
        </p>
      ) : null}

      <div ref={containerRef} className="schedule-event-timeline relative py-2">
        {mounted && isLive && trackerTop !== null ? (
          <div
            className="schedule-live-tracker"
            style={{ top: `${trackerTop}px` }}
            aria-hidden
          >
            <div className="schedule-live-tracker-line" />
            <div className="schedule-live-tracker-dot" />
          </div>
        ) : null}

        <ol className="flex flex-col gap-4">
          {eventDaySlots.map((slot, index) => {
            const isPast =
              mounted &&
              isLive &&
              elapsedMinutes !== null &&
              elapsedMinutes >= slot.endMinutes
            const isCurrent =
              mounted && isLive && resolvedActiveIndex === index

            return (
              <li
                key={slot.activity}
                ref={(node) => {
                  slotRefs.current[index] = node
                }}
                className={cn(
                  'schedule-event-slot rounded-lg border border-border/50 bg-card/55 p-4 backdrop-blur-sm',
                  isPast && 'schedule-event-slot--past',
                  isCurrent && 'schedule-event-slot--live border-primary/40',
                  slot.isSpecial && 'schedule-slot-card--special schedule-glow-special',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <time className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {slot.time}
                  </time>
                  {isCurrent ? (
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-destructive">
                      ● Live Now
                    </span>
                  ) : null}
                  {slot.isSpecial && !isCurrent ? (
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-destructive">
                      Highlight
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                  {slot.activity}
                </p>
              </li>
            )
          })}
        </ol>
      </div>

      <p className="mt-6 text-center text-[0.65rem] text-muted-foreground sm:text-xs">
        Lao National Circus · Vientiane · 18 July 2026
      </p>
    </div>
  )
}
