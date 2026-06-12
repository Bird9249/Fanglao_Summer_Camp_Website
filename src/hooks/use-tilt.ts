import * as React from 'react'

const MAX_TILT_DEG = 8

/**
 * 3D tilt that follows the pointer. Writes rotation + splash-origin to CSS vars
 * via rAF (no React re-render). Pass `enabled: false` to disable on touch
 * devices or when the user prefers reduced motion.
 */
export function useTilt<T extends HTMLElement>(enabled: boolean) {
  const ref = React.useRef<T>(null)
  const frameRef = React.useRef(0)

  const apply = React.useCallback((rotateX: number, rotateY: number, px: number, py: number) => {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
    node.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
    node.style.setProperty('--splash-x', `${px.toFixed(1)}%`)
    node.style.setProperty('--splash-y', `${py.toFixed(1)}%`)
  }, [])

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<T>) => {
      if (!enabled) return
      const node = ref.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      const rotateY = (x - 0.5) * 2 * MAX_TILT_DEG
      const rotateX = (0.5 - y) * 2 * MAX_TILT_DEG

      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        apply(rotateX, rotateY, x * 100, y * 100)
      })
    },
    [apply, enabled],
  )

  const handlePointerLeave = React.useCallback(() => {
    if (!enabled) return
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      apply(0, 0, 50, 50)
    })
  }, [apply, enabled])

  React.useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  return {
    ref,
    tiltProps: enabled
      ? { onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave }
      : {},
  }
}
