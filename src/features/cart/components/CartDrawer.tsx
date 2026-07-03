'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '@/store/cart'
import { cn, formatPrice } from '@/lib/utils/format'

const DELIVERY_THRESHOLD = 100_000  // ₦100k = free delivery
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
          'fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#0D0D0D] z-50 flex flex-col border-l border-white/[0.06]',
          'shadow-[-20px_0_60px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#0D0D0D] border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-white">
              Shopping Cart
              {items.length > 0 && (
                <span className="ml-2 text-[14px] font-normal text-[#555555]">
                  ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-[8px] bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center text-[#777777] hover:text-white hover:bg-[#242424] transition-colors"
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
            <ul>
              {items.map((item) => (
                <li key={item.id} className="px-6 py-4 flex gap-3 border-b border-white/[0.04]">
                  {/* Image */}
                  <Link
                    href={`/store/product/${item.slug}`}
                    onClick={closeCart}
                    className="w-[72px] h-[72px] shrink-0 bg-[#1A1A1A] rounded-[10px] border border-white/[0.06] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  >
                    <Image
                      src={item.image || '/images/device-placeholder.jpg'}
                      alt={item.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-contain p-2"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#555555] uppercase tracking-[0.5px] mb-1">
                      ShopFresherz
                    </p>
                    <Link
                      href={`/store/product/${item.slug}`}
                      onClick={closeCart}
                      className="text-[13px] font-medium text-white leading-snug line-clamp-2 hover:text-[#F97316] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[15px] font-bold text-[#F97316] mt-1 [text-shadow:0_0_12px_rgba(249,115,22,0.3)]">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty stepper + remove */}
                    <div className="flex items-start justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-[6px] border border-white/[0.08] bg-[#1A1A1A] flex items-center justify-center text-white hover:border-[#F97316] disabled:opacity-40 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-7 h-7 rounded-[6px] border border-white/[0.08] bg-[#1A1A1A] flex items-center justify-center text-[12px] font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQty}
                          className="w-7 h-7 rounded-[6px] border border-white/[0.08] bg-[#1A1A1A] flex items-center justify-center text-white hover:border-[#F97316] disabled:opacity-40 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[13px] font-bold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#888888] hover:text-[#DC2626] transition-colors"
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
          <div className="border-t border-white/[0.06] px-6 pt-4 pb-5 space-y-4 bg-[#0F0F0F]">
            {/* Free delivery progress */}
            <div>
              <p className={cn('text-[12px]', afterDiscount >= DELIVERY_THRESHOLD ? 'text-[#16A34A]' : 'text-[#888888]')}>
                {afterDiscount >= DELIVERY_THRESHOLD
                  ? "You've unlocked free delivery!"
                  : <>Add <span className="font-semibold text-[#F97316]">{formatPrice(DELIVERY_THRESHOLD - afterDiscount)}</span> more for free delivery</>}
              </p>
                <div className="mt-2 h-1 bg-[#1A1A1A] rounded-[20px] overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#F97316] to-[#FBBF24] rounded-[20px] transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                  style={{ width: `${Math.min(100, (afterDiscount / DELIVERY_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>

            {/* Summary lines */}
            <div className="space-y-2 text-[14px]">
              <div className="flex justify-between text-[#777777]">
                <span>Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#22C55E]">
                  <span>Discount {couponCode && `(${couponCode})`}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777777]">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-[#22C55E] font-medium">FREE</span> : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[#777777]">
                <span>VAT (7.5%)</span>
                <span>{formatPrice(vat)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-[16px] pt-3 border-t border-white/[0.08]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/store/checkout"
                onClick={closeCart}
                className="sf-btn-primary w-full h-[52px] rounded-[12px] text-[15px] font-bold"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-center text-[13px] text-[#555555] hover:text-[#888888] transition-colors"
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
      <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center mb-5">
        <FiShoppingBag size={36} className="text-[#555555]" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">Your cart is empty</h3>
      <p className="text-sm text-[#666666] mb-6">
        Looks like you haven&apos;t added anything yet.
      </p>
      <button
        onClick={onClose}
        className="sf-btn-primary h-10 px-6 text-sm"
      >
        Browse Products
      </button>
    </div>
  )
}
