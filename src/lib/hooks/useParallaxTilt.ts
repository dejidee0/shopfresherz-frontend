'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'

interface ParallaxTiltOptions {
  /** Max tilt in degrees for the mouse-driven (desktop) effect. */
  maxTiltMouse?: number
  /** Max tilt in degrees for the gyro-driven (mobile) effect. */
  maxTiltGyro?: number
  /**
   * When this ref reads true, tilt updates are suspended and the element
   * snaps back to flat — used to stand down while pinch/scroll zoom or the
   * lightbox is active so we never fight the zoom transforms.
   */
  disabledRef?: MutableRefObject<boolean>
}

/**
 * Parallax tilt for the PDP hero image: mouse-position tilt on
 * hover-capable devices, device-orientation (gyroscope) tilt on touch
 * devices. Ref-driven DOM writes (no React re-renders per event), paired
 * with the existing `.sf-tilt-card` / `.sf-tilt-card-inner` CSS
 * (perspective + `transform .15s ease-out`).
 *
 * Gyro specifics:
 * - The first orientation reading becomes the neutral baseline, so the
 *   user's natural holding angle isn't already "tilted".
 * - iOS requires permission via DeviceOrientationEvent.requestPermission(),
 *   which must run inside a user gesture — we request it once on the first
 *   touch of the element, and silently do nothing if denied/unavailable.
 *   The page never blocks on a permission prompt.
 */
export function useParallaxTilt<T extends HTMLElement = HTMLDivElement>({
  maxTiltMouse = 5,
  maxTiltGyro = 6,
  disabledRef,
}: ParallaxTiltOptions = {}) {
  const outerRef = useRef<T | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const setTilt = (rx: number, ry: number) => {
      if (disabledRef?.current) {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)'
        return
      }
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const resetTilt = () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }

    // ── Desktop: cursor-position parallax ─────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const r = outer.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      // Tilt away from the cursor (image leans back where the cursor is)
      setTilt((py - 0.5) * maxTiltMouse * 2, (0.5 - px) * maxTiltMouse * 2)
    }

    // ── Mobile: gyroscope parallax ────────────────────────────────────
    let baseline: { beta: number; gamma: number } | null = null
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      if (!baseline) baseline = { beta: e.beta, gamma: e.gamma }
      const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v))
      // ±18° of physical device tilt maps to the full visual range
      const dBeta = clamp(e.beta - baseline.beta, 18) / 18
      const dGamma = clamp(e.gamma - baseline.gamma, 18) / 18
      setTilt(-dBeta * maxTiltGyro, dGamma * maxTiltGyro)
    }

    let orientationAttached = false
    const attachOrientation = () => {
      if (orientationAttached) return
      orientationAttached = true
      window.addEventListener('deviceorientation', handleOrientation)
    }

    let permissionRequested = false
    const handleFirstTouch = () => {
      if (permissionRequested) return
      permissionRequested = true
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof DOE.requestPermission === 'function') {
        // iOS 13+: must be called from a user gesture; ignore rejection.
        DOE.requestPermission()
          .then((state) => {
            if (state === 'granted') attachOrientation()
          })
          .catch(() => {})
      }
    }

    if (hasHover) {
      outer.addEventListener('mousemove', handleMouseMove)
      outer.addEventListener('mouseleave', resetTilt)
    } else {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: unknown }
      if (typeof window.DeviceOrientationEvent !== 'undefined') {
        if (typeof DOE.requestPermission === 'function') {
          // iOS: wait for a user gesture before asking
          outer.addEventListener('touchstart', handleFirstTouch, { passive: true })
        } else {
          // Android and others: no permission needed
          attachOrientation()
        }
      }
    }

    return () => {
      outer.removeEventListener('mousemove', handleMouseMove)
      outer.removeEventListener('mouseleave', resetTilt)
      outer.removeEventListener('touchstart', handleFirstTouch)
      if (orientationAttached) {
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }
  }, [maxTiltMouse, maxTiltGyro, disabledRef])

  return { outerRef, innerRef }
}
