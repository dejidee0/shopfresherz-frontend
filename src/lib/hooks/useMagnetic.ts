'use client'

import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import type { MouseEvent } from 'react'

interface MagneticHandlers {
  style: { x: MotionValue<number>; y: MotionValue<number> }
  onMouseMove: (e: MouseEvent<HTMLElement>) => void
  onMouseLeave: () => void
}

/**
 * Magnetic-pull effect for CTAs — the element shifts slightly toward the
 * cursor on hover. Motion values drive the transform directly (no React
 * re-renders), so this stays cheap even with many buttons on a page.
 * No-ops under prefers-reduced-motion.
 */
export function useMagnetic(strength = 0.25): MagneticHandlers {
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { style: { x: springX, y: springY }, onMouseMove, onMouseLeave }
}
