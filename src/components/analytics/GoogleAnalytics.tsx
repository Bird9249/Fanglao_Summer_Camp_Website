import { useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import { trackPageView, waitForGoogleAnalytics } from '~/lib/analytics'

export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const searchStr = useRouterState({
    select: (state) => state.location.searchStr,
  })

  React.useEffect(() => {
    let cancelled = false
    const pagePath = searchStr ? `${pathname}${searchStr}` : pathname

    void waitForGoogleAnalytics().then(() => {
      if (cancelled) return
      trackPageView(pagePath)
    })

    return () => {
      cancelled = true
    }
  }, [pathname, searchStr])

  return null
}
