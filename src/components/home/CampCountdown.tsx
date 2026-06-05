import { RiTimerFlashFill } from '@remixicon/react'
import { useAnimatedCountdown } from '~/hooks/use-animated-countdown'
import { cn } from '~/lib/utils'

function CountdownUnit({
  label,
  value,
  active,
}: {
  label: string
  value: number
  active: boolean
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:gap-2">
      <div
        className={cn(
          'countdown-digit flex w-full max-w-[5.5rem] items-center justify-center rounded-lg border border-primary/30 bg-background/80 px-2 py-2.5 sm:max-w-none sm:min-w-22 sm:rounded-xl sm:px-4 sm:py-3 md:min-w-28 md:py-4',
          active && 'countdown-digit--active',
        )}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
        {label}
      </span>
    </div>
  )
}

export function CampCountdown({ active }: { active: boolean }) {
  const { display, campStarted } = useAnimatedCountdown(active)

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-primary/25 bg-card/70 p-4 backdrop-blur-sm sm:gap-5 sm:rounded-2xl sm:p-6 md:p-8">
      <div className="flex items-center justify-center gap-2 px-1 text-center text-primary">
        <RiTimerFlashFill size={18} className="shrink-0 sm:size-5" />
        <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.18em]">
          {campStarted ? 'Summer Camp ເລີ່ມແລ້ວ!' : 'ນັບຖອຍຫຼັງສູ່ວັນເປີດ Camp'}
        </p>
      </div>

      {campStarted ? (
        <p className="text-center text-base font-semibold text-foreground sm:text-lg">
          29 ມິ.ຖ. 2026 — ພົບກັນທີ່ Fanglao Studio
        </p>
      ) : (
        <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 self-center sm:max-w-none sm:flex sm:justify-center sm:gap-3 md:gap-6">
          <CountdownUnit label="Days" value={display.days} active={active} />
          <span className="countdown-separator self-center pb-5 text-2xl font-bold text-primary sm:pb-6 sm:text-3xl md:text-5xl">
            :
          </span>
          <CountdownUnit label="Hours" value={display.hours} active={active} />
          <span className="countdown-separator self-center pb-5 text-2xl font-bold text-primary sm:pb-6 sm:text-3xl md:text-5xl">
            :
          </span>
          <CountdownUnit label="Minutes" value={display.minutes} active={active} />
        </div>
      )}

      <p className="text-center text-[0.65rem] text-muted-foreground sm:text-xs">
        ເປົ້າໝາຍ · 29 June 2026 · 08:00 (Asia/Vientiane)
      </p>
    </div>
  )
}
