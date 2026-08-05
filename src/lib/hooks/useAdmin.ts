'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type DashboardStatsDto, type PagedResult, type OrderDto, type AdminUserDto, type LowStockDto, type BannerDto, type AdminOrdersFilters, type AdminUsersFilters, type UpdateOrderStatusRequest, type AdjustLoyaltyRequest, type CreateBannerRequest, type UpdateBannerRequest, type AdminProductsFilters, type CreateProductRequest, type UpdateProductRequest, type ProductDto, type FlashDealDto, type CreateFlashDealRequest, type UpdateFlashDealRequest, type CouponDto, type CreateCouponRequest, type UpdateCouponRequest, CategoryDto, CreatePromoRequest, type PromoPlacement, PROMO_MULTI_ITEM_PLACEMENTS } from '@/lib/api/admin'
import { productsApi } from '@/lib/api/products'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

// ─── useDashboard ──────────────────────────────────────────────────────────────

export function useDashboard() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(accessToken!),
    enabled: !!accessToken,
  })
}

// ─── useOrders ─────────────────────────────────────────────────────────────────

export function useOrders(filters: AdminOrdersFilters = {}) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => adminApi.getOrders(accessToken!, filters),
    enabled: !!accessToken,
  })
}

// ─── useUsers ──────────────────────────────────────────────────────────────────

export function useUsers(filters: AdminUsersFilters = {}) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(accessToken!, filters),
    enabled: !!accessToken,
  })
}

// ─── useLowStock ───────────────────────────────────────────────────────────────

export function useLowStock(threshold = 5) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'low-stock', threshold],
    queryFn: () => adminApi.getLowStock(accessToken!, threshold),
    enabled: !!accessToken,
  })
}

// ─── useBanners ────────────────────────────────────────────────────────────────

export function useBanners() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: () => adminApi.getBanners(accessToken!),
    enabled: !!accessToken,
  })
}

// ─── Promo Cards (unified across all 6 placements) ────────────────────────────

/** Admin list with real ids — only meaningful for PROMO_MULTI_ITEM_PLACEMENTS. */
export function usePromoAdminList(placement: PromoPlacement) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'promotions', placement, 'admin-list'],
    queryFn: () => adminApi.getPromoAdminList(accessToken!, placement),
    enabled: !!accessToken && PROMO_MULTI_ITEM_PLACEMENTS.includes(placement),
  })
}

/** Public read — the display source for singleton placements (no admin list exists). */
export function usePromoPublic(placement: PromoPlacement) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'promotions', placement, 'public'],
    queryFn: () => adminApi.getPromoPublic(accessToken!, placement),
    enabled: !!accessToken,
  })
}

export function useAllPromoSections() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'promotions', 'all'],
    queryFn: () => adminApi.getAllPromoSections(accessToken!),
    enabled: !!accessToken,
  })
}

export function useCreatePromo() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ placement, payload }: { placement: PromoPlacement; payload: CreatePromoRequest }) =>
      adminApi.createPromo(accessToken!, placement, payload),
    onSuccess: (_data, { placement }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions', placement] })
      toast.success('Promo saved successfully')
    },
    onError: (error: { message?: string }) => {
      toast.error('Failed to save promo', error.message ?? 'Please try again')
    },
  })
}

export function useUpdatePromo() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      placement,
      id,
      payload,
    }: {
      placement: PromoPlacement
      id: string
      payload: CreatePromoRequest
    }) => adminApi.updatePromo(accessToken!, placement, id, payload),
    onSuccess: (_data, { placement }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions', placement] })
      toast.success('Promo updated successfully')
    },
    onError: (error: { message?: string }) => {
      toast.error('Failed to update promo', error.message ?? 'Please try again')
    },
  })
}

/** Works for hero/flash-sale rows, which already carry a real id. */
export function useDeletePromo() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminApi.deletePromo(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] })
      toast.success('Promo deleted successfully')
    },
    onError: (error: { message?: string }) => {
      toast.error('Failed to delete promo', error.message ?? 'Please try again')
    },
  })
}

/**
 * Singleton placements never expose a real database id via the public read
 * endpoint (only a display slug). To delete one, first resolve its real id
 * by re-submitting the same productId (a safe no-op upsert onto the same
 * row), then delete using the id that comes back.
 */
export function useDeleteSingletonPromo() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      placement,
      productId,
    }: {
      placement: PromoPlacement
      productId: string
    }) => {
      const resolved = await adminApi.createPromo(accessToken!, placement, { productId })
      await adminApi.deletePromo(accessToken!, resolved.id)
    },
    onSuccess: (_data, { placement }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions', placement] })
      toast.success('Promo deleted successfully')
    },
    onError: (error: { message?: string }) => {
      toast.error('Failed to delete promo', error.message ?? 'Please try again')
    },
  })
}

// ─── useUpdateOrderStatus ──────────────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderNumber, payload }: { orderNumber: string; payload: UpdateOrderStatusRequest }) =>
      adminApi.updateOrderStatus(accessToken!, orderNumber, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Order status updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update order status', error.message ?? 'Please try again')
    },
  })
}

// ─── useCancelOrder ────────────────────────────────────────────────────────────

