"use client"
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname()
    const pageTitle = path.split(/[\\\/]/).at(-1) ?? "";

    return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar title={pageTitle} />
        <main className="flex-1 bg-gray-50">{children}</main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}