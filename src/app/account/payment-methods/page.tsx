"use client"
import AddCardModal from "@/components/account/AddCardModal";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { PaymentCard } from "@/features/account/components/PaymentCard";
import { PaymentMethod } from "@/lib/api/account";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    last4: "0945",
    balance: 20000,
    currency: "NGN",
    cardholderName: "Okoro John",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "0945",
    balance: 20000,
    currency: "NGN",
    cardholderName: "Okoro John",
    isDefault: false,
  },
  {
    id: "3",
    type: "verve",
    last4: "0945",
    balance: 20000,
    currency: "NGN",
    cardholderName: "Okoro John",
    isDefault: false,
  },
];

export default function AccountAddressPage() {

  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleDeleteCard(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <AccountLayout
      breadcrumbItems={[
        { label: "Payment Methods", href: "/account/payment-methods" },
      ]}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col border border-border w-full lg:w-[80%]">
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between p-4 border-b border-border">
            <p className="text-sm font-semibold text-gray-600">PAYMENTS OPTIONS</p>
            <button onClick={()=> setIsModalOpen(true)} className="text-primary text-sm cursor-pointer flex items-center gap-2"> Add Card <FaArrowRight/></button>
          </div>

          <div className="flex p-4 gap-4 flex-wrap scrollbar-hide pb-1">
              {paymentMethods.map((card) => (
                <PaymentCard
                  key={card.id}
                  card={card}
                  onDelete={handleDeleteCard}
                  onEdit={(id) => {
                    /* TODO: open edit modal */
                  }}
                />
              ))}
              {paymentMethods.length === 0 && !isLoading && (
                <p className="text-sm text-text-muted py-4">
                  No saved payment methods.
                </p>
              )}
            </div>
        </div>
      </div>
      {
        isModalOpen && <AddCardModal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}/>
      }
    </AccountLayout>
  );
}
