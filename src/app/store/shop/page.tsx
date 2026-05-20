import { Suspense } from 'react'
import { ShopClient } from '@/features/product/components/ShopClient'
import { productsApi } from '@/lib/api/products'
import type { Product } from '@/lib/types/product'

export const revalidate = 60

export const metadata = {
  title: 'Shop All Products',
  description: "Browse Nigeria's freshest gadgets. Phones, laptops, accessories and more.",
}

export default async function ShopPage() {
  let products: Product[] = []

  try {
    const res = await productsApi.list({ pageSize: 24, sortBy: 'best_selling' })
    products = res.data ?? []
  } catch {
    // Render empty state gracefully if API is down
  }

   return (
     <Suspense>
       <ShopClient initialProducts={products} />
     </Suspense>
   )
}