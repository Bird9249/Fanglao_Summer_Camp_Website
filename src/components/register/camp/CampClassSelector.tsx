import { RiCheckLine } from '@remixicon/react'
import { campStyles } from '~/lib/camp-styles'
import { CAMP_MAX_AGE, CAMP_MIN_AGE, type CampStyleId } from '~/lib/camp-registration'
import { cn } from '~/lib/utils'

export function CampClassSelector({
  value,
  onChange,
  error,
  disabled,
}: {
  value: CampStyleId[]
  onChange: (value: CampStyleId[]) => void
  error?: string
  disabled?: boolean
}) {
  const toggleClass = (classId: CampStyleId) => {
    if (disabled) return
    if (value.includes(classId)) {
      onChange(value.filter((id) => id !== classId))
      return
    }
    onChange([...value, classId])
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {campStyles.map((style) => {
          const selected = value.includes(style.id as CampStyleId)
          const Icon = style.icon

          return (
            <button
              key={style.id}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={`${style.name} — ${selected ? 'ເລືອກແລ້ວ' : 'ຍັງບໍ່ເລືອກ'}`}
              onClick={() => toggleClass(style.id as CampStyleId)}
              className={cn(
                'camp-class-card group relative flex min-h-[10.5rem] flex-col overflow-hidden rounded-xl border bg-card text-left transition-all duration-300 outline-none',
                'focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
                selected
                  ? 'camp-class-card--selected border-primary'
                  : 'border-border/70 hover:border-primary/40',
              )}
            >
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent transition-opacity duration-300',
                  selected ? 'opacity-70' : 'opacity-100',
                )}
              />

              <div className="relative flex flex-1 flex-col justify-end p-3">
                <img
                  src={style.silhouetteSrc}
                  alt=""
                  className={cn(
                    'pointer-events-none absolute inset-x-2 top-2 h-[58%] w-[calc(100%-1rem)] object-contain object-bottom transition-all duration-300',
                    selected ? 'opacity-100 brightness-110' : 'opacity-70 group-hover:opacity-90',
                  )}
                />

                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <Icon
                      size={18}
                      className={cn(
                        'shrink-0 transition-colors duration-300',
                        selected ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
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
                  <p
                    className={cn(
                      'font-heading text-xs font-bold uppercase leading-tight tracking-wide transition-colors duration-300',
                      selected ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {style.name.replace(' Class', '')}
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">{style.lao}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          ສາມາດເລືອກຫຼາຍກວ່າ 1 ຄລາສ · ອາຍຸ {CAMP_MIN_AGE}–{CAMP_MAX_AGE} ປີ
        </p>
      )}
    </div>
  )
}
