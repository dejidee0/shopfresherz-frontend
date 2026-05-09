'use client'

import Image from 'next/image'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { OrderSummary, CheckoutLayout } from './CheckoutShared'
import {
  type BillingForm,
  type DeliveryMethod,
  type PaymentMethod,
  type CouponState,
  DELIVERY_OPTIONS,
} from '../types/checkout'
import { cn } from '@/lib/utils/format'

// ─── Mock cart items — replace with useCartStore() ────────────────────────────

const MOCK_ITEMS = [
  { id: '1', name: 'Canon EOS', variant: 'White / L', qty: 1, price: 28500, thumb: '/images/Rbag.png' },
  { id: '2', name: 'Canon EOS', variant: 'White / L', qty: 1, price: 28500, thumb: '/images/Rbag.png' },
  { id: '3', name: 'Canon EOS', variant: 'White / L', qty: 1, price: 28500, thumb: '/images/Rbag.png' },
]

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#F5F5F5] last:border-0 gap-4">
      <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] shrink-0 w-24">
        {label}
      </span>
      <span className="text-sm text-[#111111] text-right">{value}</span>
    </div>
  )
}

// ─── ReviewStep ───────────────────────────────────────────────────────────────

interface Props {
  billing: BillingForm
  delivery: DeliveryMethod
  payment: PaymentMethod
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  deliveryFee: number
  onBack: () => void
  onPlaceOrder: () => void
}

export function ReviewStep({
  billing,
  delivery,
  payment,
  coupon,
  onCouponChange,
  onApplyCoupon,
  deliveryFee,
  onBack,
  onPlaceOrder,
}: Props) {
  const deliveryLabel =
    DELIVERY_OPTIONS.find((d) => d.id === delivery)?.label ?? delivery

  const paymentLabel: Record<string, string> = {
    card: 'Debit/Credit Card',
    bank_transfer: 'Bank Transfer',
    pay_on_delivery: 'Pay on Delivery',
  }

  const deliveryDetail = (() => {
    const opt = DELIVERY_OPTIONS.find((d) => d.id === delivery)
    if (!opt) return deliveryLabel
    const days = opt.subtitle // e.g. "3-5 business days"
    return `${opt.label} — ${days}`
  })()

  return (
    <CheckoutLayout
      sidebar={
        <OrderSummary
          coupon={coupon}
          onCouponChange={onCouponChange}
          onApplyCoupon={onApplyCoupon}
          deliveryFee={deliveryFee}
        />
      }
    >
      <h2 className="text-lg font-bold text-[#111111] mb-5">Review Your Order</h2>

      {/* ── Cart items ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden mb-4">
        {MOCK_ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-4 px-4 py-3',
              i < MOCK_ITEMS.length - 1 && 'border-b border-[#F5F5F5]'
            )}
          >
            <div className="w-14 h-14 rounded bg-[#F5F5F5] shrink-0 overflow-hidden">
              <Image
                src={item.thumb}
                alt={item.name}
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111111]">{item.name}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {item.variant} × {item.qty}
              </p>
            </div>
            <p className="text-sm font-bold text-[#111111] shrink-0">
              ₦{item.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ── Delivery details ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 mb-6">
        <p className="text-sm font-bold text-[#111111] mb-1">Delivery Details</p>
        <div className="mt-2">
          <DetailRow
            label="Name"
            value={`${billing.firstName} ${billing.lastName}`.trim() || '—'}
          />
          <DetailRow label="Email"    value={billing.email   || '—'} />
          <DetailRow label="Phone"    value={billing.phone   || '—'} />
          <DetailRow label="Address"  value={billing.address || '—'} />
          <DetailRow label="Delivery" value={deliveryDetail} />
          <DetailRow label="Payment"  value={paymentLabel[payment] ?? payment} />
        </div>
      </div>

      {/* ── Nav buttons ── */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 sm:flex-none h-12 px-6 rounded border border-[#E5E7EB] text-sm font-semibold text-[#374151] flex items-center justify-center gap-2 hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
        >
          <FiArrowLeft size={15} /> BACK
        </button>
        <button
          onClick={onPlaceOrder}
          className="flex-1 h-12 rounded bg-[#F5820A] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#E06B00] transition-colors"
        >
          PLACE ORDER. ₦112,500 <FiArrowRight size={15} />
        </button>
      </div>
    </CheckoutLayout>
  )
}