export function useCancelOrder() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderNumber: string) =>
      adminApi.cancelOrder(accessToken!, orderNumber),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Order cancelled successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to cancel order', error.message ?? 'Please try again')
    },
  })
}

// ─── useAdjustUserLoyalty ──────────────────────────────────────────────────────

export function useAdjustUserLoyalty() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: AdjustLoyaltyRequest }) =>
      adminApi.adjustUserLoyalty(accessToken!, userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User loyalty adjusted successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to adjust user loyalty', error.message ?? 'Please try again')
    },
  })
}

// ─── useCreateBanner ───────────────────────────────────────────────────────────

export function useCreateBanner() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBannerRequest) =>
      adminApi.createBanner(accessToken!, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success('Banner created successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to create banner', error.message ?? 'Please try again')
    },
  })
}

// ─── useUpdateBanner ───────────────────────────────────────────────────────────

export function useUpdateBanner() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBannerRequest }) =>
      adminApi.updateBanner(accessToken!, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success('Banner updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update banner', error.message ?? 'Please try again')
    },
  })
}

// ─── useDeleteBanner ───────────────────────────────────────────────────────────

export function useDeleteBanner() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      adminApi.deleteBanner(accessToken!, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] })
      toast.success('Banner deleted successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to delete banner', error.message ?? 'Please try again')
    },
  })
}

// ─── Product Management ──────────────────────────────────────────────────────

export function useProducts(filters: AdminProductsFilters = {}) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: () => adminApi.getProducts(accessToken!, filters),
    enabled: !!accessToken,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  })
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => productsApi.getBrands(),
  })
}

export function useCreateProduct() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: any) => {
      // Transform the payload to match the API specification
      const apiPayload = {
        sku: payload.sku,
        name: payload.name,
        slug: payload.slug,
        brandId: payload.brandId,
        categoryId: payload.categoryId,
        description: payload.description,
        shortDescription: payload.shortDescription,
        price: payload.price,
        compareAtPrice: payload.compareAtPrice,
        costPrice: payload.costPrice,
        stockQty: payload.stockQty,
        weightKg: payload.weightKg,
        attributesJson: payload.attributesJson,
        tagsJson: payload.tagsJson,
        isActive: payload.isActive,
        isFeatured: payload.isFeatured,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        imageUrls: payload.imageUrls,
        initialRating: payload.initialRating,
        initialReviewCount: payload.initialReviewCount,
      }
      return adminApi.createProduct(accessToken!, apiPayload)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Product created successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to create product', error.message ?? 'Please try again')
    },
  })
}

export function useUpdateProduct() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductRequest }) =>
      adminApi.updateProduct(accessToken!, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Product updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update product', error.message ?? 'Please try again')
    },
  })
}

export function useDeleteProduct() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      adminApi.deleteProduct(accessToken!, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Product deleted successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to delete product', error.message ?? 'Please try again')
    },
  })
}

// ─── Flash Deal Management ─────────────────────────────────────────────────────

export function useFlashDeals() {
  return useQuery({
    queryKey: ['flash-deals'],
    queryFn: () => adminApi.getFlashDeals(),
  })
}

export function useCreateFlashDeal() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFlashDealRequest) =>
      adminApi.createFlashDeal(accessToken!, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-deals'] })
      toast.success('Flash deal created successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to create flash deal', error.message ?? 'Please try again')
    },
  })
}

export function useUpdateFlashDeal() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFlashDealRequest }) =>
      adminApi.updateFlashDeal(accessToken!, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-deals'] })
      toast.success('Flash deal updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update flash deal', error.message ?? 'Please try again')
    },
  })
}

export function useToggleFlashDeal() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.toggleFlashDeal(accessToken!, id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-deals'] })
      toast.success('Flash deal status updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update flash deal status', error.message ?? 'Please try again')
    },
  })
}

export function useDeleteFlashDeal() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      adminApi.deleteFlashDeal(accessToken!, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-deals'] })
      toast.success('Flash deal deleted successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to delete flash deal', error.message ?? 'Please try again')
    },
  })
}

// ─── Coupon Management ────────────────────────────────────────────────────────

export function useCoupons() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => adminApi.getCoupons(accessToken!),
  })
}

export function useCreateCoupon() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCouponRequest) =>
      adminApi.createCoupon(accessToken!, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon created successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to create coupon', error.message ?? 'Please try again')
    },
  })
}

export function useUpdateCoupon() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCouponRequest }) =>
      adminApi.updateCoupon(accessToken!, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update coupon', error.message ?? 'Please try again')
    },
  })
}

export function useDeleteCoupon() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      adminApi.deleteCoupon(accessToken!, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon deleted successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to delete coupon', error.message ?? 'Please try again')
    },
  })
}

export function useCreateCategory() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CategoryDto) =>
      adminApi.createCategory(accessToken!, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to create category', error.message ?? 'Please try again')
    },
  })
}

export function useUpdateCategory() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryDto }) =>
      adminApi.updateCategory(accessToken!, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to update category', error.message ?? 'Please try again')
    },
  })
}

export function useDeleteCategory() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      adminApi.deleteCategory(accessToken!, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully')
    },

    onError: (error: { message?: string }) => {
      toast.error('Failed to delete category', error.message ?? 'Please try again')
    },
  })
}