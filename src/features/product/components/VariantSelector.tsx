'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import type { ProductVariant } from '@/lib/types/product'

// ─── Color swatch ─────────────────────────────────────────────────────────────

interface ColorSwatchProps {
  variants: ProductVariant[]
  selected: string | null
  onSelect: (id: string) => void
}

export function ColorSwatches({ variants, selected, onSelect }: ColorSwatchProps) {
  if (!variants.length) return null

  return (
    <div>
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Color</p>
      <div className="flex items-center gap-2 flex-wrap">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            disabled={!v.inStock}
            title={v.label}
            aria-label={`${v.label}${!v.inStock ? ' (out of stock)' : ''}`}
            aria-pressed={selected === v.id}
            className={cn(
              'w-7 h-7 rounded-full border-2 transition-all duration-150 relative',
              selected === v.id ? 'border-[#F97316] scale-110 shadow-sm shadow-orange-500/20' : 'border-transparent',
              !v.inStock && 'opacity-40 cursor-not-allowed'
            )}
            style={{ backgroundColor: v.label }} // label doubles as CSS color for swatches
          >
            {selected === v.id && (
              <span className="absolute inset-0 rounded-full border-2 border-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Dropdown select ──────────────────────────────────────────────────────────

interface VariantDropdownProps {
  label: string
  variants: ProductVariant[]
  selected: string | null
  onSelect: (id: string) => void
}

export function VariantDropdown({ label, variants, selected, onSelect }: VariantDropdownProps) {
  const [open, setOpen] = useState(false)
  const selectedVariant = variants.find((v) => v.id === selected)

  return (
    <div className="relative">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">{label}</p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 flex items-center justify-between px-3 border border-black/[0.12] rounded-btn text-sm text-[#111111] bg-[#F5F5F5] hover:border-[#F97316] transition-colors"
      >
        <span>{selectedVariant?.label ?? `Select ${label}`}</span>
        <FiChevronDown
          size={14}
          className={cn('text-[#6B7280] transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#FFFFFF] border border-black/[0.1] rounded-card shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] z-20 py-1 max-h-48 overflow-y-auto">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => { onSelect(v.id); setOpen(false) }}
                disabled={!v.inStock}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-colors',
                  v.id === selected
                    ? 'text-[#F97316] font-medium bg-[#F97316]/[0.06]'
                    : 'text-[#111111] hover:bg-black/[0.05]',
                  !v.inStock && 'opacity-40 cursor-not-allowed line-through'
                )}
              >
                {v.label}
                {!v.inStock && ' (unavailable)'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
