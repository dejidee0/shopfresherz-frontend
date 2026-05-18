"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HiCheck, HiBellSlash } from "react-icons/hi2";
import { adminApi, type AdminNotificationDto } from "@/lib/api/admin";
import { useAuthStore } from "@/store/auth";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="px-5 py-4 space-y-2 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-10" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-48" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsModal({
  isOpen,
  onClose,
  onViewAll,
  anchorRef,
}: NotificationsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // const { data: session } = useSession();
  // const token = (session as any)?.accessToken as string | undefined;
  const { accessToken: token } = useAuthStore()

  const [notifications, setNotifications] = useState<AdminNotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getNotifications(token, {
        page: 1,
        pageSize: 20,
      });
      setNotifications(res.items);
      setUnreadCount(res.unreadCount);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch whenever the modal opens
  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const markOneRead = async (id: string) => {
    if (!token) return;
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await adminApi.markNotificationRead(token, id);
    } catch {
      // Roll back on failure
      fetchNotifications();
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await adminApi.markAllNotificationsRead(token);
    } catch {
      fetchNotifications();
    }
  };

  // ── Close handlers ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !anchorRef?.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/10 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && !loading && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:text-orange-600 transition-colors"
          >
            <HiCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100 max-h-90 overflow-y-auto">
        {loading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : error ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-3 text-xs font-semibold text-[#F97316] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <HiBellSlash size={18} className="text-orange-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
            <p className="text-xs text-gray-400">No new notifications right now.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                if (!n.isRead) markOneRead(n.id);
                if (n.linkUrl) window.location.href = n.linkUrl;
              }}
              className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      n.isRead
                        ? "font-medium text-gray-600"
                        : "font-bold text-gray-900"
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {timeAgo(n.createdAt)}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-opacity duration-200 ${
                      n.isRead ? "opacity-0" : "bg-[#F97316] opacity-100"
                    }`}
                  />
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-orange-50/60">
        <button
          onClick={() => {
            onViewAll?.();
            onClose();
          }}
          className="w-full py-3.5 text-sm font-semibold text-gray-600 hover:text-[#F97316] transition-colors"
        >
          View all activity
        </button>
      </div>
    </div>
  );
}