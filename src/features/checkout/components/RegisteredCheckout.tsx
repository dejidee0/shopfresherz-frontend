"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronRight,
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiPlus,
} from "react-icons/fi";
import { OrderSummary, CheckoutLayout } from "./CheckoutShared";
import type {
  CouponState,
  DeliveryMethod,
  PaymentMethod,
} from "../types/checkout";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { toast } from "@/store/toast";
import { formatPrice } from "@/lib/utils/format";
import type {
  Address,
  CreateAddressRequest,
  PaymentMethod as SavedCard,
} from "@/lib/api/account";
import AddAddressModal from "@/components/account/AddAddressModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DELIVERY_LABELS: Record<string, string> = {
  standard: "Standard Delivery",
  express: "Express Delivery",
  pickup: "Store Pickup",
};

// Infer card brand from first digit
function cardBrandLabel(card: SavedCard): string {
  if (card.cardType) return card.cardType;
  // const first = card.last4?.[0] ?? ''
  // if (first === '4') return 'Visa'
  // if (first === '5') return 'Mastercard'
  return "Card";
}

function maskNumber(last4?: string) {
  return last4 ? `•••• •••• •••• ${last4}` : "•••• •••• •••• ••••";
}

// ─── SummarySection ───────────────────────────────────────────────────────────

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] p-5 sm:p-6 mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {title.toLowerCase().includes("delivery") ? (
            <FiTruck size={15} className="text-[#F97316] shrink-0" />
          ) : (
            <FiCheckCircle size={15} className="text-[#F97316] shrink-0" />
          )}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
            {title}
          </p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-[#F97316] font-medium hover:underline flex items-center gap-0.5"
          >
            Change <FiChevronRight size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  coupon: CouponState;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon?: () => void;
  deliveryFee: number;
  delivery?: DeliveryMethod;
  // Address
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddAddress: (data: CreateAddressRequest) => Promise<void>;
  // Payment
  savedCards: SavedCard[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  selectedPayment: PaymentMethod | null;
  onSelectPayment: (m: PaymentMethod) => void;
  // Navigation
  onEditDelivery: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisteredCheckout({
  coupon,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  delivery = "standard",
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  savedCards,
  selectedCardId,
  onSelectCard,
  selectedPayment,
  onSelectPayment,
  onEditDelivery,
  onEditPayment,
  onPlaceOrder,
}: Props) {
  const { user } = useAuthStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const discountAmount = useCartStore((s) => s.discountAmount);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const total = taxableAmount + deliveryFee + taxableAmount * 0.075;

  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const visibleAddresses = showAllAddresses ? addresses : addresses.slice(0, 2);

  // Payment is ready if: a saved card is selected, or a non-card method is chosen
  // const paymentReady =
  //   (selectedPayment === "card" &&
  //     !!selectedCardId &&
  //     selectedAddressId !== null) ||
  //   (selectedPayment !== null &&
  //     selectedPayment !== "card" &&
  //     selectedAddressId !== null);

  const paymentReady = selectedAddressId !== null;

  const PAYMENT_METHOD_LABELS: Record<string, string> = {
    card: "Card",
    bank_transfer: "Bank Transfer",
    pay_on_delivery: "Pay on Delivery",
  };

  const handleAddAddress = async (data: CreateAddressRequest) => {
    setIsAddingAddress(true);

    try {
      await onAddAddress(data);
      setShowAllAddresses(true);
      setIsAddressModalOpen(false);
      toast.success("Address added successfully");
    } catch (error) {
      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Failed to add address.";
      toast.error("Address not added", message);
    } finally {
      setIsAddingAddress(false);
    }
  };

  return (
    <>
      <CheckoutLayout
        sidebar={
          <OrderSummary
            coupon={coupon}
            onCouponChange={onCouponChange}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            deliveryFee={deliveryFee}
          />
        }
      >
        <div className="flex flex-col gap-4">
          {/* ── Delivery Address ─────────────────────────────────────────────── */}
          <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiMapPin size={15} className="text-[#F97316] shrink-0" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                  DELIVERY ADDRESS
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {visibleAddresses.map((addr) => {
                const isSelected =
                  addr.id === (selectedAddressId ?? addresses[0]?.id);
                return (
                  <button
                    key={addr.id}
                    onClick={() => onSelectAddress(addr.id)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-[8px] border transition-all duration-150 ${
                      isSelected
                        ? "border-[#F97316] bg-[#FFF8F3] shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
                        : "border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] hover:border-[#F97316]/40 hover:bg-[#F2F2F2]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-[#F97316]" : "border-[rgba(0,0,0,0.15)]"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#111111]">
                          {user?.firstName} {user?.lastName}
                        </p>
                        {addr.label && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#EFEFEF] text-[#666666]">
                            {addr.label}
                          </span>
                        )}
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                        <br />
                        {addr.city}, {addr.state}
                        {addr.postalCode ? ` ${addr.postalCode}` : ""}, Nigeria
                      </p>
                    </div>
                  </button>
                );
              })}

              {addresses.length > 2 && (
                <button
                  onClick={() => setShowAllAddresses((v) => !v)}
                  className="text-xs text-[#F97316] font-medium hover:underline self-start ml-1 mt-1"
                >
                  {showAllAddresses
                    ? "Show less"
                    : `Show ${addresses.length - 2} more address${addresses.length - 2 > 1 ? "es" : ""}`}
                </button>
              )}

              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-[8px] border border-dashed border-[rgba(0,0,0,0.15)] px-4 py-3 text-[13px] text-[#888888] font-medium hover:border-[#F97316] hover:text-[#F97316] transition-colors"
              >
                <span className="w-4 h-4 rounded-full border border-dashed border-current flex items-center justify-center">
                  <FiPlus size={10} />
                </span>
                Add a new address
              </button>
            </div>
          </div>

          {/* ── Delivery Details ─────────────────────────────────────────────── */}
          <SummarySection title="Delivery Details" onEdit={onEditDelivery}>
            <div className="flex items-center gap-2">
              <FiTruck size={14} className="text-[#888888] shrink-0" />
              <p className="text-[14px] font-medium text-[#111111]">
                {DELIVERY_LABELS[delivery] ?? "Standard Delivery"}
              </p>
            </div>
            <p className="text-[13px] text-[#888888] mt-0.5 ml-5">
              {delivery === "pickup"
                ? "You will pick up your order from our store."
                : deliveryFee === 0
                  ? "Free delivery on this order."
                  : `Delivery fee: ${formatPrice(deliveryFee)}`}
            </p>
          </SummarySection>

          <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiCreditCard size={15} className="text-[#F97316] shrink-0" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                  PAYMENT METHOD
                </p>
              </div>
              <button
                onClick={onEditPayment}
                className="text-xs text-[#F97316] font-medium hover:underline flex items-center gap-0.5"
              >
                Change <FiChevronRight size={12} />
              </button>
            </div>

            <div className="grid gap-2">
              {savedCards.length > 0 ? (
                savedCards.map((card) => {
                  const isSelected = selectedPayment === "card" && selectedCardId === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => onSelectCard(card.id)}
                      className={`w-full flex items-center gap-3 rounded-[8px] border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-[1.5px] border-[#F97316] bg-[#FFF8F3] shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
                          : "border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] hover:border-[#F97316]/40 hover:bg-[#F2F2F2]"
                      }`}
                    >
                       <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#F97316]" : "border-[rgba(0,0,0,0.15)]"}`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#F97316]" />}
                      </span>
                      <FiCreditCard size={16} className="text-[#F97316]" />
                      <span className="flex flex-col">
                         <span className="text-sm font-medium text-[#111111]">{cardBrandLabel(card)}</span>
                        <span className="text-xs text-[#888888]">{maskNumber(card.cardNumber?.slice(-4))}</span>
                      </span>
                    </button>
                  );
                })
              ) : (
                <button
                  onClick={() => onSelectPayment("card")}
                  className={`w-full flex items-center gap-3 rounded-[8px] border px-4 py-3 text-left transition-colors ${
                    selectedPayment === "card"
                      ? "border-[1.5px] border-[#F97316] bg-[#FFF8F3] shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
                      : "border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] hover:border-[#F97316]/40 hover:bg-[#F2F2F2]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === "card" ? "border-[#F97316]" : "border-[rgba(0,0,0,0.15)]"}`}>
                    {selectedPayment === "card" && <span className="w-2 h-2 rounded-full bg-[#F97316]" />}
                  </span>
                  <FiCreditCard size={16} className="text-[#F97316]" />
                  <span className="text-sm font-medium text-[#111111]">Card</span>
                </button>
              )}

              {(["bank_transfer", "pay_on_delivery"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => onSelectPayment(method)}
                  className={`w-full flex items-center gap-3 rounded-[8px] border px-4 py-3 text-left transition-colors ${
                    selectedPayment === method
                      ? "border-[1.5px] border-[#F97316] bg-[#FFF8F3] shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
                      : "border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] hover:border-[#F97316]/40 hover:bg-[#F2F2F2]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === method ? "border-[#F97316]" : "border-[rgba(0,0,0,0.15)]"}`}>
                    {selectedPayment === method && <span className="w-2 h-2 rounded-full bg-[#F97316]" />}
                  </span>
                  <FiCreditCard size={16} className="text-[#F97316]" />
                  <span className="text-sm font-medium text-[#111111]">
                    {PAYMENT_METHOD_LABELS[method]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Place Order ──────────────────────────────────────────────────── */}
          {/* Spacer so sticky mobile button doesn't cover the last card */}
          <div className="h-20 lg:hidden" aria-hidden />
          <div className="fixed inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED] to-transparent lg:static lg:p-0 lg:bg-none">
            <button
              onClick={onPlaceOrder}
              disabled={!paymentReady}
              type="button"
              className={`w-full h-14 rounded-[14px] text-[16px] font-bold flex items-center justify-center gap-2 transition-colors ${
                paymentReady
                  ? "bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white cursor-pointer shadow-[0_8px_24px_rgba(249,115,22,0.3)]"
                  : "bg-[#E0E0E0] text-[#AAAAAA] cursor-not-allowed"
              }`}
            >
              PLACE ORDER — {formatPrice(total)} <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </CheckoutLayout>

      <AddAddressModal
        key={
          isAddressModalOpen
            ? "checkout-new-address"
            : "checkout-address-closed"
        }
        isOpen={isAddressModalOpen}
        isSubmitting={isAddingAddress}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddAddress}
      />
    </>
  );
}
