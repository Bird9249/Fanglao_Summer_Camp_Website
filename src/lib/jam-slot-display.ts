import type { JamCategoryPublicDTO } from '~/lib/jam-registration-api'

export function getJamSlotBadgeText(
  item: Pick<JamCategoryPublicDTO, 'availability' | 'remaining' | 'capacity'>,
): string {
  if (item.availability === 'full') return 'ເຕັມແລ້ວ'
  if (item.capacity == null) return 'ເປີດຮັບ'
  const n = item.remaining ?? 0
  if (n <= 3) return `ເຫຼືອ ${n} ທີ່ — ໃກ້ເຕັມ!`
  if (n <= 10) return `ເຫຼືອ ${n} ທີ່`
  return `ເຫຼືອ ${n} ທີ່`
}

export function isJamCategoryFull(item: JamCategoryPublicDTO): boolean {
  return item.availability === 'full'
}
