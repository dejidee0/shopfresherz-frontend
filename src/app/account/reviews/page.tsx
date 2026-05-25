"use client";

import { Button } from "@/components/ui/Button";
import ReviewStars from "@/components/ui/ReviewStars";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import {
  accountApi,
  type AccountOrderItem,
  type ProductReview,
} from "@/lib/api/account";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/toast";
import { useEffect, useState } from "react";
import { MdImportantDevices } from "react-icons/md";

type ReviewStatus = "pending" | "submitted";

interface PurchasedProduct {
  productId: string;
  name: string;
  imageUrl?: string;
  slug?: string;
}

type SubmittedReview = ProductReview & {
  productId: string;
  productName: string;
};

interface ReviewForm {
  rating: number;
  title: string;
  body: string;
}

const emptyReviewForm: ReviewForm = {
  rating: 5,
  title: "",
  body: "",
};

export default function AccountReviewsPage() {
  const { accessToken } = useAuthStore();
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("pending");
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [reviews, setReviews] = useState<SubmittedReview[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PurchasedProduct | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewForm>(emptyReviewForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const token = accessToken;

    async function loadReviewsContext() {
      await Promise.resolve();
      if (!isMounted) return;

      setIsLoading(true);
      setError("");

      try {
        const [profile, orders] = await Promise.all([
          accountApi.getProfile(token),
          accountApi.getOrders(token, 1, 50),
        ]);

        const purchasedProducts = uniqueProducts(
          orders.items
            .filter((order) => order.status === "Delivered")
            .flatMap((order) => order.items)
        );

        const reviewResults = await Promise.allSettled(
          purchasedProducts.map(async (product) => ({
            product,
            reviews: await accountApi.getProductReviews(product.productId, {
              page: 1,
              pageSize: 100,
            }),
          }))
        );

        const submittedReviews = reviewResults.flatMap((result) =>
          result.status === "fulfilled"
            ? result.value.reviews.items
                .filter((review) => review.userId === profile.id)
                .map((review) => ({
                  ...review,
                  productId: result.value.product.productId,
                  productName: result.value.product.name,
                }))
            : []
        );
        const reviewedProductIds = new Set(
          submittedReviews.map((review) => review.productId)
        );

        if (!isMounted) return;

        setPurchases(
          purchasedProducts.filter((product) => !reviewedProductIds.has(product.productId))
        );
        setReviews(submittedReviews);
      } catch {
        if (isMounted) setError("Failed to load your reviews.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReviewsContext();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  function openReviewModal(product: PurchasedProduct) {
    setSelectedProduct(product);
    setReviewForm(emptyReviewForm);
  }

  function closeReviewModal() {
    setSelectedProduct(null);
    setReviewForm(emptyReviewForm);
  }

  async function submitReview() {
    if (!accessToken || !selectedProduct) return;
    if (!reviewForm.title.trim() || !reviewForm.body.trim()) {
      setError("Please add a review title and comment.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await accountApi.createReview(accessToken, {
        productId: selectedProduct.productId,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        body: reviewForm.body.trim(),
      });

      setPurchases((prev) =>
        prev.filter((product) => product.productId !== selectedProduct.productId)
      );
      setReviews((prev) => [
        {
          id: `local-${selectedProduct.productId}`,
          productId: selectedProduct.productId,
          productName: selectedProduct.name,
          userId: "",
          reviewerName: "You",
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          body: reviewForm.body.trim(),
          isVerifiedPurchase: true,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      closeReviewModal();
      setReviewStatus("submitted");
      toast.success("Review submitted successfully");
    } catch {
      toast.error("Failed to submit review", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AccountLayout
      breadcrumbItems={[{ label: "Reviews", href: "/account/reviews" }]}
    >
      <div className="flex flex-col gap-6 lg:w-[70%]">
        <div>
          <p className="text-2xl font-semibold">My Reviews</p>
          <p className="text-xs text-gray-500">
            Share your experience with products
          </p>
        </div>

        <div className="flex gap-2 items-center rounded-full bg-border p-1 w-fit">
          <button
            type="button"
            onClick={() => setReviewStatus("pending")}
            className={`text-sm px-4 cursor-pointer p-2 rounded-full ${
              reviewStatus === "pending" ? "font-semibold bg-white" : ""
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setReviewStatus("submitted")}
            className={`text-sm px-4 cursor-pointer p-2 rounded-full ${
              reviewStatus === "submitted" ? "font-semibold bg-white" : ""
            }`}
          >
            Submitted
          </button>
        </div>

        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="rounded-md border border-border bg-white px-4 py-8 text-center text-sm text-text-muted">
            Loading reviews...
          </p>
        )}

        {!isLoading && reviewStatus === "pending" && (
          <div className="flex flex-col gap-3">
            {purchases.length === 0 ? (
              <EmptyState text="No purchased products are awaiting review." />
            ) : (
              purchases.map((product) => (
                <ProductReviewPrompt
                  key={product.productId}
                  product={product}
                  onWriteReview={() => openReviewModal(product)}
                />
              ))
            )}
          </div>
        )}

        {!isLoading && reviewStatus === "submitted" && (
          <div className="flex flex-col gap-3">
            {reviews.length === 0 ? (
              <EmptyState text="You have not submitted any reviews yet." />
            ) : (
              reviews.map((review) => (
                <SubmittedReviewCard
                  key={review.id}
                  review={review}
                />
              ))
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          form={reviewForm}
          isSubmitting={isSubmitting}
          onChange={setReviewForm}
          onClose={closeReviewModal}
          onSubmit={submitReview}
        />
      )}
    </AccountLayout>
  );
}

function uniqueProducts(items: AccountOrderItem[]) {
  const seen = new Map<string, PurchasedProduct>();

  items.forEach((item) => {
    if (seen.has(item.productId)) return;
    seen.set(item.productId, {
      productId: item.productId,
      name: item.productSnapshot.name,
      imageUrl: item.productSnapshot.imageUrl,
      slug: item.productSnapshot.slug,
    });
  });

  return Array.from(seen.values());
}

function ProductReviewPrompt({
  product,
  onWriteReview,
}: {
  product: PurchasedProduct;
  onWriteReview: () => void;
}) {
  return (
    <div className="p-4 border border-border bg-white flex flex-col gap-3 md:gap-0 md:flex-row justify-between">
      <div className="flex items-center gap-3">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-12 w-12 rounded object-cover bg-gray-50"
          />
        ) : (
          <MdImportantDevices className="text-4xl text-text-muted" />
        )}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">{product.name}</p>
          <p className="text-sm text-text-muted">Awaiting your review</p>
        </div>
      </div>
      <Button className="text-xs" onClick={onWriteReview}>
        WRITE REVIEW
      </Button>
    </div>
  );
}

function SubmittedReviewCard({
  review,
}: {
  review: SubmittedReview;
}) {
  return (
    <div className="p-4 border border-border bg-white flex flex-col gap-3 md:gap-0 md:flex-row items-start justify-between">
      <div className="flex items-start gap-3">
        <MdImportantDevices className="text-4xl text-text-muted shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{review.productName}</p>
          <ReviewStars rating={review.rating} size={14} />
          <p className="text-xs text-text-muted">
            {new Date(review.createdAt).toLocaleDateString("en-NG")}
            {review.isVerifiedPurchase ? " · Verified purchase" : ""}
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-sm">{review.title || "Untitled Review"}</p>
            <p className="text-sm text-text-muted">{review.body}</p>
          </div>
        </div>
      </div>
      <Button className="text-xs" disabled title="Review editing needs a backend endpoint">
        EDIT REVIEW
      </Button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-md border border-border bg-white px-4 py-8 text-center text-sm text-text-muted">
      {text}
    </p>
  );
}

function ReviewModal({
  product,
  form,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: {
  product: PurchasedProduct;
  form: ReviewForm;
  isSubmitting: boolean;
  onChange: (form: ReviewForm) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-lg rounded bg-white p-5 shadow-xl">
        <div className="mb-4">
          <p className="text-lg font-semibold">Write Review</p>
          <p className="text-sm text-text-muted">{product.name}</p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Rating</span>
            <select
              value={form.rating}
              onChange={(e) =>
                onChange({ ...form, rating: Number(e.target.value) })
              }
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Review</span>
            <textarea
              value={form.body}
              rows={4}
              onChange={(e) => onChange({ ...form, body: e.target.value })}
              className="resize-none rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} isLoading={isSubmitting}>
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
