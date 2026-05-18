import { Suspense } from "react";
import { ShopClient } from "@/features/product/components/ShopClient";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/lib/types/product";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const categoryName =
    slug === 'all'
      ? 'All Products'
      : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  let products: Product[] = []
  let categoryId: number | undefined

  try {
    if (slug !== 'all') {
      const categories = await productsApi.getCategories()
      const category = categories.find(c => c.slug === slug)
      
      // Log every key/value pair to catch the real field name
      console.log('category raw entries:', category ? Object.entries(category) : null)
      
      categoryId = category?.id
    }

    if (slug !== 'all' && categoryId) {
      const res = await productsApi.list({ categoryId, pageSize: 1000 })
      products = res.data ?? []
      console.log('category id::', categoryId)
      console.log('products:', products)
    } else {
      const res = await productsApi.list({ pageSize: 1000 })
      products = res.data ?? []
    }
  } catch (error) {
    console.error('Failed to fetch products or categories:', error)
  }

  return (
    <Suspense>
      <ShopClient
        key={slug}
        initialProducts={products}
        categoryName={categoryName}
        categorySlug={slug}
        categoryId={slug === 'all' ? undefined : categoryId}
      />
    </Suspense>
  )
}