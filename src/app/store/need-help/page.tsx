// 'use client'

// import Link from 'next/link'
// import { useState } from 'react'
// import {
//   FiHelpCircle, FiRefreshCw, FiTruck, FiCreditCard,
//   FiShield, FiPackage, FiChevronDown, FiChevronUp,
//   FiPhone, FiMessageCircle, FiAlertCircle,
// } from 'react-icons/fi'
// import { RiWhatsappLine } from 'react-icons/ri'

// /* ─── Types ─────────────────────────────────────────────────── */
// interface Step { step: number; text: string }
// interface Section {
//   id: string
//   icon: React.ElementType
//   title: string
//   intro: string
//   steps: Step[]
//   note?: string
// }

// /* ─── Content ────────────────────────────────────────────────── */
// const SECTIONS: Section[] = [
//   {
//     id: 'returns',
//     icon: FiRefreshCw,
//     title: 'Returns & Exchanges',
//     intro:
//       'Changed your mind or received the wrong item? We make returns straightforward.',
//     steps: [
//       { step: 1, text: 'Contact us within 7 days of delivery via WhatsApp or email.' },
//       { step: 2, text: 'Share your order number and a brief description (photos help).' },
//       { step: 3, text: 'Our team will confirm eligibility and arrange a pickup or drop-off.' },
//       { step: 4, text: 'Once we receive and inspect the item, your exchange or refund is processed.' },
//     ],
//     note:
//       'Items must be in original condition with all accessories, manuals, and packaging. Opened software, earphones, and hygiene products are non-returnable.',
//   },
//   {
//     id: 'refunds',
//     icon: FiCreditCard,
//     title: 'Refunds',
//     intro:
//       'Approved refunds are processed back to your original payment method.',
//     steps: [
//       { step: 1, text: 'Refund requests are reviewed within 1–2 business days of us receiving the item.' },
//       { step: 2, text: 'Card refunds take 3–7 business days depending on your bank.' },
//       { step: 3, text: 'Bank transfer refunds are processed within 2–3 business days.' },
//       { step: 4, text: 'You\'ll receive an email confirmation once the refund is initiated.' },
//     ],
//     note: 'Delivery fees are non-refundable unless the return is due to our error.',
//   },
//   {
//     id: 'shipping',
//     icon: FiTruck,
//     title: 'Shipping & Delivery',
//     intro: 'We deliver nationwide across Nigeria with real-time tracking.',
//     steps: [
//       { step: 1, text: 'Orders placed before 2 pm on weekdays are dispatched same day.' },
//       { step: 2, text: 'Lagos deliveries: 1–2 business days.' },
//       { step: 3, text: 'Other states: 2–5 business days.' },
//       { step: 4, text: 'You\'ll receive a tracking link via SMS and email once your order ships.' },
//     ],
//     note:
//       'Delivery timelines may be affected by public holidays or extreme weather. We\'ll notify you of any delays.',
//   },
//   {
//     id: 'warranty',
//     icon: FiShield,
//     title: 'Warranty & Repairs',
//     intro:
//       'All products come with the manufacturer\'s warranty. We help you navigate claims.',
//     steps: [
//       { step: 1, text: 'Check your product\'s warranty card or documentation for the warranty period.' },
//       { step: 2, text: 'Contact us with your order number and a description of the fault.' },
//       { step: 3, text: 'We\'ll guide you to the nearest authorised service centre or arrange a pickup.' },
//       { step: 4, text: 'Warranty claims typically take 7–14 business days to resolve.' },
//     ],
//     note:
//       'Warranty does not cover physical damage, water damage, or faults caused by unauthorised repairs.',
//   },
//   {
//     id: 'orders',
//     icon: FiPackage,
//     title: 'Order Issues',
//     intro: 'Wrong item, missing accessory, or damaged on arrival? We\'ve got you.',
//     steps: [
//       { step: 1, text: 'Take clear photos of the item and packaging immediately upon delivery.' },
//       { step: 2, text: 'Contact us within 48 hours of delivery via WhatsApp or email.' },
//       { step: 3, text: 'Share your order number and photos — we\'ll resolve it within 24 hours.' },
//       { step: 4, text: 'We\'ll arrange a replacement, exchange, or refund at no extra cost to you.' },
//     ],
//     note: 'Issues reported after 48 hours of delivery may not qualify for a free replacement.',
//   },
// ]

