import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/BreadCrumbs'
import { ProductImageZoom } from '@/features/product/components/ProductImageZoom'
import { PDPActions } from '@/features/product/components/PdpActions'
import { ProductTabs } from '@/features/product/components/ProductTabs'
import { PDPBottomProducts } from '@/features/product/components/PdpBottomProducts'
import { productsApi } from '@/lib/api/products'
import type { Metadata } from 'next'

export const revalidate = 120

interface PDPProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  try {
    const product = await productsApi.getBySlug(params.slug)
    return {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.description.slice(0, 155),
      openGraph: {
        title: product.name,
        images: [{ url: product.images[0]?.display ?? '' }],
      },
    }
  } catch {
    return { title: 'Product not found' }
  }
}

export default async function ProductDetailPage({ params }: PDPProps) {
  let product
  try {
    product = await productsApi.getBySlug(params.slug)
  } catch {
    notFound()
  }

  // Fetch supporting lists — failures don't break the page
  const [flashDeals, bestSellers, topRated, newArrivals] = await Promise.allSettled([
    productsApi.flashDeals().then((deals) => deals.map((d) => d.product)),
    productsApi.bestSellers(3),
    productsApi.list({ sort: 'best_rated', limit: 3 }).then((r) => r.data),
    productsApi.newArrivals(3),
  ])

  const breadcrumbs = [
    { label: 'Shop', href: '/shop' },
    { label: 'Shop Grid', href: '/shop' },
    { label: product.categoryName, href: `/category/${product.categoryId}` },
    { label: product.name },
  ]

  return (
    <div className="max-w-content mx-auto px-10 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* ── Main PDP layout ── */}
      <div className="flex flex-col lg:flex-row gap-10 mt-4">

        {/* Left: Image zoom */}
        <div className="w-full lg:w-120 shrink-0">
          <ProductImageZoom
            images={product.images}
            productName={product.name}
            isOutOfStock={(product.stockQty - product.reservedQty) <= 0}
          />
        </div>

        {/* Right: Product info + actions */}
        <div className="flex-1 min-w-0">
          <PDPActions product={product} />
        </div>
      </div>

      {/* ── Tabs: Description / Additional Info / Specification / Review ── */}
      <ProductTabs product={product} />

      {/* ── Bottom product rows ── */}
      <PDPBottomProducts
        flashSaleToday={flashDeals.status === 'fulfilled' ? flashDeals.value : []}
        bestSellers={bestSellers.status === 'fulfilled' ? bestSellers.value : []}
        topRated={topRated.status === 'fulfilled' ? topRated.value : []}
        newArrivals={newArrivals.status === 'fulfilled' ? newArrivals.value : []}
      />
    </div>
  )
}