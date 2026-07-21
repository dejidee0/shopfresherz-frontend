"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

interface BestDealPromoCardProps {
  slug: string;
  name: string;
  image: string;
  /** Optional looping background video — falls back to `image` when absent. */
  videoUrl?: string;
  originalPrice: string;
  salePrice: string;
  description: string;
  badge: string;
}

/**
 * Full-width Best Deal promo card. Renders a background video when the promo
 * has one (muted/looped/playsInline for mobile autoplay), lazy-loaded via
 * IntersectionObserver so it never downloads until scrolled near, and falls
 * back to the static image both as the video's poster frame and entirely
 * when the user has prefers-reduced-motion set.
 */
export function BestDealPromoCard({
  slug,
  name,
  image,
  videoUrl,
  originalPrice,
  salePrice,
  description,
  badge,
}: BestDealPromoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const shouldRenderVideo = !!videoUrl && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldRenderVideo || isInView) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRenderVideo, isInView]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[340px] sm:min-h-[400px] md:min-h-[440px] overflow-hidden rounded-2xl bg-[#1A1A2E]"
    >
      {/* Poster image — always present, doubles as the video's poster frame while it loads */}
      <Image
        src={image}
        alt={name}
        fill
        sizes="100vw"
        className="object-cover object-center"
        unoptimized
      />

      {shouldRenderVideo && isInView && (
        <video
          src={videoUrl}
          poster={image}
          muted
          autoPlay
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[340px] sm:min-h-[400px] md:min-h-[440px] flex-col justify-end p-6 sm:p-8 md:p-10">
        {badge && (
          <span className="mb-3 inline-block w-fit rounded-full bg-[#F97316] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {badge}
          </span>
        )}
        <h3 className="max-w-md text-2xl sm:text-3xl font-bold leading-tight text-white">{name}</h3>
        {description && (
          <p className="mt-2 max-w-md line-clamp-2 text-sm text-white/70">{description}</p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-[#F97316]">{salePrice}</span>
          {originalPrice && (
            <span className="text-sm text-white/40 line-through">{originalPrice}</span>
          )}
        </div>
        <Link
          href={`/store/product/${slug}`}
          className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-lg bg-[#F97316] px-6 text-sm font-bold text-white transition-colors hover:bg-[#EA580C]"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
