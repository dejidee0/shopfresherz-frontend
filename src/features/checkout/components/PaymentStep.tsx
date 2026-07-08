// 'use client'

// import { useState } from 'react'
// import {
//   Field,
//   RadioOption,
//   StepIndicator,
//   StepNavButtons,
//   OrderSummary,
//   CheckoutLayout,
// } from './CheckoutShared'
// import {
//   PAYMENT_OPTIONS,
//   BANK_DETAILS,
//   type PaymentMethod,
//   type CardForm,
//   type CouponState,
// } from '../types/checkout'
// import { accountApi } from '@/lib/api/account'
// import { useAuthStore } from '@/store/auth'

// // ─── Constants ────────────────────────────────────────────────────────────────

// const CARD_TYPES = [
//   { label: 'Visa',       value: 'visa'       },
//   { label: 'Mastercard', value: 'mastercard' },
//   { label: 'Verve',      value: 'verve'      },
// ]

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** Parses "MM/YY" → { expiryMonth, expiryYear } or null if invalid */
// function parseExpiry(raw: string): { expiryMonth: number; expiryYear: number } | null {
//   const [mm, yy] = raw.split('/')
//   const month = parseInt(mm, 10)
//   const year  = parseInt(yy,  10)
//   if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return null
//   return { expiryMonth: month, expiryYear: 2000 + year }
// }

// // ─── Card form ────────────────────────────────────────────────────────────────

// type CardFieldErrors = Partial<{
//   cardType:       string
//   nameOnCard:     string
//   cardNumber:     string
//   expireDate:     string
//   cvc:            string
//   submit:         string
// }>

// function CardFormFields({
//   form,
//   setForm,
// }: {
//   form: CardForm
//   setForm: (f: CardForm) => void
// }) {
//   const { accessToken } = useAuthStore()

//   // These two fields don't live in CardForm (which is for UI state only)
//   // so we keep them as local state and include them only at submit time
//   const [cardType,  setCardType]  = useState('visa')
//   const [isDefault, setIsDefault] = useState(false)

//   const [errors,      setErrors]      = useState<CardFieldErrors>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [saved,       setSaved]       = useState(false)

//   // Generic setter that also clears the field's error
//   const set = (key: keyof CardForm, value: string) => {
//     setForm({ ...form, [key]: value })
//     setErrors((prev) => ({ ...prev, [key]: undefined }))
//   }

//   const handleCardNumber = (raw: string) => {
//     const digits    = raw.replace(/\D/g, '').slice(0, 16)
//     const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
//     set('cardNumber', formatted)
//   }

//   const handleExpiry = (raw: string) => {
//     const digits    = raw.replace(/\D/g, '').slice(0, 4)
//     const formatted = digits.length > 2
//       ? `${digits.slice(0, 2)}/${digits.slice(2)}`
//       : digits
//     set('expireDate', formatted)
//   }

//   function validate(): CardFieldErrors {
//     const e: CardFieldErrors = {}
//     if (!cardType)
//       e.cardType   = 'Select a card type.'
//     if (!form.nameOnCard.trim())
//       e.nameOnCard = 'Name on card is required.'
//     if (form.cardNumber.replace(/\s/g, '').length < 13)
//       e.cardNumber = 'Enter a valid card number.'
//     if (form.expireDate.length < 5)
//       e.expireDate = 'Enter expiry as MM/YY.'
//     else if (!parseExpiry(form.expireDate))
//       e.expireDate = 'Enter a valid expiry date.'
//     if (form.cvc.length < 3)
//       e.cvc        = 'Enter a valid CVV (3–4 digits).'
//     return e
//   }

//   async function handleSave() {
//     setSaved(false)
//     const e = validate()
//     if (Object.keys(e).length > 0) { setErrors(e); return }

//     setErrors({})
//     setIsSubmitting(true)

//     try {
//       const expiry = parseExpiry(form.expireDate)!

//       await accountApi.createPaymentMethod(accessToken ?? '', {
//         cardType,
//         cardNumber:     form.cardNumber.replace(/\s/g, ''), // strip display spaces
//         cardHolderName: form.nameOnCard.trim(),
//         expiryMonth:    expiry.expiryMonth,
//         expiryYear:     expiry.expiryYear,
//         isDefault,
//       })

