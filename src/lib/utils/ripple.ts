import type { MouseEvent } from 'react'

/**
 * Spawns a one-off ripple element at the click point, matching a plain
 * CSS keyframe animation (`.sf-ripple` / `@keyframes sf-ripple` in
 * globals.css) rather than React state — the ripple is purely visual
 * and self-removing, so there's no need to route it through render.
 */
export function spawnRipple(e: MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const ripple = document.createElement('span')
  ripple.className = 'sf-ripple'
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`
  btn.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}
