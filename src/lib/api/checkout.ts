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
};
