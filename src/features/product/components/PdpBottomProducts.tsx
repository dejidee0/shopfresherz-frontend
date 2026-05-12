import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'
import type { Product, FlashDeal } from '@/lib/types/product'

interface MiniProductListProps {
  flashSaleToday: FlashDeal[]
  bestSellers: Product[]
  topRated: Product[]
  newArrivals: Product[]
}

export function PDPBottomProducts({
  flashSaleToday,
  bestSellers,
  topRated,
  newArrivals,
}: MiniProductListProps) {
  const sections = [
    { title: 'Flash Sale Today', products: flashSaleToday, isFlashDeal: true },
    { title: 'Best Sellers', products: bestSellers, isFlashDeal: false },
    { title: 'Top Rated', products: topRated, isFlashDeal: false },
    { title: 'New Arrival', products: newArrivals, isFlashDeal: false },
  ]

  return (
    <div className="mt-12 border-t border-[#E5E7EB] pt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {sections.map(({ title, products, isFlashDeal }) => (
          <div key={title}>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide mb-4 pb-2 border-b border-[#F5F5F5]">
              {title}
            </h3>
            <ul className="space-y-4">
              {products.slice(0, 3).map((product) => {
                const isFlash = isFlashDeal && 'productSlug' in product
                const href = isFlash
                  ? `/store/product/${(product as FlashDeal).productSlug}`
                  : `/store/product/${(product as Product).slug}`
                const name = isFlash ? (product as FlashDeal).productName : (product as Product).name
                const image = isFlash 
                  ? (product as FlashDeal).productImageUrl ?? '/images/Rbag.png' 
                  : (product as Product).images?.[0]?.thumb ?? '/images/Rbag.png'
                const price = isFlash 
                  ? (product as FlashDeal).salePrice 
                  : (product as Product).price
                const compareAtPrice = isFlash 
                  ? (product as FlashDeal).originalPrice 
                  : (product as Product).compareAtPrice

                return (
                  <li key={product.id}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 group"
                    >
                      {/* Thumb */}
                      <div className="w-14 h-14 shrink-0 bg-[#F5F5F5] rounded-card overflow-hidden">
                         <Image
                          src={image}
                          alt={name}
                         width={56}
                         height={56}
                         className="w-full h-full object-contain p-1"
                         />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <p className="text-xs text-[#111111] line-clamp-2 leading-snug group-hover:text-[#F5820A] transition-colors">
                          {name}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-sm font-bold text-[#F5820A]">
                            {formatPrice(price)}
                          </span>
                          {compareAtPrice && (
                            <span className="text-[11px] text-[#6B7280] line-through">
                              {formatPrice(compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
