import { Suspense } from 'react'
import { ShopClient } from '@/features/product/components/ShopClient'
import { productsApi } from '@/lib/api/products'

export const revalidate = 60

export const metadata = {
  title: 'Shop All Products',
  description: "Browse Nigeria's freshest gadgets. Phones, laptops, accessories and more.",
}

export default async function ShopPage() {
  // let products = []
  let totalCount = 0

  try {
    const res = await productsApi.list({ limit: 24, sort: 'best_selling' })
    // products = res.data
    totalCount = res.total
  } catch {
    // Render empty state gracefully if API is down
  }

  return (
    <Suspense>
      {/* <ShopClient
        initialProducts={products}
        totalCount={totalCount}
      /> */}
    </Suspense>
  )
}