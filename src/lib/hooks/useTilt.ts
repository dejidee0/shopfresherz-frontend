'use client'

import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import type { MouseEvent } from 'react'

interface TiltHandlers {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  glowX: MotionValue<number>
  glowY: MotionValue<number>
  onMouseMove: (e: MouseEvent<HTMLElement>) => void
  onMouseLeave: () => void
}

/**
 * Lightweight CSS-transform 3D tilt that follows the cursor, plus motion
 * values for a cursor-tracking glow position. Pure transforms — no
 * Three.js/WebGL. Motion values update outside React's render cycle so
 * this is cheap even in dense grids. No-ops under prefers-reduced-motion;
 * callers should also skip attaching the handlers on touch devices (no
 * hover capability) since mouse-tracking has no meaning there.
 */
export function useTilt(maxTilt = 8): TiltHandlers {
  const shouldReduceMotion = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)
  const springRotateX = useSpring(rotateX, { stiffness: 250, damping: 22, mass: 0.5 })
  const springRotateY = useSpring(rotateY, { stiffness: 250, damping: 22, mass: 0.5 })

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * maxTilt * 2)
    rotateX.set(-(py - 0.5) * maxTilt * 2)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }

  const onMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return { rotateX: springRotateX, rotateY: springRotateY, glowX, glowY, onMouseMove, onMouseLeave }
}