// const QUICK_LINKS = [
//   { label: 'Track my order',       href: '/account/orders' },
//   { label: 'View my orders',       href: '/account/orders' },
//   { label: 'Update my address',    href: '/account/addresses' },
//   { label: 'Manage payment cards', href: '/account/payment-methods' },
//   { label: 'Edit my profile',      href: '/account/profile' },
//   { label: 'Contact support',      href: '/store/support' },
// ]

// /* ─── Components ─────────────────────────────────────────────── */
// function SectionBlock({ section }: { section: Section }) {
//   const [open, setOpen] = useState(false)
//   const Icon = section.icon

//   return (
//     <div id={section.id} className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F97316]/10 transition-colors"
//         aria-expanded={open}
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
//             <Icon size={17} className="text-[#F97316]" />
//           </div>
//           <div>
//             <p className="font-bold text-sm text-white">{section.title}</p>
//             <p className="text-xs text-[#6B7280] mt-0.5 hidden sm:block">{section.intro}</p>
//           </div>
//         </div>
//         {open
//           ? <FiChevronUp size={16} className="text-[#F97316] shrink-0 ml-3" />
//           : <FiChevronDown size={16} className="text-[#6B7280] shrink-0 ml-3" />}
//       </button>

//       {open && (
//         <div className="px-5 pb-5 border-t border-white/[0.08] pt-4">
//           <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">{section.intro}</p>

//           <ol className="space-y-3">
//             {section.steps.map(({ step, text }) => (
//               <li key={step} className="flex items-start gap-3">
//                 <span className="w-6 h-6 rounded-full bg-[#F97316] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
//                   {step}
//                 </span>
//                 <p className="text-sm text-white leading-relaxed">{text}</p>
//               </li>
//             ))}
//           </ol>

//           {section.note && (
//             <div className="mt-4 flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
//               <FiAlertCircle size={15} className="text-[#F97316] shrink-0 mt-0.5" />
//               <p className="text-xs text-[#6B7280] leading-relaxed">{section.note}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ─── Page ───────────────────────────────────────────────────── */
// export default function NeedHelpPage() {
//   return (
//     <div className="bg-[#F5F5F5] min-h-screen">

//       {/* Hero */}
//       <section className="bg-[#0D0D0D] text-white py-14 px-4">
//         <div className="max-w-3xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
//             <FiHelpCircle size={28} className="text-[#F97316]" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
//             Help Centre
//           </h1>
//           <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
//             Step-by-step guides for returns, refunds, shipping, warranty claims,
//             and order issues. Find what you need below.
//           </p>
//         </div>
//       </section>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">

//         {/* Help sections */}
//         <section>
//           <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">
//             How can we help?
//           </h2>
//           <div className="space-y-3">
//             {SECTIONS.map((section) => (
//               <SectionBlock key={section.id} section={section} />
//             ))}
//           </div>
//         </section>

