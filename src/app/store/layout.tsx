import { TopBar } from '@/components/layout/TopBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/features/cart/components/CartDrawer'

// This layout wraps every customer-facing page:
//   / (home), /category/*, /product/*, /search, /cart, /checkout, /auth/*, /account/*
//
// Route group folders (store) don't appear in URLs —
// /app/(store)/page.tsx → shopfresherz.com/
// /app/(store)/category/[slug]/page.tsx → shopfresherz.com/category/phones

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}