//       setSaved(true)
//     } catch {
//       setErrors({ submit: 'Something went wrong. Please try again.' })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="border border-[#E5E7EB] rounded-lg p-4 mt-3 flex flex-col gap-3 bg-[#FAFAFA]">

//       {/* Card type */}
//       <div>
//         <p className="text-xs font-medium text-[#374151] mb-1.5">Card Type</p>
//         <div className="flex gap-2">
//           {CARD_TYPES.map((t) => (
//             <button
//               key={t.value}
//               type="button"
//               onClick={() => {
//                 setCardType(t.value)
//                 setErrors((prev) => ({ ...prev, cardType: undefined }))
//               }}
//               className={`flex-1 py-1.5 rounded-lg border-2 text-xs font-semibold transition-all ${
//                 cardType === t.value
//                   ? 'border-[#F97316] text-[#F97316] bg-orange-50'
//                   : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316]/40'
//               }`}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>
//         {errors.cardType && (
//           <p className="text-[11px] text-red-500 mt-1">{errors.cardType}</p>
//         )}
//       </div>

//       {/* Name on card */}
//       <div>
//         <Field
//           label="Name on Card"
//           value={form.nameOnCard}
//           onChange={(v) => set('nameOnCard', v)}
//           placeholder="As it appears on card"
//         />
//         {errors.nameOnCard && (
//           <p className="text-[11px] text-red-500 mt-1">{errors.nameOnCard}</p>
//         )}
//       </div>

//       {/* Card number */}
//       <div>
//         <Field
//           label="Card Number"
//           value={form.cardNumber}
//           onChange={handleCardNumber}
//           placeholder="0000 0000 0000 0000"
//         />
//         {errors.cardNumber && (
//           <p className="text-[11px] text-red-500 mt-1">{errors.cardNumber}</p>
//         )}
//       </div>

//       {/* Expiry + CVV */}
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <Field
//             label="Expiry Date"
//             value={form.expireDate}
//             onChange={handleExpiry}
//             placeholder="MM/YY"
//           />
//           {errors.expireDate && (
//             <p className="text-[11px] text-red-500 mt-1">{errors.expireDate}</p>
//           )}
//         </div>
//         <div>
//           <Field
//             label="CVV"
//             value={form.cvc}
//             onChange={(v) => set('cvc', v.replace(/\D/g, '').slice(0, 4))}
//             placeholder="•••"
//           />
//           {errors.cvc && (
//             <p className="text-[11px] text-red-500 mt-1">{errors.cvc}</p>
//           )}
//         </div>
//       </div>

//       {/* Set as default */}
//       <label className="flex items-center gap-2 cursor-pointer select-none">
//         <input
//           type="checkbox"
//           checked={isDefault}
//           onChange={(e) => setIsDefault(e.target.checked)}
//           className="w-4 h-4 accent-[#F97316] rounded"
//         />
//         <span className="text-xs text-[#6B7280]">Save as default payment method</span>
//       </label>

//       {errors.submit && (
//         <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
//           {errors.submit}
//         </p>
//       )}
//       {saved && (
//         <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
//           Card saved successfully.
//         </p>
//       )}

//       <button
//         type="button"
//         onClick={handleSave}
//         disabled={isSubmitting}
//         className="self-start text-xs font-bold px-4 py-2 rounded-lg bg-[#F97316] text-white hover:bg-[#EA580C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//       >
//         {isSubmitting ? 'Saving…' : 'Save Card'}
//       </button>
//     </div>
//   )
// }

// // ─── Bank transfer detail block ───────────────────────────────────────────────

