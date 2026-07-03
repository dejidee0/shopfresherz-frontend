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

import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

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
  type CreateAddressRequest,
  type PaymentMethod as SavedCard,
} from "@/lib/api/account";
import { checkoutApi } from "@/lib/api/checkout";
import { toast } from "@/store/toast";
import { FlutterwavePaymentTrigger } from "@/features/payment/components/FlutterwavePaymentTrigger";
import {
  CHECKOUT_ADDRESSES_QUERY_KEY,
  SAVED_CARDS_QUERY_KEY,
} from "@/features/checkout/queryKeys";

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

  // ── Saved cards ───────────────────────────────────────────────────────────
  const { data: savedCards = [] } = useQuery<SavedCard[]>({
    queryKey: SAVED_CARDS_QUERY_KEY(token),
    queryFn: () => accountApi.getPaymentMethods(token!),
    enabled: !!token,
  });

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  useMemo(() => {
    if (savedCards.length === 0 || selectedCardId) return;
    const def = savedCards.find((c) => c.isDefault) ?? null;
    if (def) {
      setSelectedCardId(def.id);
      setPayment("card");
    }
  }, [savedCards]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step + form state ─────────────────────────────────────────────────────
  const [step, setStep] = useState<CheckoutStep>(1);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD);
  const [coupon, setCoupon] = useState<CouponState>({
    code: couponCode ?? "",
    applied: !!couponCode,
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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

  // const handlePlaceOrder = async () => {
  //   if (!token || !isAuthenticated) {
  //     toast.error("Please sign in", "You need to sign in before placing an order.");
  //     return;
  //   }

  //   if (!selectedAddressId || !selectedAddress) {
  //     toast.error("Select a delivery address", "Choose where you want this order delivered.");
  //     return;
  //   }

  //   if (isPlacingOrder) return;

  //   const taxable = Math.max(0, subtotal - discountAmount);
  //   const tax = taxable * 0.075;
  //   const total = taxable + deliveryFee + tax;
  //   const deliveryMethod = delivery === "express" ? "Express" : delivery === "pickup" ? "Pickup" : "Standard";
  //   const paymentMethod =
  //     payment === "bank_transfer" ? "BankTransfer" : payment === "pay_on_delivery" ? "POD" : "Card";
  //   const appliedCouponCode = coupon.applied ? coupon.code.trim().toUpperCase() : undefined;

  //   setIsPlacingOrder(true);

  //   try {
  //     const order = await checkoutApi.placeOrder(token, {
  //       items: items.map((item) => ({
  //         productId: item.productId,
  //         name: item.name,
  //         quantity: item.quantity,
  //         price: item.price,
  //         image: item.image,
  //       })),
  //       addressId: selectedAddressId,
  //       shippingAddressId: selectedAddressId,
  //       inlineAddress: {
  //         label: selectedAddress.label,
  //         line1: selectedAddress.line1,
  //         line2: selectedAddress.line2,
  //         city: selectedAddress.city,
  //         state: selectedAddress.state,
  //         postalCode: selectedAddress.postalCode,
  //       },
  //       deliveryMethod,
  //       delivery: {
  //         method: deliveryMethod,
  //         fee: deliveryFee,
  //       },
  //       paymentMethod,
  //       payment: {
  //         method: paymentMethod,
  //         savedCardId: selectedCardId ?? undefined,
  //       },
  //       pricing: {
  //         subtotal,
  //         discountAmount,
  //         deliveryFee,
  //         tax,
  //         total,
  //       },
  //       couponCode: appliedCouponCode,
  //       coupon: appliedCouponCode
  //         ? {
  //             code: appliedCouponCode,
  //             discountAmount,
  //           }
  //         : undefined,
  //     });

  //     clearCart();
  //     router.push(`/store/checkout/confirmation?orderNumber=${order.orderNumber}`);
  //   } catch (error) {
  //     const message =
  //       error && typeof error === "object" && "message" in error && typeof error.message === "string"
  //         ? error.message
  //         : "Unable to place your order. Please try again.";
  //     toast.error("Order failed", message);
  //   } finally {
  //     setIsPlacingOrder(false);
  //   }
  // };

  const [flwConfig, setFlwConfig] = useState<any>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);

  // Step A: Called when user clicks "Place Order" in ReviewStep
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
        paymentMethod:
          payment === "bank_transfer"
            ? "BankTransfer"
            : payment === "pay_on_delivery"
              ? "POD"
              : "Card",
        pricing: { subtotal, discountAmount, deliveryFee, tax, total },
        couponCode: coupon.applied
          ? coupon.code.trim().toUpperCase()
          : undefined,
      });

      setPendingOrderId(result.pendingOrderId);
      setFlwConfig(result.flutterwaveConfig);
      // handleFlutterPayment is triggered in useEffect below
    } catch (error) {
      toast.error(
        "Payment initiation failed",
        "Unable to start payment. Please try again.",
      );
    } finally {
      setIsInitiating(false);
    }
  };

  // Step B: Called after Flutterwave popup closes with success
  const handleConfirmOrder = async (transactionId: string, txRef: string) => {
    if (!pendingOrderId) return;
    setIsPlacingOrder(true);
    try {
      const order = await checkoutApi.confirmOrder(token!, {
        pendingOrderId,
        transactionId,
        txRef,
        status: "successful",
      });
      clearCart();
      router.push(
        `/store/checkout/confirmation?orderNumber=${order.orderNumber}`,
      );
    } catch (error) {
      toast.error(
        "Order confirmation failed",
        "Payment was received but order could not be confirmed. Contact support.",
      );
    } finally {
      setIsPlacingOrder(false);
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
      <div className="bg-[#0A0A0A] px-4 py-16 min-h-screen text-center">
        <h1 className="text-xl font-bold text-white">Your cart is empty</h1>
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
    <div className="bg-[#0A0A0A] px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="max-w-content mx-auto">
      {step === 1 && (
        <RegisteredCheckout
          {...sidebarProps}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onAddAddress={handleAddAddress}
          delivery={delivery}
          deliveryFee={deliveryFee}
          savedCards={savedCards}
          selectedCardId={selectedCardId}
          onSelectCard={(id) => {
            setSelectedCardId(id);
            setPayment("card");
          }}
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
          onSelect={(m) => {
            setPayment(m);
            if (m !== "card") setSelectedCardId(null);
          }}
          cardForm={cardForm}
          setCardForm={setCardForm}
          onBack={() => setStep(1)}
          onContinue={() => setStep(1)}
          {...sidebarProps}
        />
      )}

      {/* {step === 4 && (
        <ReviewStep
          selectedAddress={selectedAddress}
          delivery={delivery}
          payment={payment ?? "card"}
          isPlacingOrder={isPlacingOrder}
          onBack={() => setStep(1)}
          onPlaceOrder={handlePlaceOrder}
          {...sidebarProps}
        />
      )} */}

      {step === 4 && (
        <ReviewStep
          selectedAddress={selectedAddress}
          delivery={delivery}
          payment={payment ?? "card"}
          isPlacingOrder={isInitiating || isPlacingOrder}  // covers both phases
          onBack={() => setStep(1)}
          onPlaceOrder={handleInitiatePayment}
          {...sidebarProps}
        />
      )}

      {flwConfig && (
        <FlutterwavePaymentTrigger
          config={flwConfig}
          onSuccess={(txId, txRef) => {
            setFlwConfig(null);
            handleConfirmOrder(txId, txRef);
          }}
          onClose={() => {
            setFlwConfig(null);
            setPendingOrderId(null);
            toast.error("Payment cancelled", "Your payment was not completed.");
          }}
        />
      )}
      </div>
    </div>
  );
}
