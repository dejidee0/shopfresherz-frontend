"use client"
import AddAddressModal from "@/components/account/AddAddressModal";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const addressArray = [
  {
    id: "1",
    userName: "Mfoniso",
    title: "Home Address",
    address:
      "East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh",
    phone: " +1-202-555-0118",
    email: " kevin.gilbert@gmail.com",
    default: true,
  },
  {
    id: "2",
    userName: "Mfoniso",
    title: "Office",
    address: "Plot 42 Admiralty Way Lekki Phase 1",
    phone: " +1-202-555-0118",
    email: " kevin.gilbert@gmail.com",
    default: false,
  },
];

export default function AccountAddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <AccountLayout
      breadcrumbItems={[{ label: "Addresses", href: "/account/addresses" }]}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:gap-0 md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold">My Addresses</p>
            <p className="text-gray-500 text-sm">
              Manage your delivery addresses
            </p>
          </div>
          <Button onClick={()=> setIsModalOpen(true)}>Add Address</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addressArray.map((add) => (
            <div key={add.id} className="flex flex-col border border-border">
                {/* CARD HEAD ER */}
              <div className="p-2 border-b border-border flex justify-between">
                <div className="flex gap-2">
                  <p className="font-semibold">{add.title}</p>
                  {add.default === true && (
                    <p className="bg-primary rounded-md flex items-center gap-1 text-white text-xs px-1">
                      <FaCheck />
                      Default
                    </p>
                  )} 
                </div>
                <button>
                  <FaRegTrashAlt className="text-red-500" />
                </button>
              </div>

                {/* CARD BODY */}
              <div className="p-2 flex flex-col gap-2">
                  <p className="font-semibold">{add.userName}</p>
                  <p className="text-gray-500 text-xs">{add.address}</p>
                  <p className="text-xs">phone number: <span className="text-gray-500">{add.phone}</span></p>
                  <p className="text-xs">Email: <span className="text-gray-500">{add.email}</span></p>
                  <Button variant="secondary">Edit Address</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {
        isModalOpen && <AddAddressModal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}/>
      }
    </AccountLayout>
  );
}
