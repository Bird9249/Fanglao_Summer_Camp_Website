import * as React from 'react'
import {
  CAMP_OPEN_DATE,
  getCountdownParts,
  type CountdownParts,
} from '~/lib/camp-countdown'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete: () => void,
) {
  let start: number | null = null
  let frame = 0

  const step = (timestamp: number) => {
    if (start === null) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    const eased = 1 - (1 - progress) ** 3
    onUpdate(Math.round(from + (to - from) * eased))
    if (progress < 1) {
      frame = requestAnimationFrame(step)
    } else {
      onUpdate(to)
      onComplete()
    }
  }

  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export function useAnimatedCountdown(active: boolean) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [display, setDisplay] = React.useState<CountdownParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    totalMs: 0,
  })
  const [live, setLive] = React.useState(false)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (!active || hasAnimated.current) return
    hasAnimated.current = true

    const target = getCountdownParts(CAMP_OPEN_DATE)

    if (prefersReducedMotion) {
      setDisplay(target)
      setLive(true)
      return
    }

    const cancelFns: Array<() => void> = []
    let completed = 0

    const onPartDone = () => {
      completed += 1
      if (completed === 3) setLive(true)
    }

    cancelFns.push(
      animateValue(0, target.days, 1400, (days) => {
        setDisplay((current) => ({ ...current, days }))
      }, onPartDone),
    )
    cancelFns.push(
      animateValue(0, target.hours, 1200, (hours) => {
        setDisplay((current) => ({ ...current, hours }))
      }, onPartDone),
    )
    cancelFns.push(
      animateValue(0, target.minutes, 1000, (minutes) => {
        setDisplay((current) => ({ ...current, minutes }))
      }, onPartDone),
    )

    setDisplay((current) => ({ ...current, totalMs: target.totalMs }))

    return () => cancelFns.forEach((cancel) => cancel())
  }, [active, prefersReducedMotion])

  React.useEffect(() => {
    if (!live) return

    const sync = () => {
      setDisplay(getCountdownParts(CAMP_OPEN_DATE))
    }

    sync()
    const interval = window.setInterval(sync, 60_000)
    return () => window.clearInterval(interval)
  }, [live])

  return { display, live, campStarted: display.totalMs === 0 && live }
}
