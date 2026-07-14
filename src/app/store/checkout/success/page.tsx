"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiCheck, FiTruck } from "react-icons/fi";
import { formatPrice } from "@/lib/utils/format";

function SuccessContent() {
  const params = useSearchParams();
  const order = params.get("order") ?? "";
  const method = params.get("method") ?? "Card";
  const total = Number(params.get("total") ?? 0);

  return (
    <div className="bg-[#F5F2ED] min-h-screen px-4 py-10 sm:py-16">
      <div className="max-w-[560px] mx-auto">
        {/* ── Animated success header ── */}
        <div className="flex flex-col items-center text-center">
          <div className="sf-success-circle">
            <FiCheck size={32} className="text-white" strokeWidth={3} />
          </div>

          <h1 className="text-[28px] font-bold text-[#111111] mt-4">
            Order Placed!
          </h1>

          {order && (
            <span className="mt-3 inline-flex items-center rounded-full bg-[#F97316] text-white text-sm font-bold px-4 py-1.5">
              Order #{order}
            </span>
          )}

          <p className="text-sm text-[#666666] mt-3">
            Thank you for shopping with ShopFresherz
          </p>
        </div>

        {/* ── Method-specific card ── */}
        {method === "Card" && (
          <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mt-6">
            <h2 className="text-base font-bold text-[#16A34A] flex items-center gap-2">
              <FiCheck size={18} /> Payment Confirmed
            </h2>
            <p className="text-sm text-[#666666] mt-2 leading-relaxed">
              Your payment was successful. Your order is being processed.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#111111]">
              <FiTruck size={16} className="text-[#F97316]" />
              <span>
                Estimated delivery: <strong>3-5 business days</strong>
              </span>
            </div>
            <Link
              href="/account/orders"
              className="mt-5 w-full h-11 rounded-[10px] border border-[#F97316] text-[#F97316] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#FFF8F3] transition-colors"
            >
              Track Order
            </Link>
          </div>
        )}

        {method === "PayOnDelivery" && (
          <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mt-6">
            <h2 className="text-base font-bold text-[#2563EB] flex items-center gap-2">
              🚚 Order Confirmed
            </h2>

            <ol className="mt-4 flex flex-col gap-3">
              {[
                "We'll call you within 2 hours to confirm delivery details",
                "Your order will arrive in 3-5 business days",
                `Have ${formatPrice(total)} ready when our rider arrives`,
                "You'll receive an SMS when your order is out for delivery",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#111111]">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-[12px] bg-[#EFF6FF] p-4">
              <p className="text-xs text-[#666666]">Amount to pay</p>
              <p className="text-2xl font-extrabold text-[#2563EB]">
                {formatPrice(total)}
              </p>
            </div>
          </div>
        )}

        {/* ── Bottom actions ── */}
        <div className="flex gap-3 mt-6">
          <Link
            href="/account/orders"
            className="flex-1 h-12 rounded-[10px] border border-[#F97316] text-[#F97316] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#FFF8F3] transition-colors"
          >
            Track My Order
          </Link>
          <Link
            href="/store"
            className="flex-1 h-12 rounded-[10px] bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Continue Shopping <FiArrowRight size={15} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .sf-success-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: sf-success-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes sf-success-bounce {
          0% {
            transform: scale(0);
          }
          60% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="bg-[#F5F2ED] min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
