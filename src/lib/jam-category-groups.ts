import { RiTrophyLine } from '@remixicon/react'
import type { JamCategoryPublicDTO } from '~/lib/jam-registration-api'

export const CLOUD_JAM_GROUP_KEY = 'cloud-jam'

/** Legacy single category — replaced by cloud-jam-1v1 / cloud-jam-2v2 */
export const RETIRED_JAM_CATEGORY_KEYS = new Set(['cloud-jam'])

export function isRetiredJamCategoryKey(categoryKey: string): boolean {
  return RETIRED_JAM_CATEGORY_KEYS.has(categoryKey)
}

export const CLOUD_JAM_PARENT = {
  categoryKey: CLOUD_JAM_GROUP_KEY,
  labelLao: 'Cloud Jam Qualifier',
  name: 'Laos Cloud Jam Qualifier',
  description: 'Breaking open qualifier · ເລືອກ 1 vs 1 ຫຼື 2 vs 2',
  icon: RiTrophyLine,
} as const

export function isCloudJamSubCategoryKey(categoryKey: string): boolean {
  return (
    categoryKey.startsWith(`${CLOUD_JAM_GROUP_KEY}-`) &&
    categoryKey !== CLOUD_JAM_GROUP_KEY
  )
}

export function partitionJamCategories(categories: JamCategoryPublicDTO[]) {
  const active = categories.filter(
    (c) => !isRetiredJamCategoryKey(c.categoryKey),
  )

  const cloudJamSubs = active
    .filter((c) => isCloudJamSubCategoryKey(c.categoryKey))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const standalone = active.filter(
    (c) => !isCloudJamSubCategoryKey(c.categoryKey),
  )

  return { cloudJamSubs, standalone }
}

export function getCloudJamSubLabel(item: JamCategoryPublicDTO): string {
  if (item.format === 'duo') return '2 vs 2'
  if (item.format === 'solo') return '1 vs 1'
  return item.labelLao?.trim() || item.name
}

export function getCloudJamGroupAvailability(
  subs: JamCategoryPublicDTO[],
): 'open' | 'full' {
  return subs.some((c) => c.availability !== 'full') ? 'open' : 'full'
}

export function getCloudJamGroupRemaining(subs: JamCategoryPublicDTO[]): number | null {
  const withCapacity = subs.filter((c) => c.capacity != null)
  if (withCapacity.length === 0) return null
  return withCapacity.reduce((sum, c) => sum + (c.remaining ?? 0), 0)
}
