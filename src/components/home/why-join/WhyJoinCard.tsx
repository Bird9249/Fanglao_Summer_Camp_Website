import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react'
import { useTilt } from '~/hooks/use-tilt'
import type { WhyJoinPillar } from '~/lib/why-join-pillars'
import { cn } from '~/lib/utils'

const themeClass: Record<WhyJoinPillar['theme'], string> = {
  gold: 'why-join-card--gold',
  crimson: 'why-join-card--crimson',
  'neon-violet': 'why-join-card--neon-violet',
}

export function WhyJoinCard({
  pillar,
  index,
  expanded,
  interactive,
  onToggle,
}: {
  pillar: WhyJoinPillar
  index: number
  expanded: boolean
  interactive: boolean
  onToggle: () => void
}) {
  const Icon = pillar.icon
  const { ref, tiltProps } = useTilt<HTMLButtonElement>(interactive)
  const bulletsId = `why-join-bullets-${pillar.id}`

  return (
    <div
      className="why-join-card-shell"
      style={{ '--stagger-delay': `${index * 0.2}s` } as React.CSSProperties}
    >
      <button
        ref={ref}
        type="button"
        aria-expanded={expanded}
        aria-controls={bulletsId}
        onClick={onToggle}
        className={cn(
          'why-join-card group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 text-left outline-none backdrop-blur-sm md:p-6 focus-visible:ring-3 focus-visible:ring-ring/50',
          themeClass[pillar.theme],
        )}
        {...tiltProps}
      >
        <span aria-hidden className="why-join-splash pointer-events-none absolute inset-0" />

        <div className="relative z-10 flex items-start gap-3">
          <span className="why-join-icon flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background/55 md:size-12">
            <Icon size={24} />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
            <span className="font-heading text-base font-bold uppercase leading-tight tracking-tight md:text-lg">
              {pillar.title}
            </span>
            <span className="text-xs text-muted-foreground md:text-sm">
              {pillar.titleLao}
            </span>
          </span>
          <RiArrowDownSLine
            aria-hidden
            size={22}
            className={cn(
              'why-join-chevron ml-auto mt-1 shrink-0 text-muted-foreground transition-transform duration-300 md:hidden',
              expanded && 'rotate-180',
            )}
          />
        </div>

        <p className="relative z-10 text-sm leading-relaxed text-foreground/85">
          {pillar.summary}
        </p>

        <div
          id={bulletsId}
          data-expanded={expanded}
          className="why-join-bullets relative z-10"
        >
          <ul className="why-join-bullets-inner flex flex-col gap-2 pt-1">
            {pillar.bullets.map((bullet, i) => (
              <li
                key={bullet}
                className="why-join-bullet flex items-start gap-2 text-sm leading-snug text-foreground/90"
                style={{ '--bullet-i': i } as React.CSSProperties}
              >
                <RiCheckLine
                  aria-hidden
                  size={18}
                  className="why-join-check mt-0.5 shrink-0"
                />
                <span className="font-medium">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </button>
    </div>
  )
}
