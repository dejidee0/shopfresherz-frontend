'use client'

import { FiCheckCircle, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import { FiMapPin, FiTruck, FiCreditCard } from 'react-icons/fi'
import { OrderSummary, CheckoutLayout } from './CheckoutShared'
import type { CouponState } from '../types/checkout'
import { useAuthStore } from '@/store/auth'

// ─── Summary section wrapper ──────────────────────────────────────────────────

function SummarySection({
  icon: Icon,
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

// ─── RegisteredCheckout ───────────────────────────────────────────────────────

interface Props {
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onPlaceOrder: () => void
}

export function RegisteredCheckout({
  coupon,
  onCouponChange,
  onApplyCoupon,
  onPlaceOrder,
}: Props) {
  const { user } = useAuthStore()

  return (
    <CheckoutLayout
      sidebar={
        <OrderSummary
          coupon={coupon}
          onCouponChange={onCouponChange}
          onApplyCoupon={onApplyCoupon}
          deliveryFee={0}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {/* Customer address */}
        <SummarySection icon={FiMapPin} title="Customer Address" onEdit={() => {}}>
          <p className="text-sm font-semibold text-[#111111]">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            24 Adeola Odeku St, Victoria Island<br />
            Lagos, 101241, Nigeria
          </p>
          <p className="text-xs text-[#6B7280] mt-1">+234 802 345 6789</p>
        </SummarySection>

        {/* Delivery details */}
        <SummarySection icon={FiTruck} title="Delivery Details" onEdit={() => {}}>
          <p className="text-sm font-semibold text-[#111111]">Pick-up Station</p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Delivery between{' '}
            <span className="font-semibold text-[#111111]">17 April</span> and{' '}
            <span className="font-semibold text-[#111111]">20 April.</span>
          </p>
          <div className="mt-3 border border-[#E5E7EB] rounded p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Pickup Station
              </p>
              <button className="text-xs text-[#F5820A] hover:underline flex items-center gap-0.5">
                Change <FiChevronRight size={11} />
              </button>
            </div>
            <p className="text-sm font-semibold text-[#111111] mt-1">
              ShopFresherz Pickup Station Oron Road
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
              411 Oron Road, Opposite Elitok's Mall, by Obikason Filling Station,
              Uyo, Akwa Ibom State, Nigeria., opposite Gifty supermarket | Akwa Ibom – Uyo
            </p>
          </div>
        </SummarySection>

        {/* Payment method */}
        <SummarySection icon={FiCreditCard} title="Payment Method" onEdit={() => {}}>
          <p className="text-sm font-semibold text-[#111111]">
            Pay with Cards, Bank Transfer or USSD
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            You will be redirected to our secure checkout page.
          </p>
        </SummarySection>

        {/* Place order CTA */}
        <button
          onClick={onPlaceOrder}
          className="w-full h-12 rounded bg-[#F5820A] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#E06B00] transition-colors"
        >
          PLACE ORDER ₦112,500 <FiArrowRight size={16} />
        </button>
      </div>
    </CheckoutLayout>
  )
}