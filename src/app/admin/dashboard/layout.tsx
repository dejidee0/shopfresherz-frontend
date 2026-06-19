"use client";

import AdminNavbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/components/admin/SidebarContext";
import { PageSpinner } from "@/components/ui/Spinner";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const pageTitle = path.split(/[\\\/]/).at(-1) ?? "";
  const { user, isAuthenticated, isLoading } = useRequireAuth({
      role: "SuperAdmin",
      redirectTo: "/",
    });

  if (isLoading || !user || !isAuthenticated) {
    return <PageSpinner />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AdminNavbar title={pageTitle} />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
