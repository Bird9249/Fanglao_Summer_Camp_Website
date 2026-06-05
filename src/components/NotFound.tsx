import { Link } from '@tanstack/react-router'
import {
  RiArrowLeftLine,
  RiHome4Line,
  RiSparklingLine,
} from '@remixicon/react'
import { NavSectionLink } from '~/components/layout/NavSectionLink'
import { SiteLayout } from '~/components/layout/SiteLayout'
import { Button } from '~/components/ui/button'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <SiteLayout>
      <section
        aria-labelledby="not-found-heading"
        className="not-found-section relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-16 md:py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 not-found-section-bg"
        />

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <p
              aria-hidden
              className="not-found-code font-heading text-7xl font-bold tracking-tighter text-primary md:text-8xl"
            >
              404
            </p>
            <div className="flex flex-col gap-2">
              <h1
                id="not-found-heading"
                className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl"
              >
                ບໍ່ພົບໜ້ານີ້
              </h1>
              <div className="text-sm text-muted-foreground md:text-base">
                {children ?? (
                  <p>
                    ໜ້າທີ່ທ່ານຊອກຫາອາດຖືກຍ້າຍ ລຶບ ຫຼືພິມ URL ບໍ່ຖືກຕ້ອງ
                    <br />
                    ກັບໄປໜ້າຫຼັກ ຫຼືເລືອກເມນູດ້ານລຸ່ມໄດ້
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="shadow-lg shadow-primary/25"
              asChild
            >
              <Link to="/">
                <RiHome4Line />
                ກັບໜ້າຫຼັກ
              </Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
            >
              <RiArrowLeftLine />
              ກັບຄືນ
            </Button>
          </div>

          <div className="w-full rounded-2xl border border-primary/20 bg-card/80 p-5 backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center justify-center gap-2 text-primary">
              <RiSparklingLine size={18} />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                ລິ້ງແນະນຳ
              </p>
            </div>
            <nav
              aria-label="Suggested links"
              className="flex flex-col gap-2 text-sm"
            >
              <NavSectionLink
                sectionId="camp-styles"
                label="ເບິ່ງ Summer Camp Styles"
                className="rounded-lg border border-border/70 bg-background/40 px-4 py-3 font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                activeClassName="text-primary"
              />
              <NavSectionLink
                sectionId="jam-event"
                label="Fanglao Jam 2026"
                className="rounded-lg border border-border/70 bg-background/40 px-4 py-3 font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                activeClassName="text-primary"
              />
              <Link
                to="/register/camp"
                className="rounded-lg border border-border/70 bg-background/40 px-4 py-3 font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                ລົງທະບຽນ Summer Camp
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
