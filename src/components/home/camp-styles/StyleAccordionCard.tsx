import type { CampStyle } from '~/lib/camp-styles'
import { cn } from '~/lib/utils'

export function StyleAccordionCard({
  style,
  expanded,
  anyExpanded,
  accordionMode,
  flexGrow,
  onHover,
  onSelect,
  className,
}: {
  style: CampStyle
  expanded: boolean
  anyExpanded: boolean
  accordionMode: boolean
  flexGrow?: number
  onHover: () => void
  onSelect: () => void
  className?: string
}) {
  const Icon = style.icon
  const showExpandedContent = accordionMode ? expanded : true
  const showCollapsedTitle = accordionMode ? !(anyExpanded && !expanded) : true

  return (
    <button
      type="button"
      aria-label={`${style.name} — ${style.lao}`}
      aria-expanded={accordionMode ? expanded : undefined}
      style={
        accordionMode && flexGrow !== undefined
          ? { flexGrow, flexBasis: 0, flexShrink: 1 }
          : undefined
      }
      className={cn(
        'style-accordion-card group relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        accordionMode
          ? 'style-accordion-card--flex h-full min-h-[28rem] min-w-0'
          : 'min-h-[17rem] sm:min-h-[19rem]',
        accordionMode && anyExpanded && !expanded && 'style-accordion-card--dimmed',
        className,
      )}
      onMouseEnter={accordionMode ? onHover : undefined}
      onFocus={accordionMode ? onHover : undefined}
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out',
          accordionMode ? 'h-[88%]' : 'h-[55%] sm:h-[58%]',
        )}
      >
        <img
          src={style.silhouetteSrc}
          alt=""
          className={cn(
            'style-accordion-silhouette absolute inset-0 size-full object-contain object-bottom',
            showExpandedContent && accordionMode
              ? 'style-accordion-silhouette--hidden'
              : 'style-accordion-silhouette--visible',
            !accordionMode && 'opacity-90',
          )}
        />

        <img
          src={style.photoSrc}
          alt=""
          className={cn(
            'style-accordion-photo absolute inset-0 size-full object-contain object-bottom',
            showExpandedContent && accordionMode
              ? 'style-accordion-photo--visible'
              : accordionMode
                ? 'style-accordion-photo--hidden'
                : 'style-accordion-photo--visible',
          )}
        />
      </div>

      <div
        aria-hidden
        className={cn(
          'style-accordion-splash pointer-events-none absolute inset-0',
          style.splashClass,
          showExpandedContent && accordionMode
            ? 'style-accordion-splash--active'
            : 'style-accordion-splash--idle',
          !accordionMode && 'style-accordion-splash--subtle',
        )}
      />

      <div
        className={cn(
          'relative z-10 flex h-full flex-col justify-between',
          accordionMode ? 'p-4 md:p-5' : 'p-4 sm:p-5',
        )}
      >
        <div className="flex flex-col gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-background/50 text-primary backdrop-blur-sm sm:size-10">
            <Icon size={20} />
          </span>
          <div
            className={cn(
              'style-accordion-title flex flex-col gap-0.5',
              !showCollapsedTitle && 'style-accordion-title--hidden',
            )}
          >
            <p className="font-heading text-sm font-bold uppercase tracking-wide sm:text-base">
              {style.name}
            </p>
            <p className="text-xs text-muted-foreground sm:text-sm">{style.lao}</p>
          </div>
        </div>

        <div
          className={cn(
            'style-accordion-details flex flex-col gap-1',
            showExpandedContent
              ? 'style-accordion-details--visible'
              : 'style-accordion-details--hidden',
          )}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-primary sm:text-xs">
            {style.tagline}
          </p>
          <p className="line-clamp-2 text-xs text-foreground/90 sm:line-clamp-3">
            {style.description}
          </p>
          <p className="text-xs text-muted-foreground">{style.schedule}</p>
        </div>
      </div>
    </button>
  )
}
