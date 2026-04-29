"use client";

import { HiMagnifyingGlass, HiBell } from "react-icons/hi2";
// import Image from "next/image";

interface NavbarProps {
  title: string;
}

export default function AdminNavbar({ title }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <HiMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search data, users, or reports"
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-64 transition-all"
          />
        </div>

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <HiBell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold text-gray-800">Mfoniso..</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}