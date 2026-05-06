import { api } from './client'
import type { Order, User } from '../types/user'

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string
  label: string       // e.g. "Home", "Work"
  fullName: string
  street: string
  city: string
  state: string
  country: string
  postalCode?: string
  phone: string
  email?: string
  isDefault: boolean
}

// ─── Payment Method ───────────────────────────────────────────────────────────

export interface PaymentMethod {
  id: string
  type: 'visa' | 'mastercard' | 'verve'
  last4: string
  balance?: number        // shown on card chip in dashboard
  currency?: string
  cardholderName: string
  isDefault: boolean
}

// ─── Order Detail ─────────────────────────────────────────────────────────────

export interface OrderLineItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  productImage: string
  categoryName: string
  price: number
  quantity: number
  subtotal: number
}

export interface OrderActivity {
  id: string
  message: string
  timestamp: string
  icon: 'check' | 'truck' | 'location' | 'package' | 'shield' | 'confirm'
}

export type OrderStepStatus = 'completed' | 'active' | 'pending'

export interface OrderStep {
  label: string
  status: OrderStepStatus
}

export interface OrderDetail extends Order {
  lineItems: OrderLineItem[]
  activity: OrderActivity[]
  steps: OrderStep[]
  billingAddress: Address
  shippingAddress: Address
  notes?: string
  placedAt: string
  expectedArrival?: string
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number
  completedOrders: number
  loyaltyPoints: number
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const accountApi = {
  /** Full dashboard data in one call */
  getDashboard: (token: string) =>
    api.get<{
      user: User
      stats: DashboardStats
      recentOrders: Order[]
      paymentMethods: PaymentMethod[]
    }>('/account/dashboard', { token }),

  /** Paginated order history */
  getOrders: (token: string, page = 1, limit = 12) =>
    api.get<{ data: Order[]; total: number; totalPages: number }>(
      '/account/orders',
      { token, params: { page, limit } }
    ),

  /** Single order with line items, activity, addresses */
  getOrderDetail: (token: string, orderId: string) =>
    api.get<OrderDetail>(`/account/orders/${orderId}`, { token }),

  /** Saved addresses */
  getAddresses: (token: string) =>
    api.get<Address[]>('/account/addresses', { token }),

  updateAddress: (token: string, id: string, data: Partial<Address>) =>
    api.put<Address>(`/account/addresses/${id}`, data, { token }),

  deleteAddress: (token: string, id: string) =>
    api.delete<void>(`/account/addresses/${id}`, { token }),

  /** Payment methods */
  getPaymentMethods: (token: string) =>
    api.get<PaymentMethod[]>('/account/payment-methods', { token }),

  deletePaymentMethod: (token: string, id: string) =>
    api.delete<void>(`/account/payment-methods/${id}`, { token }),

  /** Profile */
  getProfile: (token: string) =>
    api.get<User>('/account/profile', { token }),

  updateProfile: (token: string, data: Partial<User>) =>
    api.put<User>('/account/profile', data, { token }),
}