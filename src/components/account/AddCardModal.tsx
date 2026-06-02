'use client'

import { useEffect, useState } from 'react'
import { HiXMark } from 'react-icons/hi2'
import type { PaymentCardDto } from '@/lib/api/account'

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PaymentCardDto) => Promise<void>
  /** Pass existing card data to switch modal into edit mode */
  initialData?: Partial<PaymentCardDto>
}

const CARD_TYPES = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Verve', value: 'verve' },
]

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const m = i + 1
  return { label: String(m).padStart(2, '0'), value: m }
})

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 12 }, (_, i) => ({
  label: String(CURRENT_YEAR + i),
  value: CURRENT_YEAR + i,
}))

const EMPTY: PaymentCardDto = {
  cardType: 'visa',
  cardNumber: '',
  cardHolderName: '',
  expiryMonth: new Date().getMonth() + 1,
  expiryYear: CURRENT_YEAR,
  isDefault: false,
}

export default function AddCardModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddCardModalProps) {
  const isEdit = !!initialData
  const [form, setForm] = useState<PaymentCardDto>({ ...EMPTY, ...initialData })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync form when initialData changes (e.g. opening edit for different card)
  useEffect(() => {
  setForm({
    cardType:       initialData?.cardType       ?? EMPTY.cardType,
    cardNumber:     initialData?.cardNumber     ?? EMPTY.cardNumber,
    cardHolderName: initialData?.cardHolderName ?? EMPTY.cardHolderName,
    expiryMonth:    initialData?.expiryMonth    ?? EMPTY.expiryMonth,
    expiryYear:     initialData?.expiryYear     ?? EMPTY.expiryYear,
    isDefault:      initialData?.isDefault      ?? EMPTY.isDefault,
  })
  setError(null)
}, [initialData, isOpen])

  function set<K extends keyof PaymentCardDto>(key: K, value: PaymentCardDto[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Format card number with spaces every 4 digits
  function handleCardNumber(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    set('cardNumber', digits)
  }

  async function handleSubmit() {
    setError(null)
    if (!form.cardHolderName.trim()) return setError('Name on card is required.')
    if (!isEdit && form.cardNumber.replace(/\s/g, '').length < 13)
      return setError('Enter a valid card number.')
    if (!form.cardType) return setError('Select a card type.')

    setIsSubmitting(true)
    try {
      await onSubmit(form)
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Card' : 'Add New Card'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Card type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Card Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {CARD_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set('cardType', t.value)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    form.cardType === t.value
                      ? 'border-[#F97316] text-[#F97316] bg-orange-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name on card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name on Card <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cardHolderName}
              onChange={(e) => set('cardHolderName', e.target.value)}
              placeholder="John Doe"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Card number — hidden in edit mode since we only have last4 */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Card Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                onChange={(e) => handleCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all tracking-wider"
              />
            </div>
          )}

          {/* Expiry + CVV */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expiry Month <span className="text-red-500">*</span>
              </label>
              <select
                value={form.expiryMonth}
                onChange={(e) => set('expiryMonth', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all bg-white"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expiry Year <span className="text-red-500">*</span>
              </label>
              <select
                value={form.expiryYear}
                onChange={(e) => set('expiryYear', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all bg-white"
              >
                {YEARS.map((y) => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>

            {/* CVV only shown on add, not edit */}
            {!isEdit && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={form.cardNumber} // CVV isn't stored — use a separate local field
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setForm((prev) => ({ ...prev, _cvv: digits } as any))
                  }}
                  placeholder="•••"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all"
                />
              </div>
            )}
          </div>

          {/* Set as default */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => set('isDefault', e.target.checked)}
              className="w-4 h-4 accent-[#F97316] rounded"
            />
            <span className="text-sm text-gray-700">Set as default payment method</span>
          </label>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-lg hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  )
}