//         {/* Quick links */}
//         <section>
//           <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">
//             Quick Links
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {QUICK_LINKS.map(({ label, href }) => (
//               <Link
//                 key={label}
//                 href={href}
//                 className="bg-[#141414] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-white hover:border-[#F97316] hover:text-[#F97316] transition-colors text-center"
//               >
//                 {label}
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* Still need help CTA */}
//         <section className="bg-[#F97316] rounded-2xl p-6 sm:p-8 text-white text-center">
//           <FiMessageCircle size={32} className="mx-auto mb-3 opacity-90" />
//           <h2 className="text-lg font-extrabold mb-2">Still need help?</h2>
//           <p className="text-white/85 text-sm leading-relaxed max-w-md mx-auto mb-6">
//             Our support team is available Monday to Saturday. Reach us directly
//             and we&apos;ll sort things out fast.
//           </p>
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//             <a
//               href="https://wa.me/2349075308722"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 bg-white text-[#F97316] font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-[#F97316]/10 transition-colors"
//             >
//               <RiWhatsappLine size={18} /> WhatsApp Us
//             </a>
//             <a
//               href="tel:+2349075308722"
//               className="inline-flex items-center gap-2 bg-white/15 text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-white/25 transition-colors border border-white/30"
//             >
//               <FiPhone size={16} /> Call +234 907 530 8722
//             </a>
//           </div>
//           <p className="text-white/60 text-xs mt-4">
//             Or visit our full{' '}
//             <Link href="/store/support" className="underline hover:text-white">
//               Customer Support page
//             </Link>
//           </p>
//         </section>

//       </div>
//     </div>
//   )
// }


'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  FiHelpCircle, FiRefreshCw, FiTruck, FiCreditCard,
  FiShield, FiPackage, FiPhone, FiMessageCircle, FiAlertCircle,
} from 'react-icons/fi'
import { RiWhatsappLine } from 'react-icons/ri'

/* ─── Types ─────────────────────────────────────────────────── */
interface Step { step: number; text: string }
interface Section {
  id: string
  icon: React.ElementType
  title: string
  intro: string
  steps: Step[]
  note?: string
  accent: string   // icon bg tint
  accentText: string  // icon color
}

/* ─── Content ────────────────────────────────────────────────── */
const SECTIONS: Section[] = [
  {
    id: 'returns',
    icon: FiRefreshCw,
    title: 'Returns & Exchanges',
    intro: 'Changed your mind or received the wrong item? We make returns straightforward.',
    steps: [
      { step: 1, text: 'Contact us within 7 days of delivery via WhatsApp or email.' },
      { step: 2, text: 'Share your order number and a brief description (photos help).' },
      { step: 3, text: 'Our team will confirm eligibility and arrange a pickup or drop-off.' },
      { step: 4, text: 'Once we receive and inspect the item, your exchange or refund is processed.' },
    ],
    note: 'Items must be in original condition with all accessories, manuals, and packaging. Opened software, earphones, and hygiene products are non-returnable.',
    accent: 'bg-orange-50',
    accentText: 'text-[#E07200]',
  },
  {
    id: 'refunds',
    icon: FiCreditCard,
    title: 'Refunds',
    intro: 'Approved refunds are processed back to your original payment method.',
    steps: [
      { step: 1, text: 'Refund requests are reviewed within 1–2 business days of us receiving the item.' },
      { step: 2, text: 'Card refunds take 3–7 business days depending on your bank.' },
      { step: 3, text: 'Bank transfer refunds are processed within 2–3 business days.' },
      { step: 4, text: "You'll receive an email confirmation once the refund is initiated." },
    ],
    note: 'Delivery fees are non-refundable unless the return is due to our error.',
    accent: 'bg-blue-50',
    accentText: 'text-blue-700',
  },
  {
    id: 'shipping',
    icon: FiTruck,
    title: 'Shipping & Delivery',
    intro: 'We deliver nationwide across Nigeria with real-time tracking.',
    steps: [
      { step: 1, text: 'Orders placed before 2 pm on weekdays are dispatched same day.' },
      { step: 2, text: 'Lagos deliveries: 1–2 business days.' },
      { step: 3, text: 'Other states: 2–5 business days.' },
      { step: 4, text: "You'll receive a tracking link via SMS and email once your order ships." },
    ],
    note: "Delivery timelines may be affected by public holidays or extreme weather. We'll notify you of any delays.",
    accent: 'bg-green-50',
    accentText: 'text-green-700',
  },
  {
    id: 'warranty',
    icon: FiShield,
    title: 'Warranty & Repairs',
    intro: "All products come with the manufacturer's warranty. We help you navigate claims.",
    steps: [
      { step: 1, text: "Check your product's warranty card or documentation for the warranty period." },
      { step: 2, text: 'Contact us with your order number and a description of the fault.' },
      { step: 3, text: "We'll guide you to the nearest authorised service centre or arrange a pickup." },
      { step: 4, text: 'Warranty claims typically take 7–14 business days to resolve.' },
    ],
    note: 'Warranty does not cover physical damage, water damage, or faults caused by unauthorised repairs.',
    accent: 'bg-orange-50',
    accentText: 'text-[#C2410C]',
  },
  {
    id: 'orders',
    icon: FiPackage,
    title: 'Order Issues',
    intro: "Wrong item, missing accessory, or damaged on arrival? We've got you.",
    steps: [
      { step: 1, text: 'Take clear photos of the item and packaging immediately upon delivery.' },
      { step: 2, text: 'Contact us within 48 hours of delivery via WhatsApp or email.' },
      { step: 3, text: "Share your order number and photos — we'll resolve it within 24 hours." },
      { step: 4, text: "We'll arrange a replacement, exchange, or refund at no extra cost to you." },
    ],
    note: 'Issues reported after 48 hours of delivery may not qualify for a free replacement.',
    accent: 'bg-pink-50',
    accentText: 'text-pink-700',
  },
]

const QUICK_LINKS = [
  { label: 'Track my order',       href: '/account/orders' },
  { label: 'View my orders',       href: '/account/orders' },
  { label: 'Update my address',    href: '/account/addresses' },
  { label: 'Manage payment cards', href: '/account/payment-methods' },
  { label: 'Edit my profile',      href: '/account/profile' },
  { label: 'Contact support',      href: '/store/support' },
]

/* ─── SectionBlock ───────────────────────────────────────────── */
function SectionBlock({ section }: { section: Section }) {
  const [open, setOpen] = useState(false)
  const Icon = section.icon

  return (
    <div
      id={section.id}
      className={`bg-[#141414] border rounded-xl overflow-hidden transition-colors duration-150 ${
        open ? 'border-[#F97316]/40' : 'border-white/[0.08]'
      }`}
    >
      {/* Header button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F97316]/10/50 transition-colors gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-[10px] ${section.accent} flex items-center justify-center shrink-0`}
          >
            <Icon size={16} className={section.accentText} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{section.title}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5 hidden sm:block truncate">
              {section.intro}
            </p>
          </div>
        </div>
        <span
          className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
            open
              ? 'border-[#F97316]/40 bg-[#F97316]/10 text-[#F97316]'
              : 'border-[#D1D5DB] text-[#6B7280]'
          }`}
        >
          {open ? '−' : '+'}
        </span>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-[#F3F4F6]">
          <p className="text-[13px] text-[#6B7280] mb-5 leading-relaxed">{section.intro}</p>

          <ol className="space-y-3">
            {section.steps.map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="w-[22px] h-[22px] rounded-full bg-[#F97316] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step}
                </span>
                <p className="text-[13px] text-[#D7D7D7] leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>

          {section.note && (
            <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <FiAlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-800 leading-relaxed">{section.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function NeedHelpPage() {
  return (
    <div className="bg-[#F7F6F3] min-h-screen font-sans">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-12 px-4"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}
      >
        {/* Subtle orange glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 75% at 65% 50%, rgba(245,130,10,0.14) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <FiHelpCircle size={26} className="text-[#F97316]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1">
              Help Centre
            </h1>
            <p className="text-sm text-white/55 leading-relaxed max-w-md font-light">
              Step-by-step guides for returns, refunds, shipping, warranty claims,
              and order issues. Find what you need below.
            </p>
          </div>
          <span className="hidden sm:inline-flex shrink-0 items-center rounded-full border border-[#F97316]/35 bg-[#F97316]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#F97316]">
            Help guides
          </span>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Help sections ── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#9CA3AF] mb-3">
            How can we help?
          </p>
          <div className="space-y-2">
            {SECTIONS.map((section) => (
              <SectionBlock key={section.id} section={section} />
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <hr className="border-white/[0.08]" />

        {/* ── Quick links ── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#9CA3AF] mb-3">
            Quick links
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {QUICK_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-[#141414] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] font-medium text-[#D7D7D7] hover:border-[#F97316] hover:text-[#E07200] transition-all duration-150 text-center hover:-translate-y-0.5"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <hr className="border-white/[0.08]" />

        {/* ── Still need help CTA ── */}
        <section
          className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #c45e00 0%, #e07200 40%, #F97316 100%)' }}
        >
          {/* Subtle inner glow ring */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 border border-white/20 mb-4">
              <FiMessageCircle size={22} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
            <p className="text-white/75 text-[13px] leading-relaxed max-w-sm mx-auto mb-6 font-light">
              Our support team is available Monday to Saturday. Reach us directly
              and we&apos;ll sort things out fast.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/2349075308722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#C45E00] font-semibold text-[13px] px-6 py-2.5 rounded-xl hover:bg-[#F97316]/10 transition-colors"
              >
                <RiWhatsappLine size={17} /> WhatsApp us
              </a>
              <a
                href="tel:+2349075308722"
                className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white font-semibold text-[13px] px-6 py-2.5 rounded-xl hover:bg-white/25 transition-colors"
              >
                <FiPhone size={15} /> Call +234 907 530 8722
              </a>
            </div>
            <p className="text-white/50 text-[11px] mt-4">
              Or visit our full{' '}
              <Link href="/store/support" className="underline hover:text-white transition-colors">
                Customer Support page
              </Link>
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
