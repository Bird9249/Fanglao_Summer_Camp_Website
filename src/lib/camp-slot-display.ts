import type { CampClassPublicDTO } from '~/lib/camp-registration-api'

export function getSlotBadgeText(
  item: Pick<CampClassPublicDTO, 'availability' | 'remaining'>,
): string {
  const n = item.remaining
  switch (item.availability) {
    case 'open':
      return `ເຫຼືອ ${n} ທີ່ນັ່ງ`
    case 'low':
      return `ເຫຼືອ ${n} ທີ່ນັ່ງສຸດທ້າຍ`
    case 'critical':
      return `ເຫຼືອ ${n} ທີ່ນັ່ງສຸດທ້າຍ!`
    case 'full':
      return `ເຕັມແລ້ວ`
    default:
      return `ເຫຼືອ ${n} ທີ່ນັ່ງ`
  }
}

export function isClassFull(item: CampClassPublicDTO): boolean {
  return item.availability === 'full' || item.remaining <= 0
}

export function canJoinWaitlist(item: CampClassPublicDTO): boolean {
  return (
    isClassFull(item) &&
    item.waitlistEnabled &&
    (item.waitlistRemaining === null || item.waitlistRemaining > 0)
  )
}
