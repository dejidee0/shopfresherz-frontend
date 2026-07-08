// 'use client'

// import Link from 'next/link'
// import {
//   FiHeadphones, FiPhone, FiMail, FiMessageCircle,
//   FiClock, FiMapPin, FiChevronDown, FiChevronUp,
//   FiShoppingBag, FiRefreshCw, FiTruck, FiCreditCard,
// } from 'react-icons/fi'
// import { RiInstagramLine, RiWhatsappLine } from 'react-icons/ri'
// import { useState } from 'react'

// const FAQS = [
//   {
//     q: 'How do I place an order?',
//     a: 'Browse our store, add items to your cart, and proceed to checkout. You can pay via card, bank transfer, or USSD. Once your payment is confirmed, you\'ll receive an order confirmation email.',
//   },
//   {
//     q: 'What payment methods do you accept?',
//     a: 'We accept debit/credit cards (Visa, Mastercard), bank transfers, USSD, and mobile money. All transactions are secured with industry-standard encryption.',
//   },
//   {
//     q: 'How long does delivery take?',
//     a: 'Lagos deliveries typically take 1–2 business days. Other states within Nigeria take 2–5 business days depending on your location. You\'ll receive a tracking link once your order ships.',
//   },
//   {
//     q: 'Can I return or exchange a product?',
//     a: 'Yes. We offer a 7-day return window for items in original condition with all accessories and packaging intact. Visit our Need Help page or contact us to initiate a return.',
//   },
//   {
//     q: 'Are your products original and genuine?',
//     a: 'Absolutely. ShopFresherz sources directly from authorised distributors and brand partners. Every product comes with the manufacturer\'s warranty.',
//   },
//   {
//     q: 'How do I track my order?',
//     a: 'Log in to your account and go to Orders, or use the Track Order link in the navigation bar. You\'ll also receive SMS and email updates at every stage of delivery.',
//   },
// ]

// const CHANNELS = [
//   {
//     icon: FiPhone,
//     title: 'Call Us',
//     detail: '+234 907 530 8722',
//     sub: 'Mon – Sat, 8 am – 8 pm',
//     href: 'tel:+2349075308722',
//     cta: 'Call now',
//     color: 'bg-orange-50 text-[#F97316]',
//   },
//   {
//     icon: RiWhatsappLine,
//     title: 'WhatsApp',
//     detail: '+234 907 530 8722',
//     sub: 'Typically replies within minutes',
//     href: 'https://wa.me/2349075308722',
//     cta: 'Chat on WhatsApp',
//     color: 'bg-green-50 text-green-600',
//   },
//   {
//     icon: FiMail,
//     title: 'Email Us',
//     detail: 'support@shopfresherz.com',
//     sub: 'We reply within 24 hours',
//     href: 'mailto:support@shopfresherz.com',
//     cta: 'Send email',
//     color: 'bg-blue-50 text-blue-600',
//   },
//   {
//     icon: RiInstagramLine,
//     title: 'Instagram DM',
//     detail: '@fresherzgadget',
//     sub: 'Mon – Sat, 9 am – 6 pm',
//     href: 'https://instagram.com/fresherzgadget',
//     cta: 'Message us',
//     color: 'bg-pink-50 text-pink-600',
//   },
// ]

// const TOPICS = [
//   { icon: FiShoppingBag, label: 'Orders & Payments', href: '/store/support#faq' },
//   { icon: FiTruck,       label: 'Shipping & Delivery', href: '/store/support#faq' },
//   { icon: FiRefreshCw,   label: 'Returns & Exchanges', href: '/store/need-help#returns' },
//   { icon: FiCreditCard,  label: 'Refunds',              href: '/store/need-help#refunds' },
// ]

// function FaqItem({ q, a }: { q: string; a: string }) {
//   const [open, setOpen] = useState(false)
//   return (
//     <div className="border border-white/[0.08] rounded-lg overflow-hidden">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:bg-[#F97316]/10 transition-colors"
//         aria-expanded={open}
//       >
//         <span>{q}</span>
//         {open
//           ? <FiChevronUp size={16} className="text-[#F97316] shrink-0 ml-3" />
//           : <FiChevronDown size={16} className="text-[#6B7280] shrink-0 ml-3" />}
//       </button>
//       {open && (
//         <div className="px-5 pb-4 text-sm text-[#6B7280] leading-relaxed border-t border-white/[0.08] pt-3">
//           {a}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function CustomerSupportPage() {
//   return (
//     <div className="bg-[#F5F5F5] min-h-screen">

