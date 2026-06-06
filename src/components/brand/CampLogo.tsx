import { cn } from '~/lib/utils'

const sizeClasses = {
  hero: 'max-w-96 sm:max-w-120 md:max-w-140 lg:max-w-160',
  register: 'max-w-64 sm:max-w-80 md:max-w-96',
} as const

type CampLogoProps = {
  size?: keyof typeof sizeClasses
  className?: string
  priority?: boolean
}

export function CampLogo({
  size = 'hero',
  className,
  priority = false,
}: CampLogoProps) {
  return (
    <img
      src="/summer-camp-logo.png"
      alt="Summer Dance Camp 2026 — ຮຽນເຕັ້ນພັກແລ້ງ"
      width={640}
      height={640}
      className={cn('h-auto w-full object-contain', sizeClasses[size], className)}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
    />
  )
}
