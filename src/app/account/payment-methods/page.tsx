'use client'

import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { AccountLayout } from '@/features/account/components/AccountLayout'
import { PaymentCard } from '@/features/account/components/PaymentCard'
import AddCardModal from '@/components/account/AddCardModal'
import { accountApi, type PaymentMethod, type PaymentCardDto } from '@/lib/api/account'
import { useAuthStore } from '@/store/auth'

export default function PaymentMethodsPage() {
  const token = useAuthStore((s) => s.accessToken)

  const [methods, setMethods]       = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null)

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return
    accountApi.getPaymentMethods(token)
      .then(setMethods)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  // ── Add ──────────────────────────────────────────────────────────────────
  async function handleAdd(data: PaymentCardDto) {
    if (!token) return
    const created = await accountApi.createPaymentMethod(token, data)
    setMethods((prev) => [...prev, created])
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  async function handleEdit(data: PaymentCardDto) {
    if (!token || !editingCard) return
    await accountApi.updatePaymentMethod(token, editingCard.id, data)
    // Re-fetch so the card reflects server state
    const updated = await accountApi.getPaymentMethods(token)
    setMethods(updated)
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!token) return
    await accountApi.deletePaymentMethod(token, id)
    setMethods((prev) => prev.filter((m) => m.id !== id))
  }

  function openEdit(id: string) {
    const card = methods.find((m) => m.id === id) ?? null
    setEditingCard(card)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingCard(null)
  }

  // Map PaymentMethod → PaymentCardDto for the edit form's initialData
  function toInitialData(card: PaymentMethod): Partial<PaymentCardDto> {
    return {
      cardType:      card.cardType,
      cardHolderName: card.cardHolderName,
      expiryMonth:   card.expiryMonth,
      expiryYear:    card.expiryYear,
      // cardNumber omitted in edit — user can't see/change the full number
      isDefault:     card.isDefault,
    }
  }

  return (
    <AccountLayout
      breadcrumbItems={[{ label: 'Payment Methods', href: '/account/payment-methods' }]}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col border border-border w-full lg:w-[80%]">
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between p-4 border-b border-border">
            <p className="text-sm font-semibold text-gray-600">PAYMENT OPTIONS</p>
            <button
              onClick={() => { setEditingCard(null); setIsModalOpen(true) }}
              className="text-primary text-sm cursor-pointer flex items-center gap-2"
            >
              Add Card <FaArrowRight />
            </button>
          </div>

          <div className="flex p-4 gap-4 flex-wrap pb-1">
            {isLoading ? (
              // Skeleton placeholders
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="min-w-60 w-65 h-36 rounded-xl bg-gray-100 animate-pulse" />
              ))
            ) : methods.length > 0 ? (
              methods.map((card) => (
                <PaymentCard
                  key={card.id}
                  card={card}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 py-4">No saved payment methods.</p>
            )}
          </div>
        </div>
      </div>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingCard ? handleEdit : handleAdd}
        initialData={editingCard ? toInitialData(editingCard) : undefined}
      />
    </AccountLayout>
  )
}