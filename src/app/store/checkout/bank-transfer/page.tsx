"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiCheck, FiCopy } from "react-icons/fi";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "@/store/toast";

const WHATSAPP_NUMBER_DISPLAY = "+234 907 530 8722";
const WHATSAPP_NUMBER_INTL = "2349075308722";

function BankTransferContent() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber") ?? "";
  const bankName = params.get("bankName") ?? "";
  const accountNumber = params.get("accountNumber") ?? "";
  const accountName = params.get("accountName") ?? "";
  const instructions = params.get("instructions") ?? "";
  const total = Number(params.get("total") ?? 0);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      toast.success("Account number copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy", "Please copy the account number manually.");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi ShopFresherz, I've made a bank transfer for order ${orderNumber}${
      total > 0 ? ` (${formatPrice(total)})` : ""
    }. Attached is my proof of payment.`,
  );

  return (
    <div className="bg-[#F5F2ED] min-h-screen px-4 py-10 sm:py-16">
      <div className="max-w-[560px] mx-auto">
        <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Checkmark animation — pure CSS, no library */}
          <div className="sf-check-ring">
            <svg viewBox="0 0 52 52" className="sf-check-svg">
              <circle className="sf-check-circle" cx="26" cy="26" r="24" fill="none" />
              <path className="sf-check-mark" fill="none" d="M14 27l7 7 17-17" />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] mt-5">
            Order Placed!
          </h1>
          <p className="text-sm text-[#666666] mt-1.5 max-w-xs">
            Your order will be confirmed as soon as we receive and verify your
            bank transfer.
          </p>

          {orderNumber && (
            <span className="mt-4 inline-flex items-center rounded-full bg-[#FFF1E6] text-[#F97316] text-sm font-bold px-4 py-1.5">
              {orderNumber}
            </span>
          )}

          {/* Bank details card */}
          <div className="w-full mt-6 rounded-[14px] border border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] p-5 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-3">
              Transfer to
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-[#888888]">Bank Name</p>
                <p className="text-sm font-semibold text-[#111111]">{bankName}</p>
              </div>

              <div>
                <p className="text-xs text-[#888888]">Account Number</p>
                <div className="flex items-center justify-between gap-3 mt-0.5">
                  <p className="text-2xl font-extrabold tracking-wide text-[#111111]">
                    {accountNumber}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] text-xs font-semibold transition-colors ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                    }`}
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#888888]">Account Name</p>
                <p className="text-sm font-semibold text-[#111111]">{accountName}</p>
              </div>

              {total > 0 && (
                <div className="pt-3 border-t border-[rgba(0,0,0,0.08)]">
                  <p className="text-xs text-[#888888]">Amount to Transfer</p>
                  <p className="text-lg font-bold text-[#F97316]">
                    {formatPrice(total)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {instructions && (
            <p className="text-xs text-[#666666] mt-4 leading-relaxed">
              {instructions}
            </p>
          )}

          <div className="w-full mt-6 rounded-[12px] border border-[rgba(37,211,102,0.25)] bg-[rgba(37,211,102,0.06)] p-4">
            <p className="text-[13px] text-[#111111] leading-relaxed">
              Send your proof of payment / screenshot to our WhatsApp:{" "}
              <span className="font-bold">{WHATSAPP_NUMBER_DISPLAY}</span>
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-3 h-12 rounded-[10px] bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Send Payment Proof on WhatsApp
          </a>

          <Link
            href="/"
            className="w-full mt-3 h-12 rounded-[10px] border border-[rgba(0,0,0,0.12)] text-sm font-semibold text-[#666666] hover:border-[#F97316] hover:text-[#F97316] flex items-center justify-center gap-2 transition-colors"
          >
            Continue Shopping <FiArrowRight size={15} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .sf-check-ring { width: 88px; height: 88px; }
        .sf-check-svg { width: 100%; height: 100%; }
        .sf-check-circle {
          stroke: #22c55e; stroke-width: 3; stroke-dasharray: 151; stroke-dashoffset: 151;
          animation: sf-draw-circle 0.5s ease-out forwards;
        }
        .sf-check-mark {
          stroke: #22c55e; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 36; stroke-dashoffset: 36;
          animation: sf-draw-check 0.35s 0.45s ease-out forwards;
        }
        @keyframes sf-draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes sf-draw-check  { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}

export default function BankTransferPage() {
  return (
    <Suspense fallback={<div className="bg-[#F5F2ED] min-h-screen" />}>
      <BankTransferContent />
    </Suspense>
  );
}
