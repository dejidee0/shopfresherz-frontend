"use client";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { useState } from "react";
import { MdImportantDevices } from "react-icons/md";

const purchases = [
  {
    id: "1",
    title: "Headset",
    imgUrl: "",
  },
  {
    id: "2",
    title: "Headset 2",
    imgUrl: "",
  },
];

const reviews = [
  {
    id: "1",
    title: "Wonderful Product",
    productName: "Galaxy Buds 3",
    stars: "3.5",
    review: "Really good earbuds for the price. Battery life could be better.",
  },
];

export default function AccountReviewsPage() {
  const [reviewStatus, setReviewStatus] = useState("pending");
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
            onClick={() => setReviewStatus("pending")}
            className={`text-sm px-4 cursor-pointer p-2 rounded-full ${reviewStatus === "pending" && "font-semibold bg-white"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setReviewStatus("submitted")}
            className={`text-sm px-4 cursor-pointer p-2 rounded-full ${reviewStatus === "submitted" && "font-semibold bg-white"}`}
          >
            Submitted
          </button>
        </div>

        {reviewStatus === "pending"
          ? purchases.map((product) => (
              <div
                key={product.id}
                className="p-4 border border-border flex flex-col gap-3 md:gap-0 md:flex-row justify-between"
              >
                <div className="flex items-center gap-3">
                  <MdImportantDevices className="text-4xl text-text-muted" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-sm">{product.title}</p>
                    <p className="text-sm text-text-muted">
                      Awaiting your review
                    </p>
                  </div>
                </div>
                <Button className="text-xs">WRITE REVIEW</Button>
              </div>
            ))
          : reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 border border-border flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <MdImportantDevices className="text-4xl text-text-muted" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{rev.productName}</p>
                    <div className="text-primary">{rev.stars}</div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-sm">{rev.title}</p>
                      <p className="text-sm text-text-muted">{rev.review}</p>
                    </div>
                  </div>
                </div>
                <Button className="text-xs">EDIT REVIEW</Button>
              </div>
            ))}
      </div>
    </AccountLayout>
  );
}
