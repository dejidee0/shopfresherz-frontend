// import { redirect } from 'next/navigation'
// import { AccountSidebar } from '@/features/account/components/AccountSideBar'
// import { Breadcrumb } from '@/components/ui/BreadCrumbs'

// // In production, validate the session server-side here.
// // For now we rely on the client-side auth store — redirect happens
// // in the individual page components if token is missing.

// interface AccountLayoutProps {
//   children: React.ReactNode
//   breadcrumbItems?: { label: string; href?: string }[]
// }

// // This is the layout wrapper used by all /account/* pages.
// // It is NOT a Next.js layout.tsx — it's a plain server component
// // so each page can pass its own breadcrumb items.
// export function AccountLayout({
//   children,
//   breadcrumbItems = [],
// }: AccountLayoutProps) {
//   const crumbs = [
//     { label: 'User Account', href: '/account' },
//     { label: 'Dashboard', href: '/account' },
//     ...breadcrumbItems,
//   ]

//   return (
//     <div className="max-w-content mx-auto px-10 py-6">
//       <Breadcrumb items={crumbs} />

//       <div className="flex gap-6 mt-4">
//         <AccountSidebar />
//         <div className="flex-1 min-w-0">{children}</div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { AccountSidebar } from '@/features/account/components/AccountSideBar'
import { Breadcrumb } from '@/components/ui/BreadCrumbs'
import { FiMenu, FiX } from 'react-icons/fi'

interface AccountLayoutProps {
  children: React.ReactNode
  breadcrumbItems?: { label: string; href?: string }[]
}

export function AccountLayout({
  children,
  breadcrumbItems = [],
}: AccountLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const crumbs = [
    { label: 'User Account', href: '/account' },
    { label: 'Dashboard', href: '/account' },
    ...breadcrumbItems,
  ]

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">

      {/* ── Breadcrumb + mobile menu trigger ── */}
      <div className="flex items-center justify-between gap-3">
        <Breadcrumb items={crumbs} />

        {/* Hamburger — visible only on mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-[#111111] border border-gray-200 rounded px-3 py-1.5 hover:border-[#F97316] hover:text-[#F97316] transition-colors shrink-0"
          aria-label="Open account menu"
        >
          <FiMenu size={16} />
          <span className="text-xs">Menu</span>
        </button>
      </div>

      <div className="flex gap-6 mt-4">

        {/* ── Desktop sidebar — hidden below lg ── */}
        <aside className="hidden lg:block shrink-0">
          <AccountSidebar />
        </aside>

        {/* ── Mobile sidebar drawer ── */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden flex flex-col">
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-[#111111]">My Account</p>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-[#F97316] transition-colors p-1"
                  aria-label="Close menu"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Sidebar content inside drawer */}
              <div className="flex-1 overflow-y-auto p-3">
                <AccountSidebar onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* ── Page content ── */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}