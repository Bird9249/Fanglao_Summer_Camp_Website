import type { JamCategory } from '~/lib/jam-event'
import { cn } from '~/lib/utils'

export function JamCategoryPanel({
  title,
  subtitle,
  categories,
  variant,
}: {
  title: string
  subtitle: string
  categories: JamCategory[]
  variant: 'qualifier' | 'battle'
}) {
  const isQualifier = variant === 'qualifier'

  return (
    <div
      className={cn(
        'jam-panel flex flex-col gap-5 rounded-2xl p-5 md:p-6',
        isQualifier ? 'jam-panel--qualifier' : 'jam-panel--battle',
      )}
    >
      <div className="flex flex-col gap-1">
        <h3
          className={cn(
            'font-heading text-lg font-bold uppercase tracking-wide md:text-xl',
            isQualifier ? 'jam-panel-title--qualifier' : 'jam-panel-title--battle',
          )}
        >
          {title}
        </h3>
        <p className="jam-tagline text-xs uppercase tracking-[0.15em]">
          {subtitle}
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <li
              key={category.id}
              className={cn(
                'jam-category-card flex gap-3 rounded-xl p-4',
                isQualifier
                  ? 'jam-category-card--qualifier'
                  : 'jam-category-card--battle',
              )}
            >
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg border',
                  isQualifier
                    ? 'jam-category-icon--qualifier'
                    : 'jam-category-icon--battle',
                )}
              >
                <Icon size={20} />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-sm font-bold uppercase tracking-wide text-white">
                  {category.name}
                </p>
                <p
                  className={cn(
                    'text-xs',
                    isQualifier
                      ? 'jam-category-lao--qualifier'
                      : 'jam-category-lao--battle',
                  )}
                >
                  {category.lao}
                </p>
                <p className="jam-tagline text-sm">{category.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
