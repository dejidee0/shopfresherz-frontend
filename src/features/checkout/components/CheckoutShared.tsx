'use client'

import Image from 'next/image'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiChevronRight,
  FiTag,
} from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { cn, formatPrice } from '@/lib/utils/format'
import type { CheckoutStep, CouponState } from '../types/checkout'

const VAT_RATE = 0.075

export function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  className,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  error?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-sm font-medium text-[#374151]">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 px-3 rounded border text-sm text-[#111111] outline-none transition-colors placeholder:text-[#9CA3AF]',
          error ? 'border-red-400 focus:border-red-400' : 'border-[#E5E7EB] focus:border-[#F5820A]'
        )}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  className,
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  error?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-sm font-medium text-[#374151]">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 px-3 rounded border text-sm text-[#111111] bg-white outline-none transition-colors',
          error ? 'border-red-400 focus:border-red-400' : 'border-[#E5E7EB] focus:border-[#F5820A]'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

export function RadioOption({
  label,
  subtitle,
  price,
  selected,
  onSelect,
}: {
  label: string
  subtitle: string
  price?: string | null
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-lg border text-left transition-colors',
        selected ? 'border-[#F5820A] bg-orange-50/40' : 'border-[#E5E7EB] bg-white hover:border-[#F5820A]/40'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#111111]">{label}</p>
        <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        {price !== undefined && (
          <span className={cn('text-sm font-semibold', price === null || price === 'Free' ? 'text-green-500' : 'text-[#111111]')}>
            {price === null ? 'Free' : price}
          </span>
        )}
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
            selected ? 'border-green-500' : 'border-[#D1D5DB]'
          )}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
        </div>
      </div>
    </button>
  )
}

const STEPS: { n: CheckoutStep; label: string }[] = [
  { n: 1, label: 'Billing Info' },
  { n: 2, label: 'Delivery' },
  { n: 3, label: 'Payment' },
  { n: 4, label: 'Review' },
]

export function StepIndicator({ step }: { step: CheckoutStep }) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto">
      {STEPS.map(({ n, label }, i) => {
        const done = n < step
        const active = n === step
        return (
          <div key={n} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                  done ? 'bg-green-500 text-white' : active ? 'bg-[#F5820A] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                )}
              >
                {done ? <FiCheckCircle size={13} /> : n}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block whitespace-nowrap transition-colors',
                  active ? 'text-[#F5820A]' : done ? 'text-green-600' : 'text-[#6B7280]'
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <FiChevronRight size={14} className="text-[#D1D5DB] shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function StepNavButtons({
  onBack,
  onContinue,
  continueLabel = 'CONTINUE',
}: {
  onBack: () => void
  onContinue: () => void
  continueLabel?: string
}) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onBack}
        className="flex-1 sm:flex-none h-12 md:px-6 rounded border border-[#E5E7EB] text-sm font-semibold text-[#374151] flex items-center justify-center gap-2 hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
      >
        <FiArrowLeft size={15} /> BACK
      </button>
      <button
        onClick={onContinue}
        className="flex-1 h-12 text-xs md:text-base rounded bg-[#F5820A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#E06B00] transition-colors"
      >
        {continueLabel} <FiArrowRight size={15} />
      </button>
    </div>
  )
}

export function OrderSummary({
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
}: {
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon?: () => void
  deliveryFee: number
}) {
  const items = useCartStore((s) => s.items)
  const discountAmount = useCartStore((s) => s.discountAmount)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const tax = taxableAmount * VAT_RATE
  const total = taxableAmount + deliveryFee + tax

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
        <p className="text-sm font-bold text-[#111111] mb-4">Order Summary</p>

        <div className="flex flex-col gap-4 mb-4">
          {items.length === 0 && (
            <p className="text-sm text-[#6B7280]">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-[#F5F5F5] shrink-0 overflow-hidden">
                <Image
                  src={item.image || '/images/device-placeholder.jpg'}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#111111] truncate">{item.name}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {item.quantity} x{' '}
                  <span className="text-[#F5820A] font-semibold">{formatPrice(item.price)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#F5F5F5] pt-3 space-y-2">
          {[
            { label: 'Sub-total', value: formatPrice(subtotal) },
            { label: 'Shipping', value: deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee) },
            {
              label: 'Discount',
              value: discountAmount > 0 ? `-${formatPrice(discountAmount)}` : formatPrice(0),
              accent: 'text-red-500',
            },
            { label: 'VAT (7.5%)', value: formatPrice(tax) },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-[#6B7280]">{label}</span>
              <span className={cn('font-medium text-[#111111]', accent)}>{value}</span>
            </div>
          ))}

          <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#F5F5F5]">
            <span className="text-[#111111]">Total</span>
            <span className="text-[#111111]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <FiTag size={14} className="text-[#F5820A]" />
          <p className="text-sm font-bold text-[#111111]">Coupon Code</p>
        </div>
        {coupon.applied ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <FiCheckCircle size={14} />
              <span>{coupon.code.toUpperCase()} applied</span>
            </div>
            {onRemoveCoupon && (
              <button
                onClick={onRemoveCoupon}
                className="text-xs font-semibold text-[#F5820A] hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon.code}
              onChange={(e) => onCouponChange(e.target.value)}
              className="h-10 px-3 rounded border border-[#E5E7EB] text-sm outline-none focus:border-[#F5820A] transition-colors placeholder:text-[#9CA3AF]"
            />
            <button
              onClick={onApplyCoupon}
              disabled={!coupon.code.trim()}
              className="h-10 rounded bg-[#6B21A8] text-white text-sm font-semibold hover:bg-[#581C87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              APPLY COUPON
            </button>
            {coupon.error && <p className="text-xs text-red-500">{coupon.error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export function CheckoutLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="w-full lg:w-[280px] xl:w-[300px] shrink-0">{sidebar}</div>
    </div>
  )
}
