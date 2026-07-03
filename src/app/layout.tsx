// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import { Navbar } from '@/components/layout/Navbar'
// import { TopBar } from '@/components/layout/TopBar'
// import { Footer } from '@/components/layout/Footer'
// import { CartDrawer } from '@/features/cart/components/CartDrawer'
// import { Providers } from './providers'

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })

// export const metadata: Metadata = {
//   title: {
//     default: 'ShopFresherz — Fresh Tech, Every Time',
//     template: '%s | ShopFresherz',
//   },
//   description:
//     "Nigeria's most trusted destination for tech enthusiasts — delivering the freshest gadgets at competitive prices.",
//   metadataBase: new URL('https://www.shopfresherz.com'),
//   openGraph: {
//     siteName: 'ShopFresherz',
//     type: 'website',
//   },
//   icons: {
//     icon: '/favicon.ico',
//   },
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {

//   return (
//     <html lang="en" className={inter.variable}>
//       <body className="min-h-screen flex flex-col antialiased">
//         <Providers>
//           <TopBar />
//           <Navbar />
//           <main className="flex-1">{children}</main>
//           <Footer />
//           {/* Cart drawer lives at root so it overlays any page */}
//           <CartDrawer />
//         </Providers>
//       </body>
//     </html>
//   )
// }

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'ShopFresherz — Fresh Tech, Every Time',
    template: '%s | ShopFresherz',
  },
  description:
    "Nigeria's most trusted destination for tech enthusiasts — delivering the freshest gadgets at competitive prices.",
  metadataBase: new URL('https://www.shopfresherz.com'),
  openGraph: { siteName: 'ShopFresherz', type: 'website' },
  icons: { icon: '/favicon.ico' },
}

// Root layout: minimal shell only.
// All chrome (Navbar, Footer, AdminSidebar) lives in route-group layouts below.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
