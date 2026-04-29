"use client";

import { useState } from "react";
import ReviewStars from "@/components/ui/ReviewStars";
import { HiFlag, HiOutlineFlag, HiPaperAirplane } from "react-icons/hi2";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = "Pending" | "Approved" | "Rejected" | "Flagged";

interface Review {
  id: string;
  product: string;
  rating: number;
  excerpt: string;
  fullText: string;
  author: string;
  initials: string;
  avatarColor: string;
  timeAgo: string;
  status: ReviewStatus;
  image?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    product: "Samsung Galaxy S24 Ultra",
    rating: 4,
    excerpt: "The display is absolutely stunning and the zoom capabilities of the camera are unmatched....",
    fullText: "The display is absolutely stunning and the zoom capabilities of the camera are unmatched. Battery life is solid and the S Pen integration is a massive bonus for productivity. Would recommend to anyone looking for a flagship Android experience.",
    author: "Chinwe Hezekiah",
    initials: "CH",
    avatarColor: "bg-orange-400",
    timeAgo: "2h ago",
    status: "Pending",
  },
  {
    id: "2",
    product: "Nike Air Max 90",
    rating: 5,
    excerpt: "Classic style that never goes out of fashion. Extremely comfortable for daily wear. The build...",
    fullText: "Classic style that never goes out of fashion. Extremely comfortable for daily wear. The build quality is exceptional and the cushioning feels like walking on air. I've been wearing Air Max for years, but this particular model feels more durable than previous iterations. Highly recommend for both casual use and light gym sessions.",
    author: "Emeka Nwosu",
    initials: "EN",
    avatarColor: "bg-teal-500",
    timeAgo: "5h ago",
    status: "Pending",
  },
  {
    id: "3",
    product: "Sony WH-1000XM5",
    rating: 5,
    excerpt: "Best noise cancelling headphones I've ever used. The sound quality is incredible...",
    fullText: "Best noise cancelling headphones I've ever used. The sound quality is incredible and the ANC completely blocks out ambient noise. Perfect for long flights and open offices. Battery lasts all day. Highly recommended.",
    author: "Tunde Adeyemi",
    initials: "TA",
    avatarColor: "bg-blue-500",
    timeAgo: "1d ago",
    status: "Approved",
  },
  {
    id: "4",
    product: "Anker PowerCore 26800",
    rating: 2,
    excerpt: "Stopped charging after two weeks. Customer service was unhelpful...",
    fullText: "Stopped charging after two weeks. Customer service was unhelpful when I tried to get a replacement. Very disappointed given the price point. Would not recommend.",
    author: "Ngozi Obi",
    initials: "NO",
    avatarColor: "bg-purple-500",
    timeAgo: "2d ago",
    status: "Rejected",
  },
  {
    id: "5",
    product: "Generic USB Hub",
    rating: 1,
    excerpt: "This is a scam product. The seller sent a completely different item...",
    fullText: "This is a scam product. The seller sent a completely different item than what was shown. The listing is misleading and the product is dangerous — it overheated within minutes. AVOID.",
    author: "Unknown User",
    initials: "UU",
    avatarColor: "bg-red-400",
    timeAgo: "3d ago",
    status: "Flagged",
  },
];

