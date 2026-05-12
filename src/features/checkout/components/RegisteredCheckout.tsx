'use client'

import { FiArrowRight, FiCheckCircle, FiChevronRight } from 'react-icons/fi'
import { FiMapPin, FiTruck, FiCreditCard } from 'react-icons/fi'
import { OrderSummary, CheckoutLayout } from './CheckoutShared'
import type { CouponState } from '../types/checkout'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils/format'

function SummarySection({
  title,
  onEdit,
  children,
}: {
  icon: React.ElementType
  title: string
  onEdit?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiCheckCircle size={15} className="text-[#F5820A] shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            {title}
          </p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-[#F5820A] font-medium hover:underline flex items-center gap-0.5"
          >
            Change <FiChevronRight size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

interface Props {
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon?: () => void
  deliveryFee: number
  onEditDelivery: () => void
  onEditPayment: () => void
  onPlaceOrder: () => void
}

export function RegisteredCheckout({
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  onEditDelivery,
  onEditPayment,
  onPlaceOrder,
}: Props) {
  const { user } = useAuthStore()
  const subtotal = useCartStore((s) => s.subtotal())
  const discountAmount = useCartStore((s) => s.discountAmount)
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const total = taxableAmount + deliveryFee + taxableAmount * 0.075

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
      <div className="flex flex-col gap-4">
        <SummarySection icon={FiMapPin} title="Customer Address">
          <p className="text-sm font-semibold text-[#111111]">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            24 Adeola Odeku St, Victoria Island<br />
            Lagos, 101241, Nigeria
          </p>
          <p className="text-xs text-[#6B7280] mt-1">+234 802 345 6789</p>
        </SummarySection>

        <SummarySection icon={FiTruck} title="Delivery Details" onEdit={onEditDelivery}>
          <p className="text-sm font-semibold text-[#111111]">Standard Delivery</p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Delivery fee is calculated from your current cart and delivery choice.
          </p>
        </SummarySection>

        <SummarySection icon={FiCreditCard} title="Payment Method" onEdit={onEditPayment}>
          <p className="text-sm font-semibold text-[#111111]">
            Pay with Cards, Bank Transfer or Pay on Delivery
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            You will confirm payment before placing the order.
          </p>
        </SummarySection>

        <button
          onClick={onPlaceOrder}
          className="w-full h-12 rounded bg-[#F5820A] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#E06B00] transition-colors"
        >
          PLACE ORDER - {formatPrice(total)} <FiArrowRight size={16} />
        </button>
      </div>
    </CheckoutLayout>
  )
}
