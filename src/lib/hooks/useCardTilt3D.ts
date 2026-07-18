'use client'

import { useEffect, useRef } from 'react'

const MAX_TILT_DEG = 12
const TOUCH_GLOW_MS = 500

/**
 * Dramatic 3D tilt + cursor-tracking glow for product cards. Ref-driven
 * (direct DOM style mutation, no React re-renders per mousemove) paired
 * with a plain CSS `transition: transform 0.15s ease-out` on
 * `.sf-tilt-card-inner` for the snap-to-cursor feel, and `.sf-tilt-glow`
 * for the cursor-following radial glow (see globals.css).
 *
 * Unlike a naive implementation that listens on `document`, this scopes
 * mousemove/mouseleave to the card element itself, so the tilt reacts to
 * cursor position *within the card*, not anywhere on the page.
 *
 * Touch devices get no continuous tilt (no persistent cursor to track) —
 * a tap instead briefly flashes the glow via `.sf-tilt-active`.
 */
export function useCardTilt3D<T extends HTMLElement = HTMLDivElement>() {
  const outerRef = useRef<T | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let touchTimeout: ReturnType<typeof setTimeout> | null = null

    function handleMouseMove(e: MouseEvent) {
      const r = outer!.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const rx = (0.5 - py) * MAX_TILT_DEG * 2
      const ry = (px - 0.5) * MAX_TILT_DEG * 2
      inner!.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      outer!.style.setProperty('--gx', `${px * 100}%`)
      outer!.style.setProperty('--gy', `${py * 100}%`)
    }

    function handleMouseLeave() {
      inner!.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }

    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0]
      if (!touch) return
      const r = outer!.getBoundingClientRect()
      const px = (touch.clientX - r.left) / r.width
      const py = (touch.clientY - r.top) / r.height
      outer!.style.setProperty('--gx', `${px * 100}%`)
      outer!.style.setProperty('--gy', `${py * 100}%`)
      outer!.classList.add('sf-tilt-active')
      if (touchTimeout) clearTimeout(touchTimeout)
      touchTimeout = setTimeout(() => {
        outer!.classList.remove('sf-tilt-active')
      }, TOUCH_GLOW_MS)
    }

    outer.addEventListener('mousemove', handleMouseMove)
    outer.addEventListener('mouseleave', handleMouseLeave)
    outer.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      outer.removeEventListener('mousemove', handleMouseMove)
      outer.removeEventListener('mouseleave', handleMouseLeave)
      outer.removeEventListener('touchstart', handleTouchStart)
      if (touchTimeout) clearTimeout(touchTimeout)
    }
  }, [])

  return { outerRef, innerRef }
}
