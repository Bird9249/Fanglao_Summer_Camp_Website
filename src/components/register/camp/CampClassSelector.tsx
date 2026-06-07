import { RiCheckLine, RiSparklingLine } from '@remixicon/react'
import type { CampClassPublicDTO } from '~/lib/camp-registration-api'
import { CAMP_MAX_AGE, CAMP_MIN_AGE } from '~/lib/camp-registration'
import {
  getCampClassDisplayName,
  getCampClassEnglishSubtitle,
} from '~/lib/camp-class-display'
import {
  canJoinWaitlist,
  getSlotBadgeText,
  isClassFull,
} from '~/lib/camp-slot-display'
import { findCampStyleForClass } from '~/lib/camp-styles'
import { cn } from '~/lib/utils'

export function CampClassSelector({
  classes,
  value,
  waitlistIds,
  onChange,
  onWaitlistChange,
  error,
  disabled,
}: {
  classes: CampClassPublicDTO[]
  value: string[]
  waitlistIds: string[]
  onChange: (value: string[]) => void
  onWaitlistChange: (value: string[]) => void
  error?: string
  disabled?: boolean
}) {
  const sorted = [...classes].sort((a, b) => a.sortOrder - b.sortOrder)

  const toggleOpenClass = (classTypeId: string) => {
    if (disabled) return
    if (value.includes(classTypeId)) {
      onChange(value.filter((id) => id !== classTypeId))
      return
    }
    onChange([...value, classTypeId])
  }

  const toggleWaitlist = (classTypeId: string) => {
    if (disabled) return
    if (waitlistIds.includes(classTypeId)) {
      onWaitlistChange(waitlistIds.filter((id) => id !== classTypeId))
      return
    }
    onWaitlistChange([...waitlistIds, classTypeId])
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sorted.map((item) => {
          const full = isClassFull(item)
          const waitlistAvailable = canJoinWaitlist(item)
          const selected = value.includes(item.classTypeId)
          const waitlisted = waitlistIds.includes(item.classTypeId)
          const style = findCampStyleForClass(item)
          const Icon = style?.icon ?? RiSparklingLine
          const displayName = getCampClassDisplayName(item)
          const englishSubtitle = getCampClassEnglishSubtitle(item)
          const badgeText = getSlotBadgeText(item)

          return (
            <div key={item.classTypeId} className="flex flex-col gap-1">
              <button
                type="button"
                disabled={disabled || (full && !waitlistAvailable)}
                aria-pressed={selected || waitlisted}
                aria-label={`${displayName} — ${
                  selected
                    ? 'ເລືອກແລ້ວ'
                    : waitlisted
                      ? 'ຄິວສຳຮອງ'
                      : full
                        ? 'ເຕັມແລ້ວ'
                        : 'ຍັງບໍ່ເລືອກ'
                }`}
                onClick={() => {
                  if (!full) {
                    toggleOpenClass(item.classTypeId)
                    return
                  }
                  if (waitlistAvailable) {
                    toggleWaitlist(item.classTypeId)
                  }
                }}
                className={cn(
                  'camp-class-card group relative min-h-[10.5rem] overflow-hidden rounded-xl border bg-card text-left transition-all duration-300 outline-none',
                  'focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
                  full && 'camp-class-card--full',
                  waitlisted && 'camp-class-card--waitlist',
                  selected
                    ? 'camp-class-card--selected border-primary'
                    : 'border-border/70 hover:border-primary/40',
                )}
              >
                {style?.silhouetteSrc ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-2 top-2 bottom-14 z-0"
                  >
                    <img
                      src={style.silhouetteSrc}
                      alt=""
                      className={cn(
                        'size-full object-contain object-bottom transition-all duration-300',
                        selected || waitlisted
                          ? 'opacity-100 brightness-110'
                          : 'opacity-85 group-hover:opacity-95',
                      )}
                    />
                  </div>
                ) : null}

                <div
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/45 to-transparent/10 transition-opacity duration-300',
                    selected || waitlisted ? 'opacity-80' : 'opacity-100',
                  )}
                />

                <div className="relative z-[2] flex min-h-[10.5rem] flex-col justify-end p-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Icon
                        size={18}
                        className={cn(
                          'shrink-0 transition-colors duration-300',
                          selected || waitlisted
                            ? 'text-primary'
                            : 'text-muted-foreground',
                        )}
                      />
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                          selected || waitlisted
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border/80 bg-background/60 text-transparent',
                        )}
                      >
                        <RiCheckLine size={12} />
                      </span>
                    </div>
                    <span
                      className={cn(
                        'camp-slot-badge w-fit',
                        `camp-slot-badge--${item.availability}`,
                      )}
                    >
                      <span
                        className={cn(
                          'camp-slot-dot',
                          `camp-slot-dot--${item.availability}`,
                        )}
                        aria-hidden
                      />
                      {badgeText}
                    </span>
                    <p
                      className={cn(
                        'font-heading text-xs font-bold uppercase leading-tight tracking-wide transition-colors duration-300',
                        selected || waitlisted
                          ? 'text-primary'
                          : 'text-foreground',
                      )}
                    >
                      {displayName}
                    </p>
                    {englishSubtitle ? (
                      <p className="text-[0.7rem] text-muted-foreground">
                        {englishSubtitle}
                      </p>
                    ) : null}
                    {waitlisted ? (
                      <p className="text-[0.68rem] font-semibold text-amber-600 dark:text-amber-400">
                        ຄິວສຳຮອງ
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>

              {full && waitlistAvailable ? (
                <button
                  type="button"
                  className={cn(
                    'camp-waitlist-cta',
                    waitlisted && 'border-primary/50 bg-primary/10',
                  )}
                  disabled={disabled}
                  onClick={() => toggleWaitlist(item.classTypeId)}
                >
                  {waitlisted
                    ? 'ຍົກເລີກຄິວສຳຮອງ'
                    : 'ລົງຊື່ຕໍ່ຄິວສຳຮອງ'}
                </button>
              ) : null}
            </div>
          )
        })}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          ສາມາດເລືອກຫຼາຍກວ່າ 1 ຄລາສ · ອາຍຸ {CAMP_MIN_AGE}–{CAMP_MAX_AGE} ປີ ·
          ຕົວເລກອັບເດດອັດຕະໂນມັດ
        </p>
      )}
    </div>
  )
}
