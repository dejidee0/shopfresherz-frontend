"use client";

import { useEffect, useRef } from "react";
import { TbLogout } from "react-icons/tb";

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  user?: {
    name: string;
    email: string;
  };
  /** Position the popover relative to a trigger element */
  anchorRef?: React.RefObject<HTMLElement>;
}

export default function OptionsModal({
  isOpen,
  onClose,
  onSignOut,
  user = { name: "Mfoniso Ibokette", email: "mfonisoibokette21@gmail.com" },
  anchorRef,
}: OptionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="User options"
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
      </div>

      {/* Actions */}
      <div className="py-1.5">
        <button
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 font-semibold hover:bg-red-50 transition-colors"
        >
          <TbLogout size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}