//       {/* Hero */}
//       <section className="bg-[#F97316] text-white py-14 px-4">
//         <div className="max-w-3xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
//             <FiHeadphones size={28} />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
//             Customer Support
//           </h1>
//           <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
//             We&apos;re here to help. Reach out through any channel below or browse our
//             frequently asked questions — we typically respond within minutes.
//           </p>
//         </div>
//       </section>

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">

//         {/* Contact channels */}
//         <section>
//           <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">
//             Get in Touch
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {CHANNELS.map(({ icon: Icon, title, detail, sub, href, cta, color }) => (
//               <a
//                 key={title}
//                 href={href}
//                 target={href.startsWith('http') ? '_blank' : undefined}
//                 rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
//                 className="bg-[#141414] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 hover:border-[#F97316] hover:shadow-md transition-all group"
//               >
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
//                   <Icon size={20} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm text-white">{title}</p>
//                   <p className="text-sm text-[#F97316] font-medium mt-0.5">{detail}</p>
//                   <p className="text-xs text-[#6B7280] mt-0.5">{sub}</p>
//                 </div>
//                 <span className="text-xs font-semibold text-[#F97316] group-hover:underline mt-auto">
//                   {cta} →
//                 </span>
//               </a>
//             ))}
//           </div>
//         </section>

//         {/* Business hours + location */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-5">
//             <div className="flex items-center gap-2 mb-4">
//               <FiClock size={16} className="text-[#F97316]" />
//               <h2 className="font-bold text-sm text-white uppercase tracking-wide">
//                 Business Hours
//               </h2>
//             </div>
//             <ul className="space-y-2 text-sm text-[#6B7280]">
//               {[
//                 ['Monday – Friday', '8:00 am – 8:00 pm'],
//                 ['Saturday',        '9:00 am – 6:00 pm'],
//                 ['Sunday',          'Closed'],
//               ].map(([day, hours]) => (
//                 <li key={day} className="flex justify-between">
//                   <span className="text-white font-medium">{day}</span>
//                   <span>{hours}</span>
//                 </li>
//               ))}
//             </ul>
//             <p className="text-xs text-[#6B7280] mt-4 leading-relaxed">
//               WhatsApp messages received outside business hours will be answered
//               the next working day.
//             </p>
//           </div>

//           <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-5">
//             <div className="flex items-center gap-2 mb-4">
//               <FiMapPin size={16} className="text-[#F97316]" />
//               <h2 className="font-bold text-sm text-white uppercase tracking-wide">
//                 Our Location
//               </h2>
//             </div>
//             <p className="text-sm text-white font-semibold">ShopFresherz HQ</p>
//             <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
//               Lagos, Nigeria
//             </p>
//             <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">
//               We operate primarily online and deliver nationwide across Nigeria.
//               Walk-in pickups are available by appointment — contact us to arrange.
//             </p>
//             <a
//               href="tel:+2349075308722"
//               className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#F97316] hover:underline"
//             >
//               <FiPhone size={12} /> Book a pickup call
//             </a>
//           </div>
//         </section>

//         {/* Quick topic links */}
//         <section>
//           <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">
//             What do you need help with?
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {TOPICS.map(({ icon: Icon, label, href }) => (
//               <Link
//                 key={label}
//                 href={href}
//                 className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-[#F97316] hover:shadow-sm transition-all"
//               >
//                 <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
//                   <Icon size={17} className="text-[#F97316]" />
//                 </div>
//                 <span className="text-xs font-semibold text-white">{label}</span>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* FAQ */}
//         <section id="faq">
//           <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">
//             Frequently Asked Questions
//           </h2>
//           <div className="space-y-3">
//             {FAQS.map((item) => (
//               <FaqItem key={item.q} q={item.q} a={item.a} />
//             ))}
//           </div>
//           <p className="text-sm text-[#6B7280] mt-5 text-center">
//             Didn&apos;t find your answer?{' '}
//             <Link href="/store/need-help" className="text-[#F97316] font-semibold hover:underline">
//               Visit our Help Centre →
//             </Link>
//           </p>
//         </section>

//       </div>
//     </div>
//   )
// }




'use client'

import Link from 'next/link'
import {
  FiHeadphones, FiPhone, FiMail,
  FiClock, FiMapPin,
  FiShoppingBag, FiRefreshCw, FiTruck, FiCreditCard,
} from 'react-icons/fi'
import { RiInstagramLine, RiWhatsappLine } from 'react-icons/ri'
import { useState } from 'react'

const FAQS = [
  {
    q: 'How do I place an order?',
    a: "Browse our store, add items to your cart, and proceed to checkout. You can pay via card, bank transfer, or USSD. Once your payment is confirmed, you'll receive an order confirmation email.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept debit/credit cards (Visa, Mastercard), bank transfers, USSD, and mobile money. All transactions are secured with industry-standard encryption.',
  },
  {
    q: 'How long does delivery take?',
    a: "Lagos deliveries typically take 1–2 business days. Other states within Nigeria take 2–5 business days depending on your location. You'll receive a tracking link once your order ships.",
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Yes. We offer a 7-day return window for items in original condition with all accessories and packaging intact. Visit our Need Help page or contact us to initiate a return.',
  },
  {
    q: 'Are your products original and genuine?',
    a: "Absolutely. ShopFresherz sources directly from authorised distributors and brand partners. Every product comes with the manufacturer's warranty.",
  },
  {
    q: 'How do I track my order?',
    a: "Log in to your account and go to Orders, or use the Track Order link in the navigation bar. You'll also receive SMS and email updates at every stage of delivery.",
  },
]

const CHANNELS = [
  {
    icon: FiPhone,
    title: 'Call Us',
    detail: '+234 907 530 8722',
    sub: 'Mon – Sat, 8 am – 8 pm',
    href: 'tel:+2349075308722',
    cta: 'Call now',
    bg: 'bg-orange-50',
    iconColor: 'text-[#E07200]',
  },
  {
    icon: RiWhatsappLine,
    title: 'WhatsApp',
    detail: '+234 907 530 8722',
    sub: 'Typically replies within minutes',
    href: 'https://wa.me/2349075308722',
    cta: 'Chat now',
    bg: 'bg-green-50',
    iconColor: 'text-green-700',
  },
  {
    icon: FiMail,
    title: 'Email Us',
    detail: 'support@shopfresherz.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@shopfresherz.com',
    cta: 'Send email',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-700',
  },
  {
    icon: RiInstagramLine,
    title: 'Instagram DM',
    detail: '@fresherzgadget',
    sub: 'Mon – Sat, 9 am – 6 pm',
    href: 'https://instagram.com/fresherzgadget',
    cta: 'Message us',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-700',
  },
]

const TOPICS = [
  { icon: FiShoppingBag, label: 'Orders & Payments',    href: '/store/support#faq' },
  { icon: FiTruck,       label: 'Shipping & Delivery',  href: '/store/support#faq' },
  { icon: FiRefreshCw,   label: 'Returns & Exchanges',  href: '/store/need-help#returns' },
  { icon: FiCreditCard,  label: 'Refunds',              href: '/store/need-help#refunds' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ${
        open ? 'border-[#F97316]/40' : 'border-black/[0.07]'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-[#111111] hover:bg-black/[0.03] transition-colors gap-3"
      >
        <span>{q}</span>
        <span
          className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center shrink-0 transition-colors text-xs font-bold ${
            open
              ? 'border-[#F97316]/40 bg-[#F97316]/10 text-[#F97316]'
              : 'border-[#D1D5DB] text-[#6B7280]'
          }`}
        >
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-3 text-sm text-[#666666] leading-relaxed border-t border-black/[0.07]">
          {a}
        </div>
      )}
    </div>
  )
}

export default function CustomerSupportPage() {
  return (
    <div className="bg-[#F5F2ED] min-h-screen font-sans">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-12 px-4"
        style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F2ED 60%, #FFFFFF 100%)' }}
      >
        {/* Subtle glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(245,130,10,0.10) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center shrink-0">
            <FiHeadphones size={26} className="text-[#F97316]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight mb-1">
              Customer Support
            </h1>
            <p className="text-sm text-[#666666] leading-relaxed max-w-md font-light">
              We&apos;re here to help. Reach out through any channel below or browse
              our frequently asked questions — we typically respond within minutes.
            </p>
          </div>
          <span className="hidden sm:inline-flex shrink-0 items-center rounded-full border border-[#F97316]/40 bg-[#F97316]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#F97316]">
            Live support
          </span>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Contact channels ── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#888888] mb-3">
            Get in touch
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHANNELS.map(({ icon: Icon, title, detail, sub, href, cta, bg, iconColor }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-white border border-black/[0.07] rounded-xl p-[18px] flex flex-col gap-3 hover:border-[#F97316] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className={`w-9 h-9 rounded-[10px] ${bg} flex items-center justify-center`}>
                  <Icon size={17} className={iconColor} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111111]">{title}</p>
                  <p className="text-[12px] font-medium text-[#E07200] mt-0.5">{detail}</p>
                  <p className="text-[11px] text-[#888888] mt-0.5">{sub}</p>
                </div>
                <span className="text-[11px] font-semibold text-[#E07200] mt-auto flex items-center gap-1 group-hover:underline">
                  {cta} →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <hr className="border-black/[0.08]" />

        {/* ── Business hours + Location ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Hours */}
          <div className="bg-white border border-black/[0.07] rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <FiClock size={14} className="text-[#E07200]" />
              <p className="text-[10px] font-semibold uppercase tracking-[1.2px] text-[#888888]">
                Business hours
              </p>
            </div>
            <ul className="space-y-0">
              {(
                [
                  ['Monday – Friday', '8:00 am – 8:00 pm'],
                  ['Saturday',        '9:00 am – 6:00 pm'],
                  ['Sunday',          'Closed'],
                ] as [string, string][]
              ).map(([day, hours]) => (
                <li
                  key={day}
                  className="flex justify-between items-center py-[7px] border-b border-[#F3F4F6] last:border-b-0"
                >
                  <span className="text-[12px] font-medium text-[#111111]">{day}</span>
                  <span className="text-[12px] text-[#666666]">{hours}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[#888888] mt-3 leading-relaxed">
              WhatsApp messages outside business hours are answered the next working day.
            </p>
          </div>

          {/* Location */}
          <div className="bg-white border border-black/[0.07] rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin size={14} className="text-[#E07200]" />
              <p className="text-[10px] font-semibold uppercase tracking-[1.2px] text-[#888888]">
                Our location
              </p>
            </div>
            <p className="text-[13px] font-semibold text-[#111111]">ShopFresherz HQ</p>
            <p className="text-[12px] text-[#666666] mt-1">Lagos, Nigeria</p>
            <p className="text-[11px] text-[#888888] mt-3 leading-relaxed">
              We operate primarily online and deliver nationwide across Nigeria.
              Walk-in pickups are available by appointment — contact us to arrange.
            </p>
            <a
              href="tel:+2349075308722"
              className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-semibold text-[#E07200] hover:underline"
            >
              <FiPhone size={11} /> Book a pickup call
            </a>
          </div>
        </section>

        {/* ── Divider ── */}
        <hr className="border-black/[0.08]" />

        {/* ── Topic shortcuts ── */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#888888] mb-3">
            What do you need help with?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TOPICS.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-white border border-black/[0.07] rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-[#F97316] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="w-9 h-9 rounded-[10px] bg-orange-50 flex items-center justify-center">
                  <Icon size={16} className="text-[#E07200]" />
                </div>
                <span className="text-[11px] font-medium text-[#111111] leading-snug">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <hr className="border-black/[0.08]" />

        {/* ── FAQ ── */}
        <section id="faq">
          <p className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#888888] mb-3">
            Frequently asked questions
          </p>
          <div className="space-y-2">
            {FAQS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <p className="text-sm text-[#888888] mt-5 text-center">
            Didn&apos;t find your answer?{' '}
            <Link href="/store/need-help" className="text-[#E07200] font-semibold hover:underline">
              Visit our Help Centre →
            </Link>
          </p>
        </section>

      </div>
    </div>
  )
}