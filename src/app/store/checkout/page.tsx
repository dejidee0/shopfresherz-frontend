"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

import { DeliveryStep } from "@/features/checkout/components/DeliveryStep";
import { PaymentStep } from "@/features/checkout/components/PaymentStep";
import { ReviewStep } from "@/features/checkout/components/ReviewStep";
import { RegisteredCheckout } from "@/features/checkout/components/RegisteredCheckout";
import { StepIndicator } from "@/features/checkout/components/CheckoutShared";

import {
  type DeliveryMethod,
  type PaymentMethod,
  type CouponState,
} from "@/features/checkout/types/checkout";
import {
  accountApi,
  type Address,
  type CreateAddressRequest,
} from "@/lib/api/account";
import { checkoutApi } from "@/lib/api/checkout";
import { productsApi } from "@/lib/api/products";
import { toast } from "@/store/toast";
import { CHECKOUT_ADDRESSES_QUERY_KEY } from "@/features/checkout/queryKeys";

type CheckoutStep = 1 | 2 | 3 | 4;

const COUPONS: Record<string, { type: "percent" | "fixed"; value: number }> = {
  SAVE10: { type: "percent", value: 10 },
  FRESH10: { type: "percent", value: 10 },
  WELCOME5000: { type: "fixed", value: 5000 },
};

