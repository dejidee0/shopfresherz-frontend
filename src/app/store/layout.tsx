// import { TopBar } from '@/components/layout/TopBar'
// import { Navbar } from '@/components/layout/Navbar'
// import { Footer } from '@/components/layout/Footer'
// import { CartDrawer } from '@/features/cart/components/CartDrawer'

// // This layout wraps every customer-facing page:
// //   / (home), /category/*, /product/*, /search, /cart, /checkout, /auth/*, /account/*
// //
// // Route group folders (store) don't appear in URLs —
// // /app/(store)/page.tsx → shopfresherz.com/
// // /app/(store)/category/[slug]/page.tsx → shopfresherz.com/category/phones

// export default function StoreLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <TopBar />
//       <Navbar />
//       <main className="flex-1">{children}</main>
//       <Footer />
//       <CartDrawer />
//     </>
//   )
// }


import Script from 'next/script'
import { TopBar } from '@/components/layout/TopBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { ChatWidget } from '@/features/chat/components/ChatWidget'

// Wraps every customer-facing page:
// / · /category/* · /product/* · /search · /cart · /checkout · /auth/* · /account/*
// Route group (store) is invisible in URLs.

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="flutterwave-v4"
        src="https://checkout.flutterwave.com/v3.js"
        strategy="beforeInteractive"
      />
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Overlays — rendered at root so they sit above all page content */}
      <CartDrawer />
      <ChatWidget />
    </>
  )
}