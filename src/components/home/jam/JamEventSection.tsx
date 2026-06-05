import { Link } from '@tanstack/react-router'
import { RiMapPinFill, RiSwordFill } from '@remixicon/react'
import { BracketPreview } from './BracketPreview'
import { JamCategoryPanel } from './JamCategoryPanel'
import { useInView } from '~/hooks/use-in-view'
import {
  jamBattles,
  jamEventMeta,
  jamQualifiers,
} from '~/lib/jam-event'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export function JamEventSection() {
  const { ref, inView } = useInView({ threshold: 0.15 })

  return (
    <section
      id="jam-event"
      ref={ref}
      aria-labelledby="jam-event-heading"
      className={cn(
        'jam-theme jam-event-section relative scroll-mt-18 overflow-hidden border-t px-4 py-16 md:py-20',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 jam-event-section-bg"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="jam-eyebrow flex items-center gap-2">
            <RiSwordFill size={18} />
            <p className="text-xs font-bold uppercase tracking-[0.25em]">
              Battle Arena · Vol. 1
            </p>
            <RiSwordFill size={18} />
          </div>
          <h2
            id="jam-event-heading"
            className="jam-title font-heading text-3xl font-black uppercase tracking-tight md:text-4xl"
          >
            {jamEventMeta.title}
          </h2>
          <p className="jam-tagline max-w-xl text-sm md:text-base">
            {jamEventMeta.tagline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="jam-meta-strong font-semibold">
              {jamEventMeta.dateLao}
            </span>
            <span className="hidden jam-meta-icon md:inline">·</span>
            <span className="jam-meta-muted flex items-center gap-1.5">
              <RiMapPinFill size={16} className="jam-meta-icon" />
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
          <Button size="lg" className="jam-btn-cta h-12 px-8" asChild>
            <Link to="/register/jam">ສະໝັກແຂ່ງ Fanglao Jam</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
