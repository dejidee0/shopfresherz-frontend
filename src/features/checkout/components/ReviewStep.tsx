'use client'

import Image from 'next/image'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { cn, formatPrice } from '@/lib/utils/format'
import { OrderSummary, CheckoutLayout, StepIndicator } from './CheckoutShared'
import {
  type DeliveryMethod,
  type PaymentMethod,
  type CouponState,
  DELIVERY_OPTIONS,
} from '../types/checkout'
import type { Address } from '@/lib/api/account'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[rgba(0,0,0,0.07)] last:border-0 gap-4">
      <span className="text-xs font-bold uppercase tracking-wider text-[#888888] shrink-0 w-24">
        {label}
      </span>
      <span className="text-sm text-[#111111] text-right">{value || '—'}</span>
    </div>
  )
}

interface Props {
  // Address selected in RegisteredCheckout
  selectedAddress: Address | null
  delivery: DeliveryMethod
  payment: PaymentMethod
  phone: string
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon?: () => void
  deliveryFee: number
  isPlacingOrder?: boolean
  onBack: () => void
  onPlaceOrder: () => void | Promise<void>
}

export function ReviewStep({
  selectedAddress,
  delivery,
  payment,
  phone,
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  isPlacingOrder = false,
  onBack,
  onPlaceOrder,
}: Props) {
  const { user } = useAuthStore()
  const items          = useCartStore((s) => s.items)
  const subtotal       = useCartStore((s) => s.subtotal())
  const discountAmount = useCartStore((s) => s.discountAmount)
  const taxable        = Math.max(0, subtotal - discountAmount)
  const total          = taxable + deliveryFee + taxable * 0.075

  const paymentLabel: Record<PaymentMethod, string> = {
    card:            'Debit / Credit Card',
    bank_transfer:   'Bank Transfer',
    pay_on_delivery: 'Pay on Delivery',
  }

  const deliveryDetail = (() => {
    const opt = DELIVERY_OPTIONS.find((d) => d.id === delivery)
    return opt ? `${opt.label} — ${opt.subtitle}` : delivery
  })()

  // Build full address string from the selected Address object
  const addressLine = selectedAddress
    ? [
        selectedAddress.line1,
        selectedAddress.line2,
        selectedAddress.city,
        selectedAddress.state,
        selectedAddress.postalCode,
        'Nigeria',
      ]
        .filter(Boolean)
        .join(', ')
    : '—'

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'

  return (
    <CheckoutLayout
      sidebar={
        <OrderSummary
          coupon={coupon}
          onCouponChange={onCouponChange}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          deliveryFee={deliveryFee}
        />
      }
    >
      <StepIndicator step={4} />
      <h2 className="text-lg font-bold text-[#111111] mb-5">Review Your Order</h2>

      {/* ── Cart items ── */}
      <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-lg overflow-hidden mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
        {items.length === 0 && (
          <p className="p-4 text-sm text-[#888888]">Your cart is empty.</p>
        )}
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-4 px-4 py-3',
              i < items.length - 1 && 'border-b border-[rgba(0,0,0,0.06)]',
            )}
          >
            <div className="w-14 h-14 rounded bg-[#F0F0F0] shrink-0 overflow-hidden">
              <Image
                src={item.image || '/images/device-placeholder.jpg'}
                alt={item.name}
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111111] line-clamp-1">{item.name}</p>
              <p className="text-xs text-[#888888] mt-0.5">
                Qty {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <p className="text-sm font-bold text-[#111111] shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* ── Delivery details ── */}
      <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-lg p-4 sm:p-5 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
        <p className="text-sm font-bold text-[#111111] mb-2">Delivery Details</p>
        <DetailRow label="Name"     value={fullName} />
        <DetailRow label="Email"    value={user?.email    || '—'} />
        <DetailRow label="Phone"    value={phone || user?.phone || '—'} />
        <DetailRow label="Address"  value={addressLine} />
        <DetailRow label="Delivery" value={deliveryDetail} />
        <DetailRow label="Payment"  value={paymentLabel[payment]} />
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 sm:flex-none h-12 px-6 rounded border border-[rgba(0,0,0,0.12)] text-sm font-semibold text-[#666666] flex items-center justify-center gap-2 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
        >
          <FiArrowLeft size={15} /> BACK
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={items.length === 0 || isPlacingOrder}
          className="flex-1 text-xs md:text-base h-12 rounded sf-btn-primary text-white font-bold flex items-center justify-center gap-2 disabled:bg-none disabled:bg-[#E0E0E0] disabled:text-[#AAAAAA] disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? 'PLACING ORDER...' : `PLACE ORDER — ${formatPrice(total)}`} <FiArrowRight className="hidden md:flex" size={15} />
        </button>
      </div>
    </CheckoutLayout>
  )
}
