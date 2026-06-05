import type { ComponentType } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { cn } from '~/lib/utils'

export function QuickInfoCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: ComponentType<{ size?: number | string; className?: string }>
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card
      className={cn(
        'h-full w-full border-border/80 bg-card/90 backdrop-blur-sm',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start gap-3 pb-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary sm:size-11">
          <Icon size={20} className="sm:hidden" />
          <Icon size={22} className="hidden sm:block" />
        </span>
        <CardTitle className="font-heading pt-0.5 text-sm font-bold uppercase tracking-wide sm:pt-1 sm:text-base">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  )
}
