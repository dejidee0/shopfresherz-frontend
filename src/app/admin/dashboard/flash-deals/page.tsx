"use client";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { FaPen, FaPlay, FaRegClock, FaRegTrashAlt } from "react-icons/fa";
import { MdImportantDevices, MdOutlineEditCalendar } from "react-icons/md";
import { CiPause1 } from "react-icons/ci";
import AddFlashDealModal from "@/components/admin/AddFlashDealModal";

const products = [
  {
    productId: "1",
    productName: "Sam Galaxy s24 Ultra",
    originalPrice: "₦1,200,000",
    salePrice: "₦799,000",
    startDate: "10/02/2026",
    endDate: "20/02/2026",
    soldQuantity: "5",
    maxQuantity: "20",
    status: "active",
    imgUrl: "",
  },
  {
    productId: "2",
    productName: "Sam Galaxy s24 Ultra",
    originalPrice: "₦1,200,000",
    salePrice: "₦799,000",
    startDate: "10/02/2026",
    endDate: "20/02/2026",
    soldQuantity: "15",
    maxQuantity: "20",
    status: "paused",
    imgUrl: "",
  },
  {
    productId: "3",
    productName: "Sam Galaxy s24 Ultra",
    originalPrice: "₦1,200,000",
    salePrice: "₦799,000",
    startDate: "10/02/2026",
    endDate: "20/02/2026",
    soldQuantity: "0",
    maxQuantity: "20",
    status: "scheduled",
    imgUrl: "",
  },
];

const AdminFlashDealsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-6">
      <div className="flex justify-between md:items-center">
        <div className="mb-6 flex flex-col gap-3">
          <p className="font-bold">Flash Deals Details</p>
          <p className="text-xs text-text-muted">Manage time-limited offers</p>
        </div>

        <Button onClick={()=> setIsModalOpen(true)} className="rounded-md cursor-pointer text-xs md:text-sm">Create Deals</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {products.map((product) => {
          const progress =
            (parseInt(product.soldQuantity) / parseInt(product.maxQuantity)) *
            100;
          return (
            <div key={product.productId} className="flex flex-col rounded-md">
              {product.imgUrl ? (
                <img src="" alt="product-image" />
              ) : (
                <div className="h-50 flex items-center justify-center bg-gray-200 rounded-t-md">
                  <MdImportantDevices className="text-text-muted text-8xl" />
                </div>
              )}
              <div className="flex flex-col gap-4 p-3">
                <p className="text-lg font-semibold">{product.productName}</p>
                <div className="flex items-end gap-3">
                  <p className="text-xl text-primary">{product.salePrice}</p>{" "}
                  <p className="text-sm text-text-muted line-through">
                    {product.originalPrice}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-xs text-text-muted">{product.soldQuantity} SOLD</p>{" "}
                    <p className="text-xs text-text-muted">{product.maxQuantity} MAX</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F97316] rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 text-text-muted text-xs">
                  <FaRegClock />{" "}
                  <p>
                    {product.startDate} - {product.endDate}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex flex-1 rounded-md">
                    {product.status === "active" ? (
                      <div className="flex items-center justify-center gap-3">
                        <CiPause1 /> <p>Pause</p>
                      </div>
                    ) : product.status === "paused" ? (
                      <div className="flex items-center justify-center gap-3">
                        <FaPlay /> <p>Resume</p>
                      </div>
                    ) : product.status === "scheduled" ? (
                      <div className="flex items-center justify-center gap-3">
                        <MdOutlineEditCalendar /> <p>Reschedule</p>
                      </div>
                    ) : (
                      ""
                    )}
                  </Button>

                  {/* Action Buttons */}
                  <button className="cursor-pointer">
                    <FaPen />
                  </button>
                  <button className="cursor-pointer">
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>

              {
                isModalOpen && <AddFlashDealModal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}/>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminFlashDealsPage;
