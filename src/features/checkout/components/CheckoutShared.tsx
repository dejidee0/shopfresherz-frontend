'use client'

import Image from 'next/image'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiTag,
} from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { cn, formatPrice } from '@/lib/utils/format'
import type { CheckoutStep, CouponState } from '../types/checkout'

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
      {label && <label className="mb-1.5 text-[12px] font-medium text-[#666666]">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'input-light h-10 px-3 text-sm',
          error ? 'border-red-400 focus:border-red-400' : ''
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
      {label && <label className="mb-1.5 text-[12px] font-medium text-[#666666]">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 px-3 rounded-[8px] border border-[rgba(0,0,0,0.12)] text-sm text-[#111111] bg-white outline-none transition-colors focus:border-[rgba(249,115,22,0.5)]',
          error ? 'border-red-400 focus:border-red-400' : ''
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
        'w-full flex items-center justify-between p-3 sm:p-4 rounded-[10px] border text-left transition-all',
        selected ? 'border-[#F97316] bg-[#FFF8F3] shadow-[0_0_0_2px_rgba(249,115,22,0.15)]' : 'border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] hover:border-[#F97316]/40'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#111111]">{label}</p>
        <p className="text-xs text-[#666666] mt-0.5">{subtitle}</p>
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
            selected ? 'border-[#F97316]' : 'border-[#D1D5DB]'
          )}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />}
        </div>
      </div>
    </button>
  )
}

export function PaymentOptionCard({
  icon,
  label,
  sublabel,
  badge,
  selected,
  onSelect,
  disabled = false,
  disabledReason,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  badge?: string
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  disabledReason?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      className={cn(
        'w-full flex items-center gap-3.5 rounded-[12px] text-left px-5 py-4 transition-all',
        disabled
          ? 'border-[1.5px] border-[#E5E7EB] bg-[#F7F7F7] opacity-60 cursor-not-allowed'
          : selected
            ? 'border-2 border-[#F97316] bg-[#FFF8F3] shadow-[0_0_0_3px_rgba(249,115,22,0.1)]'
            : 'border-[1.5px] border-[#E5E7EB] bg-white hover:border-[#F97316]/40'
      )}
    >
      <span
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
          selected && !disabled ? 'border-[#F97316]' : 'border-[#D1D5DB]'
        )}
      >
        {selected && !disabled && <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />}
      </span>
      <span className="shrink-0 text-[#F97316] flex items-center justify-center w-[18px]">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-bold text-[#111111]">{label}</span>
        <span className="block text-[12px] text-[#888888] mt-0.5">{sublabel}</span>
        {disabled && disabledReason && (
          <span className="block text-[11px] text-[#F97316] font-medium mt-1">{disabledReason}</span>
        )}
      </span>
      {badge && !disabled && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-white bg-[#F97316] rounded-full px-2.5 py-1">
          {badge}
        </span>
      )}
    </button>
  )
}

// Progress steps shown at the top of checkout: Delivery -> Payment -> Review.
// CheckoutStep 1 (address selection) and 2 (delivery method) both map to "Delivery".
const PROGRESS_STEPS: { n: CheckoutStep; label: string }[] = [
  { n: 1, label: 'Delivery' },
  { n: 3, label: 'Payment' },
  { n: 4, label: 'Review' },
]

export function StepIndicator({ step }: { step: CheckoutStep }) {
  const activeIndex = step === 2 ? 0 : PROGRESS_STEPS.findIndex((s) => s.n === step)

  return (
    <div className="flex items-start justify-center gap-0 mb-8 max-w-md mx-auto">
      {PROGRESS_STEPS.map(({ label }, i) => {
        const done = i < activeIndex
        const active = i === activeIndex
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                  done || active ? 'bg-[#F97316] text-white' : 'bg-[#E5E5E5] text-[#999999]'
                )}
              >
                {done ? <FiCheckCircle size={15} /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-[11px] whitespace-nowrap transition-colors',
                  active ? 'text-[#F97316] font-bold' : done ? 'text-[#F97316] font-medium' : 'text-[#999999] font-medium'
                )}
              >
                {label}
              </span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-[2px] mx-2 mb-5 rounded-full transition-colors',
                  done ? 'bg-[#F97316]' : 'bg-[#E5E5E5]'
                )}
              />
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
        className="flex-1 sm:flex-none h-12 md:px-6 rounded-[8px] border border-[rgba(0,0,0,0.12)] text-sm font-semibold text-[#666666] flex items-center justify-center gap-2 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
      >
        <FiArrowLeft size={15} /> BACK
      </button>
      <button
        onClick={onContinue}
        className="sf-btn-primary flex-1 h-12 text-xs md:text-base rounded-[10px] font-semibold"
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
  const total = taxableAmount + deliveryFee

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <p className="text-[18px] font-bold text-[#111111] mb-4">Order Summary</p>

        <div className="flex flex-col mb-4">
          {items.length === 0 && (
            <p className="text-sm text-[#666666]">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
              <div className="w-12 h-12 rounded-[8px] bg-[#F0F0F0] shrink-0 overflow-hidden">
                <Image
                  src={item.image || '/images/device-placeholder.jpg'}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#111111] truncate">{item.name}</p>
                <p className="text-[12px] text-[#666666] mt-0.5">
                  {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                </p>
              </div>
              <span className="text-[13px] font-semibold text-[#F97316]">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-1 space-y-2">
          {[
            { label: 'Sub-total', value: formatPrice(subtotal) },
            { label: 'Shipping', value: deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee) },
            {
              label: 'Discount',
              value: discountAmount > 0 ? `-${formatPrice(discountAmount)}` : formatPrice(0),
              accent: 'text-red-500',
            },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex justify-between text-[14px]">
              <span className="text-[#666666]">{label}</span>
              <span className={cn('font-medium text-[#111111]', accent)}>{value}</span>
            </div>
          ))}

          <div className="flex justify-between text-[20px] font-extrabold pt-3 mt-2 border-t border-[rgba(0,0,0,0.08)]">
            <span className="text-[#111111]">Total</span>
            <span className="text-[#111111]">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-[rgba(0,0,0,0.06)] text-[11px] text-[#999999]">
          <span className="flex items-center gap-1">
            <FiLock size={12} /> Secure Checkout
          </span>
          <span className="text-[#D1D5DB]">·</span>
          <span className="flex items-center gap-1">
            <FiShield size={12} /> SSL Encrypted
          </span>
        </div>
      </div>

      <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 mb-3">
          <FiTag size={14} className="text-[#F97316]" />
          <p className="text-[14px] font-medium text-[#111111]">Coupon Code</p>
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
                className="text-xs font-semibold text-[#F97316] hover:underline"
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
              className="h-10 px-3 text-[14px] rounded-[8px] border border-[rgba(0,0,0,0.1)] bg-[#F8F8F8] text-[#111111] placeholder:text-[#AAAAAA] outline-none transition-colors focus:border-[rgba(249,115,22,0.5)]"
            />
            <button
              onClick={onApplyCoupon}
              disabled={!coupon.code.trim()}
              className="sf-btn-primary h-11 rounded-[8px] text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-6">{sidebar}</div>
    </div>
  )
}
