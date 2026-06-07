import type { CampClassPublicDTO } from '~/lib/camp-registration-api'
import { findCampStyleForClass } from '~/lib/camp-styles'

function normalizeClassName(name: string) {
  return name.replace(/\s+Class$/i, '').trim()
}

/** ຊື່ສະແດງຜົນຫຼັກ — ຈາກ admin (labelLao) ຫຼື fallback */
export function getCampClassDisplayName(item: CampClassPublicDTO): string {
  const fromAdmin = item.labelLao?.trim()
  if (fromAdmin) return fromAdmin

  const style = findCampStyleForClass(item)
  return style?.lao ?? normalizeClassName(item.name)
}

/** ຊື່ອັງກິດ — ແສດງເປັນບັນທັດຮອງເມື່ອ admin ຕັ້ງຊື່ລາວແຍກຕ່າງຫາກ */
export function getCampClassEnglishSubtitle(
  item: CampClassPublicDTO,
): string | null {
  const english = normalizeClassName(item.name)
  const display = getCampClassDisplayName(item)
  if (english.toLowerCase() === display.toLowerCase()) return null
  return english
}
