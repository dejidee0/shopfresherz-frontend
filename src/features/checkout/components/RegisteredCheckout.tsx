'use client'

import { useState } from 'react'
import {
  FiArrowRight, FiCheckCircle, FiChevronRight,
  FiMapPin, FiTruck, FiCreditCard, FiPlus, FiAlertCircle,
} from 'react-icons/fi'
import { OrderSummary, CheckoutLayout } from './CheckoutShared'
import type { CouponState, DeliveryMethod, PaymentMethod } from '../types/checkout'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils/format'
import type { Address, PaymentMethod as SavedCard } from '@/lib/api/account'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DELIVERY_LABELS: Record<string, string> = {
  standard: 'Standard Delivery',
  express:  'Express Delivery',
  pickup:   'Store Pickup',
}

// Infer card brand from first digit
function cardBrandLabel(card: SavedCard): string {
  if (card.cardType) return card.cardType
  // const first = card.last4?.[0] ?? ''
  // if (first === '4') return 'Visa'
  // if (first === '5') return 'Mastercard'
  return 'Card'
}

function maskNumber(last4?: string) {
  return last4 ? `•••• •••• •••• ${last4}` : '•••• •••• •••• ••••'
}

// ─── SummarySection ───────────────────────────────────────────────────────────

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiCheckCircle size={15} className="text-[#F5820A] shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{title}</p>
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  coupon: CouponState
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon?: () => void
  deliveryFee: number
  delivery?: DeliveryMethod
  // Address
  addresses: Address[]
  selectedAddressId: string | null
  onSelectAddress: (id: string) => void
  // Payment
  savedCards: SavedCard[]
  selectedCardId: string | null
  onSelectCard: (id: string) => void
  selectedPayment: PaymentMethod | null
  onSelectPayment: (m: PaymentMethod) => void
  // Navigation
  onEditDelivery: () => void
  onEditPayment: () => void
  onPlaceOrder: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisteredCheckout({
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  delivery = 'standard',
  addresses,
  selectedAddressId,
  onSelectAddress,
  savedCards,
  selectedCardId,
  onSelectCard,
  selectedPayment,
  onSelectPayment,
  onEditDelivery,
  onEditPayment,
  onPlaceOrder,
}: Props) {
  const { user } = useAuthStore()
  const subtotal = useCartStore((s) => s.subtotal())
  const discountAmount = useCartStore((s) => s.discountAmount)
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const total = taxableAmount + deliveryFee + taxableAmount * 0.075

  const [showAllAddresses, setShowAllAddresses] = useState(false)

  const visibleAddresses = showAllAddresses ? addresses : addresses.slice(0, 2)

  // Payment is ready if: a saved card is selected, or a non-card method is chosen
  const paymentReady =
    (selectedPayment === 'card' && !!selectedCardId && selectedAddressId !== null) ||
    (selectedPayment !== null && selectedPayment !== 'card' && selectedAddressId !== null)

  const PAYMENT_METHOD_LABELS: Record<string, string> = {
    card:            'Card',
    bank_transfer:   'Bank Transfer',
    pay_on_delivery: 'Pay on Delivery',
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
      <div className="flex flex-col gap-4">

        {/* ── Delivery Address ─────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiMapPin size={15} className="text-[#F5820A] shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Delivery Address
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {visibleAddresses.map((addr) => {
              const isSelected = addr.id === (selectedAddressId ?? addresses[0]?.id)
              return (
                <button
                  key={addr.id}
                  onClick={() => onSelectAddress(addr.id)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 ${
                    isSelected
                      ? 'border-[#F5820A] bg-[#FFF7F0]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#F5820A]/40 hover:bg-[#FFFAF5]'
                  }`}
                >
                  <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-[#F5820A]' : 'border-[#D1D5DB]'
                  }`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#F5820A]" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#111111]">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {addr.label && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
                          {addr.label}
                        </span>
                      )}
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                      {addr.city}, {addr.state}{addr.postalCode ? ` ${addr.postalCode}` : ''}, Nigeria
                    </p>
                  </div>
                </button>
              )
            })}

            {addresses.length > 2 && (
              <button
                onClick={() => setShowAllAddresses((v) => !v)}
                className="text-xs text-[#F5820A] font-medium hover:underline self-start ml-1 mt-1"
              >
                {showAllAddresses
                  ? 'Show less'
                  : `Show ${addresses.length - 2} more address${addresses.length - 2 > 1 ? 'es' : ''}`}
              </button>
            )}

            <button
              onClick={() => {/* TODO: open add-address modal */}}
              className="mt-1 flex items-center gap-2 text-xs text-[#6B7280] font-medium hover:text-[#F5820A] transition-colors self-start"
            >
              <span className="w-4 h-4 rounded-full border border-dashed border-current flex items-center justify-center">
                <FiPlus size={10} />
              </span>
              Add a new address
            </button>
          </div>
        </div>

        {/* ── Delivery Details ─────────────────────────────────────────────── */}
        <SummarySection title="Delivery Details" onEdit={onEditDelivery}>
          <div className="flex items-center gap-2">
            <FiTruck size={14} className="text-[#6B7280] shrink-0" />
            <p className="text-sm font-semibold text-[#111111]">
              {DELIVERY_LABELS[delivery] ?? 'Standard Delivery'}
            </p>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5 ml-5">
            {delivery === 'pickup'
              ? 'You will pick up your order from our store.'
              : deliveryFee === 0
              ? 'Free delivery on this order.'
              : `Delivery fee: ${formatPrice(deliveryFee)}`}
          </p>
        </SummarySection>

        {/* ── Payment Method ───────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiCreditCard size={15} className="text-[#F5820A] shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Payment Method
              </p>
            </div>
            <button
              onClick={onEditPayment}
              className="text-xs text-[#F5820A] font-medium hover:underline flex items-center gap-0.5"
            >
              Add Card / Change <FiChevronRight size={12} />
            </button>
          </div>

          {savedCards.length > 0 ? (
            <div className="flex flex-col gap-2">
              {savedCards.map((card) => {
                const isSelected = card.id === selectedCardId && selectedPayment === 'card'
                return (
                  <button
                    key={card.id}
                    onClick={() => onSelectCard(card.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'border-[#F5820A] bg-[#FFF7F0]'
                        : 'border-[#E5E7EB] bg-white hover:border-[#F5820A]/40 hover:bg-[#FFFAF5]'
                    }`}
                  >
                    {/* Radio */}
                    <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#F5820A]' : 'border-[#D1D5DB]'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#F5820A]" />}
                    </span>

                    {/* Card visual */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#111111]">
                          {cardBrandLabel(card)}
                        </span>
                        {card.isDefault && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5 font-mono tracking-widest">
                        {maskNumber(card.cardNumber?.slice(-4))}
                      </p>
                      {(card.expiryMonth && card.expiryYear) && (
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                          Expires {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}

              {/* Other payment methods as secondary options */}
              {(['bank_transfer', 'pay_on_delivery'] as PaymentMethod[]).map((method) => {
                const isSelected = selectedPayment === method
                return (
                  <button
                    key={method}
                    onClick={() => { onSelectPayment(method); }}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'border-[#F5820A] bg-[#FFF7F0]'
                        : 'border-[#E5E7EB] bg-white hover:border-[#F5820A]/40 hover:bg-[#FFFAF5]'
                    }`}
                  >
                    <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#F5820A]' : 'border-[#D1D5DB]'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#F5820A]" />}
                    </span>
                    <span className="text-sm font-medium text-[#111111]">
                      {PAYMENT_METHOD_LABELS[method]}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            /* No saved cards — show all payment options */
            <div className="flex flex-col gap-2">
              {(['card', 'bank_transfer', 'pay_on_delivery'] as PaymentMethod[]).map((method) => {
                const isSelected = selectedPayment === method
                return (
                  <button
                    key={method}
                    onClick={() => onSelectPayment(method)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'border-[#F5820A] bg-[#FFF7F0]'
                        : 'border-[#E5E7EB] bg-white hover:border-[#F5820A]/40 hover:bg-[#FFFAF5]'
                    }`}
                  >
                    <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#F5820A]' : 'border-[#D1D5DB]'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#F5820A]" />}
                    </span>
                    <span className="text-sm font-medium text-[#111111]">
                      {PAYMENT_METHOD_LABELS[method]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* No payment selected warning */}
          {!paymentReady && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600">
              <FiAlertCircle size={13} />
              Please select a payment method to continue.
            </div>
          )}
        </div>

        {/* ── Place Order ──────────────────────────────────────────────────── */}
        <button
          onClick={onPlaceOrder}
          disabled={!paymentReady}
          className={`w-full h-12 rounded font-bold flex items-center justify-center gap-2 transition-colors ${
            paymentReady
              ? 'bg-[#F5820A] text-white hover:bg-[#E06B00] cursor-pointer'
              : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          }`}
        >
          PLACE ORDER — {formatPrice(total)} <FiArrowRight size={16} />
        </button>
      </div>
    </CheckoutLayout>
  )
}