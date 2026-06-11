import {
  RiCalendarFill,
  RiGroupFill,
  RiMapPinFill,
  RiTicketFill,
} from '@remixicon/react'
import { useInView } from '~/hooks/use-in-view'
import { CampCountdown } from './CampCountdown'
import { QuickInfoCard } from './QuickInfoCard'

export function QuickInfoSection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref}
      aria-labelledby="quick-info-heading"
      className="border-t border-border bg-card/30 px-4 py-12 sm:py-16 md:py-20"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8 md:gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h2
            id="quick-info-heading"
            className="font-heading text-xl font-bold uppercase tracking-tight sm:text-2xl md:text-3xl"
          >
            ຂໍ້ມູນສຳຄັນ
          </h2>
          <p className="mx-auto max-w-lg text-xs text-muted-foreground sm:text-sm">
            ວັນທີ · ສະຖານທີ່ · ເປົ້າໝາຍ — ພ້ອມນັບຖອຍຫຼັງສູ່ວັນເປີດ Camp
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <QuickInfoCard icon={RiCalendarFill} title="Camp Dates">
            <p className="font-semibold text-foreground">
              29 June – 17 July 2026
            </p>
            <p>(Mon–Fri)</p>
            <p className="flex items-start gap-1.5 pt-0.5">
              <RiMapPinFill size={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="min-w-0 break-words">
                Fanglao Studio · Vientiane Center 4F
              </span>
            </p>
          </QuickInfoCard>

          <QuickInfoCard icon={RiTicketFill} title="Jam Date">
            <p className="font-semibold text-foreground">18 July 2026</p>
            <p className="flex items-start gap-1.5 pt-0.5">
              <RiMapPinFill size={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="min-w-0 break-words">
                Lao National Circus · Vientiane
              </span>
            </p>
          </QuickInfoCard>

          <QuickInfoCard
            icon={RiGroupFill}
            title="Target"
            className="sm:col-span-2 lg:col-span-1"
          >
            <p className="font-semibold text-foreground">ອາຍຸ 5–35 ປີ</p>
            <p>ສຳລັບ Kids ຫາ Adults</p>
            <p>ແບ່ງກຸ່ມຕາມຄລາສ ແລະລະດັບທີ່ເໝາະສົມ</p>
          </QuickInfoCard>
        </div>

        <CampCountdown active={inView} />
      </div>
    </section>
  )
}
