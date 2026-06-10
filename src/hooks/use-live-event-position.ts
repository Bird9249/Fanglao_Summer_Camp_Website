import * as React from 'react'
import {
  eventDaySlots,
  findActiveEventSlotIndex,
  getCurrentEventMinutes,
  getLaosNow,
  isEventDayLive,
} from '~/lib/camp-schedule'

const UPDATE_INTERVAL_MS = 45_000

export function useLiveEventPosition(
  containerRef: React.RefObject<HTMLElement | null>,
  slotRefs: React.RefObject<(HTMLElement | null)[]>,
) {
  const [mounted, setMounted] = React.useState(false)
  const [trackerTop, setTrackerTop] = React.useState<number | null>(null)
  const [activeSlotIndex, setActiveSlotIndex] = React.useState<number | null>(
    null,
  )
  const [isLive, setIsLive] = React.useState(false)

  const updatePosition = React.useCallback(() => {
    const now = getLaosNow()
    const live = isEventDayLive(now)
    setIsLive(live)

    if (!live) {
      setTrackerTop(null)
      setActiveSlotIndex(null)
      return
    }

    const elapsed = getCurrentEventMinutes(now)
    if (elapsed === null) {
      setTrackerTop(null)
      setActiveSlotIndex(null)
      return
    }

    const slotIndex = findActiveEventSlotIndex(elapsed)
    setActiveSlotIndex(slotIndex)

    const container = containerRef.current
    const refs = slotRefs.current
    if (!container || !refs?.length || slotIndex === null) {
      setTrackerTop(null)
      return
    }

    const slotEl = refs[slotIndex]
    if (!slotEl) {
      setTrackerTop(null)
      return
    }

    const slot = eventDaySlots[slotIndex]
    const slotDuration = slot.endMinutes - slot.startMinutes
    const progressInSlot =
      slotDuration > 0
        ? Math.min(
            1,
            Math.max(0, (elapsed - slot.startMinutes) / slotDuration),
          )
        : 0

    const containerRect = container.getBoundingClientRect()
    const slotRect = slotEl.getBoundingClientRect()
    const slotTop = slotRect.top - containerRect.top
    const top = slotTop + slotRect.height * progressInSlot
    setTrackerTop(top)
  }, [containerRef, slotRefs])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    updatePosition()
    const interval = window.setInterval(updatePosition, UPDATE_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [mounted, updatePosition])

  return { mounted, isLive, trackerTop, activeSlotIndex }
}
