import { Link, useRouterState } from '@tanstack/react-router'
import { RiPenNibFill } from '@remixicon/react'
import * as React from 'react'
import { cn } from '~/lib/utils'

export function FloatingRegisterFab() {
  const [visible, setVisible] = React.useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  React.useEffect(() => {
    const hero = document.getElementById('hero-section')

    if (!hero) {
      const onScroll = () => setVisible(window.scrollY > 160)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  return (
    <Link
      to="/register/camp"
      aria-label="ລົງທະບຽນ Summer Camp"
      className={cn(
        'floating-register-fab fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-primary/50 bg-primary px-4 py-3 text-primary-foreground shadow-xl shadow-primary/35 transition-all duration-300 md:right-6 md:bottom-6',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <RiPenNibFill size={18} />
      <span className="font-heading text-xs font-bold uppercase tracking-wide md:text-sm">
        ລົງທະບຽນ
      </span>
    </Link>
  )
}
