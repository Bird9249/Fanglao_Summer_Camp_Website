import { useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import { trackPageView } from '~/lib/analytics'

export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const searchStr = useRouterState({
    select: (state) => state.location.searchStr,
  })

  React.useEffect(() => {
    const pagePath = searchStr ? `${pathname}${searchStr}` : pathname
    trackPageView(pagePath)
  }, [pathname, searchStr])

  return null
}
