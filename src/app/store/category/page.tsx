import { Suspense } from 'react'
import { ShopClient } from '@/features/product/components/ShopClient'
import { productsApi } from '@/lib/api/products'
import type { Product } from '@/lib/types/product'

export const revalidate = 60

interface CategoryPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const name = params?.slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${name} — ShopFresherz`,
    description: `Browse ${name} at the best prices in Nigeria.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params?.slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

   let products: Product[] = []

   try {
     const res = await productsApi.list({
       category: params?.slug,
       limit: 24,
       sort: 'best_selling',
     })
     products = res.data ?? []
   } catch {
     // Graceful empty state
   }

   return (
     <Suspense>
       <ShopClient
         initialProducts={products}
         categoryName={categoryName}
         categorySlug={params.slug}
       />
     </Suspense>
   )
}