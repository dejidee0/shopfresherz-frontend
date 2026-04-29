'use client'

import { useState, useCallback, useRef } from 'react'
import { cn, formatPrice } from '@/lib/utils/format'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (range: [number, number]) => void
  step?: number
  className?: string
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1000,
  className,
}: PriceRangeSliderProps) {
  const [localMin, localMax] = value
  const trackRef = useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const toPercent = (v: number) => ((v - min) / (max - min)) * 100

  // Handle dragging either thumb
  function handleThumbDrag(
    thumb: 'min' | 'max',
    e: React.MouseEvent | React.TouchEvent
  ) {
    e.preventDefault()
    const track = trackRef.current
    if (!track) return

    function getX(ev: MouseEvent | TouchEvent) {
      return 'touches' in ev ? ev.touches[0].clientX : ev.clientX
    }

    function update(ev: MouseEvent | TouchEvent) {
      const rect = track!.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (getX(ev) - rect.left) / rect.width))
      const raw = min + ratio * (max - min)
      const snapped = Math.round(raw / step) * step
      const clamped = clamp(snapped)

      if (thumb === 'min') {
        onChange([Math.min(clamped, localMax - step), localMax])
      } else {
        onChange([localMin, Math.max(clamped, localMin + step)])
      }
    }

    function stop() {
      window.removeEventListener('mousemove', update)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchmove', update)
      window.removeEventListener('touchend', stop)
    }

    window.addEventListener('mousemove', update)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchmove', update)
    window.addEventListener('touchend', stop)
  }

  const minPct = toPercent(localMin)
  const maxPct = toPercent(localMax)

  return (
    <div className={cn('w-full', className)}>
      {/* Track */}
      <div ref={trackRef} className="relative h-1.5 bg-[#E5E7EB] rounded-full mx-2 my-5 cursor-pointer">
        {/* Active range fill */}
        <div
          className="absolute h-full bg-[#F5820A] rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        {/* Min thumb */}
        <Thumb
          percent={minPct}
          onDrag={(e) => handleThumbDrag('min', e)}
          aria-label="Minimum price"
          aria-valuenow={localMin}
          aria-valuemin={min}
          aria-valuemax={localMax}
        />

        {/* Max thumb */}
        <Thumb
          percent={maxPct}
          onDrag={(e) => handleThumbDrag('max', e)}
          aria-label="Maximum price"
          aria-valuenow={localMax}
          aria-valuemin={localMin}
          aria-valuemax={max}
        />
      </div>

      {/* Price display */}
      <div className="flex items-center justify-between text-xs text-[#6B7280] mt-1">
        <div className="border border-[#E5E7EB] rounded px-2 py-1">
          <span className="font-medium text-[#111111]">{formatPrice(localMin)}</span>
        </div>
        <div className="h-px w-3 bg-[#E5E7EB]" />
        <div className="border border-[#E5E7EB] rounded px-2 py-1">
          <span className="font-medium text-[#111111]">{formatPrice(localMax)}</span>
        </div>
      </div>
    </div>
  )
}

interface ThumbProps {
  percent: number
  onDrag: (e: React.MouseEvent | React.TouchEvent) => void
  'aria-label': string
  'aria-valuenow': number
  'aria-valuemin': number
  'aria-valuemax': number
}

function Thumb({ percent, onDrag, ...aria }: ThumbProps) {
  return (
    <div
      role="slider"
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F5820A] border-2 border-white shadow-md cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-[#F5820A]/40 z-10"
      style={{ left: `${percent}%` }}
      onMouseDown={onDrag}
      onTouchStart={onDrag}
      tabIndex={0}
      {...aria}
    />
  )
}