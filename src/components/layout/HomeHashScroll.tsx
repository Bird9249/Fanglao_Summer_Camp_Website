import { useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import { scrollToSectionFromHash } from '~/lib/scroll-to-section'

export function HomeHashScroll() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const hash = useRouterState({ select: (state) => state.location.hash })

  React.useEffect(() => {
    if (pathname !== '/' || !hash) return

    const frame = window.requestAnimationFrame(() => {
      scrollToSectionFromHash(hash)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
