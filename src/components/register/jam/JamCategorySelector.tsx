import { RiCheckLine } from '@remixicon/react'
import {
  findJamCategoryMeta,
  getJamCategoryDisplayName,
  getJamCategoryEnglishSubtitle,
  getJamFormatLabel,
} from '~/lib/jam-category-display'
import {
  CLOUD_JAM_PARENT,
  getCloudJamGroupAvailability,
  getCloudJamGroupRemaining,
  getCloudJamSubLabel,
  partitionJamCategories,
} from '~/lib/jam-category-groups'
import type { JamCategoryPublicDTO } from '~/lib/jam-registration-api'
import { getJamSlotBadgeText, isJamCategoryFull } from '~/lib/jam-slot-display'
import { cn } from '~/lib/utils'

function JamCategoryCard({
  item,
  selected,
  disabled,
  onSelect,
  className,
}: {
  item: JamCategoryPublicDTO
  selected: boolean
  disabled?: boolean
  onSelect: () => void
  className?: string
}) {
  const full = isJamCategoryFull(item)
  const meta = findJamCategoryMeta(item.categoryKey)
  const Icon = meta?.icon
  const displayName = getJamCategoryDisplayName(item)
  const englishSubtitle = getJamCategoryEnglishSubtitle(item)
  const badgeText = getJamSlotBadgeText(item)
  const availability = full ? 'full' : 'open'

  return (
    <button
      type="button"
      disabled={disabled || full}
      aria-pressed={selected}
      aria-label={`${displayName} — ${selected ? 'ເລືອກແລ້ວ' : full ? 'ເຕັມແລ້ວ' : 'ຍັງບໍ່ເລືອກ'}`}
      onClick={onSelect}
      className={cn(
        'jam-reg-category-card group relative h-full min-h-34 overflow-hidden rounded-xl border bg-card/80 text-left transition-all duration-300 outline-none',
        'focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed',
        full && 'jam-reg-category-card--full',
        selected
          ? 'jam-reg-category-card--selected border-primary'
          : 'border-border/70 hover:border-primary/45',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br transition-opacity duration-300',
          item.kind === 'qualifier'
            ? 'from-primary/10 via-transparent to-transparent'
            : 'from-primary/15 via-transparent to-transparent',
          selected ? 'opacity-100' : 'opacity-60 group-hover:opacity-90',
        )}
      />

      <div className="relative z-1 flex h-full min-h-34 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          {Icon ? (
            <Icon
              size={20}
              className={cn(
                'shrink-0 transition-colors duration-300',
                selected ? 'text-primary' : 'text-muted-foreground',
              )}
            />
          ) : (
            <span className="size-5" />
          )}
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/80 bg-background/60 text-transparent',
            )}
          >
            <RiCheckLine size={12} />
          </span>
        </div>

        <div className=" flex flex-col gap-1.5 pt-3">
          <span
            className={cn(
              'camp-slot-badge w-fit',
              `camp-slot-badge--${availability}`,
            )}
          >
            <span
              className={cn('camp-slot-dot', `camp-slot-dot--${availability}`)}
              aria-hidden
            />
            {badgeText}
          </span>
          <p
            className={cn(
              'font-heading text-sm font-bold uppercase leading-tight tracking-wide transition-colors duration-300',
              selected ? 'text-primary' : 'text-foreground',
            )}
          >
            {displayName}
          </p>
          {englishSubtitle ? (
            <p className="text-[0.68rem] leading-snug text-muted-foreground">
              {englishSubtitle}
            </p>
          ) : null}
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground/90">
            {getJamFormatLabel(item.format)}
          </p>
          {item.description ? (
            <p className="line-clamp-2 text-[0.68rem] leading-snug text-muted-foreground">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function CloudJamFormatChip({
  sub,
  selected,
  disabled,
  onSelect,
}: {
  sub: JamCategoryPublicDTO
  selected: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  const full = isJamCategoryFull(sub)
  const availability = full ? 'full' : 'open'
  const badgeText = getJamSlotBadgeText(sub)

  return (
    <button
      type="button"
      disabled={disabled || full}
      aria-pressed={selected}
      aria-label={`${getCloudJamSubLabel(sub)} — ${selected ? 'ເລືອກແລ້ວ' : full ? 'ເຕັມແລ້ວ' : 'ຍັງບໍ່ເລືອກ'}`}
      onClick={onSelect}
      className={cn(
        'jam-reg-format-chip group/chip relative flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-center transition-all duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed',
        full && 'opacity-50',
        selected
          ? 'jam-reg-format-chip--selected border-primary bg-primary/12'
          : 'border-border/60 bg-background/40 hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      <span
        className={cn(
          'camp-slot-badge w-fit',
          `camp-slot-badge--${availability}`,
        )}
      >
        <span
          className={cn('camp-slot-dot', `camp-slot-dot--${availability}`)}
          aria-hidden
        />
        {badgeText}
      </span>
      <span
        className={cn(
          'font-heading text-sm font-bold uppercase tracking-wide',
          selected ? 'text-primary' : 'text-foreground',
        )}
      >
        {getCloudJamSubLabel(sub)}
      </span>
      <span className="text-[0.62rem] font-medium uppercase tracking-wide text-muted-foreground">
        {getJamFormatLabel(sub.format)}
      </span>
      {selected ? (
        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <RiCheckLine size={10} />
        </span>
      ) : null}
    </button>
  )
}

function CloudJamQualifierBlock({
  subs,
  selectedId,
  disabled,
  onSelectSub,
  subError,
}: {
  subs: JamCategoryPublicDTO[]
  selectedId: string
  disabled?: boolean
  onSelectSub: (id: string) => void
  subError?: string
}) {
  const selectedSub = subs.find((c) => c.id === selectedId)
  const groupAvailability = getCloudJamGroupAvailability(subs)
  const groupFull = groupAvailability === 'full'
  const remaining = getCloudJamGroupRemaining(subs)
  const ParentIcon = CLOUD_JAM_PARENT.icon
  const cardSelected = !!selectedSub

  const groupBadge =
    groupFull
      ? 'ເຕັມແລ້ວ'
      : remaining != null
        ? `ເຫຼືອ ${remaining} ທີ່`
        : 'ເປີດຮັບ'

  return (
    <div
      className={cn(
        'jam-reg-category-card jam-reg-cloud-jam group relative flex h-full min-h-[8.5rem] flex-col overflow-hidden rounded-xl border bg-card/80 text-left transition-all duration-300',
        groupFull && !selectedSub && 'jam-reg-category-card--full opacity-50',
        cardSelected
          ? 'jam-reg-category-card--selected border-primary'
          : 'border-border/70',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent transition-opacity duration-300',
          cardSelected ? 'opacity-100' : 'opacity-60',
        )}
      />

      <div className="relative z-[1] flex h-full flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <ParentIcon
            size={20}
            className={cn(
              'shrink-0',
              cardSelected ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
              cardSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/80 bg-background/60 text-transparent',
            )}
            aria-hidden
          >
            <RiCheckLine size={12} />
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-1.5 pt-3">
          <span
            className={cn(
              'camp-slot-badge w-fit',
              `camp-slot-badge--${groupAvailability}`,
            )}
          >
            <span
              className={cn(
                'camp-slot-dot',
                `camp-slot-dot--${groupAvailability}`,
              )}
              aria-hidden
            />
            {groupBadge}
          </span>
          <p
            className={cn(
              'font-heading text-sm font-bold uppercase leading-tight tracking-wide',
              cardSelected ? 'text-primary' : 'text-foreground',
            )}
          >
            {CLOUD_JAM_PARENT.labelLao}
          </p>
          <p className="text-[0.68rem] leading-snug text-muted-foreground">
            {CLOUD_JAM_PARENT.name}
          </p>
          <p className="line-clamp-2 text-[0.68rem] leading-snug text-muted-foreground">
            {CLOUD_JAM_PARENT.description}
          </p>
        </div>

        <div
          className="mt-3 border-t border-border/50 pt-3"
          role="group"
          aria-label="Cloud Jam — ເລືອກຮູບແບບ"
        >
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            ເລືອກຮູບແບບ
          </p>
          <div className="grid grid-cols-2 gap-2">
            {subs.map((sub) => (
              <CloudJamFormatChip
                key={sub.id}
                sub={sub}
                selected={selectedId === sub.id}
                disabled={disabled}
                onSelect={() => onSelectSub(sub.id)}
              />
            ))}
          </div>
          {subError ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {subError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function QualifierPanel({
  categories,
  selectedId,
  disabled,
  onChange,
  error,
}: {
  categories: JamCategoryPublicDTO[]
  selectedId: string
  disabled?: boolean
  onChange: (id: string) => void
  error?: string
}) {
  const { cloudJamSubs, standalone } = partitionJamCategories(
    categories.filter((c) => c.kind === 'qualifier'),
  )

  const selectedSub = cloudJamSubs.find((c) => c.id === selectedId)
  const showSubError =
    error === 'ກະລຸນາເລືອກໝວດແຂ່ງຂັນ' &&
    cloudJamSubs.length > 0 &&
    !selectedSub &&
    standalone.every((c) => c.id !== selectedId)

  return (
    <div className={cn('jam-reg-panel rounded-2xl border p-4 md:p-5', 'jam-panel jam-panel--qualifier')}>
      <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary">
        Qualifiers
      </p>
      <div className="grid gap-3 sm:grid-cols-2 sm:items-stretch">
        {cloudJamSubs.length > 0 ? (
          <CloudJamQualifierBlock
            subs={cloudJamSubs}
            selectedId={selectedId}
            disabled={disabled}
            onSelectSub={onChange}
            subError={
              showSubError ? 'ກະລຸນາເລືອກ 1 vs 1 ຫຼື 2 vs 2' : undefined
            }
          />
        ) : null}

        {standalone.map((item) => (
          <JamCategoryCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            disabled={disabled}
            onSelect={() => onChange(item.id)}
            className="h-full"
          />
        ))}
      </div>
    </div>
  )
}

export function JamCategorySelector({
  categories,
  value,
  onChange,
  error,
  disabled,
}: {
  categories: JamCategoryPublicDTO[]
  value: string
  onChange: (categoryId: string) => void
  error?: string
  disabled?: boolean
}) {
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
  const battles = sorted.filter((c) => c.kind === 'battle')

  return (
    <div className="flex flex-col gap-4">
      <QualifierPanel
        categories={sorted}
        selectedId={value}
        disabled={disabled}
        onChange={onChange}
        error={error}
      />

      {battles.length > 0 ? (
        <div className={cn('jam-reg-panel rounded-2xl border p-4 md:p-5', 'jam-panel jam-panel--battle')}>
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Battles
          </p>
          <div className="grid gap-3 sm:grid-cols-2 sm:items-stretch">
            {battles.map((item) => (
              <JamCategoryCard
                key={item.id}
                item={item}
                selected={value === item.id}
                disabled={disabled}
                onSelect={() => onChange(item.id)}
                className="h-full"
              />
            ))}
          </div>
        </div>
      ) : null}

      {error && error !== 'ກະລຸນາເລືອກໝວດແຂ່ງຂັນ' ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : error && !value ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Cloud Jam: ເລືອກ 1 vs 1 ຫຼື 2 vs 2 ພາຍໃນການແຂ່ງ · ຈຳນວນທີ່ນັ່ງອັບເດດອັດຕະໂນມັດ
        </p>
      )}
    </div>
  )
}
