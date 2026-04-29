import { api } from './client'
import type { Product, FlashDeal } from '../types/product'
import type { PaginatedResponse } from '../types/user'

export interface ProductFilters {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  condition?: 'new' | 'refurbished'
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_rated' | 'best_selling'
  page?: number
  limit?: number
  q?: string
}

export const productsApi = {
  /** List products with filters — used on category + search pages */
  list: (filters: ProductFilters = {}) =>
    api.get<PaginatedResponse<Product>>('/products', {
      params: {
        category: filters.category,
        brand: filters.brand,
        price_min: filters.priceMin,
        price_max: filters.priceMax,
        rating: filters.rating,
        in_stock: filters.inStock,
        condition: filters.condition,
        sort: filters.sort,
        page: filters.page ?? 1,
        limit: filters.limit ?? 24,
        q: filters.q,
      },
    }),

  /** Single product by slug — used on PDP */
  getBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`),

  /** Related products — shown below PDP */
  getRelated: (productId: string) =>
    api.get<Product[]>(`/products/${productId}/related`),

  /** New arrivals — homepage section */
  newArrivals: (limit = 10) =>
    api.get<Product[]>('/products/new-arrivals', { params: { limit } }),

  /** Best sellers — homepage + footer section */
  bestSellers: (limit = 10) =>
    api.get<Product[]>('/products/best-sellers', { params: { limit } }),

  /** Active flash deals with endTime for countdown */
  flashDeals: () =>
    api.get<FlashDeal[]>('/products/flash-deals'),

  /** Instant search — dropdown results (top 5 products + 3 categories) */
  instantSearch: (q: string) =>
    api.get<{ products: Product[]; categories: { id: number; name: string; slug: string }[] }>(
      '/products/search/instant',
      { params: { q } }
    ),
}