import { api } from "./client";
import type { Order, User } from "../types/user";

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
  isDefault: boolean;
  fullName?: string;
  street?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface CreateAddressRequest {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
  isDefault: boolean;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;

// ─── Payment Method ───────────────────────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  cardType: "visa" | "mastercard" | "verve";
  cardNumber: string;
  balance?: number; // shown on card chip in dashboard
  currency?: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;  // shown on card chip in dashboard
  isDefault: boolean;
}

export interface PaymentCardDto {
  cardType: string;
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

// ─── Order Detail ─────────────────────────────────────────────────────────────

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  categoryName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderActivity {
  id: string;
  message: string;
  timestamp: string;
  icon: "check" | "truck" | "location" | "package" | "shield" | "confirm";
}

export type OrderStepStatus = "completed" | "active" | "pending";

export interface OrderStep {
  label: string;
  status: OrderStepStatus;
}

export interface OrderDetail extends Order {
  lineItems: OrderLineItem[];
  activity: OrderActivity[];
  steps: OrderStep[];
  billingAddress: Address;
  shippingAddress: Address;
  notes?: string;
  placedAt: string;
  expectedArrival?: string;
}

export interface InlineOrderAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
}

export type DeliveryMethod = "Standard" | "Express" | string;
export type PaymentMethodType = "Card" | "BankTransfer" | "USSD" | "POD" | string;

export interface CreateOrderRequest {
  addressId?: string;
  inlineAddress?: InlineOrderAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethodType;
  couponCode?: string;
  notes?: string;
  guestEmail?: string;
  guestSessionId?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  paymentUrl?: string;
  paymentReference?: string;
  total: number;
}

export interface OrderProductSnapshot {
  name: string;
  sku: string;
  imageUrl: string;
  slug: string;
}

export interface AccountOrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productSnapshot: OrderProductSnapshot;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AccountOrder extends Order {
  userId: string;
  deliveryAddress: InlineOrderAddress;
  deliveryMethod: DeliveryMethod;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
  items: AccountOrderItem[];
}

export type OrdersResponse = ApiPaginatedResponse<AccountOrder> & {
  data: AccountOrder[];
  total: number;
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  loyaltyPoints: number;
}

