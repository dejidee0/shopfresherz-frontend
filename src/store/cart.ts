'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types/cart'
import { clampQty } from '@/lib/utils/format'

interface CartState {
  items: CartItem[]
  couponCode: string | null
  discountAmount: number
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Derived
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,
      isOpen: false,

      addItem: (incoming) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === incoming.productId && i.variantId === incoming.variantId
          )

          if (existing) {
            // Increase qty, respect stock cap
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: clampQty(i.quantity + incoming.quantity, i.stockQty) }
                  : i
              ),
            }
          }

          // New line item
          const id = `${incoming.productId}-${incoming.variantId ?? 'default'}-${Date.now()}`
          return { items: [...state.items, { ...incoming, id }] }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: clampQty(qty, i.stockQty) } : i
          ),
        })),

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      setCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),

      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'sf-cart',
      // Only persist items and coupon — not UI state
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
)