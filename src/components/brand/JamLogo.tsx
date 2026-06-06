import { cn } from '~/lib/utils'

const sizeClasses = {
  section: 'max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl',
  register: 'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg',
} as const

type JamLogoProps = {
  size?: keyof typeof sizeClasses
  className?: string
}

export function JamLogo({ size = 'section', className }: JamLogoProps) {
  return (
    <img
      src="/fanglao-jam-logo.png"
      alt="Fanglao Jam Vol. 1"
      width={800}
      height={400}
      className={cn('h-auto w-full object-contain', sizeClasses[size], className)}
      decoding="async"
    />
  )
}
