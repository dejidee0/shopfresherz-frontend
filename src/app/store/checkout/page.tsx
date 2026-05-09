// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuthStore } from '@/store/auth'

// import { BillingStep }        from '@/features/checkout/components/BillingStep'
// import { DeliveryStep }       from '@/features/checkout/components/DeliveryStep'
// import { PaymentStep }        from '@/features/checkout/components/PaymentStep'
// import { ReviewStep }         from '@/features/checkout/components/ReviewStep'
// import { RegisteredCheckout } from '@/features/checkout/components/RegisteredCheckout'

// import {
//   EMPTY_BILLING,
//   EMPTY_CARD,
//   type BillingForm,
//   type DeliveryMethod,
//   type PaymentMethod,
//   type CardForm,
//   type CouponState,
//   type CheckoutStep,
// } from '@/features/checkout/types/checkout'

// export default function CheckoutPage() {
//   const router = useRouter()
//   const { isAuthenticated } = useAuthStore()

//   // ── Step (guest flow only) ─────────────────────────────────────────────────
//   const [step, setStep] = useState<CheckoutStep>(1)

//   // ── Form state ─────────────────────────────────────────────────────────────
//   const [billing,  setBilling]  = useState<BillingForm>(EMPTY_BILLING)
//   const [delivery, setDelivery] = useState<DeliveryMethod>('standard')
//   const [payment,  setPayment]  = useState<PaymentMethod>('card')
//   const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD)

//   // ── Coupon (persists across all steps) ─────────────────────────────────────
//   const [coupon, setCoupon] = useState<CouponState>({ code: '', applied: false })

//   const handleCouponChange = (v: string) =>
//     setCoupon((prev) => ({ ...prev, code: v, applied: false }))

//   const handleApplyCoupon = () => {
//     if (coupon.code.trim()) setCoupon((prev) => ({ ...prev, applied: true }))
//   }

//   // ── Delivery fee derived from selection ────────────────────────────────────
//   const deliveryFee = delivery === 'express' ? 3500 : 0

//   // ── Final order submission — called only from ReviewStep ──────────────────
//   const handlePlaceOrder = async () => {
//     // TODO: call your order API here, e.g.:
//     // await checkoutApi.placeOrder({ billing, delivery, payment, cardForm, coupon })
//     router.push('/store/checkout/confirmation')
//   }

//   // ── Shared sidebar props passed to every step ──────────────────────────────
//   const sharedSidebarProps = {
//     coupon,
//     onCouponChange: handleCouponChange,
//     onApplyCoupon: handleApplyCoupon,
//     deliveryFee,
//   }

//   // ── Registered user: skip step flow, show confirmed summary directly ───────
//   if (isAuthenticated) {
//     return (
//       <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh]">
//         <RegisteredCheckout
//           coupon={coupon}
//           onCouponChange={handleCouponChange}
//           onApplyCoupon={handleApplyCoupon}
//           onPlaceOrder={handlePlaceOrder}
//         />
//       </div>
//     )
//   }

//   // ── Guest step flow: 1 → 2 → 3 → 4 → /checkout/confirmation ─────────────
//   return (
//     <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh]">

//       {/* Step 1 — Billing Info */}
//       {step === 1 && (
//         <BillingStep
//           form={billing}
//           setForm={setBilling}
//           onContinue={() => (setStep(2), console.log(billing))}
//           {...sharedSidebarProps}
//         />
//       )}

//       {/* Step 2 — Delivery Method */}
//       {step === 2 && (
//         <DeliveryStep
//           selected={delivery}
//           onSelect={setDelivery}
//           onBack={() => setStep(1)}
//           onContinue={() => setStep(3)}
//           {...sharedSidebarProps}
//         />
//       )}

//       {/* Step 3 — Payment Method: advances to review, does NOT place order */}
//       {step === 3 && (
//         <PaymentStep
//           selected={payment}
//           onSelect={setPayment}
//           cardForm={cardForm}
//           setCardForm={setCardForm}
//           onBack={() => setStep(2)}
//           onContinue={() => setStep(4)}
//           {...sharedSidebarProps}
//         />
//       )}

//       {/* Step 4 — Review Order: onPlaceOrder calls the API then redirects */}
//       {step === 4 && (
//         <ReviewStep
//           billing={billing}
//           delivery={delivery}
//           payment={payment}
//           onBack={() => setStep(3)}
//           onPlaceOrder={handlePlaceOrder}
//           {...sharedSidebarProps}
//         />
//       )}

//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

import { BillingStep }        from '@/features/checkout/components/BillingStep'
import { DeliveryStep }       from '@/features/checkout/components/DeliveryStep'
import { PaymentStep }        from '@/features/checkout/components/PaymentStep'
import { ReviewStep }         from '@/features/checkout/components/ReviewStep'
import { RegisteredCheckout } from '@/features/checkout/components/RegisteredCheckout'

