import { Suspense } from 'react'
import { ShopClient } from '@/features/product/components/ShopClient'
import { productsApi } from '@/lib/api/products'

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
  const categoryName = params.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  // let products = []
  let totalCount = 0

  try {
    const res = await productsApi.list({
      category: params.slug,
      limit: 24,
      sort: 'best_selling',
    })
    // products = res.data
    totalCount = res.total
  } catch {
    // Graceful empty state
  }

  return (
    <Suspense>
      {/* <ShopClient
        // initialProducts={products}
        totalCount={totalCount}
        categoryName={categoryName}
        categorySlug={params.slug}
      /> */}
    </Suspense>
  )
}