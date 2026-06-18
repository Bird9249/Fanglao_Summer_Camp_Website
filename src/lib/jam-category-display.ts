import type { JamCategoryPublicDTO } from '~/lib/jam-registration-api'
import {
  CLOUD_JAM_PARENT,
  getCloudJamSubLabel,
  isCloudJamSubCategoryKey,
} from '~/lib/jam-category-groups'
import { jamBattles, jamQualifiers } from '~/lib/jam-event'

const META_BY_KEY = new Map(
  [...jamQualifiers, ...jamBattles].map((c) => [c.id, c] as const),
)

/** Sub-keys (cloud-jam-1v1) resolve to parent marketing meta where useful */
export function findJamCategoryMeta(categoryKey: string) {
  if (isCloudJamSubCategoryKey(categoryKey)) {
    return {
      id: CLOUD_JAM_PARENT.categoryKey,
      name: CLOUD_JAM_PARENT.name,
      lao: CLOUD_JAM_PARENT.labelLao,
      description: CLOUD_JAM_PARENT.description,
      icon: CLOUD_JAM_PARENT.icon,
    }
  }
  return META_BY_KEY.get(categoryKey)
}

export function getJamCategoryDisplayName(item: JamCategoryPublicDTO): string {
  if (isCloudJamSubCategoryKey(item.categoryKey)) {
    const sub = getCloudJamSubLabel(item)
    return `${CLOUD_JAM_PARENT.labelLao} · ${sub}`
  }
  return item.labelLao?.trim() || item.name
}

export function getJamCategoryEnglishSubtitle(
  item: JamCategoryPublicDTO,
): string | null {
  const meta = findJamCategoryMeta(item.categoryKey)
  if (!meta) return item.name !== item.labelLao ? item.name : null
  return meta.name !== getJamCategoryDisplayName(item) ? meta.name : null
}

export function getJamFormatLabel(format: JamCategoryPublicDTO['format']): string {
  return format === 'duo' ? '2 vs 2 · Duo' : '1 vs 1 · Solo'
}
