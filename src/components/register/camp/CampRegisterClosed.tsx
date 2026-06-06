import { Link } from '@tanstack/react-router'
import { RiCalendarLine, RiLockLine, RiMapPinLine } from '@remixicon/react'
import { CampLogo } from '~/components/brand/CampLogo'
import { siteMeta } from '~/components/layout/nav'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { CAMP_MAX_AGE, CAMP_MIN_AGE } from '~/lib/camp-registration'

export function CampRegisterClosed() {
  return (
    <div className="flex min-h-full flex-col">
      <section
        aria-labelledby="camp-register-closed-heading"
        className="camp-register-hero relative border-b border-primary/20 px-4 py-10 md:py-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 camp-register-hero-bg"
        />

        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6">
          <div className="rounded-2xl border border-primary/20 bg-card/80 p-5 shadow-[0_0_40px_color-mix(in_oklch,var(--primary)_8%,transparent)] backdrop-blur-sm md:p-7">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 id="camp-register-closed-heading" className="sr-only">
                ປິດຮັບລົງທະບຽນ Camp ຊົ່ວຄາວ
              </h1>
              <CampLogo size="register" />

              <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <RiLockLine size={28} />
              </div>

              <p className="font-heading text-lg font-bold uppercase tracking-tight md:text-xl">
                ປິດຮັບລົງທະບຽນ Camp ຊົ່ວຄາວ
              </p>

              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                ການລົງທະບຽນ Summer Dance Camp 2026 ຍັງບໍ່ເປີດ ຫຼື ປິດຮັບແລ້ວ
                ກະລຸນາຕິດຕາມຂ່າວສານໃນໜ້າຫຼັກ ຫຼື ຕິດຕໍ່ທີມງານ
              </p>

              <div className="grid w-full gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3 text-left">
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

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3 text-left">
                  <RiMapPinLine
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      ອາຍຸຜູ້ສະໝັກ
                    </span>
                    <span className="text-sm font-medium">
                      {CAMP_MIN_AGE}–{CAMP_MAX_AGE} ປີ
                    </span>
                  </div>
                </div>
              </div>

              <Button asChild className="shadow-lg shadow-primary/25">
                <Link to="/">ກັບໜ້າຫຼັກ</Link>
              </Button>
            </div>
          </div>

          <Card className="border-primary/20 bg-card/80">
            <CardHeader>
              <CardTitle className="font-heading text-lg uppercase">
                ຕ້ອງການຂໍ້ມູນເພີ່ມ?
              </CardTitle>
              <CardDescription>
                ເບິ່ງລາຍລະອຽດຄລາສ ແລະຕາຕະລາງໃນໜ້າຫຼັກ ກ່ອນເປີດຮັບສະໝັກ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link to="/" hash="camp-styles">
                  ເບິ່ງຄລາສ Summer Camp
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
