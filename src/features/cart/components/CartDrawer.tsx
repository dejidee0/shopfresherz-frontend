'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { cn, formatPrice } from '@/lib/utils/format'

const DELIVERY_THRESHOLD = 50_000  // ₦50k = free delivery
const VAT_RATE = 0.075              // 7.5%

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, couponCode, discountAmount } =
    useCartStore()

  const drawerRef = useRef<HTMLDivElement>(null)
  const sub = subtotal()
  const discount = discountAmount
  const afterDiscount = sub - discount
  const deliveryFee = afterDiscount >= DELIVERY_THRESHOLD ? 0 : 1_500
  const vat = afterDiscount * VAT_RATE
  const total = afterDiscount + deliveryFee + vat

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, closeCart])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-105 bg-white z-50 flex flex-col',
          'shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <FiShoppingBag size={18} className="text-[#F5820A]" />
            <h2 className="text-base font-bold text-[#111111]">
              Shopping Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-[#6B7280]">
                  ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
            aria-label="Close cart"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <ul className="divide-y divide-[#F5F5F5] px-5">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-3">
                  {/* Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="w-18 h-18 shrink-0 bg-[#F5F5F5] rounded-card overflow-hidden"
                  >
                    <Image
                      src={item.image || '/images/Rbag.png'}
                      alt={item.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-contain p-1"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm text-[#111111] leading-snug line-clamp-2 hover:text-[#F5820A] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-bold text-[#F5820A] mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty stepper + remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#E5E7EB] rounded-btn overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] disabled:opacity-40 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQty}
                          className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] disabled:opacity-40 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#111111]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#6B7280] hover:text-[#EF4444] transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order summary + actions */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E7EB] px-5 py-4 space-y-3 bg-white">
            {/* Free delivery progress */}
            {afterDiscount < DELIVERY_THRESHOLD && (
              <div className="bg-orange-50 rounded-card px-3 py-2.5">
                <p className="text-xs text-[#6B7280]">
                  Add{' '}
                  <span className="font-bold text-[#F5820A]">
                    {formatPrice(DELIVERY_THRESHOLD - afterDiscount)}
                  </span>{' '}
                  more for free delivery
                </p>
                <div className="mt-1.5 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5820A] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (afterDiscount / DELIVERY_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Summary lines */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#22C55E]">
                  <span>Discount {couponCode && `(${couponCode})`}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B7280]">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-[#22C55E] font-medium">FREE</span> : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>VAT (7.5%)</span>
                <span>{formatPrice(vat)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#111111] text-base pt-1.5 border-t border-[#E5E7EB]">
                <span>Total</span>
                <span className="text-[#F5820A]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full h-11 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white font-semibold rounded-btn flex items-center justify-center text-sm hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="w-full h-11 border border-[#E5E7EB] text-[#111111] font-semibold rounded-btn text-sm hover:bg-[#F5F5F5] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
      <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
        <FiShoppingBag size={36} className="text-[#E5E7EB]" />
      </div>
      <h3 className="text-base font-bold text-[#111111] mb-2">Your cart is empty</h3>
      <p className="text-sm text-[#6B7280] mb-6">
        Looks like you haven&apos;t added anything yet.
      </p>
      <button
        onClick={onClose}
        className="h-10 px-6 bg-linear-to-r from-[#F5820A] to-[#E06B00] text-white font-semibold rounded-btn text-sm hover:shadow-md hover:shadow-orange-200 transition-all"
      >
        Browse Products
      </button>
    </div>
  )
}