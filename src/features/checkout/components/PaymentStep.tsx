'use client'

import {
  StepIndicator,
  StepNavButtons,
  OrderSummary,
  CheckoutLayout,
  PaymentOptionCard,
} from './CheckoutShared'
import {
  PAYMENT_OPTIONS,
  type PaymentMethod,
  type CouponState,
} from '../types/checkout'
import { FiCreditCard } from 'react-icons/fi'

// ─── PaymentStep ──────────────────────────────────────────────────────────────

interface Props {
  selected: PaymentMethod
  onSelect: (m: PaymentMethod) => void
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon?: () => void
  deliveryFee: number
  onBack: () => void
  onContinue: () => void
}

export function PaymentStep({
  selected,
  onSelect,
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  onBack,
  onContinue,
}: Props) {
  const selectedOption = PAYMENT_OPTIONS.find((o) => o.id === selected)

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
      <StepIndicator step={3} />
      <h2 className="text-lg font-bold text-[#111111] mb-5">Payment Method</h2>

      <div className="flex flex-col gap-2.5">
        {PAYMENT_OPTIONS.map((opt) => (
          <PaymentOptionCard
            key={opt.id}
            icon={
              opt.icon === 'card' ? (
                <FiCreditCard size={18} />
              ) : opt.icon === 'bank' ? (
                <span className="text-lg leading-none">🏦</span>
              ) : (
                <span className="text-lg leading-none">🚚</span>
              )
            }
            label={opt.label}
            sublabel={opt.subtitle}
            badge={opt.badge}
            selected={selected === opt.id}
            onSelect={() => onSelect(opt.id)}
          />
        ))}
      </div>

      {selectedOption && (
        <p className="text-xs text-[#888888] mt-3 leading-relaxed">
          {selectedOption.description}
          {selectedOption.note && (
            <span className="block mt-1 text-[#F97316] font-medium">
              {selectedOption.note}
            </span>
          )}
        </p>
      )}

      <StepNavButtons
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="REVIEW ORDER"
      />
    </CheckoutLayout>
  )
}
