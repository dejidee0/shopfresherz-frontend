'use client'

import { useState } from 'react'
import {
  Field,
  RadioOption,
  StepIndicator,
  StepNavButtons,
  OrderSummary,
  CheckoutLayout,
} from './CheckoutShared'
import {
  PAYMENT_OPTIONS,
  BANK_DETAILS,
  type PaymentMethod,
  type CardForm,
  type CouponState,
} from '../types/checkout'

// ─── Card form ────────────────────────────────────────────────────────────────

type CardErrors = Partial<Record<keyof CardForm, string>>

function CardFormFields({
  form,
  setForm,
}: {
  form: CardForm
  setForm: (f: CardForm) => void
}) {
  const set = (key: keyof CardForm, value: string) =>
    setForm({ ...form, [key]: value })

  // Format card number with spaces every 4 digits
  const handleCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    set('cardNumber', formatted)
  }

  // Format expiry as MM/YY
  const handleExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    set('expireDate', formatted)
  }

  return (
    <div className="border border-[#E5E7EB] rounded-lg p-4 mt-3 flex flex-col gap-3 bg-[#FAFAFA]">
      <Field
        label="Name on Card"
        value={form.nameOnCard}
        onChange={(v) => set('nameOnCard', v)}
        placeholder="As it appears on card"
      />
      <Field
        label="Card Number"
        value={form.cardNumber}
        onChange={handleCardNumber}
        placeholder="0000 0000 0000 0000"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Expire Date"
          value={form.expireDate}
          onChange={handleExpiry}
          placeholder="MM/YY"
        />
        <Field
          label="CVC"
          value={form.cvc}
          onChange={(v) => set('cvc', v.replace(/\D/g, '').slice(0, 4))}
          placeholder="•••"
        />
      </div>
    </div>
  )
}

// ─── Bank transfer detail block ───────────────────────────────────────────────

function BankDetailBlock() {
  return (
    <div className="border border-[#E5E7EB] rounded-lg p-4 mt-3 bg-[#FAFAFA]">
      <p className="text-sm font-semibold text-[#111111] mb-3">Bank Details</p>
      <div className="flex flex-col gap-2">
        {[
          { label: 'Bank',           value: BANK_DETAILS.bank          },
          { label: 'Account Name',   value: BANK_DETAILS.accountName   },
          { label: 'Account Number', value: BANK_DETAILS.accountNumber },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[#9CA3AF]">{label}</span>
            <span className="font-medium text-[#111111]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Pay on delivery info block ───────────────────────────────────────────────

function PayOnDeliveryBlock() {
  return (
    <div className="border border-[#E5E7EB] rounded-lg p-4 mt-3 bg-[#FAFAFA]">
      <p className="text-sm text-[#6B7280] leading-relaxed">
        You'll pay by cash or POS when your order is delivered.{' '}
        <span className="text-[#F5820A] font-medium">
          Available for Standard delivery within Lagos only.
        </span>
      </p>
    </div>
  )
}

// ─── PaymentStep ──────────────────────────────────────────────────────────────

interface Props {
  selected: PaymentMethod
  onSelect: (m: PaymentMethod) => void
  cardForm: CardForm
  setCardForm: (f: CardForm) => void
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
  cardForm,
  setCardForm,
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  onBack,
  onContinue,
}: Props) {
  const [cardErrors, setCardErrors] = useState<CardErrors>({})

  const validateCard = (): boolean => {
    if (selected !== 'card') return true
    const e: CardErrors = {}
    if (!cardForm.nameOnCard.trim())    e.nameOnCard  = 'Required'
    if (cardForm.cardNumber.replace(/\s/g, '').length < 16)
      e.cardNumber = 'Enter a valid 16-digit card number'
    if (cardForm.expireDate.length < 5) e.expireDate  = 'Enter MM/YY'
    if (cardForm.cvc.length < 3)        e.cvc         = 'Enter 3-4 digits'
    setCardErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validateCard()) onContinue()
  }

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

      <div className="flex flex-col gap-3">
        {PAYMENT_OPTIONS.map((opt) => (
          <div key={opt.id}>
            <RadioOption
              label={opt.label}
              subtitle={opt.subtitle}
              selected={selected === opt.id}
              onSelect={() => onSelect(opt.id)}
            />

            {/* Conditionally render the detail panel under the selected option */}
            {selected === opt.id && (
              <>
                {opt.id === 'card' && (
                  <CardFormFields form={cardForm} setForm={setCardForm} />
                )}
                {opt.id === 'bank_transfer' && <BankDetailBlock />}
                {opt.id === 'pay_on_delivery' && <PayOnDeliveryBlock />}
              </>
            )}
          </div>
        ))}
      </div>

      <StepNavButtons
        onBack={onBack}
        onContinue={handleContinue}
        continueLabel="REVIEW ORDER"
      />
    </CheckoutLayout>
  )
}
