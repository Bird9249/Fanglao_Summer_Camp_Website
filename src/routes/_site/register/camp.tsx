import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CampRegisterHero } from '~/components/register/camp/CampRegisterHero'
import { CampRegistrationForm } from '~/components/register/camp/CampRegistrationForm'
import { isCampStyleId, type CampStyleId } from '~/lib/camp-registration'
import { pageSeo } from '~/utils/seo'

const campRegisterSearchSchema = z.object({
  class: z.string().optional(),
})

export const Route = createFileRoute('/_site/register/camp')({
  validateSearch: campRegisterSearchSchema,
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
  const { class: preselectedClass } = Route.useSearch()
  const defaultClassIds: CampStyleId[] =
    preselectedClass && isCampStyleId(preselectedClass) ? [preselectedClass] : []

  return (
    <div className="flex flex-col">
      <CampRegisterHero preselectedClassIds={defaultClassIds} />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-10">
        <CampRegistrationForm defaultClassIds={defaultClassIds} />
      </div>
    </div>
  )
}
