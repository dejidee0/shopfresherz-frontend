import { api } from "./client";
import type {
  Product,
  FlashDeal,
  CreateFlashDealRequest,
  CategoryItem,
  SearchResult,
  InstantSearchResult,
  Brands,
  Banner,
} from "../types/product";

// Raw API pagination shape (backend uses `items` instead of `data`)
interface ApiPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// type ProductApiResponse = Product & {
//   stockQty?: number;
//   reservedQty?: number;
// };

type ProductApiResponse = Product

// Transform API product to UI-compatible format
// function transformProduct(apiProduct: ProductApiResponse): Product {
//   return {
//     ...apiProduct,
//     // Ensure image format compatibility
//     imageUrls: (
//       (apiProduct.imageUrls ?? []) as Array<{
//         thumbUrl?: string;
//         displayUrl?: string;
//         zoomUrl?: string;
//         originalUrl?: string;
//         sortOrder?: number;
//         isVideo?: boolean;
//       }>
//     ).map((img) => ({
//       id: "",
//       thumb: img.thumbUrl ?? img.displayUrl ?? img.originalUrl ?? "",
//       display: img.displayUrl ?? img.originalUrl ?? "",
//       zoom: img.zoomUrl ?? img.originalUrl ?? "",
//       original: img.originalUrl ?? "",
//       sortOrder: img.sortOrder,
//       isVideo: img.isVideo,
//     })),
//     // Flatten brand
//     brandId: apiProduct.brand?.id ?? "",
//     brandName: apiProduct.brand?.name ?? "",
//     // Flatten category
//     categoryId: apiProduct.category?.id ?? 0,
//     categoryName: apiProduct.category?.name ?? "",
//     // Map availableQty to stockQty for backwards compatibility
//     stockQty: apiProduct.availableQty ?? apiProduct.stockQty ?? 0,
//     reservedQty: 0,
//   };
// }

function transformProduct(apiProduct: ProductApiResponse): Product {
  return {
    ...apiProduct,
    // imageUrls is already string[] — no transformation needed
    imageUrls: apiProduct.imageUrls ?? [],
    // Flatten brand
    brandId: apiProduct.brand?.id ?? '',
    brandName: apiProduct.brand?.name ?? '',
    // Flatten category
    categoryId: apiProduct.category?.id ?? 0,
    categoryName: apiProduct.category?.name ?? '',
    // Map availableQty to stockQty for backwards compatibility
    stockQty: apiProduct.availableQty ?? apiProduct.stockQty ?? 0,
    reservedQty: 0,
  }
}

export interface ProductFilters {
  categoryId?: number;
  brandId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  condition?: "new" | "refurbished";
  sortBy?:
    | "relevance"
    | "price_asc"
    | "price_desc"
    | "newest"
    | "best_rated"
    | "best_selling";
  page?: number;
  pageSize?: number;
  q?: string;
}

export const productsApi = {
  /** List products with filters — used on category + search pages */
  list: (filters: ProductFilters = {}) =>
    api
      .get<ApiPaginatedResponse<Product>>("/products", {
        params: {
          categoryId: filters.categoryId,
          brand: filters.brandId,
          price_min: filters.priceMin,
          price_max: filters.priceMax,
          rating: filters.rating,
          in_stock: filters.inStock,
          condition: filters.condition,
          sort: filters.sortBy,
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 24,
          q: filters.q,
        },
      })
      .then((res) => ({
        ...res,
        data: res.items, // map `items` → `data` to satisfy PaginatedResponse
      })),

  /** Search products with advanced filters — used on search pages */
  search: (filters: ProductFilters = {}) =>
    api
      .get<SearchResult>("/search", {
        params: {
          q: filters.q,
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 20,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          ratingMin: filters.rating,
          inStockOnly: filters.inStock,
          sortBy: filters.sortBy,
        },
      })
      .then((res) => ({
        ...res,
        data: res.items, // map `items` → `data` to satisfy PaginatedResponse
      })),

  /** Single product by slug — used on PDP */
  getBySlug: async (slug: string) => {
    const product = await api.get<Product>(`/products/${slug}`);
    return transformProduct(product);
  },

  /** Related products — shown below PDP */
  getRelated: (productId: string) =>
    api.get<Product[]>(`/products/${productId}/related`),

  /** New arrivals — homepage section */
  newArrivals: (limit = 10) =>
    api.get<Product[]>("/new-arrivals", { params: { limit } }),

  /** Best sellers — homepage + footer section */
  bestSellers: (limit = 10) =>
    api.get<Product[]>("/best-deals", { params: { limit } }),

  /** Active flash deals with endTime for countdown */
  flashDeals: () => api.get<FlashDeal[]>("/flash-deals"),

  createFlashDeal: (token: string, payload: CreateFlashDealRequest) =>
    api.post<FlashDeal>("/flash-deals", payload, { token }),

  /** Instant search — dropdown results (top 5 products + 3 categories) */
  instantSearch: (q: string) =>
    api.get<InstantSearchResult>("/search/instant", { params: { q } }),

  /** Get all categories */
  getCategories: () => api.get<[CategoryItem]>("/categories"),

  getBrands: () => api.get<Brands[]>("/brands"),

  getBanners: () => api.get<Banner[]>("/banners"),

  /** Best Deal promo card — single featured product for the homepage */
  getBestDealPromo: () =>
    api.get<{
      id: string
      imageUrl: string
      name: string
      slug?: string
      rating: number
      originalPrice: string
      salePrice: string
      description: string
      badge: string
    }>("/promotions/best-deal"),

  /** Laptop promo section — bottom featured product banner */
  getLaptopPromo: () =>
    api.get<{
      id: string
      slug?: string
      title: string
      imageUrl: string
      price?: string
      salePrice?: string
      badge?: string
      ctaText: string
    }>("/promotions/laptop-promo"),

  /** Computer Accessories sidebar promo card */
  getAccessoriesPromo: () =>
    api.get<{
      id: string
      slug?: string
      title: string
      imageUrl: string
      price?: string
      ctaText: string
    }>("/promotions/accessories-promo"),

  /** Promotion section banner — two-card promo strip */
  getPromoBanner: () =>
    api.get<{
      id: string
      title: string
      subtitle: string
      ctaText: string
      imageUrl: string
      imageAlt: string
      badge: string
    }>("/promotions/promo-banner"),

  /** Hero promo cards — list used for the two side cards in HeroBanner */
  getHeroPromos: () =>
    api.get<Array<{
      id: string
      title: string
      tag?: string
      badge?: string
      ctaText: string
      linkUrl: string
      imageUrl: string
      subTitle?: string
      price?: string
      sortOrder: number
      slug?: string
    }>>("/promotions/hero"),

  /** Flash Sale promo cards — list, sorted by sortOrder like hero promos */
  getFlashSalePromos: () =>
    api.get<Array<{
      id: string
      title: string
      tag?: string
      badge?: string
      ctaText: string
      imageUrl: string
      price?: string
      sortOrder: number
      slug?: string
    }>>("/promotions/flash-sale"),

  /** Store Promo Banner — single featured card */
  getStorePromoBanner: () =>
    api.get<{
      id: string
      title: string
      subtitle: string
      ctaText: string
      imageUrl: string
      imageAlt?: string
      badge?: string
      tag?: string
      slug?: string
    }>("/promotions/store-promo-banner"),
};