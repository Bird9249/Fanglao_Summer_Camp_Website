import { useNavigate, useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import { scrollToSection } from '~/lib/scroll-to-section'
import { cn } from '~/lib/utils'

export function NavSectionLink({
  sectionId,
  label,
  className,
  activeClassName = 'text-primary',
  onNavigate,
}: {
  sectionId: string
  label: string
  className?: string
  activeClassName?: string
  onNavigate?: () => void
}) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const hash = useRouterState({ select: (state) => state.location.hash })
  const isHome = pathname === '/'
  const isActive =
    isHome &&
    (hash === sectionId ||
      (sectionId === 'hero-section' && (hash === '' || hash === 'hero-section')))

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate?.()

    if (isHome) {
      scrollToSection(sectionId)
      return
    }

    void navigate({ to: '/', hash: sectionId }).then(() => {
      window.requestAnimationFrame(() => {
        scrollToSection(sectionId)
      })
    })
  }

  return (
    <a
      href={`/#${sectionId}`}
      onClick={handleClick}
      className={cn(className, isActive && activeClassName)}
    >
      {label}
    </a>
  )
}
