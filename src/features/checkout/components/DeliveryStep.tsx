'use client'

import {
  RadioOption,
  StepIndicator,
  StepNavButtons,
  OrderSummary,
  CheckoutLayout,
} from './CheckoutShared'
import { DELIVERY_OPTIONS, type DeliveryMethod, type CouponState } from '../types/checkout'

interface Props {
  selected: DeliveryMethod
  onSelect: (d: DeliveryMethod) => void
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon?: () => void
  deliveryFee: number
  onBack: () => void
  onContinue: () => void
}

export function DeliveryStep({
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
      <StepIndicator step={2} />
      <h2 className="text-lg font-bold text-[#111111] mb-5">Delivery Method</h2>

      <div className="flex flex-col gap-3">
        {DELIVERY_OPTIONS.map((opt) => (
          <RadioOption
            key={opt.id}
            label={opt.label}
            subtitle={opt.subtitle}
            price={opt.price === null ? null : `₦${opt.price.toLocaleString()}`}
            selected={selected === opt.id}
            onSelect={() => onSelect(opt.id)}
          />
        ))}
      </div>

      <StepNavButtons
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="CONTINUE TO PAYMENT"
      />
    </CheckoutLayout>
  )
}
