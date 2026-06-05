import { Link } from '@tanstack/react-router'
import {
  RiCalendarLine,
  RiLockFill,
  RiMapPinLine,
  RiSwordFill,
} from '@remixicon/react'
import { NavSectionLink } from '~/components/layout/NavSectionLink'
import { siteMeta } from '~/components/layout/nav'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  jamBattles,
  jamEventMeta,
  jamQualifiers,
} from '~/lib/jam-event'

export function JamRegisterClosed() {
  return (
    <div className="jam-theme flex min-h-full flex-col">
      <section
        aria-labelledby="jam-register-hero-heading"
        className="relative border-b border-[color-mix(in_srgb,#D31F26_35%,transparent)] px-4 py-10 md:py-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 jam-event-section-bg"
        />

        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6">
          <div className="jam-card rounded-2xl border p-5 backdrop-blur-sm md:p-7">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="jam-eyebrow flex items-center gap-2">
                <RiSwordFill size={16} />
                <p className="text-xs font-bold uppercase tracking-[0.25em]">
                  Battle Arena · Vol. 1
                </p>
                <RiSwordFill size={16} />
              </div>

              <h1
                id="jam-register-hero-heading"
                className="jam-title font-heading text-2xl font-black uppercase tracking-tight md:text-3xl"
              >
                ລົງທະບຽນ Fanglao Jam
              </h1>

              <p className="jam-tagline max-w-xl text-sm md:text-base">
                ສຳລັບຜູ້ເຂົ້າແຂ່ງຂັນ qualifier ແລະ battle categories
              </p>

              <div className="grid w-full gap-3 sm:grid-cols-2">
                <div className="jam-info-tile flex items-start gap-2.5 rounded-xl border px-3 py-3 text-left">
                  <RiCalendarLine
                    size={18}
                    className="jam-meta-icon mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="jam-tagline text-xs font-semibold uppercase tracking-wide">
                      ວັນທີ່ແຂ່ງຂັນ
                    </span>
                    <span className="jam-meta-strong text-sm font-medium">
                      {jamEventMeta.dateLao}
                    </span>
                  </div>
                </div>

                <div className="jam-info-tile flex items-start gap-2.5 rounded-xl border px-3 py-3 text-left">
                  <RiMapPinLine
                    size={18}
                    className="jam-meta-icon mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="jam-tagline text-xs font-semibold uppercase tracking-wide">
                      ສະຖານທີ່
                    </span>
                    <span className="jam-meta-strong text-sm font-medium leading-snug">
                      {siteMeta.jamLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-10">
        <Card className="jam-card border bg-transparent shadow-none">
          <CardHeader className="items-center text-center">
            <div className="jam-card-icon mb-2 flex size-14 items-center justify-center rounded-full border">
              <RiLockFill size={28} />
            </div>
            <CardTitle className="jam-title font-heading text-xl uppercase md:text-2xl">
              ຍັງບໍ່ເປີດຮັບລົງທະບຽນ
            </CardTitle>
            <CardDescription className="jam-tagline max-w-lg text-base">
              ການລົງທະບຽນ Fanglao Jam ຈະເປີດໃນໄວໆນີ້ — ຕິດຕາມຂ່າວສານໃນໜ້າຫຼັກ
              ຫຼືຊ່ອງທາງຕິດຕໍ່ຂອງ Fanglao Studio
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-[color-mix(in_srgb,#D31F26_25%,transparent)] bg-[color-mix(in_srgb,#000_45%,transparent)] p-4">
              <p className="jam-eyebrow mb-3 text-xs font-semibold uppercase tracking-wide">
                ໝວດໝູ່ທີ່ຈະເປີດໃຫ້ສະໝັກ
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="jam-tagline text-xs font-medium uppercase tracking-wide">
                    Qualifiers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {jamQualifiers.map((category) => (
                      <span
                        key={category.id}
                        className="jam-chip--qualifier rounded-full border px-3 py-1 text-xs font-medium text-white"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="jam-tagline text-xs font-medium uppercase tracking-wide">
                    Battles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {jamBattles.map((category) => (
                      <span
                        key={category.id}
                        className="jam-chip--battle rounded-full border px-3 py-1 text-xs font-medium text-white"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ul className="jam-tagline flex list-disc flex-col gap-1.5 pl-5 text-sm">
              <li>ຊື່–ນາມສະກຸນ / ຊື່ທີມ (solo ຫຼື duo)</li>
              <li>ເລືອກໝວດໝູ່ແຂ່ງຂັນ</li>
              <li>ຂໍ້ມູນຕິດຕໍ່</li>
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <NavSectionLink
                sectionId="jam-event"
                label="ເບິ່ງລາຍລະອຽດ Fanglao Jam"
                className="jam-btn-outline inline-flex h-10 flex-1 items-center justify-center rounded-lg border px-4 text-sm font-semibold uppercase tracking-wide transition-colors"
                activeClassName="text-[#D31F26]"
              />
              <Button size="lg" className="jam-btn-outline flex-1" asChild>
                <Link to="/register/camp">ລົງທະບຽນ Summer Camp</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
