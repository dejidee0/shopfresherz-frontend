'use client'

import { useEffect, useState } from 'react'

/**
 * True only on devices with a real hover-capable pointer (mouse/trackpad).
 * Used to skip attaching cursor-tracking handlers (tilt, magnetic pull) on
 * touch devices, where they'd be dead weight — most customers here are on
 * mobile Nigerian networks, so this matters for performance.
 */
export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHasHover(mq.matches)
    const listener = (e: MediaQueryListEvent) => setHasHover(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  return hasHover
}
