import {
  RiFlashlightFill,
  RiHeart3Fill,
  RiTrophyFill,
} from '@remixicon/react'
import type { ComponentType } from 'react'

export type PillarTheme = 'gold' | 'crimson' | 'neon-violet'

export type WhyJoinPillar = {
  id: string
  icon: ComponentType<{ size?: number | string; className?: string }>
  title: string
  titleLao: string
  summary: string
  bullets: string[]
  theme: PillarTheme
}

export const whyJoinPillars: WhyJoinPillar[] = [
  {
    id: 'elite-skill',
    icon: RiFlashlightFill,
    title: 'Elite Dance Skill',
    titleLao: 'ທັກສະການເຕັ້ນລະດັບມືອາຊີບ',
    summary: 'ຮຽນຫຼາກຫຼາຍ style ພ້ອມພັດທະນາທັກສະຮອບດ້ານ',
    bullets: [
      'ໄດ້ຮຽນຫຼາກຫຼາຍ style',
      'ຮຽນຮູ້ວັດທະນະທຳການເຕັ້ນ',
      'ພັດທະນາທັກສະຮອບດ້ານ ທັງ Technique, Musicality, Coordination, Performance',
      'ໄດ້ລອງຄົ້ນຫາ Style ທີ່ມັກ',
    ],
    theme: 'gold',
  },
  {
    id: 'international-stage',
    icon: RiTrophyFill,
    title: 'International & Stage Experience',
    titleLao: 'ປະສົບການລະດັບສາກົນ ແລະ ເວທີຈິງ',
    summary: 'ປະສົບການຈາກຄູຕ່າງປະເທດ ແລະ ໂອກາດຂຶ້ນເວທີຈິງ',
    bullets: [
      'ຮັບປະສົບການພິເສດຈາກຄູສອນຕ່າງປະເທດ',
      'ເປີດມຸມມອງສູ່ໂລກການເຕັ້ນລະດັບສາກົນ',
      'ມີໂອກາດຂຶ້ນເວທີຈິງໃນ Fanglao JAM',
      'ຮັບ Certificate of Completion',
    ],
    theme: 'crimson',
  },
  {
    id: 'mindset-community',
    icon: RiHeart3Fill,
    title: 'Mindset & Community',
    titleLao: 'ການເຕີບໂຕ ແລະ ມິດຕະພາບ',
    summary: 'ເສີມຄວາມໝັ້ນໃຈ ສ້າງມິດຕະພາບ ແລະ ຄວາມຄິດສ້າງສັນ',
    bullets: [
      'ເສີມຄວາມໝັ້ນໃຈ ກ້າສະແດງອອກ',
      'ຮຽນຮູ້ການເຮັດວຽກເປັນທີມ',
      'ສ້າງວິໄນ ແລະຄວາມຮັບຜິດຊອບ',
      'ຝຶກສຸຂະພາບຮ່າງກາຍ (ແຂງແຮງ, ຢຶດຢຸ່ນ, ອົດທົນ)',
      'ສ້າງມິດຕະພາບໃໝ່',
      'ພັດທະນາຄວາມຄິດສ້າງສັນ',
    ],
    theme: 'neon-violet',
  },
]
