"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { useToastStore, type Toast, type ToastType } from "@/store/toast";
import { cn } from "@/lib/utils/format";

// ─── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_DURATION = 4000;

const TYPE_CONFIG: Record<
  ToastType,
  {
    icon: React.ElementType;
    bar: string;
    iconClass: string;
    bg: string;
    border: string;
  }
> = {
  success: {
    icon: FiCheckCircle,
    bar: "bg-[#22C55E]",
    iconClass: "text-[#22C55E]",
    bg: "bg-white",
    border: "border-[#22C55E]/20",
  },
  error: {
    icon: FiXCircle,
    bar: "bg-[#EF4444]",
    iconClass: "text-[#EF4444]",
    bg: "bg-white",
    border: "border-[#EF4444]/20",
  },
  warning: {
    icon: FiAlertTriangle,
    bar: "bg-[#F59E0B]",
    iconClass: "text-[#F59E0B]",
    bg: "bg-white",
    border: "border-[#F59E0B]/20",
  },
  info: {
    icon: FiInfo,
    bar: "bg-[#F5820A]",
    iconClass: "text-[#F5820A]",
    bg: "bg-white",
    border: "border-[#F5820A]/20",
  },
};

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const config = TYPE_CONFIG[toast.type];
  const Icon = config.icon;
  const duration = toast.duration ?? DEFAULT_DURATION;

  // Auto-dismiss timer
  useEffect(() => {
    if (duration === 0) return; // persistent toast
    const timer = setTimeout(() => dismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, dismiss]);

  // Progress bar ref
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (duration === 0 || !barRef.current) return;
    // Trigger CSS animation from 100% → 0%
    barRef.current.style.transition = `width ${duration}ms linear`;
    barRef.current.style.width = "0%";
  }, [duration]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "relative flex items-start gap-3 w-90 rounded-card border shadow-lg overflow-hidden px-4 py-3.5",
        "animate-in slide-in-from-right-4 duration-300",
        config.bg,
        config.border,
      )}
    >
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.bar)} />

      {/* Icon */}
      <Icon size={18} className={cn("shrink-0 mt-0.5", config.iconClass)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#111111] leading-snug">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => dismiss(toast.id)}
        className="shrink-0 w-5 h-5 flex items-center justify-center text-[#9CA3AF] hover:text-[#111111] transition-colors mt-0.5"
        aria-label="Dismiss"
      >
        <FiX size={13} />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F5F5]">
          <div
            ref={barRef}
            className={cn("h-full w-full", config.bar, "opacity-40")}
          />
        </div>
      )}
    </div>
  );
}

// ─── Toaster — mount once in layout ──────────────────────────────────────────

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  // Portal into body so z-index is never clipped by a parent stacking context
  //if (typeof window === 'undefined') return null

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // nothing until client hydration

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-2 items-center pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
