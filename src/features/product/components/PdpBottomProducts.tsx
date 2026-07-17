import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'
import { Reveal } from '@/components/motion/Reveal'
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
    <Reveal className="mt-12 border-t border-black/[0.08] pt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map(({ title, products, isFlashDeal }, i) => (
          <Reveal key={title} delay={i * 0.08} duration={0.3}>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide mb-4 pb-2 border-b border-black/[0.08]">
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
                  ? (product as FlashDeal).productImageUrl ?? '/images/device-placeholder.jpg' 
                  : (product as Product).imageUrls?.[0] ?? '/images/device-placeholder.jpg'
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
                       className="flex items-center gap-3 group rounded-[10px] p-2 hover:bg-black/[0.03] transition-colors"
                    >
                      {/* Thumb */}
                      <div className="w-14 h-14 shrink-0 bg-[#F5F5F5] rounded-card overflow-hidden">
                         <Image
                          src={image}
                          alt={name}
                         width={56}
                         height={56}
                         className="w-full h-full object-cover"
                         />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <p className="text-xs text-[#666666] line-clamp-2 leading-snug group-hover:text-[#F97316] transition-colors">
                          {name}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-sm font-bold text-[#F97316]">
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
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}
