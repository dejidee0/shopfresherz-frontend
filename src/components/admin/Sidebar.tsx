"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/admin/SidebarContext";
import { HiXMark } from "react-icons/hi2";
import {
  MdDashboard,
  MdInventory,
  MdSettings,
  MdPeople,
  MdBarChart,
} from "react-icons/md";
import {
  HiShoppingBag,
  HiTag,
  HiClipboard,
  HiBolt,
  HiTicket,
  HiStar,
  HiPhoto,
} from "react-icons/hi2";

const navSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: MdDashboard },
    ],
  },
  {
    title: "CATALOG",
    items: [
      { label: "Products", href: "/admin/dashboard/products", icon: HiShoppingBag },
      { label: "Categories", href: "/admin/dashboard/categories", icon: HiTag },
      { label: "Inventory", href: "/admin/dashboard/inventory", icon: MdInventory },
    ],
  },
  {
    title: "SALES",
    items: [
      { label: "Orders", href: "/admin/dashboard/orders", icon: HiClipboard },
      { label: "Flash Deals", href: "/admin/dashboard/flash-deals", icon: HiBolt },
      { label: "Coupons", href: "/admin/dashboard/coupons", icon: HiTicket },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { label: "Customer", href: "/admin/dashboard/customers", icon: MdPeople },
      { label: "Reviews", href: "/admin/dashboard/reviews", icon: HiStar },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { label: "Analytics", href: "/admin/dashboard/analytics", icon: MdBarChart },
    ],
  },
  {
    title: "MANAGE",
    items: [
      { label: "Content", href: "/admin/dashboard/content", icon: HiPhoto },
      { label: "Settings", href: "/admin/dashboard/settings", icon: MdSettings },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo row */}
      <div className="flex items-center justify-between mb-8 px-1 shrink-0">
        <img
          src="/icons/shopfresherz_logo_black.png"
          alt="shopfresherz logo"
          className="h-8 w-auto"
        />
        {/* Close button — only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <HiXMark size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2.5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest px-2 mb-1">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                        isActive
                          ? "bg-[#F97316] text-white shadow-sm shadow-orange-200"
                          : "text-gray-500 hover:bg-orange-50 hover:text-[#F97316]"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-[#F97316]"
                        }
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* ── Desktop sidebar — always visible, in normal flow ── */}
      <aside className="hidden lg:flex w-52 sticky top-0 h-screen bg-white border-r border-gray-100 flex-col py-6 px-4 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer — slides in over content ── */}
      <>
        {/* Backdrop */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={close}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
          className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col py-6 px-4 z-50 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onClose={close} />
        </aside>
      </>
    </>
  );
}