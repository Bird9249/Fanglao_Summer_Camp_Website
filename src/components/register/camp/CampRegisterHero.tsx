import {
  RiCalendarLine,
  RiMapPinLine,
  RiSparklingLine,
  RiUserLine,
} from '@remixicon/react'
import { campStyles } from '~/lib/camp-styles'
import { CAMP_MAX_AGE, CAMP_MIN_AGE, type CampStyleId } from '~/lib/camp-registration'
import { siteMeta } from '~/components/layout/nav'
const registerSteps = [
  { id: 'profile', label: 'ຂໍ້ມູນສ່ວນຕົວ', icon: RiUserLine },
  { id: 'classes', label: 'ເລືອກຄລາສ', icon: RiSparklingLine },
] as const

export function CampRegisterHero({
  preselectedClassIds = [],
}: {
  preselectedClassIds?: CampStyleId[]
}) {
  const preselectedStyles = campStyles.filter((style) =>
    preselectedClassIds.includes(style.id as CampStyleId),
  )

  return (
    <section
      aria-labelledby="camp-register-hero-heading"
      className="camp-register-hero relative border-b border-primary/20 px-4 py-10 md:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 camp-register-hero-bg"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="rounded-2xl border border-primary/20 bg-card/80 p-5 shadow-[0_0_40px_color-mix(in_oklch,var(--primary)_8%,transparent)] backdrop-blur-sm md:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Summer Dance Camp 2026
              </p>
              <div className="flex flex-col gap-2">
                <h1
                  id="camp-register-hero-heading"
                  className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl"
                >
                  ລົງທະບຽນ Summer Camp
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  ແບບຟອມສຳລັບບຸກຄົນທົ່ວໄປ · ກອກຂໍ້ມູນສ່ວນຕົວ ເລືອກຄລາສ
                  ແລະສົ່ງໃບສະໝັກໃນຂັ້ນຕອນດຽວ
                </p>
              </div>
            </div>

            {preselectedStyles.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  ເລີ່ມຈາກຄລາສ:
                </span>
                {preselectedStyles.map((style) => (
                  <span
                    key={style.id}
                    className="rounded-full border border-primary/30 bg-background/50 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {style.name.replace(' Class', '')}
                  </span>
                ))}
              </div>
            ) : null}

            <ol className="grid gap-2 sm:grid-cols-2">
              {registerSteps.map((step) => {
                const Icon = step.icon

                return (
                  <li
                    key={step.id}
                    className="flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2.5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                      <Icon size={16} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ol>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3">
                <RiCalendarLine
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    ວັນທີ່ Camp
                  </span>
                  <span className="text-sm font-medium">{siteMeta.campDates}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3">
                <RiUserLine size={18} className="mt-0.5 shrink-0 text-primary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    ອາຍຸຜູ້ສະໝັກ
                  </span>
                  <span className="text-sm font-medium">
                    {CAMP_MIN_AGE}–{CAMP_MAX_AGE} ປີ
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3 sm:col-span-1">
                <RiMapPinLine
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    ສະຖານທີ່
                  </span>
                  <span className="text-sm font-medium leading-snug">
                    {siteMeta.campLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
