import { cn } from '~/lib/utils'

type FanglaoLogoProps = {
  className?: string
}

export function FanglaoLogo({ className }: FanglaoLogoProps) {
  return (
    <img
      src="/fanglao-logo.png"
      alt="Fanglao Studio"
      width={320}
      height={80}
      className={cn('h-8 w-auto object-contain md:h-9', className)}
      decoding="async"
    />
  )
}
