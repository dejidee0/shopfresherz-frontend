"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      {
        label: "Products",
        href: "/admin/dashboard/products",
        icon: HiShoppingBag,
      },
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
    items: [{ label: "Analytics", href: "/admin/dashboard/analytics", icon: MdBarChart }],
  },
  {
    title: "MANAGE",
    items: [
      { label: "Content", href: "/admin/dashboard/content", icon: HiPhoto },
      { label: "Settings", href: "/admin/dashboard/settings", icon: MdSettings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-50 sticky top-0 h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4 shrink-0">
      {/* Logo — stays fixed at top, never scrolls */}
      <div className="flex items-center gap-2 mb-8 px-1 shrink-0">
        <img src="/icons/shopfresherz_logo_black.png" alt="shopfresherz logo" />
      </div>

      {/* Nav — scrolls independently when content overflows */}
      <nav className="flex-1 space-y-2.5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest px-2 mb-1">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                // || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
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
    </aside>
  );
}
