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


import { TopBar } from '@/components/layout/TopBar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { ChatWidget } from '@/features/chat/components/ChatWidget'

// Wraps every customer-facing page:
// / · /category/* · /product/* · /search · /cart · /checkout · /auth/* · /account/*
// Route group (store) is invisible in URLs.
//
// Card payments redirect to Flutterwave's hosted checkout page (see
// checkout/verify), so the inline Flutterwave v3 SDK script is not loaded here.

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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