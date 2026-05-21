import Link from 'next/link'
import Image from 'next/image'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { RiInstagramLine, RiFacebookLine, RiTwitterXLine, RiWhatsappLine } from 'react-icons/ri'

const SHOP_LINKS = [
  { label: 'New Arrivals', href: '/store/category/all' },
  { label: 'Best Sellers', href: '/store/category/all' },
  { label: 'Flash Deals', href: '/store/category/all' },
  { label: 'Mobile Phones', href: '/store/category/all' },
  { label: 'Laptops & Computers', href: '/store/category/all' },
  { label: 'Gaming & Consoles', href: '/store/category/all' },
  { label: 'Accessories', href: '/store/category/all' },
  { label: 'Browse All Products', href: '/store/category/all', highlight: true },
]

const TOP_CATEGORIES = [
  { label: 'Computer & Laptop', href: '/store/category/all' },
  { label: 'SmartPhone', href: '/store/category/all' },
  { label: 'Electronics', href: '/store/category/all' },
  { label: 'Accessories', href: '/store/category/all' },
  { label: 'Camera & Photo', href: '/store/category/all' },
  { label: 'Gaming & Consoles', href: '/store/category/all' },
  { label: 'Romoss', href: '/store/category/all' },
  { label: 'Browse All Products', href: '/store/category/all', highlight: true },
]

const QUICK_LINKS = [
  // { label: 'About Us', href: '/about' },
  // { label: 'Blog Posts', href: '/blog' },
  // { label: 'Shopping Cart', href: '/cart' },
  { label: 'Wishlist', href: '/account/wishlist' },
  { label: 'Customer Help', href: '#' },
  { label: 'Track Order', href: '/account/track' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: RiFacebookLine },
  { label: 'Twitter / X', href: '#', icon: RiTwitterXLine },
  { label: 'Instagram', href: 'https://instagram.com/fresherzgadget', icon: RiInstagramLine },
  { label: 'WhatsApp', href: 'https://wa.me/2349075308722', icon: RiWhatsappLine },
]

const POPULAR_TAGS = [
  'Home', 'Laptop', 'Phone', 'Game Camera',
  'Macbook', 'TV', 'Power Bank', 'Smart TV',
  'Tablet', 'Microwave', 'Samsung',
]

export function Footer() {
  const getCurrentYear = () => {
    const currentYear = new Date().getFullYear()
    return currentYear
  }

  return (
    <footer className="bg-[#0D0D0D] text-white">
      {/* Main footer content */}
      <div className="max-w-content mx-auto px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1 — Brand + contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-5">
              <Image
                src="/icons/ShopFreshersV2LogoOrange.png"
                alt="ShopFresherz"
                width={140}
                height={36}
                className="h-9 w-auto"
                style={{ width: "auto", height: "auto" }} // ensures aspect ratio
              />
            </Link>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
              Nigeria&apos;s most trusted destination for tech enthusiasts — fresh gadgets at
              competitive prices.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a
                href="tel:+2349075308722"
                className="flex items-center gap-2.5 text-sm text-[#6B7280] hover:text-[#F5820A] transition-colors"
              >
                <FiPhone size={14} className="text-[#F5820A] shrink-0" />
                (620) 555-0129
              </a>
              <a
                href="mailto:support@shopfresherz.com"
                className="flex items-center gap-2.5 text-sm text-[#6B7280] hover:text-[#F5820A] transition-colors"
              >
                <FiMail size={14} className="text-[#F5820A] shrink-0" />
                support@shopfresher.z.com
              </a>
              <p className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                <FiMapPin size={14} className="text-[#F5820A] shrink-0 mt-0.5" />
                Lagos, Nigeria
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-[#6B7280] hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Top Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Top Category
            </h4>
            <ul className="space-y-2.5">
              {TOP_CATEGORIES.map(({ label, href, highlight }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={
                      highlight
                        ? 'text-sm text-[#F5820A] hover:underline font-medium'
                        : 'text-sm text-[#6B7280] hover:text-[#F5820A] transition-colors'
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#6B7280] hover:text-[#F5820A] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Socials (repeated as per Figma) */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Socials
            </h4>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#F5820A] transition-colors"
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://instagram.com/fresherzgadget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#F5820A] transition-colors"
                >
                  <RiInstagramLine size={14} />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5 — Popular Tags */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Tag
            </h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/store/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-xs text-[#6B7280] border border-[#333] rounded hover:border-[#F5820A] hover:text-[#F5820A] transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A1A1A]">
        <div className="max-w-content mx-auto px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <p>© {getCurrentYear()} shopfresherz.com. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[#F5820A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#F5820A] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}