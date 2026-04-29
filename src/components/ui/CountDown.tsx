'use client'

import { useEffect, useState } from 'react'
import { getTimeRemaining, pad2 } from '@/lib/utils/format'
import { cn } from '@/lib/utils/format'

interface CountdownProps {
  endTime: string       // ISO date string
  onExpire?: () => void
  /** 'dark' = black bg with orange digits (flash deal strip)
   *  'light' = white bg with orange digits */
  variant?: 'dark' | 'light'
  className?: string
}

export function Countdown({ endTime, onExpire, variant = 'dark', className }: CountdownProps) {
  const [time, setTime] = useState(getTimeRemaining(endTime))
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endTime)
      setTime(remaining)

      if (remaining.h === 0 && remaining.m === 0 && remaining.s === 0) {
        setExpired(true)
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, onExpire])

  if (expired) return null

  const isDark = variant === 'dark'

  return (
    <div className={cn('flex items-center gap-1', className)} aria-label="Time remaining">
      <TimeBlock value={pad2(time.h)} label="h" isDark={isDark} />
      <Colon isDark={isDark} />
      <TimeBlock value={pad2(time.m)} label="m" isDark={isDark} />
      <Colon isDark={isDark} />
      <TimeBlock value={pad2(time.s)} label="s" isDark={isDark} />
    </div>
  )
}

function TimeBlock({ value, label, isDark }: { value: string; label: string; isDark: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded px-2 py-0.5 min-w-9',
        isDark ? 'bg-[#F5820A]' : 'bg-orange-50 border border-orange-200'
      )}
    >
      <span className="text-white font-bold text-sm leading-none tabular-nums">{value}</span>
      <span className="text-white/70 text-[9px] uppercase leading-none mt-0.5">{label}</span>
    </div>
  )
}

function Colon({ isDark }: { isDark: boolean }) {
  return (
    <span className={cn('font-bold text-sm', isDark ? 'text-[#F5820A]' : 'text-[#F5820A]')}>
      :
    </span>
  )
}