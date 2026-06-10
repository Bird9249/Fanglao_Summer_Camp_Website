import type { ScheduleSlot } from '~/lib/camp-schedule'
import { cn } from '~/lib/utils'

const glowClassByStyle: Record<string, string> = {
  kids: 'schedule-glow-kids',
  kpop: 'schedule-glow-kpop',
  'street-jazz': 'schedule-glow-street-jazz',
  'hip-hop': 'schedule-glow-hip-hop',
  breaking: 'schedule-glow-breaking',
}

type TimeSlotCardProps = {
  slot: ScheduleSlot
  staggerIndex: number
}

export function TimeSlotCard({ slot, staggerIndex }: TimeSlotCardProps) {
  const glowClass = slot.isSpecial
    ? 'schedule-glow-special'
    : slot.styleId
      ? (glowClassByStyle[slot.styleId] ?? 'schedule-glow-kpop')
      : 'schedule-glow-kpop'

  return (
    <article
      className={cn(
        'schedule-slot-card rounded-lg border border-border/70 bg-card/60 p-3 backdrop-blur-sm',
        glowClass,
        slot.isSpecial && 'schedule-slot-card--special',
      )}
      style={{ animationDelay: `${staggerIndex * 40}ms` }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <time className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
          {slot.time}
        </time>
        {slot.studio ? (
          <span
            className={cn(
              'schedule-studio-badge shrink-0 rounded border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider',
              slot.studio === 1
                ? 'schedule-studio-badge--1 text-chart-5'
                : 'schedule-studio-badge--2 text-primary',
            )}
          >
            Studio {slot.studio}
          </span>
        ) : null}
      </div>

      <p className="text-sm font-semibold leading-snug text-foreground">
        {slot.className}
      </p>

      {slot.isSpecial ? (
        <span className="mt-2 inline-block text-[0.6rem] font-bold uppercase tracking-wider text-destructive">
          Highlight
        </span>
      ) : null}
    </article>
  )
}
