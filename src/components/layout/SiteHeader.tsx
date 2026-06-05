import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { RiCloseFill, RiMenuFill } from '@remixicon/react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import { scrollToSection } from '~/lib/scroll-to-section'
import { cn } from '~/lib/utils'
import { NavSectionLink } from './NavSectionLink'
import { mainNav, registerNav } from './nav'

export function SiteHeader() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isHome = pathname === '/'
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const closeMobile = () => setMobileOpen(false)

  const goHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeMobile()

    if (isHome) {
      scrollToSection('hero-section')
      return
    }

    void navigate({ to: '/', hash: 'hero-section' }).then(() => {
      window.requestAnimationFrame(() => {
        scrollToSection('hero-section')
      })
    })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
        <a
          href="/#hero-section"
          className="flex shrink-0 flex-col leading-none"
          onClick={goHome}
        >
          <span className="font-heading text-lg font-bold tracking-tight uppercase">
            Fanglao
          </span>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary">
            2026
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="ml-auto hidden items-center gap-6 lg:flex"
        >
          {mainNav.map((item) => (
            <NavSectionLink
              key={item.sectionId}
              sectionId={item.sectionId}
              label={item.label}
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-primary"
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" asChild>
            <Link to="/register/jam">Jam</Link>
          </Button>
          <Button size="sm" className="shadow-lg shadow-primary/25" asChild>
            <Link to="/register/camp">ລົງທະບຽນ</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'ປິດເມນູ' : 'ເປີດເມນູ'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <RiCloseFill /> : <RiMenuFill />}
        </Button>
      </div>

      <div
        className={cn(
          'border-t border-border bg-background lg:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4"
        >
          {mainNav.map((item) => (
            <NavSectionLink
              key={item.sectionId}
              sectionId={item.sectionId}
              label={item.label}
              onNavigate={closeMobile}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeClassName="bg-muted text-primary"
            />
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
            {registerNav.map((item) => (
              <Button key={item.to} variant="outline" asChild>
                <Link to={item.to} onClick={closeMobile}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
