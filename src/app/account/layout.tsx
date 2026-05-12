"use client"
import { TopBar } from '@/components/layout/TopBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { useRequireAuth } from '@/lib/hooks/useRequireAuth'
import { PageSpinner } from '@/components/ui/Spinner'

export default function AccountOverallLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useRequireAuth({ role: 'Customer', redirectTo: '/' })

  if (!user || !isAuthenticated){
    return <PageSpinner/>
  }

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