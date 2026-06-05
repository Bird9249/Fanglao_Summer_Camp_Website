import { cn } from '~/lib/utils'

export function PaintSplash({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className="absolute -top-24 -left-16 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-1/3 -right-20 size-96 rounded-full bg-accent/40 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-primary/10 blur-3xl" />
    </div>
  )
}
