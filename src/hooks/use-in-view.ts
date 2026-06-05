import * as React from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = React.useRef<HTMLElement>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px', ...options },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}