const TABS: ReviewStatus[] = ["Pending", "Approved", "Rejected", "Flagged"];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = "sm" }: { initials: string; color: string; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-10 h-10 text-sm" : "w-7 h-7 text-xs";
  return (
    <div className={`${dim} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Review List Card ─────────────────────────────────────────────────────────

function ReviewCard({
  review,
  isSelected,
  onClick,
}: {
  review: Review;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
        isSelected
          ? "border-[#F97316] bg-orange-50/60 shadow-sm"
          : "border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-sm font-semibold ${isSelected ? "text-[#F97316]" : "text-gray-800"}`}>
          {review.product}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{review.timeAgo}</span>
      </div>
      <ReviewStars rating={review.rating} size={14} />
      <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{review.excerpt}</p>
      <div className="flex items-center gap-2 mt-3">
        <Avatar initials={review.initials} color={review.avatarColor} />
        <span className="text-xs text-gray-500">By {review.author}</span>
      </div>
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function ReviewDetail({
  review,
  onApprove,
  onReject,
  onFlag,
  rejectReason,
  setRejectReason,
  response,
  setResponse,
  onPostResponse,
}: {
  review: Review;
  onApprove: () => void;
  onReject: () => void;
  onFlag: () => void;
  rejectReason: string;
  setRejectReason: (v: string) => void;
  response: string;
  setResponse: (v: string) => void;
  onPostResponse: () => void;
}) {
  const statusStyles: Record<ReviewStatus, string> = {
    Pending: "bg-orange-50 text-orange-500 border border-orange-200",
    Approved: "bg-green-50 text-green-600 border border-green-200",
    Rejected: "bg-red-50 text-red-500 border border-red-200",
    Flagged: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${statusStyles[review.status]}`}>
            {review.status} Review
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{review.product}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <ReviewStars rating={review.rating} size={18} />
            <span className="text-sm text-gray-500">By {review.author}</span>
          </div>
        </div>
        {/* Product image placeholder */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#E5E7EB" />
            <circle cx="8.5" cy="8.5" r="2" fill="#9CA3AF" />
            <path d="M3 15l5-4 4 3 3-2.5 6 5.5" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>

      {/* Review body */}
      <blockquote className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border-l-4 border-[#F97316] italic">
        "{review.fullText}"
      </blockquote>

      {/* Action buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onApprove}
          className="flex-1 min-w-30 py-2.5 px-5 bg-[#F97316] text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200"
        >
          Approve Review
        </button>
        <button
          onClick={onReject}
          className="flex-1 min-w-30 py-2.5 px-5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={onFlag}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors"
          aria-label="Flag review"
        >
          <HiOutlineFlag size={18} />
        </button>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Reject reason */}
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Reject Reason (Internal Only)
        </label>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Optional reason for rejection..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all resize-none"
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* Respond as ShopFresherz */}
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Respond as ShopFresherz
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your response to the customer..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] transition-all resize-none"
        />
      </div>

      {/* Post response */}
      <button
        onClick={onPostResponse}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F97316] text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200"
      >
        <HiPaperAirplane size={16} />
        Post Response
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: ReviewStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
        <HiFlag size={24} className="text-orange-300" />
      </div>
      <p className="text-gray-500 font-medium">No {tab} reviews</p>
      <p className="text-gray-400 text-sm mt-1">
        {tab === "Pending" ? "All reviews have been moderated." : `No reviews have been ${tab.toLowerCase()} yet.`}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardReviewsPage() {
  const [activeTab, setActiveTab] = useState<ReviewStatus>("Pending");
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [selectedId, setSelectedId] = useState<string>("2");
  const [rejectReason, setRejectReason] = useState("");
  const [response, setResponse] = useState("");

  const filtered = reviews.filter((r) => r.status === activeTab);
  const selected = reviews.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  const tabCount = (tab: ReviewStatus) => reviews.filter((r) => r.status === tab).length;

  const updateStatus = (id: string, status: ReviewStatus) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    // After status change, jump to next review in current tab if possible
    const remaining = reviews.filter((r) => r.status === activeTab && r.id !== id);
    setSelectedId(remaining[0]?.id ?? "");
  };

  const handlePostResponse = () => {
    if (!response.trim()) return;
    setResponse("");
    // In production: call API to save response
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Shopfresherz Reviews</h2>
        <p className="text-sm text-gray-400 mt-0.5">Moderate customer reviews</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {TABS.map((tab) => {
          const count = tabCount(tab);
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                const first = reviews.find((r) => r.status === tab);
                setSelectedId(first?.id ?? "");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                isActive
                  ? "bg-[#F97316] text-white border-[#F97316] shadow-sm shadow-orange-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-[#F97316]"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`ml-1.5 text-xs font-bold ${isActive ? "text-orange-100" : "text-gray-400"}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        {/* Left — review list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">
              No {activeTab.toLowerCase()} reviews.
            </div>
          ) : (
            filtered.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isSelected={selected?.id === review.id}
                onClick={() => setSelectedId(review.id)}
              />
            ))
          )}
        </div>

        {/* Right — detail panel */}
        <div>
          {selected && selected.status === activeTab ? (
            <ReviewDetail
              review={selected}
              rejectReason={rejectReason}
              setRejectReason={setRejectReason}
              response={response}
              setResponse={setResponse}
              onApprove={() => updateStatus(selected.id, "Approved")}
              onReject={() => updateStatus(selected.id, "Rejected")}
              onFlag={() => updateStatus(selected.id, "Flagged")}
              onPostResponse={handlePostResponse}
            />
          ) : (
            <EmptyState tab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}