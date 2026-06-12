import * as React from 'react'
import { useInView } from '~/hooks/use-in-view'
import { whyJoinPillars } from '~/lib/why-join-pillars'
import { cn } from '~/lib/utils'
import { WhyJoinCard } from './WhyJoinCard'

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

export function WhyJoinSection() {
  const { ref, inView } = useInView()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const interactive = finePointer && !reducedMotion

  const handleToggle = (id: string) =>
    setExpandedId((current) => (current === id ? null : id))

  return (
    <section
      ref={ref}
      id="why-join"
      aria-labelledby="why-join-heading"
      className="why-join-section scroll-mt-18 relative overflow-hidden border-t border-border px-4 py-12 sm:py-16 md:py-20"
    >
      <div
        aria-hidden
        className="why-join-section-bg pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8 md:gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h2
            id="why-join-heading"
            className="font-heading text-xl font-bold uppercase tracking-tight sm:text-2xl md:text-3xl"
          >
            Why Join Us?
          </h2>
          <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
            ເຂົ້າແຄมป์ນີ້ແລ້ວໄດ້ຫຍັງກັບໄປແດ່? — 3 ເຫດຜົນທີ່ເຮັດໃຫ້ Summer Camp
            ນີ້ຄຸ້ມຄ່າ
          </p>
        </div>

        <div
          className={cn(
            'why-join-grid grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3',
            inView && 'why-join-grid--in',
          )}
        >
          {whyJoinPillars.map((pillar, index) => (
            <WhyJoinCard
              key={pillar.id}
              pillar={pillar}
              index={index}
              expanded={expandedId === pillar.id}
              interactive={interactive}
              onToggle={() => handleToggle(pillar.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
