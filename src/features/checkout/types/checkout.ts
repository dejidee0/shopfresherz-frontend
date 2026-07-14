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
export type PaymentMethod = "card" | "pay_on_delivery";
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
    price: null,
    note: "Free on order above ₦50,000 otherwise ₦2,00",
  },
  {
    id: "express",
    label: "Express Delivery",
    subtitle: "1-2 business days",
    price: 3500,
    note: "Free on order above ₦50,000 otherwise ₦2,00",
  },
  {
    id: "pickup",
    label: "Store Pickup",
    subtitle: "Ready in 24 hours",
    price: null,
    note: "Free on order above ₦50,000 otherwise ₦2,00",
  },
];

// ─── Payment options ──────────────────────────────────────────────────────────

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  subtitle: string;
  description: string;
  icon: "card" | "truck";
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
    id: "pay_on_delivery",
    label: "Pay on Delivery",
    subtitle: "Cash payment when your order arrives",
    description: "Pay with cash when your order is delivered to your doorstep.",
    icon: "truck",
    note: "Available within Lagos only",
  },
];

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