// function BankDetailBlock() {
//   return (
//     <div className="border border-[#E5E7EB] rounded-lg p-4 mt-3 bg-[#FAFAFA]">
//       <p className="text-sm font-semibold text-[#111111] mb-3">Bank Details</p>
//       <div className="flex flex-col gap-2">
//         {[
//           { label: 'Bank',           value: BANK_DETAILS.bank          },
//           { label: 'Account Name',   value: BANK_DETAILS.accountName   },
//           { label: 'Account Number', value: BANK_DETAILS.accountNumber },
//         ].map(({ label, value }) => (
//           <div key={label} className="flex items-center justify-between text-sm">
//             <span className="text-[#9CA3AF]">{label}</span>
//             <span className="font-medium text-[#111111]">{value}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ─── Pay on delivery info block ───────────────────────────────────────────────

// function PayOnDeliveryBlock() {
//   return (
//     <div className="border border-[#E5E7EB] rounded-lg p-4 mt-3 bg-[#FAFAFA]">
//       <p className="text-sm text-[#6B7280] leading-relaxed">
//         You'll pay by cash or POS when your order is delivered.{' '}
//         <span className="text-[#F97316] font-medium">
//           Available for Standard delivery within Lagos only.
//         </span>
//       </p>
//     </div>
//   )
// }

// // ─── PaymentStep ──────────────────────────────────────────────────────────────

// type StepCardErrors = Partial<Record<keyof CardForm, string>>

// interface Props {
//   selected: PaymentMethod
//   onSelect: (m: PaymentMethod) => void
//   cardForm: CardForm
//   setCardForm: (f: CardForm) => void
//   coupon: CouponState
//   onCouponChange: (v: string) => void
//   onApplyCoupon: () => void
//   onRemoveCoupon?: () => void
//   deliveryFee: number
//   onBack: () => void
//   onContinue: () => void
// }

// export function PaymentStep({
//   selected,
//   onSelect,
//   cardForm,
//   setCardForm,
//   coupon,
//   onCouponChange,
//   onApplyCoupon,
//   onRemoveCoupon,
//   deliveryFee,
//   onBack,
//   onContinue,
// }: Props) {
//   const [cardErrors, setCardErrors] = useState<StepCardErrors>({})

//   const validateCard = (): boolean => {
//     if (selected !== 'card') return true
//     const e: StepCardErrors = {}
//     if (!cardForm.nameOnCard.trim())
//       e.nameOnCard = 'Required'
//     if (cardForm.cardNumber.replace(/\s/g, '').length < 13)
//       e.cardNumber = 'Enter a valid card number'
//     if (cardForm.expireDate.length < 5 || !parseExpiry(cardForm.expireDate))
//       e.expireDate = 'Enter MM/YY'
//     if (cardForm.cvc.length < 3)
//       e.cvc = 'Enter 3–4 digits'
//     setCardErrors(e)
//     return Object.keys(e).length === 0
//   }

//   const handleContinue = () => {
//     if (validateCard()) onContinue()
//   }

//   return (
//     <CheckoutLayout
//       sidebar={
//         <OrderSummary
//           coupon={coupon}
//           onCouponChange={onCouponChange}
//           onApplyCoupon={onApplyCoupon}
//           onRemoveCoupon={onRemoveCoupon}
//           deliveryFee={deliveryFee}
//         />
//       }
//     >
//       <StepIndicator step={3} />
//       <h2 className="text-lg font-bold text-[#111111] mb-5">Payment Method</h2>

//       <div className="flex flex-col gap-3">
//         {PAYMENT_OPTIONS.map((opt) => (
//           <div key={opt.id}>
//             <RadioOption
//               label={opt.label}
//               subtitle={opt.subtitle}
//               selected={selected === opt.id}
//               onSelect={() => onSelect(opt.id)}
//             />
//             {selected === opt.id && (
//               <>
//                 {opt.id === 'card'            && <CardFormFields form={cardForm} setForm={setCardForm} />}
//                 {opt.id === 'bank_transfer'   && <BankDetailBlock />}
//                 {opt.id === 'pay_on_delivery' && <PayOnDeliveryBlock />}
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       <StepNavButtons
//         onBack={onBack}
//         onContinue={handleContinue}
//         continueLabel="REVIEW ORDER"
//       />
//     </CheckoutLayout>
//   )
// }

