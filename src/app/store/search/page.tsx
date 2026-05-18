import { Suspense } from 'react'
import { ShopClient } from '@/features/product/components/ShopClient'
import { productsApi } from '@/lib/api/products'
import type { Product } from '@/lib/types/product'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>  // ✅ Promise in Next.js 15
}

export const revalidate = 60

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ''
  return {
    title: `Search results for "${query}" — ShopFresherz`,
    description: `Find products matching "${query}" at the best prices in Nigeria.`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams  // ✅ await it
  const query = q || ''

  let products: Product[] = []

  try {
    const res = await productsApi.search({
      q: query,
      page: 1,
      pageSize: 24,
    })
    products = res.data ?? []
  } catch {
    // Graceful empty state
  }

  return (
    <Suspense>
      <ShopClient
        initialProducts={products}
        categoryName={`Search results for "${query}"`}
        isSearchPage={true}
        initialQuery={query}  // ✅ pass query down so ShopClient knows what was searched
      />
    </Suspense>
  )
}