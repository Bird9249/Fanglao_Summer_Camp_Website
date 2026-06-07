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
          : [
              'style-accordion-card--carousel shrink-0 snap-center',
              'w-[min(76vw,17.5rem)] min-h-[11.5rem]',
              'md:w-[min(46vw,22rem)] md:min-h-[13rem]',
              'lg:w-[min(36vw,24rem)] lg:min-h-[14rem]',
            ],
        accordionMode && anyExpanded && !expanded && 'style-accordion-card--dimmed',
        className,
      )}
      onMouseEnter={accordionMode ? onHover : undefined}
      onFocus={accordionMode ? onHover : undefined}
      onClick={onSelect}
    >
      <div
        className={cn(
          'absolute inset-0',
          accordionMode
            ? 'bg-gradient-to-t from-background via-background/25 to-transparent'
            : 'bg-gradient-to-r from-background via-background/80 to-background/20',
        )}
      />

      <div
        className={cn(
          'absolute transition-[height,width,inset] duration-500 ease-out',
          accordionMode
            ? 'inset-x-0 bottom-0 h-[88%]'
            : 'right-0 top-0 bottom-0 w-[42%] md:w-[44%]',
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
            !accordionMode && 'opacity-95',
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
            !accordionMode && 'scale-105 md:scale-100',
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
          accordionMode
            ? 'p-4 md:p-5'
            : 'w-[58%] max-w-[58%] p-3.5 md:w-[56%] md:max-w-[56%] md:p-4 lg:p-5',
        )}
      >
        <div className="flex flex-col gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-background/55 text-primary backdrop-blur-sm md:size-9 lg:size-10">
            <Icon size={18} className="md:hidden" />
            <Icon size={20} className="hidden md:block" />
          </span>
          <div
            className={cn(
              'style-accordion-title flex flex-col gap-0.5',
              !showCollapsedTitle && 'style-accordion-title--hidden',
            )}
          >
            <p className="font-heading text-[0.8rem] font-bold uppercase leading-tight tracking-wide md:text-sm lg:text-base">
              {style.name}
            </p>
            <p className="text-[0.7rem] text-muted-foreground md:text-xs lg:text-sm">
              {style.lao}
            </p>
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
          <p className="text-[0.62rem] font-semibold uppercase tracking-widest text-primary md:text-[0.68rem] lg:text-xs">
            {style.tagline}
          </p>
          <p className="line-clamp-2 text-[0.68rem] text-foreground/90 md:line-clamp-3 md:text-xs">
            {style.description}
          </p>
          <p className="text-[0.68rem] text-muted-foreground md:text-xs">
            {style.schedule}
          </p>
          {!accordionMode ? (
            <p className="mt-0.5 text-[0.62rem] font-medium text-primary/80 md:text-[0.68rem]">
              ແຕະເພື່ອເບິ່ງວິດີໂອ →
            </p>
          ) : null}
        </div>
      </div>
    </button>
  )
}
