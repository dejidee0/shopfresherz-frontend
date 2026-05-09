'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiSend, FiMinus, FiX, FiMessageCircle } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'
import { cn, formatPrice } from '@/lib/utils/format'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductSuggestion {
  name: string
  description: string
  price: number
  slug: string
  image: string
}

interface Message {
  id: string
  role: 'assistant' | 'user'
  text: string
  product?: ProductSuggestion
  timestamp: Date
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: "Hello! I'm Fresherz. Looking for anything specific today?",
  timestamp: new Date(),
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BotBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-1">
      {/* Text bubble */}
      <div className="max-w-[82%] bg-[#F5F0E8] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#111111] leading-relaxed">
        {message.text}
      </div>

      {/* Inline product card */}
      {message.product && (
        <div className="max-w-[82%] bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mt-1">
          <div className="flex items-center gap-3 p-3">
            {/* Product image */}
            <div className="w-14 h-14 bg-[#F5F5F5] rounded-lg shrink-0 overflow-hidden">
              <Image
                src={message.product.image}
                alt={message.product.name}
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[#111111] leading-tight">
                  {message.product.name}
                </p>
                <p className="text-sm font-bold text-[#111111] shrink-0">
                  {formatPrice(message.product.price)}
                </p>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                {message.product.description}
              </p>
              <Link
                href={`/product/${message.product.slug}`}
                className="text-xs text-[#F5820A] font-semibold hover:underline mt-1 inline-block"
              >
                View Product →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Timestamp */}
      <span className="text-[10px] text-[#9CA3AF] ml-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  )
}

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="max-w-[82%] bg-[#F5820A] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-relaxed">
        {message.text}
      </div>
      <span className="text-[10px] text-[#9CA3AF] mr-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 max-w-[60%]">
      <div className="bg-[#F5F0E8] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, isMinimized])

  // Show unread dot when closed and bot responds
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasUnread(true)
    }
  }, [messages, isOpen])

  function open() {
    setIsOpen(true)
    setIsMinimized(false)
    setHasUnread(false)
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: uid(),
      role: 'user',
      text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // Build conversation history for the API (exclude greeting system message)
    const history = [...messages, userMsg]
      .filter((m) => m.id !== 'greeting' || m.role !== 'assistant')
      .map((m) => ({ role: m.role, content: m.text }))

    // Include greeting as first assistant turn
    const apiMessages = [
      { role: 'assistant', content: GREETING.text },
      ...history.filter((m) => m.content !== GREETING.text),
    ]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const botMsg: Message = {
        id: uid(),
        role: 'assistant',
        text: data.text,
        product: data.product ?? undefined,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          text: "Sorry, I'm having trouble connecting right now. Please try again or call us at +234 907 530 8722.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auto-resize textarea
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-br from-[#F5820A] to-[#E06B00] text-white shadow-lg hover:shadow-orange-300 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat with Fresherz"
        >
          <FiMessageCircle size={24} />
          {/* Unread indicator */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 w-97.5 bg-white rounded-[20px] shadow-2xl shadow-black/20 flex flex-col overflow-hidden transition-all duration-300',
            isMinimized ? 'h-16' : 'h-145'
          )}
          role="dialog"
          aria-label="Chat with Fresherz"
          aria-modal="false"
        >
          {/* ── Header ── */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F5F5F5] shrink-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <RiRobot2Line size={20} className="text-[#F5820A]" />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-white" />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#111111] leading-none">ShopFresherz</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5 uppercase tracking-wider">
                Online
              </p>
            </div>

            {/* Minimize + Close */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((v) => !v)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <FiMinus size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
                aria-label="Close chat"
              >
                <FiX size={15} />
              </button>
            </div>
          </div>

          {/* ── Messages area ── */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                {messages.map((msg) =>
                  msg.role === 'assistant' ? (
                    <BotBubble key={msg.id} message={msg} />
                  ) : (
                    <UserBubble key={msg.id} message={msg} />
                  )
                )}

                {/* Typing indicator */}
                {isLoading && <TypingIndicator />}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input bar ── */}
              <div className="flex items-end gap-3 px-4 py-3 border-t border-[#F5F5F5] bg-white shrink-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none bg-transparent leading-relaxed max-h-25 overflow-y-auto disabled:opacity-60"
                  aria-label="Chat input"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-linear-to-br from-[#F5820A] to-[#E06B00] text-white shrink-0 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  aria-label="Send message"
                >
                  <FiSend size={16} className="-translate-x-px" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}