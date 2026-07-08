'use client'

import { useState } from 'react'
import { FiMoreHorizontal, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi'
import { SiVisa, SiMastercard } from 'react-icons/si'
import { cn } from '@/lib/utils/format'
import type { PaymentMethod } from '@/lib/api/account'

interface PaymentCardProps {
  card: PaymentMethod
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

type CardType = 'visa' | 'mastercard' | 'verve'

const CARD_THEMES: Record<CardType, string> = {
  visa:       'bg-[#FFFFFF]',
  mastercard: 'bg-[#FFFFFF]',
  verve:      'bg-[#FFFFFF]',
}

const CARD_LOGO: Record<CardType, React.ReactNode> = {
  visa:       <SiVisa size={36} className="text-[#1A1F71]" />,
  mastercard: <SiMastercard size={24} className="text-[#EB001B]" />,
  verve:      <span className="text-[#F97316] font-bold text-sm tracking-widest">VERVE</span>,
}

function normaliseType(raw: string): CardType {
  const lower = raw?.toLowerCase()
  if (lower?.includes('master')) return 'mastercard'
  if (lower?.includes('verve'))  return 'verve'
  return 'visa'
}

export function PaymentCard({ card, onDelete, onEdit }: PaymentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied]     = useState(false)

  // API returns full cardNumber — derive last 4 digits
  const last4 = card.cardNumber?.slice(-4) ?? '••••'
  const type  = normaliseType(card.cardType)

  function copyNumber() {
    navigator.clipboard.writeText(`**** **** **** ${last4}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative rounded-xl p-5 text-[#111111] min-w-60 w-65 shrink-0 select-none border border-black/[0.07] shadow-[0_4px_16px_rgba(0,0,0,0.08)]', CARD_THEMES[type])}>

      {/* Balance */}
      {card.balance !== undefined && (
        <p className="text-lg font-bold mb-4 text-[#111111]">
          ₦{card.balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}{' '}
          <span className="text-xs font-normal text-[#888888]">{card.currency ?? 'NGN'}</span>
        </p>
      )}

      {/* Card number */}
      <div className="mb-4">
        <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Card Number</p>
        <div className="flex items-center gap-2 text-sm font-mono tracking-widest text-[#111111]">
          <span>**** **** ****</span>
          <span>{last4}</span>
          <button onClick={copyNumber} className="text-[#888888] hover:text-[#111111] transition-colors" aria-label="Copy">
            <FiCopy size={12} className={copied ? 'text-green-500' : ''} />
          </button>
        </div>
      </div>

      {/* Cardholder + logo */}
      <div className="flex items-center justify-between">
        {CARD_LOGO[type]}
        <span className="text-xs text-[#666666] font-medium">{card.cardHolderName}</span>
      </div>

      {/* Default badge */}
      {card.isDefault && (
        <span className="absolute bottom-3 left-5 text-[9px] font-bold uppercase tracking-widest text-[#F97316]">
          Default
        </span>
      )}

      {/* ··· menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.04] hover:bg-black/[0.08] transition-colors"
          aria-label="Card options"
        >
          <FiMoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 bg-[#FFFFFF] rounded-card shadow-lg border border-black/[0.08] z-20 py-1 min-w-32">
              <button
                onClick={() => { onEdit(card.id); setMenuOpen(false) }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[#111111] hover:bg-[#F97316]/10 hover:text-[#F97316] transition-colors"
              >
                <FiEdit2 size={13} /> Edit Card
              </button>
              <button
                onClick={() => { onDelete(card.id); setMenuOpen(false) }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[#EF4444] hover:bg-red-500/10 transition-colors"
              >
                <FiTrash2 size={13} /> Delete Card
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}