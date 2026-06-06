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
  return (
    <div
      className={cn(
        'jam-panel flex flex-col gap-5 rounded-2xl border p-5 md:p-6',
        variant === 'qualifier' ? 'jam-panel--qualifier' : 'jam-panel--battle',
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-primary md:text-xl">
          {title}
        </h3>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <li
              key={category.id}
              className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
                <Icon size={20} />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-sm font-bold uppercase tracking-wide">
                  {category.name}
                </p>
                <p className="text-xs text-primary">{category.lao}</p>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
