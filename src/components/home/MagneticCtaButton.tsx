import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { cn } from '~/lib/utils'

type MagneticCtaButtonProps = {
  to: string
  children: React.ReactNode
  variant: 'gold' | 'purple' | 'jam'
}

export function MagneticCtaButton({
  to,
  children,
  variant,
}: MagneticCtaButtonProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [hovered, setHovered] = React.useState(false)
  const [motionEnabled, setMotionEnabled] = React.useState(true)

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionEnabled(!media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!motionEnabled || !wrapperRef.current) return

    const rect = wrapperRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setOffset({
      x: (event.clientX - centerX) * 0.22,
      y: (event.clientY - centerY) * 0.22,
    })
  }

  const resetOffset = () => setOffset({ x: 0, y: 0 })

  return (
    <div
      ref={wrapperRef}
      className="magnetic-cta relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        resetOffset()
        setHovered(false)
      }}
      style={
        motionEnabled
          ? {
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transition: hovered
                ? 'transform 0.12s ease-out'
                : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
            }
          : undefined
      }
    >
      <span
        aria-hidden
        className={cn(
          'magnetic-cta-splash pointer-events-none absolute inset-0 -z-10 rounded-xl',
          variant === 'gold'
            ? 'magnetic-cta-splash--gold'
            : variant === 'jam'
              ? 'magnetic-cta-splash--jam'
              : 'magnetic-cta-splash--purple',
          hovered && motionEnabled && 'magnetic-cta-splash--active',
        )}
      />
      <Link
        to={to}
        className={cn(
          'relative inline-flex h-14 w-full min-w-56 items-center justify-center rounded-xl px-8 text-center text-sm font-bold uppercase tracking-wide transition-shadow sm:text-base',
          variant === 'gold'
            ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/40 hover:shadow-primary/55'
            : variant === 'jam'
              ? 'magnetic-cta-link--jam'
              : 'border border-primary/50 bg-accent text-accent-foreground shadow-xl shadow-accent/35 hover:border-primary/70 hover:shadow-primary/25',
        )}
      >
        {children}
      </Link>
    </div>
  )
}
