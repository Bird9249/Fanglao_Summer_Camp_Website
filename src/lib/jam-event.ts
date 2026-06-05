import {
  RiFlagFill,
  RiSwordFill,
  RiTeamFill,
  RiTrophyFill,
} from '@remixicon/react'
import type { ComponentType } from 'react'

export type JamCategory = {
  id: string
  name: string
  lao: string
  description: string
  icon: ComponentType<{ size?: number | string; className?: string }>
}

export const jamQualifiers: JamCategory[] = [
  {
    id: 'cloud-jam',
    name: 'Laos Cloud Jam Qualifier',
    lao: 'Cloud Jam Qualifier',
    description: 'Open qualifier ສຳລັບ national circuit',
    icon: RiTrophyFill,
  },
  {
    id: 'badvibe',
    name: 'Laos Badvibe Qualifier',
    lao: 'Badvibe Qualifier',
    description: 'Open qualifier ສຳລັບ Badvibe national event',
    icon: RiFlagFill,
  },
]

export const jamBattles: JamCategory[] = [
  {
    id: 'kids-battle',
    name: 'Kids Battle',
    lao: 'Kids Battle',
    description: 'ເປີດໃຫ້ນັກຮຽນ camp (ເດັກນ້ອຍ) ທຸກຄົນ',
    icon: RiSwordFill,
  },
  {
    id: 'Hip-Break',
    name: 'Hip-Break 2 vs 2',
    lao: 'Hip-Break 2vs2',
    description: 'ແຂ່ງຂັນແບບ 2-on-2 ຜົນປະສົມ Breaking ແລະ Hip-Hop',
    icon: RiTeamFill,
  },
]

export const jamEventMeta = {
  title: 'Fanglao Jam',
  date: '18 July 2026',
  dateLao: '18 ກ.ກ. 2026',
  location: 'Lao National Circus, Vientiane',
  tagline: 'ເວທີປະຊັນຝີມື · Street Battle Arena',
} as const
