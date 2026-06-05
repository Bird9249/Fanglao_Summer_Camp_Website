import { Outlet } from '@tanstack/react-router'
import * as React from 'react'
import { FloatingRegisterFab } from './FloatingRegisterFab'
import { HomeHashScroll } from './HomeHashScroll'
import { PaintSplash } from './PaintSplash'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <PaintSplash className="fixed opacity-60" />
      <HomeHashScroll />
      <SiteHeader />
      <main className="relative flex-1">
        {children ?? <Outlet />}
      </main>
      <SiteFooter />
      <FloatingRegisterFab />
    </div>
  )
}
