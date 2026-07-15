import { api } from "./client";

export interface CheckoutOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CheckoutInlineAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
}

export interface CheckoutDelivery {
  method: string;
  fee: number;
}

export interface CheckoutPayment {
  method: string;
  savedCardId?: string;
}

export interface CheckoutPricing {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface CheckoutCoupon {
  code: string;
  discountAmount: number;
}

export interface PlaceOrderRequest {
  items: CheckoutOrderItem[];
  addressId?: string;
  shippingAddressId?: string;
  inlineAddress?: CheckoutInlineAddress;
  deliveryMethod: "Standard" | "Express" | "Pickup" | string;
  delivery: CheckoutDelivery;
  paymentMethod: "Card" | "Transfer" | "POD" | string;
  payment: CheckoutPayment;
  pricing: CheckoutPricing;
  couponCode?: string;
  coupon?: CheckoutCoupon;
  notes?: string;
  guestEmail?: string;
  guestSessionId?: string;
}

export interface InitiatePaymentRequest {
  items: CheckoutOrderItem[];
  addressId?: string;
  shippingAddressId?: string;
  inlineAddress?: CheckoutInlineAddress;
  deliveryMethod: "Standard" | "Express" | "Pickup" | string;
  // delivery: CheckoutDelivery;
  paymentMethod: "Card" | "PayOnDelivery" | "BankTransfer" | string;
  // payment: CheckoutPayment;
  pricing: CheckoutPricing;
  couponCode?: string;
  // coupon?: CheckoutCoupon;
  // notes?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  instructions: string;
}

export interface FlutterWaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
    phone_number: string;
  };
  meta: {
    pendingOrderId: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
}

export interface InitiatePaymentResponse {
  pendingOrderId: string;
  orderNumber: string;
  paymentMethod: string;
  flutterwaveConfig?: FlutterWaveConfig;
  /** Flutterwave hosted checkout page — redirect the browser here for Card payments. */
  paymentLink?: string;
  /** Our own bank account details — present when paymentMethod is BankTransfer. */
  bankDetails?: BankDetails;
  message?: string;
}

export interface ConfirmOrderRequest {
  pendingOrderId: string;
  transactionId: string;
  txRef: string;
  status: string;
}

export interface ConfirmOrderResponse {
  orderNumber: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  orderNumber: string;
  paymentUrl?: string;
  paymentReference?: string;
  total: number;
}

export const checkoutApi = {
  placeOrder: (token: string, payload: PlaceOrderRequest) =>
    api.post<PlaceOrderResponse>("/orders", payload, { token }),

  initiatePayment: (token: string, payload: InitiatePaymentRequest) =>
    api.post<InitiatePaymentResponse>("/checkout/initiate-payment", payload, { token }),

  confirmOrder: async (token: string, payload: ConfirmOrderRequest) =>
    api.post<ConfirmOrderResponse>("/checkout/confirm-order", payload, { token }),
};
