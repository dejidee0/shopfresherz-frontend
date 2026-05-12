'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

import { BillingStep } from '@/features/checkout/components/BillingStep'
import { DeliveryStep } from '@/features/checkout/components/DeliveryStep'
import { PaymentStep } from '@/features/checkout/components/PaymentStep'
import { ReviewStep } from '@/features/checkout/components/ReviewStep'
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

type CheckoutStep = 1 | 2 | 3 | 4

const COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  SAVE10: { type: 'percent', value: 10 },
  FRESH10: { type: 'percent', value: 10 },
  WELCOME5000: { type: 'fixed', value: 5000 },
}

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const couponCode = useCartStore((s) => s.couponCode)
  const setCartCoupon = useCartStore((s) => s.setCoupon)
  const removeCartCoupon = useCartStore((s) => s.removeCoupon)

  const hasSavedAddress = isAuthenticated && !!user?.hasRegisteredBilling

  const [step, setStep] = useState<CheckoutStep>(1)
  const [billing, setBilling] = useState<BillingForm>(EMPTY_BILLING)
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard')
  const [payment, setPayment] = useState<PaymentMethod>('card')
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD)
  const [coupon, setCoupon] = useState<CouponState>({
    code: couponCode ?? '',
    applied: !!couponCode,
  })

  useEffect(() => {
    setCoupon({ code: couponCode ?? '', applied: !!couponCode })
  }, [couponCode])

  const deliveryFee = useMemo(() => {
    if (delivery === 'pickup') return 0
    if (delivery === 'express') return 3500
    return subtotal >= 50000 ? 0 : 1500
  }, [delivery, subtotal])

  const handleCouponChange = (value: string) => {
    removeCartCoupon()
    setCoupon({ code: value, applied: false })
  }

  const handleApplyCoupon = () => {
    const code = coupon.code.trim().toUpperCase()
    const config = COUPONS[code]

    if (!code) {
      setCoupon({ code: '', applied: false, error: 'Enter a coupon code.' })
      return
    }

    if (!config) {
      removeCartCoupon()
      setCoupon({ code, applied: false, error: 'Invalid coupon code.' })
      return
    }

    if (subtotal <= 0) {
      removeCartCoupon()
      setCoupon({ code, applied: false, error: 'Add items to your cart before applying a coupon.' })
      return
    }

    const discount = config.type === 'percent'
      ? Math.round(subtotal * (config.value / 100))
      : Math.min(config.value, subtotal)

    setCartCoupon(code, discount)
    setCoupon({ code, applied: true })
  }

  const handleRemoveCoupon = () => {
    removeCartCoupon()
    setCoupon({ code: '', applied: false })
  }

  const handlePlaceOrder = async () => {
    // TODO: await checkoutApi.placeOrder({ items, billing, delivery, payment, cardForm, coupon })
    router.push('/store/checkout/confirmation')
  }

  const sidebarProps = {
    coupon,
    onCouponChange: handleCouponChange,
    onApplyCoupon: handleApplyCoupon,
    onRemoveCoupon: handleRemoveCoupon,
    deliveryFee,
  }

  if (items.length === 0) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-16 min-h-[60vh] text-center">
        <h1 className="text-xl font-bold text-[#111111]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Add products to your cart before checking out.</p>
        <button
          onClick={() => router.push('/store')}
          className="mt-6 h-11 px-6 rounded bg-[#F5820A] text-white text-sm font-semibold hover:bg-[#E06B00] transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  if (hasSavedAddress) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh]">
        {step === 1 && (
          <RegisteredCheckout
            {...sidebarProps}
            deliveryFee={deliveryFee}
            onEditDelivery={() => setStep(2)}
            onEditPayment={() => setStep(3)}
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
