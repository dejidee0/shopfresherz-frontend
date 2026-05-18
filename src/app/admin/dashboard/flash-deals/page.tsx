"use client";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { FaPen, FaPlay, FaRegClock, FaRegTrashAlt } from "react-icons/fa";
import { MdImportantDevices, MdOutlineEditCalendar } from "react-icons/md";
import { CiPause1 } from "react-icons/ci";
import AddFlashDealModal from "@/components/admin/AddFlashDealModal";
import { useFlashDeals, useToggleFlashDeal, useDeleteFlashDeal } from "@/lib/hooks/useAdmin";
import { Spinner } from "@/components/ui/Spinner";

const AdminFlashDealsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const { data: flashDeals, isLoading } = useFlashDeals();
  const toggleFlashDealMutation = useToggleFlashDeal();
  const deleteFlashDealMutation = useDeleteFlashDeal();
  const handleEditDeal = (deal: any) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleToggleDeal = (dealId: string, currentStatus: boolean) => {
    toggleFlashDealMutation.mutate({ id: dealId, isActive: !currentStatus });
  };

  const handleDeleteDeal = (dealId: string) => {
    if (confirm('Are you sure you want to delete this flash deal?')) {
      deleteFlashDealMutation.mutate(dealId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between md:items-center">
        <div className="mb-6 flex flex-col gap-3">
          <p className="font-bold">Flash Deals Details</p>
          <p className="text-xs text-text-muted">
            {isLoading ? 'Loading flash deals...' : `${flashDeals?.length || 0} active flash deals • Manage time-limited offers`}
          </p>
        </div>

        <Button onClick={()=> setIsModalOpen(true)} className="rounded-md cursor-pointer text-xs md:text-sm">Create Deals</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full text-center py-8"><Spinner/></div>
        ) : flashDeals && flashDeals.length > 0 ? (
          flashDeals.map((deal) => {
            const progress = deal.maxQuantity > 0 ? (deal.soldQuantity / deal.maxQuantity) * 100 : 0;
            const startDate = new Date(deal.startsAt).toLocaleDateString();
            const endDate = new Date(deal.endsAt).toLocaleDateString();
            const isActive = deal.isLive;

            return (
              <div key={deal.id} className="flex flex-col rounded-md">
                {deal.productImageUrl ? (
                  <img src={deal.productImageUrl} alt="product-image" className="w-full h-50 object-cover rounded-t-md" />
                ) : (
                  <div className="h-50 flex items-center justify-center bg-gray-200 rounded-t-md">
                    <MdImportantDevices className="text-text-muted text-8xl" />
                  </div>
                )}
                <div className="flex flex-col gap-4 p-3">
                  <p className="text-lg font-semibold">{deal.productName}</p>
                  <div className="flex items-end gap-3">
                    <p className="text-xl text-primary">₦{deal.salePrice.toLocaleString()}</p>{" "}
                    <p className="text-sm text-text-muted line-through">
                      ₦{deal.originalPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p className="text-xs text-text-muted">{deal.soldQuantity} SOLD</p>{" "}
                      <p className="text-xs text-text-muted">{deal.maxQuantity} MAX</p>
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
                      {startDate} - {endDate}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="flex flex-1 rounded-md"
                      onClick={() => handleToggleDeal(deal.id, isActive)}
                    >
                      {isActive ? (
                        <div className="flex items-center justify-center gap-3">
                          <CiPause1 /> <p>Pause</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <FaPlay /> <p>Resume</p>
                        </div>
                      )}
                    </Button>

                    {/* Action Buttons */}
                    <button className="cursor-pointer" onClick={() => handleEditDeal(deal)}>
                      <FaPen />
                    </button>
                    <button className="cursor-pointer" onClick={() => handleDeleteDeal(deal.id)}>
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-text-muted">No flash deals found</div>
        )}
      </div>

      {isModalOpen && (
        <AddFlashDealModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingDeal={editingDeal}
        />
      )}
    </div>
  );
};

export default AdminFlashDealsPage;
