import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CampRegisterClosed } from '~/components/register/camp/CampRegisterClosed'
import { CampRegisterHero } from '~/components/register/camp/CampRegisterHero'
import { CampRegistrationForm } from '~/components/register/camp/CampRegistrationForm'
import { getCampClasses } from '~/lib/camp-registration.functions'
import { isCampStyleId } from '~/lib/camp-registration'
import { resolveClassTypeIdFromSlug } from '~/lib/camp-styles'
import { pageSeo } from '~/utils/seo'

const campRegisterSearchSchema = z.object({
  class: z.string().optional(),
  classTypeId: z.string().optional(),
})

export const Route = createFileRoute('/_site/register/camp')({
  validateSearch: campRegisterSearchSchema,
  loader: async () => getCampClasses(),
  head: () => {
    const { meta, links } = pageSeo({
      title: 'ລົງທະບຽນ Summer Camp | Fanglao Studio',
      description:
        'ລົງທະບຽນ Summer Dance Camp 2026 — ກອກຂໍ້ມູນສ່ວນຕົວ ເລືອກຄລາສ Kids, K-Pop, Street Jazz, Hip-Hop, Breaking ທີ່ Fanglao Studio',
      path: '/register/camp',
      keywords:
        'Fanglao, summer camp registration, dance camp Laos, hip hop camp, breaking class Vientiane',
    })

    return { meta, links }
  },
  component: RegisterCampPage,
})

function RegisterCampPage() {
  const loaderData = Route.useLoaderData()
  const { class: legacyClassSlug, classTypeId } = Route.useSearch()

  if (!loaderData.ok) {
    if (
      loaderData.code === 'EVENT_NOT_OPEN' ||
      loaderData.code === 'EVENT_NOT_FOUND'
    ) {
      return <CampRegisterClosed />
    }

    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລົງທະບຽນໄດ້ — ກະລຸນາລອງໃໝ່ພາຍຫຼັງ
        </p>
      </div>
    )
  }

  const { classes } = loaderData.data

  const defaultClassTypeIds: string[] = []
  if (classTypeId && classes.some((item) => item.classTypeId === classTypeId)) {
    defaultClassTypeIds.push(classTypeId)
  } else if (legacyClassSlug && isCampStyleId(legacyClassSlug)) {
    const resolved = resolveClassTypeIdFromSlug(legacyClassSlug, classes)
    if (resolved) defaultClassTypeIds.push(resolved)
  }

  const preselectedClasses = classes.filter((item) =>
    defaultClassTypeIds.includes(item.classTypeId),
  )

  return (
    <div className="flex flex-col">
      <CampRegisterHero preselectedClasses={preselectedClasses} />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-10">
        <CampRegistrationForm
          classes={classes}
          defaultClassTypeIds={defaultClassTypeIds}
        />
      </div>
    </div>
  )
}
