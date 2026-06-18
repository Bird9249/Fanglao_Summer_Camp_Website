import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { JamLogo } from '~/components/brand/JamLogo'
import { JamRegisterClosed } from '~/components/register/jam/JamRegisterClosed'
import { JamRegistrationForm } from '~/components/register/jam/JamRegistrationForm'
import { getJamCategories } from '~/lib/jam-registration.functions'
import { siteMeta } from '~/components/layout/nav'
import { RiCalendarLine, RiMapPinLine } from '@remixicon/react'
import { jamEventMeta } from '~/lib/jam-event'
import { pageSeo } from '~/utils/seo'

const jamRegisterSearchSchema = z.object({
  category: z.string().optional(),
})

export const Route = createFileRoute('/_site/register/jam')({
  validateSearch: jamRegisterSearchSchema,
  loader: async () => getJamCategories(),
  head: () => {
    const { meta, links } = pageSeo({
      title: 'ລົງທະບຽນ Fanglao Jam | Fanglao Studio',
      description:
        'ລົງທະບຽນ Fanglao Jam 2026 — qualifier ແລະ battle categories ທີ່ Lao National Circus',
      path: '/register/jam',
      keywords:
        'Fanglao Jam, dance battle Laos, breaking battle, hip hop competition Vientiane',
    })

    return { meta, links }
  },
  component: RegisterJamPage,
})

function RegisterJamPage() {
  const loaderData = Route.useLoaderData()
  const { category: categoryKey } = Route.useSearch()

  if (!loaderData.ok) {
    if (
      loaderData.code === 'EVENT_NOT_OPEN' ||
      loaderData.code === 'EVENT_NOT_FOUND'
    ) {
      return <JamRegisterClosed />
    }

    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລົງທະບຽນໄດ້ — ກະລຸນາລອງໃໝ່ພາຍຫຼັງ
        </p>
      </div>
    )
  }

  const { categories } = loaderData.data
  const defaultCategory = categoryKey
    ? categories.find((c) => c.categoryKey === categoryKey)
    : undefined

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
                  <RiCalendarLine size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      ວັນທີ່ແຂ່ງຂັນ
                    </span>
                    <span className="text-sm font-medium">{jamEventMeta.dateLao}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/40 px-3 py-3 text-left">
                  <RiMapPinLine size={18} className="mt-0.5 shrink-0 text-primary" />
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
        <JamRegistrationForm
          categories={categories}
          defaultCategoryId={defaultCategory?.id}
        />
      </div>
    </div>
  )
}