import {
  EMPTY_BILLING,
  EMPTY_CARD,
  type BillingForm,
  type DeliveryMethod,
  type PaymentMethod,
  type CardForm,
  type CouponState,
} from '@/features/checkout/types/checkout'

// Step type — registered users start at step 1 (RegisteredCheckout summary)
// Guest users start at step 1 (BillingStep) and progress through 2 → 3 → 4
type GuestStep      = 1 | 2 | 3 | 4  // Billing → Delivery → Payment → Review
type RegisteredStep = 1 | 2 | 3      // Summary → Delivery → Payment (no billing form)

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  // Registered users who already have a saved address skip billing entirely.
  // Flip this to false if you want to force them through the billing form.
  const hasSavedAddress = isAuthenticated && !!user?.hasRegisteredBilling

  // ── Step state ─────────────────────────────────────────────────────────────
  // Both flows start at step 1 but mean different screens (see render below)
  const [step, setStep] = useState(1)

  // ── Form state ─────────────────────────────────────────────────────────────
  const [billing,  setBilling]  = useState<BillingForm>(EMPTY_BILLING)
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard')
  const [payment,  setPayment]  = useState<PaymentMethod>('card')
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD)

  // ── Coupon (shared across all steps) ───────────────────────────────────────
  const [coupon, setCoupon] = useState<CouponState>({ code: '', applied: false })

  const handleCouponChange = (v: string) =>
    setCoupon((prev) => ({ ...prev, code: v, applied: false }))

  const handleApplyCoupon = () => {
    if (coupon.code.trim()) setCoupon((prev) => ({ ...prev, applied: true }))
  }

  // ── Delivery fee ───────────────────────────────────────────────────────────
  const deliveryFee = delivery === 'express' ? 3500 : 0

  // ── Final submission — only called from ReviewStep ─────────────────────────
  const handlePlaceOrder = async () => {
    // TODO: await checkoutApi.placeOrder({ billing, delivery, payment, cardForm, coupon })
    router.push('/checkout/confirmation')
  }

  // ── Shared props for every step's order sidebar ────────────────────────────
  const sidebarProps = {
    coupon,
    onCouponChange: handleCouponChange,
    onApplyCoupon: handleApplyCoupon,
    deliveryFee,
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REGISTERED USER FLOW
  // Step 1 — RegisteredCheckout (confirmed address/delivery/payment summary)
  // Step 2 — DeliveryStep       (change delivery if needed)
  // Step 3 — PaymentStep        (change payment if needed)
  // Step 4 — ReviewStep         (final review before placing order)
  // ════════════════════════════════════════════════════════════════════════════
  if (hasSavedAddress) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh]">

        {step === 1 && (
          <RegisteredCheckout
            coupon={coupon}
            onCouponChange={handleCouponChange}
            onApplyCoupon={handleApplyCoupon}
            // "Place Order" on the summary goes straight to review
            onPlaceOrder={() => setStep(4)}
          />
        )}

        {step === 2 && (
          <DeliveryStep
            selected={delivery}
            onSelect={setDelivery}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
            {...sidebarProps}
          />
        )}

        {step === 3 && (
          <PaymentStep
            selected={payment}
            onSelect={setPayment}
            cardForm={cardForm}
            setCardForm={setCardForm}
            onBack={() => setStep(2)}
            onContinue={() => setStep(4)}
            {...sidebarProps}
          />
        )}

        {step === 4 && (
          <ReviewStep
            billing={billing}
            delivery={delivery}
            payment={payment}
            onBack={() => setStep(1)}
            onPlaceOrder={handlePlaceOrder}
            {...sidebarProps}
          />
        )}

      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // GUEST / NEW USER FLOW
  // Step 1 — BillingStep   (enter address)
  // Step 2 — DeliveryStep  (pick delivery method)
  // Step 3 — PaymentStep   (pick payment method)
  // Step 4 — ReviewStep    (review everything, then place order)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh]">

      {step === 1 && (
        <BillingStep
          form={billing}
          setForm={setBilling}
          onContinue={() => setStep(2)}
          {...sidebarProps}
        />
      )}

      {step === 2 && (
        <DeliveryStep
          selected={delivery}
          onSelect={setDelivery}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
          {...sidebarProps}
        />
      )}

      {step === 3 && (
        <PaymentStep
          selected={payment}
          onSelect={setPayment}
          cardForm={cardForm}
          setCardForm={setCardForm}
          onBack={() => setStep(2)}
          onContinue={() => setStep(4)}
          {...sidebarProps}
        />
      )}

      {step === 4 && (
        <ReviewStep
          billing={billing}
          delivery={delivery}
          payment={payment}
          onBack={() => setStep(3)}
          onPlaceOrder={handlePlaceOrder}
          {...sidebarProps}
        />
      )}

    </div>
  )
}