import { api, apiFetch } from "./client";
import type { Order, OrderStatus, User } from "../types/user";
import type { Product } from "../types/product";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DashboardStatsDto extends Record<string, unknown> {
  totalOrders?: number;
  totalRevenue?: number;
  totalCustomers?: number;
  totalProducts?: number;
  pendingOrders?: number;
  lowStockCount?: number;
  completedOrders?: number;
  cancelledOrders?: number;
}

export interface AdminOrdersFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  paymentStatus?: string;
  from?: string | Date;
  to?: string | Date;
}

export type OrderDto = Order & Record<string, unknown>;

export interface AdminUsersFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export type AdminUserDto = Partial<User> &
  Record<string, unknown> & {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
    loyaltyPoints?: number;
  };

export interface UpdateOrderStatusRequest {
  status: OrderStatus | string;
  note?: string;
  trackingNumber?: string;
}

export interface AdjustLoyaltyRequest {
  points: number;
  reason?: string;
}

export interface LowStockDto extends Record<string, unknown> {
  productId: string;
  productName: string;
  sku?: string;
  slug?: string;
  availableQty: number;
  stockQty?: number;
  reservedQty?: number;
  threshold?: number;
}

export interface BannerDto extends Record<string, unknown> {
  id: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  ctaText?: string;
  position?: string;
  sortOrder?: number;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt?: string;
}

export interface PromoDto {
  id: string;
  productId?: string;
  imageUrl?: string;
  name?: string;
  rating?: number;
  originalPrice?: string;
  salePrice?: string;
  description?: string;
  badge?: string;
  slug?: string;
  tag?: string;
  title?: string;
  price?: string;
  ctaText?: string;
  sortOrder?: number;
  type?: string;
  subtitle?: string;
  buttonText?: string;
  priceLabel?: string;
  priceValue?: string;
  imageAlt?: string;
  priceBadge?: string;
  /** Not currently returned by the backend — see CreatePromoRequest.videoUrl. */
  videoUrl?: string;
}

export interface CreatePromoRequest {
  productId?: string;
  placement?: PromoPlacement;
  tag?: string;
  ctaText?: string;
  imageUrl?: string;
  /**
   * Sent for forward-compatibility — as of this writing the backend always
   * derives the promo description from the linked product and silently
   * ignores this field on create/update. Kept here so the UI is ready the
   * moment the backend supports it, without pretending it works today.
   */
  description?: string;
  /**
   * Optional looping background video for the Best Deal promo card.
   * Confirmed via direct testing: the backend accepts this field on create
   * without erroring, but does not currently persist or return it on
   * /promotions/best-deal — same forward-compatibility situation as
   * `description` above. Falls back to imageUrl until the backend stores it.
   */
  videoUrl?: string;
}

/**
 * Every placement a promo card can appear in. These map 1:1 to backend route
 * segments — /promotions/{placement} (public read) and
 * /promotions/admin/{placement} (create/update) — confirmed by direct testing
 * against the live API rather than assumed from existing frontend code.
 */
export type PromoPlacement =
  | "hero"
  | "best-deal"
  | "accessories-promo"
  | "laptop-promo"
  | "flash-sale"
  | "store-promo-banner";

export const PROMO_PLACEMENTS: { value: PromoPlacement; label: string }[] = [
  { value: "hero", label: "Hero Side" },
  { value: "best-deal", label: "Best Deals Section" },
  { value: "accessories-promo", label: "Accessories Sidebar" },
  { value: "laptop-promo", label: "Laptop Sidebar" },
  { value: "flash-sale", label: "Flash Sale" },
  { value: "store-promo-banner", label: "Store Promo Banner" },
];

/**
 * "hero" and "flash-sale" support multiple concurrent promo cards and expose
 * a real admin list endpoint (GET /promotions/admin/{placement}) returning
 * genuine database ids. The other 4 placements are singleton — only one
 * active entry at a time, no admin list endpoint (confirmed 405), and the
 * public read endpoint never exposes a real id (only a display slug) even
 * for a freshly-created entry. For those, create/update is a safe upsert
 * keyed on productId, and delete resolves the real id on demand by
 * re-submitting the known productId (see useDeleteSingletonPromo).
 */
