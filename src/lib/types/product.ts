export interface ProductImage {
  id: string;
  thumb: string;
  display: string;
  zoom: string;
  original: string;
  sortOrder?: number;
  isVideo?: boolean;
}

export interface ProductVariantAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  label?: string;
  type?: "color" | "storage" | "ram" | "size";
  attributes?: ProductVariantAttribute[];
  price?: number;
  stockQty?: number;
  availableQty?: number;
  inStock?: boolean;
  priceModifier?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
}

export interface CategoryWithImage extends CategoryItem {
  imageUrl: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  // icon?: string;
  imageUrl?: string;
  parentId?: number;
  // children?: CategoryItem[];
  // hasChildren?: boolean;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  slug: string;
  brandId?: string;
  brandName?: string;
  brand?: Brand;
  categoryId?: number;
  categoryName?: string;
  category?: CategoryWithImage;
  description: string;
  price: number;
  compareAtPrice?: number;
  primaryImageUrl?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: Record<string, string>;
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  soldCount?: number;
  stockQty?: number;
  reservedQty?: number;
  availableQty?: number;
  metaTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
  weightKg?: number;
  attributesJson?: string;
  tagsJson?: string;
  createdAt?: string;
}

// ─── Flash Deal ─────────────────────────────────────────────────────────────

export interface FlashDeal {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImageUrl: string | null;
  salePrice: number;
  originalPrice: number;
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  maxQuantity: number;
  soldQuantity: number;
  remainingQuantity: number;
  isLive: boolean;
  timeRemaining?: string;
}

// ─── Brands ─────────────────────────────────────────────────────────────
export interface Brands {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
}

// export interface Brands {
//   id: string;
//   title: string;
//   imageUrl: string;
//   linkUrl: string;
//   subTitle: string;
//   ctaText: string;
//   sortOrder: number;
// }

// ─── Search ─────────────────────────────────────────────────────────────

export interface SearchResult {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface InstantSearchResult {
  products: Product[];
  categories: CategoryItem[];
}
