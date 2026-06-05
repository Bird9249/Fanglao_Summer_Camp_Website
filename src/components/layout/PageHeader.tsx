import { cn } from '~/lib/utils'
import { PaintSplash } from './PaintSplash'

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <header
      className={cn(
        'relative border-b border-border bg-card/50 px-4 py-12 md:py-16',
        className,
      )}
    >
      <PaintSplash />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  )
}
