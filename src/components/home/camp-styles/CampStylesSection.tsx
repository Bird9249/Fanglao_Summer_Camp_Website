import * as React from 'react'
import { campStyles, type CampStyle } from '~/lib/camp-styles'
import { cn } from '~/lib/utils'
import { StyleAccordionCard } from './StyleAccordionCard'
import { StylePreviewDialog } from './StylePreviewDialog'

const CAROUSEL_LOOP_ITEMS = [...campStyles, ...campStyles]
const AUTO_SCROLL_SPEED = 0.32
const AUTO_RESUME_MS = 2800

function getFlexGrow(styleId: string, hoveredId: string | null) {
  if (hoveredId === null) return 1
  return hoveredId === styleId ? 3 : 0.65
}

function useAccordionMode() {
  const [accordionMode, setAccordionMode] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)')
    const update = () => setAccordionMode(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return accordionMode
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return prefersReducedMotion
}

function useAutoScrollCarousel(
  enabled: boolean,
  pausedByDialog: boolean,
) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const loopWidthRef = React.useRef(0)
  const userPausedRef = React.useRef(false)
  const pausedByDialogRef = React.useRef(pausedByDialog)
  const autoScrollingRef = React.useRef(false)
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  pausedByDialogRef.current = pausedByDialog

  const clearResumeTimer = React.useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const measureLoopWidth = React.useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const loopWidth = track.scrollWidth / 2
    loopWidthRef.current = loopWidth
    return loopWidth
  }, [])

  const normalizeScroll = React.useCallback(() => {
    const track = trackRef.current
    const loopWidth = loopWidthRef.current
    if (!track || loopWidth <= 0) return

    while (track.scrollLeft >= loopWidth) {
      track.scrollLeft -= loopWidth
    }
    while (track.scrollLeft < 0) {
      track.scrollLeft += loopWidth
    }
  }, [])

  const pauseUserControl = React.useCallback(
    (delayMs = AUTO_RESUME_MS) => {
      userPausedRef.current = true
      clearResumeTimer()
      resumeTimerRef.current = setTimeout(() => {
        userPausedRef.current = false
      }, delayMs)
    },
    [clearResumeTimer],
  )

  React.useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || !enabled) return

    measureLoopWidth()
    const observer = new ResizeObserver(measureLoopWidth)
    observer.observe(track)
    return () => observer.disconnect()
  }, [enabled, measureLoopWidth])

  React.useEffect(() => {
    if (!enabled) return

    let rafId = 0

    const tick = () => {
      const track = trackRef.current
      if (!track) {
        rafId = requestAnimationFrame(tick)
        return
      }

      if (loopWidthRef.current <= 0) {
        measureLoopWidth()
      }

      const loopWidth = loopWidthRef.current
      const canAutoScroll =
        loopWidth > 0 &&
        !pausedByDialogRef.current &&
        !userPausedRef.current

      if (canAutoScroll) {
        autoScrollingRef.current = true
        track.scrollLeft += AUTO_SCROLL_SPEED
        normalizeScroll()
        autoScrollingRef.current = false
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [enabled, measureLoopWidth, normalizeScroll])

  React.useEffect(() => clearResumeTimer, [clearResumeTimer])

  const handleScroll = React.useCallback(() => {
    if (autoScrollingRef.current) return
    normalizeScroll()
  }, [normalizeScroll])

  const handlePointerDown = React.useCallback(() => {
    pauseUserControl()
  }, [pauseUserControl])

  const handleTouchStart = React.useCallback(() => {
    userPausedRef.current = true
    clearResumeTimer()
  }, [clearResumeTimer])

  const handleTouchEnd = React.useCallback(() => {
    pauseUserControl()
  }, [pauseUserControl])

  const handleWheel = React.useCallback(() => {
    pauseUserControl()
  }, [pauseUserControl])

  return {
    trackRef,
    handleScroll,
    handlePointerDown,
    handleTouchStart,
    handleTouchEnd,
    handleWheel,
  }
}

export function CampStylesSection() {
  const accordionMode = useAccordionMode()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = React.useState<CampStyle | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const useAutoCarousel = !accordionMode && !prefersReducedMotion
  const carouselPaused = dialogOpen

  const {
    trackRef,
    handleScroll,
    handlePointerDown,
    handleTouchStart,
    handleTouchEnd,
    handleWheel,
  } = useAutoScrollCarousel(useAutoCarousel, carouselPaused)

  const handleHover = (id: string) => {
    if (accordionMode) setHoveredId(id)
  }

  const handleSelect = (style: CampStyle) => {
    setSelectedStyle(style)
    setDialogOpen(true)
  }

  const renderCard = (style: CampStyle, key: string) => (
    <StyleAccordionCard
      key={key}
      style={style}
      expanded={hoveredId === style.id}
      anyExpanded={hoveredId !== null}
      accordionMode={accordionMode}
      flexGrow={accordionMode ? getFlexGrow(style.id, hoveredId) : undefined}
      onHover={() => handleHover(style.id)}
      onSelect={() => handleSelect(style)}
    />
  )

  const carouselItems = useAutoCarousel ? CAROUSEL_LOOP_ITEMS : campStyles

  return (
    <section
      id="camp-styles"
      aria-labelledby="camp-styles-heading"
      className="scroll-mt-18 border-t border-border px-4 py-12 sm:py-16 md:py-20"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8 md:gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h2
            id="camp-styles-heading"
            className="font-heading text-xl font-bold uppercase tracking-tight sm:text-2xl md:text-3xl"
          >
            5 Styles
          </h2>
          <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Kids · K-Pop · Street Jazz · Hip-Hop · Breaking —{' '}
            {accordionMode
              ? 'ຊີ້ເພື່ອເບິ່ງຕົວຢ່າງ ແລະຕາຕະລາງເວລາ'
              : useAutoCarousel
                ? 'ເລື່ອນອັດຕະໂນມັດ · ປັດເອງເພື່ອເບິ່ງໄວຂຶ້ນ · ແຕະເພື່ອເບິ່ງວິດີໂອ'
                : 'ເລື່ອນຊ້າຍ-ຂວາເພື່ອເບິ່ງທຸກສไตล์ · ແຕະເພື່ອເບິ່ງວິດີໂອ'}
          </p>
        </div>

        {accordionMode ? (
          <div
            className="style-accordion-track flex gap-3"
            onMouseLeave={() => setHoveredId(null)}
          >
            {campStyles.map((style) => renderCard(style, style.id))}
          </div>
        ) : (
          <div
            className={cn(
              'style-styles-carousel-viewport -mx-4 md:-mx-6',
              useAutoCarousel && 'style-styles-carousel-viewport--auto',
            )}
          >
            <div
              ref={trackRef}
              className={cn(
                'style-styles-mobile-track flex gap-3 overflow-x-auto px-4 pb-1',
                'md:gap-4 md:px-6',
                useAutoCarousel && 'style-styles-carousel-track',
              )}
              onScroll={useAutoCarousel ? handleScroll : undefined}
              onPointerDown={useAutoCarousel ? handlePointerDown : undefined}
              onTouchStart={useAutoCarousel ? handleTouchStart : undefined}
              onTouchEnd={useAutoCarousel ? handleTouchEnd : undefined}
              onTouchCancel={useAutoCarousel ? handleTouchEnd : undefined}
              onWheel={useAutoCarousel ? handleWheel : undefined}
            >
              {carouselItems.map((style, index) =>
                renderCard(
                  style,
                  useAutoCarousel ? `${style.id}-${index}` : style.id,
                ),
              )}
            </div>
          </div>
        )}

        {!accordionMode ? (
          <p className="text-center text-[0.65rem] text-muted-foreground md:text-xs">
            {useAutoCarousel
              ? 'ປັດຊ້າຍ-ຂວາເພື່ອເບິ່ງໄວ · ປ່ອຍມືແລ້ວຈະເລື່ອນຊ້າໆອັດຕະໂນມັດອີກຄັ້ງ'
              : '← ເລື່ອນເພື່ອເບິ່ງຄລາສອື່ນ →'}
          </p>
        ) : null}
      </div>

      <StylePreviewDialog
        style={selectedStyle}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}