export default function CheckoutPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const { isAuthenticated } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const couponCode = useCartStore((s) => s.couponCode);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const setCartCoupon = useCartStore((s) => s.setCoupon);
  const removeCartCoupon = useCartStore((s) => s.removeCoupon);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateCartItem = useCartStore((s) => s.updateItem);

  // Reconcile persisted cart prices against current product prices — a cart
  // can sit in localStorage for days/weeks between visits, so prices may have
  // drifted since the item was added.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const item of items) {
        try {
          const product = await productsApi.getBySlug(item.slug);
          if (cancelled) return;
          if (product.price !== item.price || product.stockQty !== item.stockQty) {
            updateCartItem(item.id, {
              price: product.price,
              stockQty: product.stockQty,
            });
          }
        } catch {
          // Ignore — keep the last-known price/stock rather than blocking checkout.
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Addresses ─────────────────────────────────────────────────────────────
  const { data: addresses = [], refetch: refetchAddresses } = useQuery<
    Address[]
  >({
    queryKey: CHECKOUT_ADDRESSES_QUERY_KEY(token),
    queryFn: () => accountApi.getAddresses(token!),
    enabled: !!token,
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  useMemo(() => {
    if (addresses.length === 0 || selectedAddressId) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (def) setSelectedAddressId(def.id);
  }, [addresses]); // eslint-disable-line react-hooks/exhaustive-deps

  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  // ── Step + form state ─────────────────────────────────────────────────────
  const [step, setStep] = useState<CheckoutStep>(1);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [coupon, setCoupon] = useState<CouponState>({
    code: couponCode ?? "",
    applied: !!couponCode,
  });

  // ── Phone number ──────────────────────────────────────────────────────────
  const user = useAuthStore((s) => s.user);
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Pre-fill from the user's saved profile phone once it becomes available.
  useEffect(() => {
    if (user?.phone && !phone) setPhone(user.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phone]);

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneError =
    phoneTouched && phoneDigits.length < 10
      ? "Enter a valid phone number (at least 10 digits)."
      : undefined;
  const isPhoneValid = phoneDigits.length >= 10;

  const deliveryFee = useMemo(() => {
    if (delivery === "pickup") return 0;
    if (delivery === "express") return 3500;
    return subtotal >= 50000 ? 0 : 1500;
  }, [delivery, subtotal]);

  const handleCouponChange = (value: string) => {
    removeCartCoupon();
    setCoupon({ code: value, applied: false });
  };

  const handleApplyCoupon = () => {
    const code = coupon.code.trim().toUpperCase();
    const config = COUPONS[code];
    if (!code) {
      setCoupon({ code: "", applied: false, error: "Enter a coupon code." });
      return;
    }
    if (!config) {
      removeCartCoupon();
      setCoupon({ code, applied: false, error: "Invalid coupon code." });
      return;
    }
    if (subtotal <= 0) {
      removeCartCoupon();
      setCoupon({
        code,
        applied: false,
        error: "Add items to your cart before applying a coupon.",
      });
      return;
    }
    const discount =
      config.type === "percent"
        ? Math.round(subtotal * (config.value / 100))
        : Math.min(config.value, subtotal);
    setCartCoupon(code, discount);
    setCoupon({ code, applied: true });
  };

  const handleRemoveCoupon = () => {
    removeCartCoupon();
    setCoupon({ code: "", applied: false });
  };

  const handleAddAddress = async (data: CreateAddressRequest) => {
    if (!token) {
      throw new Error("Please sign in before adding a delivery address.");
    }

    const addressId = await accountApi.addAddress(token, data);
    await refetchAddresses();
    setSelectedAddressId(addressId);
  };

  // Resolve selected address object for ReviewStep
  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? addresses[0] ?? null;

  const [isInitiating, setIsInitiating] = useState(false);

  // Called when user clicks "Place Order" in ReviewStep
  const handleInitiatePayment = async () => {
    if (!token || !isAuthenticated) {
      toast.error(
        "Please sign in",
        "You need to sign in before placing an order.",
      );
      return;
    }
    if (!selectedAddressId) {
      toast.error(
        "Select a delivery address",
        "Choose where you want this order delivered.",
      );
      return;
    }
    if (!isPhoneValid) {
      setPhoneTouched(true);
      toast.error(
        "Enter a valid phone number",
        "We need a phone number to reach you about your order.",
      );
      return;
    }

    setIsInitiating(true);
    try {
      const taxable = Math.max(0, subtotal - discountAmount);
      const tax = taxable * 0.075;
      const total = taxable + deliveryFee + tax;

      const result = await checkoutApi.initiatePayment(token, {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        addressId: selectedAddressId,
        deliveryMethod:
          delivery === "express"
            ? "Express"
            : delivery === "pickup"
              ? "Pickup"
              : "Standard",
        paymentMethod: payment === "pay_on_delivery" ? "PayOnDelivery" : "Card",
        pricing: { subtotal, discountAmount, deliveryFee, tax, total },
        couponCode: coupon.applied
          ? coupon.code.trim().toUpperCase()
          : undefined,
        guestPhone: phone.trim(),
      });

      if (result.paymentMethod === "PayOnDelivery") {
        clearCart();
        router.push(
          `/store/checkout/success?order=${result.orderNumber}&method=PayOnDelivery&total=${total}`,
        );
        return;
      }

      // Card: hand off to Flutterwave's hosted checkout page.
      if (result.paymentMethod === "Card" && result.paymentLink) {
        sessionStorage.setItem(
          "pendingFlwOrder",
          JSON.stringify({
            pendingOrderId: result.pendingOrderId,
            orderNumber: result.orderNumber,
            txRef: result.flutterwaveConfig?.tx_ref,
            amount: result.flutterwaveConfig?.amount ?? total,
          }),
        );
        window.location.href = result.paymentLink;
        return;
      }

      toast.error(
        "Payment initiation failed",
        "Unable to start payment. Please try again.",
      );
    } catch (error) {
      toast.error(
        "Payment initiation failed",
        "Unable to start payment. Please try again.",
      );
    } finally {
      setIsInitiating(false);
    }
  };

  const sidebarProps = {
    coupon,
    onCouponChange: handleCouponChange,
    onApplyCoupon: handleApplyCoupon,
    onRemoveCoupon: handleRemoveCoupon,
    deliveryFee,
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#F5F2ED] px-4 py-16 min-h-screen text-center">
        <h1 className="text-xl font-bold text-[#111111]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[#666666]">
          Add products to your cart before checking out.
        </p>
        <button
          onClick={() => router.push("/store")}
          className="sf-btn-primary mt-6 h-11 px-6 text-sm"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F2ED] px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
      <div className="max-w-content mx-auto">
      <StepIndicator step={step} />
      {step === 1 && (
        <RegisteredCheckout
          {...sidebarProps}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onAddAddress={handleAddAddress}
          delivery={delivery}
          deliveryFee={deliveryFee}
          selectedPayment={payment}
          onSelectPayment={setPayment}
          phone={phone}
          onPhoneChange={(v) => {
            setPhone(v);
            setPhoneTouched(true);
          }}
          phoneError={phoneError}
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
          onSelect={setPayment}
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
          phone={phone}
          isPlacingOrder={isInitiating}
          onBack={() => setStep(1)}
          onPlaceOrder={handleInitiatePayment}
          {...sidebarProps}
        />
      )}
      </div>
    </div>
  );
}
