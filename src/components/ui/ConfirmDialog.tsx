'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi'
import { useConfirmStore, type ConfirmVariant } from '@/store/confirm'
import { cn } from '@/lib/utils/format'

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  {
    icon: React.ElementType
    iconBg: string
    iconColor: string
    confirmBtn: string
  }
> = {
  danger: {
    icon: FiAlertCircle,
    iconBg: 'bg-red-50',
    iconColor: 'text-[#EF4444]',
    confirmBtn:
      'bg-[#EF4444] text-white hover:bg-red-600 active:scale-[0.98]',
  },
  warning: {
    icon: FiAlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#F59E0B]',
    confirmBtn:
      'bg-[#F59E0B] text-white hover:bg-amber-500 active:scale-[0.98]',
  },
  info: {
    icon: FiInfo,
    iconBg: 'bg-orange-50',
    iconColor: 'text-[#F5820A]',
    confirmBtn:
      'bg-gradient-to-r from-[#F5820A] to-[#E06B00] text-white hover:shadow-md active:scale-[0.98]',
  },
}

export function ConfirmDialog() {
  const { isOpen, options, _answer } = useConfirmStore()

  const variant = options?.variant ?? 'danger'
  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') _answer(false)
      if (e.key === 'Enter') _answer(true)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, _answer])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !options) return null
  if (typeof window === 'undefined') return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9990 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={() => _answer(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={options.message ? 'confirm-message' : undefined}
        className="fixed inset-0 z-9991 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white rounded-modal shadow-2xl w-full max-w-100 p-6 animate-in zoom-in-95 duration-200">

          {/* Icon */}
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-4', config.iconBg)}>
            <Icon size={22} className={config.iconColor} />
          </div>

          {/* Title */}
          <h2
            id="confirm-title"
            className="text-base font-bold text-[#111111] leading-snug"
          >
            {options.title}
          </h2>

          {/* Message */}
          {options.message && (
            <p
              id="confirm-message"
              className="text-sm text-[#6B7280] mt-2 leading-relaxed"
            >
              {options.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            {/* Cancel */}
            <button
              onClick={() => _answer(false)}
              className="flex-1 h-10 border border-[#E5E7EB] rounded-btn text-sm font-semibold text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              autoFocus
            >
              {options.cancelLabel ?? 'Cancel'}
            </button>

            {/* Confirm */}
            <button
              onClick={() => _answer(true)}
              className={cn(
                'flex-1 h-10 rounded-btn text-sm font-semibold transition-all',
                config.confirmBtn
              )}
            >
              {options.confirmLabel ?? 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}