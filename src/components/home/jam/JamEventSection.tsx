import { Link } from '@tanstack/react-router'
import { RiMapPinFill } from '@remixicon/react'
import { BracketPreview } from './BracketPreview'
import { JamCategoryPanel } from './JamCategoryPanel'
import { JamEventLogo } from './JamEventLogo'
import { useInView } from '~/hooks/use-in-view'
import {
  jamBattles,
  jamEventMeta,
  jamQualifiers,
} from '~/lib/jam-event'
import { Button } from '~/components/ui/button'

export function JamEventSection() {
  const { ref, inView } = useInView({ threshold: 0.15 })

  return (
    <section
      id="jam-event"
      ref={ref}
      aria-labelledby="jam-event-heading"
      className="jam-event-section relative scroll-mt-18 overflow-hidden border-t border-primary/20 px-4 py-16 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 jam-event-section-bg"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 id="jam-event-heading" className="sr-only">
            {jamEventMeta.title}
          </h2>
          <JamEventLogo />
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {jamEventMeta.tagline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="font-semibold text-foreground">
              {jamEventMeta.dateLao}
            </span>
            <span className="hidden text-primary md:inline">·</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <RiMapPinFill size={16} className="text-primary" />
              {jamEventMeta.location}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <JamCategoryPanel
            title="National Qualifier"
            subtitle="ສິດເຂົ້າຮອບແຂ່ງງານລະດັບຊາດ"
            categories={jamQualifiers}
            variant="qualifier"
          />
          <JamCategoryPanel
            title="Battle Categories"
            subtitle="ປະຊັນຝີມືບົນເວທີ"
            categories={jamBattles}
            variant="battle"
          />
        </div>

        <BracketPreview active={inView} />

        <div className="flex justify-center">
          <Button
            size="lg"
            className="shadow-xl shadow-primary/30"
            asChild
          >
            <Link to="/register/jam">ສະໝັກແຂ່ງ Fanglao Jam</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
