"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheck, FiX } from "react-icons/fi";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { checkoutApi } from "@/lib/api/checkout";

interface PendingFlwOrder {
  pendingOrderId: string;
  orderNumber: string;
  txRef?: string;
  amount?: number;
}

type VerifyState = "verifying" | "failed" | "success";

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = useAuthStore((s) => s.accessToken);
  const clearCart = useCartStore((s) => s.clearCart);

  const status = params.get("status") ?? "";
  const txRef = params.get("tx_ref") ?? "";
  const transactionId = params.get("transaction_id") ?? "";

  const [state, setState] = useState<VerifyState>("verifying");
  const [errorMessage, setErrorMessage] = useState(
    "Payment was not completed.",
  );

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingFlwOrder");
    const pending: PendingFlwOrder | null = raw ? JSON.parse(raw) : null;

    const isSuccessful = status === "successful" || status === "completed";

    if (!isSuccessful) {
      setState("failed");
      setErrorMessage("Your payment was not completed.");
      return;
    }

    if (!pending || !token) {
      setState("failed");
      setErrorMessage(
        "We couldn't find your pending order. Please contact support.",
      );
      return;
    }

    (async () => {
      try {
        const result = await checkoutApi.confirmOrder(token, {
          pendingOrderId: pending.pendingOrderId,
          transactionId,
          txRef,
          status,
        });

        sessionStorage.removeItem("pendingFlwOrder");
        clearCart();
        setState("success");
        setTimeout(() => {
          router.push(
            `/store/checkout/success?order=${result.orderNumber}&method=Card&total=${pending.amount ?? ""}`,
          );
        }, 900);
      } catch {
        setState("failed");
        setErrorMessage(
          "Payment was received but your order could not be confirmed.",
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingTxRef = (() => {
    try {
      const raw = sessionStorage.getItem("pendingFlwOrder");
      const pending: PendingFlwOrder | null = raw ? JSON.parse(raw) : null;
      return txRef || pending?.txRef || "";
    } catch {
      return txRef;
    }
  })();

  return (
    <div className="bg-[#F5F2ED] min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-8 flex flex-col items-center text-center">
        {state === "verifying" && (
          <>
            <span
              role="status"
              aria-label="Verifying payment"
              className="inline-block rounded-full animate-spin border-4 border-[#F97316]/20 border-t-[#F97316]"
              style={{ width: 56, height: 56 }}
            />
            <p className="mt-5 text-[15px] font-medium text-[#111111]">
              Verifying your payment...
            </p>
            <p className="mt-1.5 text-sm text-[#666666]">
              Please don&apos;t close this page.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheck size={28} className="text-green-600" strokeWidth={2.5} />
            </div>
            <p className="mt-5 text-[15px] font-medium text-[#111111]">
              Payment verified
            </p>
            <p className="mt-1.5 text-sm text-[#666666]">
              Redirecting to your order confirmation…
            </p>
          </>
        )}

        {state === "failed" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <FiX size={28} className="text-red-600" strokeWidth={2.5} />
            </div>
            <h1 className="mt-5 text-lg font-bold text-[#111111]">
              Payment Verification Failed
            </h1>
            <p className="mt-1.5 text-sm text-[#666666] leading-relaxed">
              {errorMessage}
            </p>
            {pendingTxRef && (
              <p className="mt-3 text-xs text-[#999999]">
                Reference:{" "}
                <span className="font-mono text-[#666666]">
                  {pendingTxRef}
                </span>
                <br />
                Contact support with this reference if you were charged.
              </p>
            )}

            <div className="flex gap-3 mt-6 w-full">
              <button
                onClick={() => router.push("/store/checkout")}
                className="flex-1 h-11 rounded-[10px] bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/store")}
                className="flex-1 h-11 rounded-[10px] border border-[rgba(0,0,0,0.12)] text-[#666666] text-sm font-semibold hover:border-[#F97316] hover:text-[#F97316] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div className="bg-[#F5F2ED] min-h-screen" />}>
      <VerifyContent />
    </Suspense>
  );
}
