import {
  RiBoxingLine,
  RiMic2Line,
  RiMusic2Line,
  RiSparklingLine,
  RiStarSmileLine,
} from '@remixicon/react'
import type { ComponentType } from 'react'

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
      { days: 'Mon–Fri', time: '13:00 – 14:30', group: 'Kids 5–12' },
    ],
    icon: RiStarSmileLine,
    silhouetteSrc: '/images/camp-styles/kid.png',
    photoSrc: '/images/camp-styles/kid.png',
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
      { days: 'Mon–Fri', time: '15:00 – 16:30', group: 'Teens & Adults' },
    ],
    icon: RiMusic2Line,
    silhouetteSrc: '/images/camp-styles/kpop.png',
    photoSrc: '/images/camp-styles/kpop.png',
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
      { days: 'Mon–Fri', time: '16:30 – 18:00', group: 'All levels' },
    ],
    icon: RiSparklingLine,
    silhouetteSrc: '/images/camp-styles/jazz.png',
    photoSrc: '/images/camp-styles/jazz.png',
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
      { days: 'Mon–Fri', time: '13:00 – 14:30', group: 'Teens & Adults' },
    ],
    icon: RiMic2Line,
    silhouetteSrc: '/images/camp-styles/hiphop.png',
    photoSrc: '/images/camp-styles/hiphop.png',
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
      { days: 'Mon–Fri', time: '15:00 – 16:30', group: 'Intermediate+' },
    ],
    icon: RiBoxingLine,
    silhouetteSrc: '/images/camp-styles/breaking.png',
    photoSrc: '/images/camp-styles/breaking.png',
    previewVideoSrc: '/videos/camp-styles/breaking-preview.mp4',
    splashClass: 'style-splash-breaking',
  },
]

const classNameToStyleId: Record<string, string> = {
  'kids class': 'kids',
  kids: 'kids',
  kid: 'kids',
  'ເດັກນ້ອຍ': 'kids',
  'ຄລາສເດັກນ້ອຍ': 'kids',
  'k-pop class': 'kpop',
  'k-pop': 'kpop',
  kpop: 'kpop',
  'k pop': 'kpop',
  'street jazz': 'street-jazz',
  'street jazz class': 'street-jazz',
  'hip-hop class': 'hip-hop',
  'hip-hop': 'hip-hop',
  'hip hop': 'hip-hop',
  hiphop: 'hip-hop',
  breaking: 'breaking',
  'breaking class': 'breaking',
  bboy: 'breaking',
  'b-boy': 'breaking',
}

function normalizeClassLookupKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+class$/i, '')
}

function findCampStyleByLookupKey(key: string): CampStyle | undefined {
  const styleId =
    classNameToStyleId[key] ?? classNameToStyleId[normalizeClassLookupKey(key)]
  if (!styleId) return undefined
  return campStyles.find((style) => style.id === styleId)
}

export function findCampStyleForClassName(name: string): CampStyle | undefined {
  const trimmed = name.trim()
  if (!trimmed) return undefined

  const direct = findCampStyleByLookupKey(trimmed.toLowerCase())
  if (direct) return direct

  const normalized = normalizeClassLookupKey(trimmed)
  const normalizedMatch = findCampStyleByLookupKey(normalized)
  if (normalizedMatch) return normalizedMatch

  return campStyles.find((style) => {
    const candidates = [style.id, style.name, style.lao].map(normalizeClassLookupKey)
    return (
      candidates.includes(normalized) ||
      candidates.some(
        (candidate) =>
          normalized.includes(candidate) || candidate.includes(normalized),
      )
    )
  })
}

/** ຈັບຄູ່ຮູບ/icon ຈາກຊື່ຄລາສ admin + ຊື່ສະແດງຜົນລາວ */
export function findCampStyleForClass(item: {
  name: string
  labelLao?: string
}): CampStyle | undefined {
  const byName = findCampStyleForClassName(item.name)
  if (byName) return byName

  const lao = item.labelLao?.trim()
  if (!lao) return undefined

  const byLao = findCampStyleForClassName(lao)
  if (byLao) return byLao

  return campStyles.find(
    (style) => style.lao.localeCompare(lao, 'lo', { sensitivity: 'base' }) === 0,
  )
}

export function resolveClassTypeIdFromSlug(
  slug: string,
  classes: Array<{ classTypeId: string; name: string }>,
): string | undefined {
  const style = campStyles.find((item) => item.id === slug)
  if (!style) return undefined

  const normalizedStyleName = style.name.toLowerCase().replace(/\s+class$/i, '')
  const match = classes.find((item) => {
    const normalized = item.name.toLowerCase().replace(/\s+class$/i, '')
    return normalized === normalizedStyleName
  })

  return match?.classTypeId
}
