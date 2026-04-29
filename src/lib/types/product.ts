export interface ProductImage {
  thumb: string      // 80px WebP
  display: string    // 540px WebP
  zoom: string       // 1600px WebP
  original: string   // Full res
}
 
export interface ProductVariant {
  id: string
  label: string       // e.g. "256GB", "Midnight Black"
  type: 'color' | 'storage' | 'ram' | 'size'
  inStock: boolean
  priceModifier?: number
}
 
export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  brandId: string
  brandName: string
  categoryId: number
  categoryName: string
  description: string
  price: number
  compareAtPrice?: number    // RRP — shows strikethrough + discount badge
  images: ProductImage[]
  variants?: ProductVariant[]
  attributes?: Record<string, string>  // spec key-values
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  averageRating: number
  reviewCount: number
  soldCount: number
  stockQty: number
  reservedQty: number
  metaTitle?: string
  metaDescription?: string
  createdAt: string
}



// ─── Category ───────────────────────────────────────────────────────────────
 
export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  imageUrl?: string
  parentId?: number
  children?: Category[]
}



// ─── Flash Deal ─────────────────────────────────────────────────────────────
 
export interface FlashDeal {
  id: string
  product: Product
  salePrice: number
  startTime: string
  endTime: string
  maxQuantity: number
  soldCount: number
  isActive: boolean
}