'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
import { accountApi } from '@/lib/api/account'
import { useAuthStore } from '@/store/auth'
import { SAVED_CARDS_QUERY_KEY } from '@/features/checkout/queryKeys'

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_TYPES = [
  { label: 'Visa',       value: 'visa'       },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Verve',      value: 'verve'      },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseExpiry(raw: string): { expiryMonth: number; expiryYear: number } | null {
  const [mm, yy] = raw.split('/')
  const month = parseInt(mm, 10)
  const year  = parseInt(yy,  10)
  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return null
  return { expiryMonth: month, expiryYear: 2000 + year }
}

// ─── Card form ────────────────────────────────────────────────────────────────

type CardFieldErrors = Partial<{
  cardType:    string
  nameOnCard:  string
  cardNumber:  string
  expireDate:  string
  cvc:         string
  submit:      string
}>

function CardFormFields({
  form,
  setForm,
  onCardSaved,
}: {
  form: CardForm
  setForm: (f: CardForm) => void
  /** Called after a card is successfully saved so the parent can auto-select it */
  onCardSaved?: () => void
}) {
  const { accessToken } = useAuthStore()
  const queryClient     = useQueryClient()

  const [cardType,     setCardType]     = useState('visa')
  const [isDefault,    setIsDefault]    = useState(false)
  const [errors,       setErrors]       = useState<CardFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved,        setSaved]        = useState(false)

  const set = (key: keyof CardForm, value: string) => {
    setForm({ ...form, [key]: value })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleCardNumber = (raw: string) => {
    const digits    = raw.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    set('cardNumber', formatted)
  }

  const handleExpiry = (raw: string) => {
    const digits    = raw.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits
    set('expireDate', formatted)
  }

  function validate(): CardFieldErrors {
    const e: CardFieldErrors = {}
    if (!cardType)
      e.cardType   = 'Select a card type.'
    if (!form.nameOnCard.trim())
      e.nameOnCard = 'Name on card is required.'
    if (form.cardNumber.replace(/\s/g, '').length < 13)
      e.cardNumber = 'Enter a valid card number.'
    if (form.expireDate.length < 5 || !parseExpiry(form.expireDate))
      e.expireDate = 'Enter a valid expiry date (MM/YY).'
    if (form.cvc.length < 3)
      e.cvc        = 'Enter a valid CVV (3–4 digits).'
    return e
  }

  async function handleSave() {
    setSaved(false)
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setErrors({})
    setIsSubmitting(true)

    try {
      const expiry = parseExpiry(form.expireDate)!

      await accountApi.createPaymentMethod(accessToken ?? '', {
        cardType,
        cardNumber:     form.cardNumber.replace(/\s/g, ''),
        cardHolderName: form.nameOnCard.trim(),
        expiryMonth:    expiry.expiryMonth,
        expiryYear:     expiry.expiryYear,
        isDefault,
      })

      // Invalidate the saved-cards query so RegisteredCheckout reflects the
      // new card the moment the user returns to step 1 — no reload needed
      await queryClient.invalidateQueries({
        queryKey: SAVED_CARDS_QUERY_KEY(accessToken),
      })

      setSaved(true)
      onCardSaved?.()
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-[rgba(0,0,0,0.07)] rounded-lg p-4 mt-3 flex flex-col gap-3 bg-white">

      {/* Card type */}
      <div>
        <p className="text-xs font-medium text-[#666666] mb-1.5">Card Type</p>
        <div className="flex gap-2">
          {CARD_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => { setCardType(t.value); setErrors((p) => ({ ...p, cardType: undefined })) }}
              className={`flex-1 py-1.5 rounded-lg border-2 text-xs font-semibold transition-all ${
                cardType === t.value
                  ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10'
                  : 'border-[rgba(0,0,0,0.1)] text-[#666666] hover:border-[#F97316]/40 hover:text-[#111111]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {errors.cardType && <p className="text-[11px] text-red-500 mt-1">{errors.cardType}</p>}
      </div>

      {/* Name on card */}
      <div>
        <Field label="Name on Card" value={form.nameOnCard}
          onChange={(v) => set('nameOnCard', v)} placeholder="As it appears on card" />
        {errors.nameOnCard && <p className="text-[11px] text-red-500 mt-1">{errors.nameOnCard}</p>}
      </div>

      {/* Card number */}
      <div>
        <Field label="Card Number" value={form.cardNumber}
          onChange={handleCardNumber} placeholder="0000 0000 0000 0000" />
        {errors.cardNumber && <p className="text-[11px] text-red-500 mt-1">{errors.cardNumber}</p>}
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Field label="Expiry Date" value={form.expireDate}
            onChange={handleExpiry} placeholder="MM/YY" />
          {errors.expireDate && <p className="text-[11px] text-red-500 mt-1">{errors.expireDate}</p>}
        </div>
        <div>
          <Field label="CVV" value={form.cvc}
            onChange={(v) => set('cvc', v.replace(/\D/g, '').slice(0, 4))} placeholder="•••" />
          {errors.cvc && <p className="text-[11px] text-red-500 mt-1">{errors.cvc}</p>}
        </div>
      </div>

      {/* Set as default */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="w-4 h-4 accent-[#F97316] rounded" />
        <span className="text-xs text-[#666666]">Save as default payment method</span>
      </label>

      {errors.submit && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.submit}</p>
      )}
      {saved && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Card saved — it will appear as a payment option.
        </p>
      )}

      <button type="button" onClick={handleSave} disabled={isSubmitting}
        className="self-start text-xs font-bold px-4 py-2 rounded-lg sf-btn-primary text-white disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving…' : 'Save Card'}
      </button>
    </div>
  )
}

// ─── Bank transfer detail block ───────────────────────────────────────────────

function BankDetailBlock() {
  return (
    <div className="border border-[rgba(0,0,0,0.07)] rounded-lg p-4 mt-3 bg-white">
      <p className="text-sm font-semibold text-[#111111] mb-3">Bank Details</p>
      <div className="flex flex-col gap-2">
        {[
          { label: 'Bank',           value: BANK_DETAILS.bank          },
          { label: 'Account Name',   value: BANK_DETAILS.accountName   },
          { label: 'Account Number', value: BANK_DETAILS.accountNumber },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[#666666]">{label}</span>
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
    <div className="border border-[rgba(0,0,0,0.07)] rounded-lg p-4 mt-3 bg-white">
      <p className="text-sm text-[#666666] leading-relaxed">
        You'll pay by cash or POS when your order is delivered.{' '}
        <span className="text-[#F97316] font-medium">
          Available for Standard delivery within Lagos only.
        </span>
      </p>
    </div>
  )
}

// ─── PaymentStep ──────────────────────────────────────────────────────────────

type StepCardErrors = Partial<Record<keyof CardForm, string>>

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
  const [cardErrors, setCardErrors] = useState<StepCardErrors>({})

  const validateCard = (): boolean => {
    if (selected !== 'card') return true
    const e: StepCardErrors = {}
    if (!cardForm.nameOnCard.trim())
      e.nameOnCard = 'Required'
    if (cardForm.cardNumber.replace(/\s/g, '').length < 13)
      e.cardNumber = 'Enter a valid card number'
    if (cardForm.expireDate.length < 5 || !parseExpiry(cardForm.expireDate))
      e.expireDate = 'Enter MM/YY'
    if (cardForm.cvc.length < 3)
      e.cvc = 'Enter 3–4 digits'
    setCardErrors(e)
    return Object.keys(e).length === 0
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
            {selected === opt.id && (
              <>
                {opt.id === 'card' && (
                  <CardFormFields
                    form={cardForm}
                    setForm={setCardForm}
                    // Once saved, proceed back automatically
                    onCardSaved={onContinue}
                  />
                )}
                {opt.id === 'bank_transfer'   && <BankDetailBlock />}
                {opt.id === 'pay_on_delivery' && <PayOnDeliveryBlock />}
              </>
            )}
          </div>
        ))}
      </div>

      <StepNavButtons
        onBack={onBack}
        onContinue={() => { if (validateCard()) onContinue() }}
        continueLabel="REVIEW ORDER"
      />
    </CheckoutLayout>
  )
}