export interface AccountProfile {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: "Customer" | "Admin" | "SuperAdmin";
  isVerified: boolean;
  loyaltyPoints: number;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface LoyaltyTransaction {
  id: string;
  eventType: "Earned" | "Redeemed" | "Expired" | string;
  points: number;
  description: string;
  createdAt: string;
  expiresAt?: string;
  remainingPoints: number;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LoyaltyResponse {
  balance: number;
  transactions: ApiPaginatedResponse<LoyaltyTransaction>;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  backInStock: boolean;
  wishlistReminders: boolean;
  reviewReminders: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductReviewFilters {
  page?: number;
  pageSize?: number;
  starFilter?: number;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  body: string;
}

function toOrderDetail(order: AccountOrder): OrderDetail {
  const address: Address = {
    id: "",
    label: order.deliveryAddress.label,
    line1: order.deliveryAddress.line1,
    line2: order.deliveryAddress.line2,
    city: order.deliveryAddress.city,
    state: order.deliveryAddress.state,
    postalCode: order.deliveryAddress.postalCode,
    isDefault: false,
    street: order.deliveryAddress.line1,
  };

  return {
    ...order,
    lineItems: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productSnapshot.name,
      productSlug: item.productSnapshot.slug,
      productImage: item.productSnapshot.imageUrl,
      categoryName: item.productSnapshot.sku,
      price: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.lineTotal,
    })),
    activity: [],
    steps: [],
    billingAddress: address,
    shippingAddress: address,
    placedAt: order.createdAt,
    expectedArrival: order.estimatedDelivery,
  };
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const accountApi = {
  /** Full dashboard data in one call */
  getDashboard: (token: string) =>
    api.get<{
      user: User;
      stats: DashboardStats;
      recentOrders: Order[];
      paymentMethods: PaymentMethod[];
    }>("/account/dashboard", { token }),

  /** Paginated order history */
  getOrders: (token: string, page = 1, pageSize = 12) =>
    api
      .get<ApiPaginatedResponse<AccountOrder>>("/orders", {
        token,
        params: { page, pageSize },
      })
      .then((res) => ({
        ...res,
        data: res.items,
        total: res.totalCount,
      })),

  createOrder: (token: string, data: CreateOrderRequest) =>
    api.post<CreateOrderResponse>("/orders", data, { token }),

  /** Single order with line items, activity, addresses */
  getOrderDetail: (token: string, orderNumber: string) =>
    api
      .get<AccountOrder>(`/orders/${orderNumber}`, { token })
      .then(toOrderDetail),

  getOrderByNumber: (token: string, orderNumber: string) =>
    api.get<AccountOrder>(`/orders/${orderNumber}`, { token }),

  cancelOrder: (token: string, orderNumber: string) =>
    api.post<void>(`/orders/${orderNumber}/cancel`, null, { token }),

  /** Saved addresses */
  getAddresses: (token: string) => api.get<Address[]>("/addresses", { token }),

  addAddress: (token: string, data: CreateAddressRequest) =>
    api.post<string>("/addresses", data, { token }),

  updateAddress: (token: string, id: string, data: UpdateAddressRequest) =>
    api.put<void>(`/addresses/${id}`, data, { token }),

  deleteAddress: (token: string, id: string) =>
    api.delete<void>(`/addresses/${id}`, { token }),

  /** Payment methods */
  getPaymentMethods: (token: string) =>
    api.get<PaymentMethod[]>("/payment-methods", { token }),

  createPaymentMethod: (token: string, data: PaymentCardDto) =>
    api.post<PaymentMethod>("/payment-methods", data, { token }),

  updatePaymentMethod: (token: string, id: string, data: PaymentCardDto) =>
    api.put<PaymentMethod>(`/payment-methods/${id}`, data, { token }),

  deletePaymentMethod: (token: string, id: string) =>
    api.delete<void>(`/payment-methods/${id}`, { token }),

  /** Profile */
  getProfile: (token: string) =>
    api.get<AccountProfile>("/account/profile", { token }),

  updateProfile: (token: string, data: UpdateProfileRequest) =>
    api.put<void>("/account/profile", data, { token }),

  changePassword: (token: string, data: ChangePasswordRequest) =>
    api.put<void>("/account/password", data, { token }),

  getLoyalty: (token: string, page = 1, pageSize = 20) =>
    api.get<LoyaltyResponse>("/account/loyalty", {
      token,
      params: { page, pageSize },
    }),

  notifyMe: (token: string, productId: string) =>
    api.post<void>(`/account/notify-me/${productId}`, null, { token }),

  getNotifications: (token: string) =>
    api.get<NotificationPreferences>("/account/notifications", { token }),

  updateNotifications: (token: string, data: NotificationPreferences) =>
    api.put<void>("/account/notifications", data, { token }),

  getProductReviews: (
    productId: string,
    { page = 1, pageSize = 10, starFilter }: ProductReviewFilters = {},
  ) =>
    api.get<ApiPaginatedResponse<ProductReview>>(
      `/reviews/product/${productId}`,
      {
        params: { page, pageSize, starFilter },
      },
    ),

  createReview: (token: string, data: CreateReviewRequest) =>
    api.post<void>("/reviews", data, { token }),
};

export const reviewsApi = {
  getByProduct: (
    productId: string,
    { page = 1, pageSize = 10, starFilter }: ProductReviewFilters = {},
  ) =>
    api.get<ApiPaginatedResponse<ProductReview>>(
      `/reviews/product/${productId}`,
      {
        params: { page, pageSize, starFilter },
      },
    ),

  create: (token: string, data: CreateReviewRequest) =>
    api.post<void>("/reviews", data, { token }),
};
