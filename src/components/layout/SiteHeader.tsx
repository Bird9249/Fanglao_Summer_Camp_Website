import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { RiCloseFill, RiMenuFill } from '@remixicon/react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import { scrollToSection } from '~/lib/scroll-to-section'
import { cn } from '~/lib/utils'
import { FanglaoLogo } from '~/components/brand/FanglaoLogo'
import { NavSectionLink } from './NavSectionLink'
import { mainNav } from './nav'

const navLinkClass =
  'site-header-nav-link text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground'

const navLinkActiveClass = 'site-header-nav-link--active'

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
    <header className="site-header sticky top-0 z-40 border-b backdrop-blur-lg">
      <div
        aria-hidden
        className="site-header-glow pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 md:h-[4.25rem]">
        <a
          href="/#hero-section"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90"
          onClick={goHome}
          aria-label="Fanglao Studio — ໜ້າຫຼັກ"
        >
          <FanglaoLogo />
        </a>

        <nav
          aria-label="Main navigation"
          className="ml-auto hidden items-center gap-7 lg:flex"
        >
          {mainNav.map((item) => (
            <NavSectionLink
              key={item.sectionId}
              sectionId={item.sectionId}
              label={item.label}
              className={navLinkClass}
              activeClassName={navLinkActiveClass}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button
            variant="outline"
            size="sm"
            className="site-header-cta--jam font-heading text-xs font-bold uppercase tracking-wider"
            asChild
          >
            <Link to="/register/jam">Jam</Link>
          </Button>
          <Button
            size="sm"
            className="site-header-cta--camp font-heading text-xs font-bold uppercase tracking-wider"
            asChild
          >
            <Link to="/register/camp">ລົງທະບຽນ</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto text-foreground hover:bg-primary/10 hover:text-primary lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'ປິດເມນູ' : 'ເປີດເມນູ'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <RiCloseFill /> : <RiMenuFill />}
        </Button>
      </div>

      <div
        className={cn(
          'site-header-mobile relative border-t lg:hidden',
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
              className={cn(
                navLinkClass,
                'rounded-lg px-3 py-2.5 tracking-wide hover:bg-primary/8',
              )}
              activeClassName={cn(navLinkActiveClass, 'bg-primary/10')}
            />
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-primary/15 pt-4">
            <Button
              variant="outline"
              className="site-header-cta--jam font-heading font-bold uppercase tracking-wider"
              asChild
            >
              <Link to="/register/jam" onClick={closeMobile}>
                ລົງທະບຽນ Jam
              </Link>
            </Button>
            <Button
              className="site-header-cta--camp font-heading font-bold uppercase tracking-wider"
              asChild
            >
              <Link to="/register/camp" onClick={closeMobile}>
                ລົງທະບຽນ Camp
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
