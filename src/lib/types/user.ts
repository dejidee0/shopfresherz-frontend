export interface User {
  id: string
  email: string
  phone?: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: 'Customer' | 'Admin' | 'SuperAdmin'
  loyaltyPoints: number,
  hasRegisteredBilling: boolean //added this to verify if the user has registered billing info (maybe temporary)
}



// ─── Order ──────────────────────────────────────────────────────────────────
 
export type OrderStatus =
  | 'Pending'
  | 'AwaitingPayment'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'RefundRequested'
  | 'Refunded'
 
export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded'
  paymentMethod: 'Card' | 'Transfer' | 'BankTransfer' | 'USSD' | 'POD'
  subtotal: number
  discountAmount: number
  deliveryFee: number
  vatAmount: number
  total: number
  createdAt: string
}



// ─── API Responses ──────────────────────────────────────────────────────────
 
export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  // limit: number
  totalPages: number
  pageSize: number,
  hasPreviousPage: boolean
  hasNextPage: boolean
}
 
export interface ApiError {
  code: string       // e.g. SF-2001
  message: string
  status: number
}