export const PROMO_MULTI_ITEM_PLACEMENTS: PromoPlacement[] = ["hero", "flash-sale"];

/**
 * Placements whose PUT /promotions/admin/{placement}/{id} endpoint actually
 * works. Confirmed live: "hero"'s PUT 404s with "Hero banner was not found"
 * regardless of whether the id/productId are correct (a server-side bug —
 * it appears to look up a different resource internally), while "flash-sale"'s
 * PUT works correctly. Everything NOT in this list is edited via the same
 * upsert-by-productId POST that create uses (safe: confirmed it updates the
 * existing row in place rather than duplicating, for both "hero" and the
 * singleton placements — but confirmed UNSAFE for "flash-sale", whose create
 * endpoint 500s if the productId already exists there, which is why
 * flash-sale keeps using PUT).
 */
export const PROMO_PUT_UPDATE_PLACEMENTS: PromoPlacement[] = ["flash-sale"];

export interface CreateBannerRequest {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  tag?: string;
  ctaText?: string;
  position?: string;
  sortOrder?: number;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export type UpdateBannerRequest = Partial<CreateBannerRequest>;

export interface AdminProductsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  slug: string;
  brandId?: string;
  categoryId?: number;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQty: number;
  weightKg?: number;
  attributesJson?: string;
  tagsJson?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  /** Seed rating (0-5) shown before real reviews exist. */
  initialRating?: number;
  /** Seed review count shown alongside initialRating. */
  initialReviewCount?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export type ProductDto = Product & Record<string, unknown>;

export interface CategoryDto {
  name: string;
  slug: string;
  parentId?: number;
  imageUrl: string;
  sortOrder?: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface FlashDealDto {
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

export interface CreateFlashDealRequest {
  productId: string;
  variantId?: string;
  salePrice: number;
  startsAt: string;
  endsAt: string;
  maxQuantity: number;
}

export type UpdateFlashDealRequest = Partial<CreateFlashDealRequest>;

export interface CouponDto {
  id: number;
  code: string;
  type: "Fixed" | "Percentage";
  value: number;
  minimumOrderAmount: number;
  maxUses: number;
  usedCount: number;
  perUserLimit: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCouponRequest {
  code: string;
  type: "Fixed" | "Percentage";
  value: number;
  minimumOrderAmount: number;
  maxUses: number;
  perUserLimit: number;
  expiresAt: string;
  isActive?: boolean;
}

export interface AnalyticsData {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  ordersToday: number;
  processingOrders: number;
  shippedOrders: number;
  newUsersToday: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: RecentOrder[];
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
  monthlyRevenue: number;
  todayOrders: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AdminNotificationDto {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminNotificationsResponse {
  items: AdminNotificationDto[];
  unreadCount: number;
}

export interface AdminNotificationsFilters {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface ReviewDto {
  id: string;
  userId: string;
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  // Client-side moderation status — not yet returned by the API.
  // Will be replaced with a real field once the backend adds it.
  moderationStatus?: ReviewModerationStatus;
}

export type ReviewModerationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Flagged";

export interface AdminReviewsFilters {
  page?: number;
  pageSize?: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface AdminStoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  timeZone: string;
  logoUrl: string;
  contactAddress: string;
}

export interface AdminPaymentSettings {
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  bankTransferEnabled: boolean;
  defaultProvider: string;
}

export interface AdminShippingSettings {
  defaultDeliveryFee: number;
  freeShippingThreshold: number;
  estimatedDeliveryDaysMin: number;
  estimatedDeliveryDaysMax: number;
  supportedStates: string[];
}

export interface AdminTaxSettings {
  vatEnabled: boolean;
  vatRatePercent: number;
  pricesIncludeTax: boolean;
}

export interface AdminNotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  orderUpdatesEnabled: boolean;
  stockAlertsEnabled: boolean;
  marketingEnabled: boolean;
}

export interface AdminSeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultImageUrl: string;
}

export interface AdminSecuritySettings {
  accessTokenExpiryMinutes: number;
  refreshTokenExpiryDays: number;
  requireEmailVerification: boolean;
  adminMfaRequired: boolean;
}

export interface AdminMaintenanceSettings {
  enabled: boolean;
  message: string;
}

export interface AdminSettings {
  store: AdminStoreSettings;
  payment: AdminPaymentSettings;
  shipping: AdminShippingSettings;
  tax: AdminTaxSettings;
  notifications: AdminNotificationSettings;
  seo: AdminSeoSettings;
  security: AdminSecuritySettings;
  maintenance: AdminMaintenanceSettings;
}

export type AdminSettingsSection = keyof AdminSettings | string;

export interface UpdateAdminSettingsSectionRequest<T = unknown> {
  value: T;
}

export type UpdateCouponRequest = Partial<CreateCouponRequest>;

function toDateParam(value?: string | Date) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}

export const adminApi = {
  getDashboard: (token: string) =>
    api.get<DashboardStatsDto>("/admin/dashboard", { token }),

  getSettings: (token: string) =>
    api.get<AdminSettings>("/admin/settings", { token }),

  updateSettings: (token: string, payload: AdminSettings) =>
    api.put<AdminSettings>("/admin/settings", payload, { token }),

  getSettingsSection: <T = string>(
    token: string,
    section: AdminSettingsSection,
  ) => api.get<T>(`/admin/settings/${encodeURIComponent(section)}`, { token }),

  updateSettingsSection: <T = unknown>(
    token: string,
    section: AdminSettingsSection,
    payload: UpdateAdminSettingsSectionRequest<T>,
  ) =>
    api.put<AdminSettings>(
      `/admin/settings/${encodeURIComponent(section)}`,
      payload,
      { token },
    ),

  patchSettingsSection: <T = unknown>(
    token: string,
    section: AdminSettingsSection,
    payload: UpdateAdminSettingsSectionRequest<T>,
  ) =>
    apiFetch<AdminSettings>(`/admin/settings/${encodeURIComponent(section)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    }),

  getOrders: (token: string, filters: AdminOrdersFilters = {}) =>
    api.get<PagedResult<OrderDto>>("/admin/orders", {
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
    api.get<PagedResult<AdminUserDto>>("/admin/users", {
      token,
      params: {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        search: filters.search,
      },
    }),

  getAnalytics: (token: string) =>
    api.get<AnalyticsData>("/admin/analytics", { token }),

  getReviews: (token: string, filters: AdminReviewsFilters = {}) =>
    api.get<PagedResult<ReviewDto>>("/admin/reviews", {
      token,
      params: {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
      },
    }),

  // TODO: add once backend implements moderation endpoints:
  // approveReview, rejectReview, flagReview, postReviewResponse

  getNotifications: (token: string, filters: AdminNotificationsFilters = {}) =>
    api.get<AdminNotificationsResponse>("/admin/notifications", {
      token,
      params: {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        unreadOnly: filters.unreadOnly,
      },
    }),

  markNotificationRead: (token: string, id: string) =>
    api.put<void>(`/admin/notifications/${encodeURIComponent(id)}/read`, null, {
      token,
    }),

  markAllNotificationsRead: (token: string) =>
    api.put<void>("/admin/notifications/read-all", null, { token }),

  updateOrderStatus: (
    token: string,
    orderNumber: string,
    payload: UpdateOrderStatusRequest,
  ) =>
    api.put<void>(
      `/admin/orders/${encodeURIComponent(orderNumber)}/status`,
      payload,
      { token },
    ),

  /** Dedicated cancel action — self-contained, no status body required. */
  cancelOrder: (token: string, orderNumber: string) =>
    api.post<void>(
      `/admin/orders/${encodeURIComponent(orderNumber)}/cancel`,
      null,
      { token },
    ),

  adjustUserLoyalty: (
    token: string,
    userId: string,
    payload: AdjustLoyaltyRequest,
  ) =>
    api.post<void>(
      `/admin/users/${encodeURIComponent(userId)}/loyalty`,
      payload,
      { token },
    ),

  getLowStock: (token: string, threshold = 5) =>
    api.get<LowStockDto[]>("/admin/inventory/low-stock", {
      token,
      params: { threshold },
    }),

  getBanners: (token: string) =>
    api.get<BannerDto[]>("/admin/banners", { token }),

  createBanner: (token: string, payload: CreateBannerRequest) =>
    api.post<unknown>("/admin/banners", payload, { token }),

  updateBanner: (token: string, id: string, payload: UpdateBannerRequest) =>
    api.put<void>(`/admin/banners/${encodeURIComponent(id)}`, payload, {
      token,
    }),

  deleteBanner: (token: string, id: string) =>
    api.delete<void>(`/admin/banners/${encodeURIComponent(id)}`, { token }),

  /** Admin list with real ids — only valid for PROMO_MULTI_ITEM_PLACEMENTS. */
  getPromoAdminList: (token: string, placement: PromoPlacement) =>
    api.get<PromoDto[]>(`/promotions/admin/${placement}`, { token }),

  /** Public read — the only display source for singleton placements (no real id exposed). */
  getPromoPublic: (token: string, placement: PromoPlacement) =>
    api.get<PromoDto | PromoDto[] | null>(`/promotions/${placement}`, { token }),

  createPromo: (token: string, placement: PromoPlacement, payload: CreatePromoRequest) =>
    api.post<PromoDto>(`/promotions/admin/${placement}`, payload, { token }),

  updatePromo: (
    token: string,
    placement: PromoPlacement,
    id: string,
    payload: CreatePromoRequest,
  ) =>
    api.put<PromoDto>(
      `/promotions/admin/${placement}/${encodeURIComponent(id)}`,
      payload,
      { token },
    ),

  deletePromo: (token: string, id: string) =>
    api.delete<void>(`/promotions/admin/${encodeURIComponent(id)}`, { token }),

  /**
   * Admin product list — deliberately NOT /products (the public storefront
   * endpoint), which hardcodes IsActive-only filtering server-side and has
   * no sku field. This dedicated admin endpoint takes the same page/pageSize
   * shape plus a real `status` filter ("active" | "inactive" | "all", or
   * omitted for all) and `search` (matches product name).
   */
  getProducts: (token: string, filters: AdminProductsFilters = {}) =>
    api.get<PagedResult<ProductDto>>("/admin/products", {
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
    api.post<ProductDto>("/products", payload, { token }),

  updateProduct: (token: string, id: string, payload: UpdateProductRequest) =>
    api.put<ProductDto>(`/products/${encodeURIComponent(id)}`, payload, {
      token,
    }),

  deleteProduct: (token: string, id: string) =>
    api.delete<void>(`/admin/products/${encodeURIComponent(id)}`, { token }),

  getFlashDeals: () => api.get<FlashDealDto[]>("/flash-deals"),

  createFlashDeal: (token: string, payload: CreateFlashDealRequest) =>
    api.post<FlashDealDto>("/flash-deals", payload, { token }),

  updateFlashDeal: (
    token: string,
    id: string,
    payload: UpdateFlashDealRequest,
  ) =>
    api.put<void>(`/flash-deals/${encodeURIComponent(id)}`, payload, { token }),

  toggleFlashDeal: (token: string, id: string, isActive: boolean) =>
    api.put<void>(`/flash-deals/${encodeURIComponent(id)}/toggle`, null, {
      token,
      params: { isActive },
    }),

  deleteFlashDeal: (token: string, id: string) =>
    api.delete<void>(`/flash-deals/${encodeURIComponent(id)}`, { token }),

  getCoupons: (token: string) => api.get<CouponDto[]>("/coupons", { token }),

  createCoupon: (token: string, payload: CreateCouponRequest) =>
    api.post<CouponDto>("/coupons", payload, { token }),

  updateCoupon: (token: string, id: number, payload: UpdateCouponRequest) =>
    api.put<void>(`/coupons/${id}`, payload, { token }),

  deleteCoupon: (token: string, id: number) =>
    api.delete<void>(`/coupons/${id}`, { token }),

  createCategory: (token: string, payload: CategoryDto) =>
    api.post<CategoryDto>("/categories", payload, { token }),

  updateCategory: (token: string, id: number, payload: CategoryDto) =>
    api.put<CategoryDto>(`/categories/${encodeURIComponent(id)}`, payload, {
      token,
    }),

  deleteCategory: (token: string, id: number) =>
    api.delete<void>(`/categories/${encodeURIComponent(id)}`, { token }),
};
