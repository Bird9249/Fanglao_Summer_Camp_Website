import type { ComponentType } from 'react'
import {
  RiBoxingLine,
  RiMic2Line,
  RiMusic2Line,
  RiSparklingLine,
  RiStarSmileLine,
} from '@remixicon/react'

export type CampStyle = {
  id: string
  name: string
  lao: string
  tagline: string
  description: string
  schedule: string
  timeSlots: Array<{ days: string; time: string; group: string }>
  icon: ComponentType<{ size?: number | string; className?: string }>
  silhouetteSrc: string
  photoSrc: string
  previewVideoSrc: string
  splashClass: string
}

export const campStyles: CampStyle[] = [
  {
    id: 'kids',
    name: 'Kids Class',
    lao: 'ຄລາສເດັກນ້ອຍ',
    tagline: 'Foundational movement & rhythm',
    description:
      'ພື້ນຖານການເຄື່ອນໄຫວ ແລະຈັງຫວະສຳລັບເດັກນ້ອຍ ສ້າງຄວາມມັ່ນໃຈ ແລະຄວາມມ່ວນຊື່ນຜ່ານດົນຕີແລະເຕັ້ນ',
    schedule: 'ຈັນ–ສຸກ · ຊ່ວງເຊົ້າ',
    timeSlots: [
      { days: 'Mon–Fri', time: '09:00 – 11:00', group: 'Kids 5–12' },
    ],
    icon: RiStarSmileLine,
    silhouetteSrc: '/images/camp-styles/kids-silhouette.svg',
    photoSrc: '/images/camp-styles/kids-photo.svg',
    previewVideoSrc: '/videos/camp-styles/kids-preview.mp4',
    splashClass: 'style-splash-kids',
  },
  {
    id: 'kpop',
    name: 'K-Pop Class',
    lao: 'K-Pop',
    tagline: 'Choreography & performance',
    description:
      'K-Pop choreography ແລະ performance style — ຮຽນທ່າທັນສະໄໝ ແລະການເຕັ້ນບນເວທີ',
    schedule: 'ຈັນ–ສຸກ · ຊ່ວງບ່າຍ',
    timeSlots: [
      { days: 'Mon–Fri', time: '13:00 – 15:00', group: 'Teens & Adults' },
    ],
    icon: RiMusic2Line,
    silhouetteSrc: '/images/camp-styles/kpop-silhouette.svg',
    photoSrc: '/images/camp-styles/kpop-photo.svg',
    previewVideoSrc: '/videos/camp-styles/kpop-preview.mp4',
    splashClass: 'style-splash-kpop',
  },
  {
    id: 'street-jazz',
    name: 'Street Jazz',
    lao: 'Street Jazz',
    tagline: 'Jazz meets street dance',
    description:
      'Jazz technique ຜົນປະສົມກັບ street dance — ພลัง ແລະສໄຕລ໌ທີ່ຄມຊັດ',
    schedule: 'ຈັນ–ສຸກ · ຊ່ວງບ່າຍ',
    timeSlots: [
      { days: 'Mon–Fri', time: '15:00 – 17:00', group: 'All levels' },
    ],
    icon: RiSparklingLine,
    silhouetteSrc: '/images/camp-styles/street-jazz-silhouette.svg',
    photoSrc: '/images/camp-styles/street-jazz-photo.svg',
    previewVideoSrc: '/videos/camp-styles/street-jazz-preview.mp4',
    splashClass: 'style-splash-street-jazz',
  },
  {
    id: 'hip-hop',
    name: 'Hip-Hop Class',
    lao: 'Hip-Hop',
    tagline: 'Fundamentals & freestyle',
    description:
      'Hip-Hop fundamentals ແລະ freestyle sessions — ຮຽນພື້ນຖານ ແລະສ້າງສไตล์ຂອງຕົນເອງ',
    schedule: 'ຈັນ–ສຸກ · ຊ່ວງແລງ',
    timeSlots: [
      { days: 'Mon–Fri', time: '17:00 – 19:00', group: 'Teens & Adults' },
    ],
    icon: RiMic2Line,
    silhouetteSrc: '/images/camp-styles/hip-hop-silhouette.svg',
    photoSrc: '/images/camp-styles/hip-hop-photo.svg',
    previewVideoSrc: '/videos/camp-styles/hip-hop-preview.mp4',
    splashClass: 'style-splash-hip-hop',
  },
  {
    id: 'breaking',
    name: 'Breaking Class',
    lao: 'Breaking',
    tagline: 'Toprock, footwork & power',
    description:
      'Toprock, footwork, power moves ແລະ freezes — ສຳລັບຜູ້ທີ່ຕ້ອງການ Breaking ແບບຈິງຈັງ',
    schedule: 'ຈັນ–ສຸກ · ຊ່ວງແລງ',
    timeSlots: [
      { days: 'Mon–Fri', time: '19:00 – 21:00', group: 'Intermediate+' },
    ],
    icon: RiBoxingLine,
    silhouetteSrc: '/images/camp-styles/breaking-silhouette.svg',
    photoSrc: '/images/camp-styles/breaking-photo.svg',
    previewVideoSrc: '/videos/camp-styles/breaking-preview.mp4',
    splashClass: 'style-splash-breaking',
  },
]
