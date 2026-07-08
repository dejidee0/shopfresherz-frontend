import Link from 'next/link'
import Image from 'next/image'
import { RiInstagramLine, RiTwitterXLine, RiWhatsappLine } from 'react-icons/ri'

const QUICK_LINKS = [
  { label: 'Track your order', href: '/account/track' },
  { label: 'Return policy', href: '/store/need-help' },
  { label: 'Warranty info', href: '/store/need-help' },
  { label: 'Contact support', href: '/store/support' },
]

const CATEGORY_LINKS = [
  { label: 'Smartphones', href: '/store/category/all' },
  { label: 'Laptops', href: '/store/category/all' },
  { label: 'Gaming', href: '/store/category/all' },
  { label: 'Accessories', href: '/store/category/all' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/shopfresherz?igsh=MXRhMHNrM3JnbWtteQ==', icon: RiInstagramLine },
  { label: 'Twitter / X', href: '#', icon: RiTwitterXLine },
  { label: 'WhatsApp', href: 'https://wa.me/2349075308722', icon: RiWhatsappLine },
]

const PAYMENT_OPTIONS = ['Flutterwave', 'Kuda Bank', 'Transfer']

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="relative mb-5 text-[12px] font-semibold uppercase tracking-[0.8px] text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-5 after:bg-[#F97316]">
      {children}
    </h4>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#1A1A2E] text-white">
      <div className="px-4 pt-14 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <Image
                src="/icons/logo-mark.png"
                alt="ShopFresherz"
                width={36}
                height={36}
                style={{ borderRadius: '10px', objectFit: 'contain' }}
              />
              <span className="flex flex-col leading-none">
                <span className="text-base font-bold text-white">ShopFresherz</span>
                <span className="mt-1 text-[11px] text-[#444444]">Gadget Store</span>
              </span>
            </Link>

            <p className="mb-6 mt-4 max-w-[260px] text-[13px] leading-[1.9] text-[#444444]">
              Nigeria&apos;s most trusted destination for premium gadgets and electronics.
              Fresh tech, every time.
            </p>

            <div className="flex max-w-sm">
              <input
                type="email"
                placeholder="Email address"
                className="sf-input h-11 rounded-r-none"
              />
              <button className="sf-btn-primary h-11 rounded-l-none px-4 text-xs">
                Subscribe
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/[0.1] bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] transition-all hover:bg-[rgba(249,115,22,0.08)] hover:text-[#F97316] hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[13px] text-[rgba(255,255,255,0.6)] transition-colors hover:text-[rgba(255,255,255,0.9)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Categories</FooterHeading>
            <ul className="space-y-3">
              {CATEGORY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[13px] text-[rgba(255,255,255,0.6)] transition-colors hover:text-[rgba(255,255,255,0.9)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>We Accept</FooterHeading>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map((label) => (
                <span
                  key={label}
                  className="rounded-[6px] border border-white/[0.1] bg-[rgba(255,255,255,0.08)] px-2.5 py-1.5 text-[11px] text-[rgba(255,255,255,0.7)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-5 sm:flex-row">
          <p className="text-[12px] text-[rgba(255,255,255,0.4)]">© 2026 ShopFresherz</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_OPTIONS.map((label) => (
              <span key={label} className="rounded-[6px] border border-white/[0.1] bg-[rgba(255,255,255,0.08)] px-2.5 py-1.5 text-[11px] text-[rgba(255,255,255,0.7)]">
                {label}
              </span>
            ))}
          </div>
          <p className="text-[12px] text-[rgba(255,255,255,0.4)]">Made with heart in Nigeria</p>
        </div>
      </div>
    </footer>
  )
}
