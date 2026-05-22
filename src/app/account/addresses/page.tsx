"use client";

import AddAddressModal, {
  type AddressFormData,
} from "@/components/account/AddAddressModal";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/features/account/components/AccountLayout";
import { accountApi, type Address } from "@/lib/api/account";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/toast";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export default function AccountAddressPage() {
  const { accessToken } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const token = accessToken;

    async function loadAddresses() {
      await Promise.resolve();
      if (!isMounted) return;

      setIsLoading(true);
      setError("");

      try {
        const data = await accountApi.getAddresses(token);
        if (isMounted) setAddresses(data);
      } catch {
        if (isMounted) setError("Failed to load addresses.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAddresses();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  function openAddModal() {
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  function openEditModal(address: Address) {
    setEditingAddress(address);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingAddress(null);
  }

  async function handleSubmit(data: AddressFormData) {
    if (!accessToken) return;

    setIsSubmitting(true);
    setError("");

    try {
      if (editingAddress) {
        await accountApi.updateAddress(accessToken, editingAddress.id, data);
      } else {
        await accountApi.addAddress(accessToken, data);
      }

      const nextAddresses = await accountApi.getAddresses(accessToken);
      setAddresses(nextAddresses);
      closeModal();
      toast.success("Address updated successfully");
    } catch {
      setError(
        editingAddress ? "Failed to update address." : "Failed to add address."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!accessToken) return;

    setError("");

    try {
      await accountApi.deleteAddress(accessToken, id);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch {
      setError("Failed to delete address.");
    }
  }

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
          <Button onClick={openAddModal}>Add Address</Button>
        </div>

        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="rounded-md border border-border bg-white px-3 py-8 text-center text-sm text-gray-500">
            Loading addresses...
          </p>
        )}

        {!isLoading && addresses.length === 0 && (
          <p className="rounded-md border border-border bg-white px-3 py-8 text-center text-sm text-gray-500">
            No saved addresses yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((address) => (
            <div key={address.id} className="flex flex-col border border-border bg-white">
              <div className="p-2 border-b border-border flex justify-between">
                <div className="flex gap-2">
                  <p className="font-semibold">{address.label}</p>
                  {address.isDefault && (
                    <p className="bg-primary rounded-md flex items-center gap-1 text-white text-xs px-1">
                      <FaCheck />
                      Default
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  aria-label={`Delete ${address.label} address`}
                >
                  <FaRegTrashAlt className="text-red-500" />
                </button>
              </div>

              <div className="p-2 flex flex-col gap-2">
                <p className="font-semibold">{address.label}</p>
                <p className="text-gray-500 text-xs">
                  {[address.line1 ?? address.street, address.line2]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-xs">
                  City: <span className="text-gray-500">{address.city}</span>
                </p>
                <p className="text-xs">
                  State: <span className="text-gray-500">{address.state}</span>
                </p>
                {address.postalCode && (
                  <p className="text-xs">
                    Postal Code:{" "}
                    <span className="text-gray-500">{address.postalCode}</span>
                  </p>
                )}
                <Button variant="secondary" onClick={() => openEditModal(address)}>
                  Edit Address
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <AddAddressModal
          key={editingAddress?.id ?? "new-address"}
          isOpen={isModalOpen}
          initialAddress={editingAddress}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </AccountLayout>
  );
}
