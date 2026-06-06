import { Link } from '@tanstack/react-router'
import {
  RiCalendarLine,
  RiLockLine,
  RiMapPinLine,
} from '@remixicon/react'
import { JamLogo } from '~/components/brand/JamLogo'
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
    <div className="flex min-h-full flex-col">
      <section
        aria-labelledby="jam-register-hero-heading"
        className="relative border-b border-primary/20 px-4 py-10 md:py-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 jam-event-section-bg opacity-80"
        />

        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6">
          <div className="rounded-2xl border border-primary/20 bg-card/80 p-5 shadow-[0_0_40px_color-mix(in_oklch,var(--primary)_8%,transparent)] backdrop-blur-sm md:p-7">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 id="jam-register-hero-heading" className="sr-only">
                ລົງທະບຽນ Fanglao Jam
              </h1>
              <JamLogo size="register" />

              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                ສຳລັບຜູ້ເຂົ້າແຂ່ງຂັນ qualifier ແລະ battle categories
              </p>

              <div className="grid w-full gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3 text-left">
                  <RiCalendarLine
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      ວັນທີ່ແຂ່ງຂັນ
                    </span>
                    <span className="text-sm font-medium">
                      {jamEventMeta.dateLao}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3 text-left">
                  <RiMapPinLine
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      ສະຖານທີ່
                    </span>
                    <span className="text-sm font-medium leading-snug">
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
        <Card className="border-primary/25 bg-card/80">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <RiLockLine size={30} />
            </div>
            <CardTitle className="font-heading text-xl uppercase md:text-2xl">
              ຍັງບໍ່ເປີດຮັບລົງທະບຽນ
            </CardTitle>
            <CardDescription className="max-w-lg text-base">
              ການລົງທະບຽນ Fanglao Jam ຈະເປີດໃນໄວໆນີ້ — ຕິດຕາມຂ່າວສານໃນໜ້າຫຼັກ
              ຫຼືຊ່ອງທາງຕິດຕໍ່ຂອງ Fanglao Studio
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                ໝວດໝູ່ທີ່ຈະເປີດໃຫ້ສະໝັກ
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Qualifiers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {jamQualifiers.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full border border-border/80 bg-background/50 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Battles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {jamBattles.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full border border-border/80 bg-background/50 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
              <li>ຊື່–ນາມສະກຸນ / ຊື່ທີມ (solo ຫຼື duo)</li>
              <li>ເລືອກໝວດໝູ່ແຂ່ງຂັນ</li>
              <li>ຂໍ້ມູນຕິດຕໍ່</li>
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="outline" className="flex-1" asChild>
                <NavSectionLink
                  sectionId="jam-event"
                  label="ເບິ່ງລາຍລະອຽດ Fanglao Jam"
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium"
                  activeClassName="text-primary"
                />
              </Button>
              <Button
                size="lg"
                className="flex-1 shadow-lg shadow-primary/25"
                asChild
              >
                <Link to="/register/camp">ລົງທະບຽນ Summer Camp</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
