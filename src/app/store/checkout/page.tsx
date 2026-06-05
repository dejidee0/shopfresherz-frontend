"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

import { DeliveryStep } from "@/features/checkout/components/DeliveryStep";
import { PaymentStep } from "@/features/checkout/components/PaymentStep";
import { ReviewStep } from "@/features/checkout/components/ReviewStep";
import { RegisteredCheckout } from "@/features/checkout/components/RegisteredCheckout";

import {
  EMPTY_CARD,
  type DeliveryMethod,
  type PaymentMethod,
  type CardForm,
  type CouponState,
} from "@/features/checkout/types/checkout";
import {
  accountApi,
  type Address,
  type PaymentMethod as SavedCard,
} from "@/lib/api/account";

type CheckoutStep = 1 | 2 | 3 | 4;

const COUPONS: Record<string, { type: "percent" | "fixed"; value: number }> = {
  SAVE10:      { type: "percent", value: 10   },
  FRESH10:     { type: "percent", value: 10   },
  WELCOME5000: { type: "fixed",   value: 5000 },
};

export function SAVED_CARDS_QUERY_KEY(token: string | null | undefined) {
  return ["checkout-saved-cards", token] as const;
}

export default function CheckoutPage() {
  const router   = useRouter();
  const token    = useAuthStore((s) => s.accessToken);
  const { isAuthenticated } = useAuthStore();
  const items           = useCartStore((s) => s.items);
  const subtotal        = useCartStore((s) => s.subtotal());
  const couponCode      = useCartStore((s) => s.couponCode);
  const setCartCoupon   = useCartStore((s) => s.setCoupon);
  const removeCartCoupon = useCartStore((s) => s.removeCoupon);

  // ── Addresses ─────────────────────────────────────────────────────────────
  const { data: addresses = [] } = useQuery<Address[]>({
    queryKey: ["checkout-addresses", token],
    queryFn:  () => accountApi.getAddresses(token!),
    enabled:  !!token,
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useMemo(() => {
    if (addresses.length === 0 || selectedAddressId) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (def) setSelectedAddressId(def.id);
  }, [addresses]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Saved cards ───────────────────────────────────────────────────────────
  const { data: savedCards = [] } = useQuery<SavedCard[]>({
    queryKey: SAVED_CARDS_QUERY_KEY(token),
    queryFn:  () => accountApi.getPaymentMethods(token!),
    enabled:  !!token,
  });

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  useMemo(() => {
    if (savedCards.length === 0 || selectedCardId) return;
    const def = savedCards.find((c) => c.isDefault) ?? null;
    if (def) { setSelectedCardId(def.id); setPayment("card"); }
  }, [savedCards]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step + form state ─────────────────────────────────────────────────────
  const [step,     setStep]     = useState<CheckoutStep>(1);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD);
  const [coupon,   setCoupon]   = useState<CouponState>({
    code:    couponCode ?? "",
    applied: !!couponCode,
  });

  const deliveryFee = useMemo(() => {
    if (delivery === "pickup")  return 0;
    if (delivery === "express") return 3500;
    return subtotal >= 50000 ? 0 : 1500;
  }, [delivery, subtotal]);

  const handleCouponChange = (value: string) => {
    removeCartCoupon();
    setCoupon({ code: value, applied: false });
  };

  const handleApplyCoupon = () => {
    const code   = coupon.code.trim().toUpperCase();
    const config = COUPONS[code];
    if (!code)   { setCoupon({ code: "", applied: false, error: "Enter a coupon code." }); return; }
    if (!config) { removeCartCoupon(); setCoupon({ code, applied: false, error: "Invalid coupon code." }); return; }
    if (subtotal <= 0) {
      removeCartCoupon();
      setCoupon({ code, applied: false, error: "Add items to your cart before applying a coupon." });
      return;
    }
    const discount = config.type === "percent"
      ? Math.round(subtotal * (config.value / 100))
      : Math.min(config.value, subtotal);
    setCartCoupon(code, discount);
    setCoupon({ code, applied: true });
  };

  const handleRemoveCoupon = () => {
    removeCartCoupon();
    setCoupon({ code: "", applied: false });
  };

  const handlePlaceOrder = async () => {
    // TODO: await checkoutApi.placeOrder(...)
    router.push("/store/checkout/confirmation");
  };

  const sidebarProps = {
    coupon,
    onCouponChange:  handleCouponChange,
    onApplyCoupon:   handleApplyCoupon,
    onRemoveCoupon:  handleRemoveCoupon,
    deliveryFee,
  };

  // Resolve selected address object for ReviewStep
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0] ?? null;

  if (items.length === 0) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-16 min-h-[60vh] text-center">
        <h1 className="text-xl font-bold text-[#111111]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Add products to your cart before checking out.
        </p>
        <button
          onClick={() => router.push("/store")}
          className="mt-6 h-11 px-6 rounded bg-[#F5820A] text-white text-sm font-semibold hover:bg-[#E06B00] transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh]">
      {step === 1 && (
        <RegisteredCheckout
          {...sidebarProps}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          delivery={delivery}
          deliveryFee={deliveryFee}
          savedCards={savedCards}
          selectedCardId={selectedCardId}
          onSelectCard={(id) => { setSelectedCardId(id); setPayment("card"); }}
          selectedPayment={payment}
          onSelectPayment={setPayment}
          onEditDelivery={() => setStep(2)}
          onEditPayment={() => setStep(3)}
          onPlaceOrder={() => setStep(4)}
        />
      )}

      {step === 2 && (
        <DeliveryStep
          selected={delivery}
          onSelect={setDelivery}
          onBack={() => setStep(1)}
          onContinue={() => setStep(1)}
          {...sidebarProps}
        />
      )}

      {step === 3 && (
        <PaymentStep
          selected={payment ?? "card"}
          onSelect={(m) => { setPayment(m); if (m !== "card") setSelectedCardId(null); }}
          cardForm={cardForm}
          setCardForm={setCardForm}
          onBack={() => setStep(1)}
          onContinue={() => setStep(1)}
          {...sidebarProps}
        />
      )}

      {step === 4 && (
        <ReviewStep
          selectedAddress={selectedAddress}
          delivery={delivery}
          payment={payment ?? "card"}
          onBack={() => setStep(1)}
          onPlaceOrder={handlePlaceOrder}
          {...sidebarProps}
        />
      )}
    </div>
  );
}