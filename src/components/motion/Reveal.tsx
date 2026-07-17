'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface RevealProps {
  children: ReactNode
  /** Stagger delay in seconds — pass index * 0.04 (capped) for grid items. */
  delay?: number
  duration?: number
  className?: string
}

/**
 * Fade + slide-up reveal on scroll into view. `whileInView` + `viewport.once`
 * means the animation only runs once per element and Framer Motion handles
 * the IntersectionObserver internally — cheap even with many instances on a
 * page. Skips the animated state entirely under prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, duration = 0.35, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
