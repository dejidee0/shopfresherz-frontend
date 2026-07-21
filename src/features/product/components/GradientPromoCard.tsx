"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/format";

/**
 * Shared premium promo-card treatment: real product photo as background
 * (darkened for legibility) instead of a flat gradient, a proper icon in a
 * soft pill badge instead of an emoji, and a refined type hierarchy.
 * Used by both StorePromoSection and LaptopPromoSection so the "two-card
 * gradient" pattern looks consistent wherever it appears on the homepage.
 */
export function GradientPromoCard({
  icon,
  eyebrow,
  title,
  subtitle,
  price,
  ctaText,
  href,
  imageUrl,
  accent,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional price line shown above the CTA, e.g. "From ₦2,750,000" */
  price?: string;
  ctaText: string;
  href: string;
  imageUrl?: string;
  accent: "orange" | "dark";
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[220px] sm:min-h-[240px] items-end overflow-hidden rounded-[20px] p-6 sm:p-8"
    >
      {/* Real product photo background, or a considered gradient fallback if none */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.12]"
          unoptimized
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0",
            accent === "orange"
              ? "bg-[radial-gradient(120%_100%_at_100%_0%,#F97316_0%,#EA580C_45%,#7C2D12_100%)]"
              : "bg-[radial-gradient(120%_100%_at_100%_0%,#2D3561_0%,#1A1A2E_55%,#0A0A14_100%)]",
          )}
        />
      )}

      {/* Darkening gradient for text legibility over the photo */}
      <div
        className={cn(
          "absolute inset-0",
          accent === "orange"
            ? "bg-gradient-to-t from-[#3D1204]/95 via-[#7C2D12]/60 to-[#F97316]/10"
            : "bg-gradient-to-t from-black/95 via-black/65 to-black/15",
        )}
      />

      {/* Soft depth glow, brand accent only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full blur-3xl opacity-40"
        style={{ background: accent === "orange" ? "#FDBA74" : "#60A5FA" }}
      />

      <div className="relative z-10 max-w-[85%] sm:max-w-[75%]">
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
            {icon}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">
            {eyebrow}
          </span>
        </div>

        <h2 className="whitespace-pre-line text-[22px] sm:text-[26px] font-bold leading-[1.15] tracking-tight text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/75">
            {subtitle}
          </p>
        )}

        {price && (
          <p
            className={cn(
              "mt-2 text-[18px] font-bold",
              accent === "orange" ? "text-white" : "text-[#60A5FA]",
            )}
          >
            {price}
          </p>
        )}

        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
          {ctaText}
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </span>
      </div>
    </Link>
  );
}
