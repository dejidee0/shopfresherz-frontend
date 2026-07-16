export interface BillingForm {
  firstName: string;
  lastName: string;
  companyName: string;
  address: string;
  country: string;
  region: string;
  city: string;
  zipCode: string;
  email: string;
  phone: string;
  saveAddress: boolean;
}

export type DeliveryMethod = "standard" | "express" | "pickup";
export type PaymentMethod = "card" | "bank_transfer" | "pay_on_delivery";
export type CheckoutStep = 1 | 2 | 3 | 4; // 1: Billing · 2: Delivery · 3: Payment · 4: Review

export interface CardForm {
  nameOnCard: string;
  cardNumber: string;
  expireDate: string;
  cvc: string;
}

export interface CouponState {
  code: string;
  applied: boolean;
  error?: string;
}

// ─── Delivery options ─────────────────────────────────────────────────────────

/**
 * Single source of truth for delivery fees — confirmed against the live
 * backend's /checkout/initiate-payment validation (which rejects any
 * mismatched total and does not currently waive fees above any subtotal).
 * Every consumer (checkout page, cart drawer preview, delivery step display)
 * must read from here rather than hardcoding its own copy.
 */
export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  standard: 3500,
  express: 1500,
  pickup: 0,
};

export interface DeliveryOption {
  id: DeliveryMethod;
  label: string;
  subtitle: string;
  price: number | null; // null = free
  note: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    subtitle: "3-5 business days",
    price: DELIVERY_FEES.standard,
    note: "",
  },
  {
    id: "express",
    label: "Express Delivery",
    subtitle: "1-2 business days",
    price: DELIVERY_FEES.express,
    note: "",
  },
  {
    id: "pickup",
    label: "Store Pickup",
    subtitle: "Ready in 24 hours",
    price: null,
    note: "Always free — pick up in-store",
  },
];

// ─── Payment options ──────────────────────────────────────────────────────────

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  subtitle: string;
  description: string;
  icon: "card" | "truck" | "bank";
  badge?: string;
  note?: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "card",
    label: "PAY NOW",
    subtitle: "Card · Bank Transfer · USSD · OPay & more",
    description:
      "Secure payment via Flutterwave — pay with card, bank transfer, USSD and more",
    icon: "card",
    badge: "RECOMMENDED",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    subtitle: "Transfer directly to our bank account",
    description:
      "Send payment to our bank account, then share your proof of payment on WhatsApp. Your order is confirmed once we verify the transfer.",
    icon: "bank",
  },
  {
    id: "pay_on_delivery",
    label: "Pay on Delivery",
    subtitle: "Cash payment when your order arrives",
    description: "Pay with cash when your order is delivered to your doorstep.",
    icon: "truck",
    note: "Available for Osun State addresses only",
  },
];

// ─── Pay on Delivery state restriction ────────────────────────────────────────

export const POD_AVAILABLE_STATE = "Osun";

export function isPayOnDeliveryAvailable(state?: string | null): boolean {
  return (state ?? "").trim().toLowerCase() === POD_AVAILABLE_STATE.toLowerCase();
}

// ─── Address / form seeds ─────────────────────────────────────────────────────

export const COUNTRIES = ["Nigeria"];

export const REGIONS: Record<string, string[]> = {
  Nigeria: [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory",
  ],
  Ghana: ["Greater Accra", "Ashanti"],
  Kenya: ["Nairobi", "Mombasa"],
  "South Africa": ["Gauteng", "Western Cape"],
  "United States": ["California", "New York", "Texas"],
};

export const EMPTY_BILLING: BillingForm = {
  firstName: "",
  lastName: "",
  companyName: "",
  address: "",
  country: "",
  region: "",
  city: "",
  zipCode: "",
  email: "",
  phone: "",
  saveAddress: false,
};

export const EMPTY_CARD: CardForm = {
  nameOnCard: "",
  cardNumber: "",
  expireDate: "",
  cvc: "",
};
