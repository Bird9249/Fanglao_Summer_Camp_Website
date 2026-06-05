import { createFileRoute } from '@tanstack/react-router'
import { JamRegisterClosed } from '~/components/register/jam/JamRegisterClosed'
import { pageSeo } from '~/utils/seo'

export const Route = createFileRoute('/_site/register/jam')({
  head: () => {
    const { meta, links } = pageSeo({
      title: 'ລົງທະບຽນ Fanglao Jam | Fanglao Studio',
      description:
        'ການລົງທະບຽນ Fanglao Jam 2026 ຍັງບໍ່ເປີດ — ຕິດຕາມຂ່າວສານແລະເບິ່ງລາຍລະອຽດ battle ແລະ qualifier ໃນໜ້າຫຼັກ',
      path: '/register/jam',
      keywords:
        'Fanglao Jam, dance battle Laos, breaking battle, hip hop competition Vientiane',
    })

    return { meta, links }
  },
  component: RegisterJamPage,
})

function RegisterJamPage() {
  return <JamRegisterClosed />
}
