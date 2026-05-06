"use client";

import { HiMagnifyingGlass, HiBell, HiBars3 } from "react-icons/hi2";
import { useSidebar } from "@/components/admin/SidebarContext";

interface NavbarProps {
  title: string;
}

export default function AdminNavbar({ title }: NavbarProps) {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={toggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <HiBars3 size={20} className="text-gray-600" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search — hidden on small screens, visible from md up */}
        <div className="relative hidden md:block">
          <HiMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search data, users, or reports"
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-48 lg:w-64 transition-all"
          />
        </div>

        {/* Search icon button — only on small screens */}
        <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <HiMagnifyingGlass size={18} className="text-gray-500" />
        </button>

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <HiBell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            M
          </div>
          {/* Name — hidden on small screens */} 
          <div className="leading-none hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Mfoniso..</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}