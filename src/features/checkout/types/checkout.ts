export interface BillingForm {
  firstName: string
  lastName: string
  companyName: string
  address: string
  country: string
  region: string
  city: string
  zipCode: string
  email: string
  phone: string
  saveAddress: boolean
}

export type DeliveryMethod = 'standard' | 'express' | 'pickup'
export type PaymentMethod  = 'card' | 'bank_transfer' | 'pay_on_delivery'
export type CheckoutStep   = 1 | 2 | 3 | 4   // 1: Billing · 2: Delivery · 3: Payment · 4: Review

export interface CardForm {
  nameOnCard: string
  cardNumber: string
  expireDate: string
  cvc: string
}

export interface CouponState {
  code: string
  applied: boolean
}

// ─── Delivery options ─────────────────────────────────────────────────────────

export interface DeliveryOption {
  id: DeliveryMethod
  label: string
  subtitle: string
  price: number | null   // null = free
  note: string
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    subtitle: '3-5 business days',
    price: null,
    note: 'Free on order above ₦50,000 otherwise ₦2,00',
  },
  {
    id: 'express',
    label: 'Express Delivery',
    subtitle: '1-2 business days',
    price: 3500,
    note: 'Free on order above ₦50,000 otherwise ₦2,00',
  },
  {
    id: 'pickup',
    label: 'Store Pickup',
    subtitle: 'Ready in 24 hours',
    price: null,
    note: 'Free on order above ₦50,000 otherwise ₦2,00',
  },
]

// ─── Payment options ──────────────────────────────────────────────────────────

export interface PaymentOption {
  id: PaymentMethod
  label: string
  subtitle: string
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'card',
    label: 'Debit/Credit Card',
    subtitle: 'Visa, Mastercard, Verve accepted',
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    subtitle: 'Pay directly from your bank app',
  },
  {
    id: 'pay_on_delivery',
    label: 'Pay on Delivery',
    subtitle: 'Cash or POS on delivery (Standard only)',
  },
]

// ─── Address / form seeds ─────────────────────────────────────────────────────

export const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States']

export const REGIONS: Record<string, string[]> = {
  Nigeria: ['Lagos', 'Abuja', 'Akwa Ibom', 'Rivers', 'Kano'],
  Ghana: ['Greater Accra', 'Ashanti'],
  Kenya: ['Nairobi', 'Mombasa'],
  'South Africa': ['Gauteng', 'Western Cape'],
  'United States': ['California', 'New York', 'Texas'],
}

export const EMPTY_BILLING: BillingForm = {
  firstName: '', lastName: '', companyName: '',
  address: '', country: '', region: '', city: '', zipCode: '',
  email: '', phone: '', saveAddress: false,
}

export const EMPTY_CARD: CardForm = {
  nameOnCard: '', cardNumber: '', expireDate: '', cvc: '',
}

// ─── Bank details (static — replace with API response) ───────────────────────

export const BANK_DETAILS = {
  bank: 'GTBank',
  accountName: 'fresherzstore LTD',
  accountNumber: '012344333784',
}