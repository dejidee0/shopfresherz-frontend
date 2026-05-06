'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FiGrid,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiBell,
  FiStar,
  FiUsers,
  FiLogOut,
  FiPackage,
} from 'react-icons/fi'
import { PiCoinVerticalLight } from 'react-icons/pi'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils/format'

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/account',                    icon: FiGrid       },
  { label: 'Order History',    href: '/account/orders',             icon: FiShoppingBag },
  { label: 'Track Order',      href: '/account/track',              icon: FiPackage    },
  { label: 'Addresses',        href: '/account/addresses',          icon: FiMapPin     },
  { label: 'Payments Methods', href: '/account/payment-methods',    icon: FiCreditCard },
  { label: 'Profile Settings', href: '/account/profile',            icon: FiUser       },
  { label: 'Notification',     href: '/account/notifications',      icon: FiBell       },
  { label: 'Loyalty Point',    href: '/account/loyalty',            icon: PiCoinVerticalLight },
  { label: 'My Reviews',       href: '/account/reviews',            icon: FiStar       },
  { label: 'Referrals',        href: '/account/referrals',          icon: FiUsers      },
]

interface AccountSidebarProps {
  /** Called after a nav link is clicked — used by mobile drawer to close itself */
  onNavigate?: () => void
}

export function AccountSidebar({ onNavigate }: AccountSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    onNavigate?.()
    router.push('/')
  }

  return (
    <nav className="w-full lg:w-56 bg-white border border-gray-200 rounded overflow-hidden">
      <ul className="py-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          // Exact match for dashboard, prefix match for everything else
          const isActive =
            href === '/account' ? pathname === href : pathname.startsWith(href)

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-[#F5820A] text-white font-semibold'
                    : 'text-[#374151] hover:bg-orange-50 hover:text-[#F5820A]'
                )}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Link>
            </li>
          )
        })}

        {/* Divider + Logout */}
        <li className="border-t border-gray-100 mt-1 pt-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <FiLogOut size={16} className="shrink-0" />
            Log-out
          </button>
        </li>
      </ul>
    </nav>
  )
}