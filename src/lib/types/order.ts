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