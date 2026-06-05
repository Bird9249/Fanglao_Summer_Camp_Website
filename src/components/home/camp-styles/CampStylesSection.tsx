import * as React from 'react'
import { campStyles, type CampStyle } from '~/lib/camp-styles'
import { cn } from '~/lib/utils'
import { StyleAccordionCard } from './StyleAccordionCard'
import { StylePreviewDialog } from './StylePreviewDialog'

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

export function CampStylesSection() {
  const accordionMode = useAccordionMode()
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = React.useState<CampStyle | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleHover = (id: string) => {
    if (accordionMode) setHoveredId(id)
  }

  const handleSelect = (style: CampStyle) => {
    setSelectedStyle(style)
    setDialogOpen(true)
  }

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
            5 Camp Styles
          </h2>
          <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Kids · K-Pop · Street Jazz · Hip-Hop · Breaking —{' '}
            {accordionMode
              ? 'ຊີ້ເພື່ອເບິ່ງຕົວຢ່າງ ແລະຕາຕະລາງເວລາ'
              : 'แตะการ์ดເພື່ອເບິ່ງວິດີໂອຕົວຢ່າງ ແລະຕາຕະລາງເວລາ'}
          </p>
        </div>

        <div
          className={cn(
            accordionMode
              ? 'style-accordion-track flex gap-3'
              : 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3',
          )}
          onMouseLeave={() => setHoveredId(null)}
        >
          {campStyles.map((style, index) => (
            <StyleAccordionCard
              key={style.id}
              style={style}
              expanded={hoveredId === style.id}
              anyExpanded={hoveredId !== null}
              accordionMode={accordionMode}
              flexGrow={accordionMode ? getFlexGrow(style.id, hoveredId) : undefined}
              onHover={() => handleHover(style.id)}
              onSelect={() => handleSelect(style)}
              className={
                !accordionMode && index === campStyles.length - 1
                  ? 'sm:col-span-2 lg:col-span-1'
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <StylePreviewDialog
        style={selectedStyle}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}
