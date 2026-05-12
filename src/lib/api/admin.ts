import { api } from './client'
import type { Order, OrderStatus, User } from '../types/user'
import type { Product } from '../types/product'

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface DashboardStatsDto extends Record<string, unknown> {
  totalOrders?: number
  totalRevenue?: number
  totalCustomers?: number
  totalProducts?: number
  pendingOrders?: number
  lowStockCount?: number
  completedOrders?: number
  cancelledOrders?: number
}

export interface AdminOrdersFilters {
  page?: number
  pageSize?: number
  status?: string
  paymentStatus?: string
  from?: string | Date
  to?: string | Date
}

export type OrderDto = Order & Record<string, unknown>

export interface AdminUsersFilters {
  page?: number
  pageSize?: number
  search?: string
}

export type AdminUserDto = Partial<User> & Record<string, unknown> & {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  isActive?: boolean
  createdAt?: string
  loyaltyPoints?: number
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus | string
  note?: string
  trackingNumber?: string
}

export interface AdjustLoyaltyRequest {
  points: number
  reason?: string
}

export interface LowStockDto extends Record<string, unknown> {
  productId: string
  productName: string
  sku?: string
  slug?: string
  availableQty: number
  stockQty?: number
  reservedQty?: number
  threshold?: number
}

export interface BannerDto extends Record<string, unknown> {
  id: string
  title?: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  ctaText?: string
  position?: string
  sortOrder?: number
  isActive?: boolean
  startsAt?: string
  endsAt?: string
  createdAt?: string
}

export interface CreateBannerRequest {
  title?: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  ctaText?: string
  position?: string
  sortOrder?: number
  isActive?: boolean
  startsAt?: string
  endsAt?: string
}

export type UpdateBannerRequest = Partial<CreateBannerRequest>

export interface AdminProductsFilters {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateProductRequest {
  sku: string
  name: string
  slug: string
  brandId?: string
  categoryId?: number
  description?: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  stockQty: number
  weightKg?: number
  attributesJson?: string
  tagsJson?: string
  isActive?: boolean
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export type ProductDto = Product & Record<string, unknown>

function toDateParam(value?: string | Date) {
  if (!value) return undefined
  return value instanceof Date ? value.toISOString() : value
}

export const adminApi = {
  getDashboard: (token: string) =>
    api.get<DashboardStatsDto>('/admin/dashboard', { token }),

  getOrders: (token: string, filters: AdminOrdersFilters = {}) =>
    api.get<PagedResult<OrderDto>>('/admin/orders', {
      token,
      params: {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        status: filters.status,
        paymentStatus: filters.paymentStatus,
        from: toDateParam(filters.from),
        to: toDateParam(filters.to),
      },
    }),

  getUsers: (token: string, filters: AdminUsersFilters = {}) =>
    api.get<PagedResult<AdminUserDto>>('/admin/users', {
      token,
      params: {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        search: filters.search,
      },
    }),

  updateOrderStatus: (
    token: string,
    orderNumber: string,
    payload: UpdateOrderStatusRequest
  ) =>
    api.put<void>(
      `/admin/orders/${encodeURIComponent(orderNumber)}/status`,
      payload,
      { token }
    ),

  adjustUserLoyalty: (
    token: string,
    userId: string,
    payload: AdjustLoyaltyRequest
  ) =>
    api.post<void>(
      `/admin/users/${encodeURIComponent(userId)}/loyalty`,
      payload,
      { token }
    ),

  getLowStock: (token: string, threshold = 5) =>
    api.get<LowStockDto[]>('/admin/inventory/low-stock', {
      token,
      params: { threshold },
    }),

  getBanners: (token: string) =>
    api.get<BannerDto[]>('/admin/banners', { token }),

  createBanner: (token: string, payload: CreateBannerRequest) =>
    api.post<unknown>('/admin/banners', payload, { token }),

  updateBanner: (token: string, id: string, payload: UpdateBannerRequest) =>
    api.put<void>(`/admin/banners/${encodeURIComponent(id)}`, payload, { token }),

  deleteBanner: (token: string, id: string) =>
    api.delete<void>(`/admin/banners/${encodeURIComponent(id)}`, { token }),

  getProducts: (token: string, filters: AdminProductsFilters = {}) =>
    api.get<PagedResult<ProductDto>>('/products', {
      token,
      params: {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        search: filters.search,
        category: filters.category,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      },
    }),

  createProduct: (token: string, payload: CreateProductRequest) =>
    api.post<ProductDto>('/products', payload, { token }),

  updateProduct: (token: string, id: string, payload: UpdateProductRequest) =>
    api.put<ProductDto>(`/products/${encodeURIComponent(id)}`, payload, { token }),

  deleteProduct: (token: string, id: string) =>
    api.delete<void>(`/products/${encodeURIComponent(id)}`, { token }),
}
