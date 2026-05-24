"use client";

import { useState, useMemo } from "react";
import { LuImage, LuPencil } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import AddContentModal from "@/components/admin/AddContentModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useBanners, useDeleteBanner } from "@/lib/hooks/useAdmin";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentRow {
  id: string;
  title: string;
  subtitle?: string;
  cta: string;
  imgUrl?: string;
  linkUrl?: string;
  live: boolean;
}

// ─── Delete confirmation dialog ───────────────────────────────────────────────

function DeleteConfirmDialog({
  title,
  onConfirm,
  onCancel,
  isPending,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
        <div>
          <p className="font-bold text-gray-900 text-base">Delete Banner</p>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">"{title}"</span>? This
            action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminContentPage = () => {
  const { data: banners, isLoading } = useBanners();
  const deleteBannerMutation = useDeleteBanner();

  // Modal state — null = closed, undefined = add mode, ContentRow = edit mode
  const [editTarget, setEditTarget] = useState<ContentRow | null | undefined>(undefined);
  const isModalOpen = editTarget !== undefined;

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<ContentRow | null>(null);

  const contentData = useMemo<ContentRow[]>(() => {
    if (!banners) return [];
    return banners.map((banner) => ({
      id:       banner.id,
      title:    banner.title    || "Untitled",
      subtitle: banner.subtitle,
      cta:      banner.ctaText  || "Learn More",
      imgUrl:   banner.imageUrl,
      linkUrl:  banner.linkUrl,
      live:     banner.isActive || false,
    }));
  }, [banners]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleOpenAdd = () => setEditTarget(null);   // null = add mode

  const handleOpenEdit = (content: ContentRow) => setEditTarget(content);

  const handleCloseModal = () => setEditTarget(undefined);  // undefined = closed

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteBannerMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col p-2 md:p-4 lg:p-6 gap-4 lg:gap-6">

      {/* Page header */}
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-start md:items-center">
        <p className="text-sm text-text-muted">
          Manage Homepage Banners and Content
        </p>
        <Button
          onClick={handleOpenAdd}
          className="text-xs md:text-sm rounded-md cursor-pointer"
        >
          Add Banner
        </Button>
      </div>

      {/* Hero Banner Grid */}
      <div className="flex flex-col gap-3">
        <p className="md:text-2xl font-bold">Hero Banners</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <Spinner />
            </div>
          ) : contentData.length === 0 ? (
            <div className="col-span-full text-center py-8 text-sm text-text-muted">
              No banners found. Add one to get started.
            </div>
          ) : (
            contentData.map((content) => (
              <div
                key={content.id}
                className="flex flex-col md:w-[90%] lg:w-full rounded-md bg-white overflow-hidden border border-border"
              >
                {/* Banner image */}
                {content.imgUrl ? (
                  <img
                    src={content.imgUrl}
                    alt={content.title}
                    className="object-cover h-60 w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-30 bg-border">
                    <LuImage className="text-text-muted text-2xl" />
                  </div>
                )}

                {/* Card body */}
                <div className="flex flex-col gap-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 truncate">{content.title}</p>
                    {/* Live badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        content.live
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {content.live ? "Live" : "Draft"}
                    </span>
                  </div>

                  {content.subtitle && (
                    <p className="text-text-muted text-sm line-clamp-1">{content.subtitle}</p>
                  )}
                  <p className="text-text-muted text-xs">CTA: {content.cta}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-1 pt-2 border-t border-border">
                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(content)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#F97316] transition-colors px-2 py-1 rounded hover:bg-orange-50"
                      title="Edit banner"
                    >
                      <LuPencil size={13} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(content)}
                      disabled={deleteBannerMutation.isPending}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete banner"
                    >
                      <RiDeleteBinLine size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {isModalOpen && (
        <AddContentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={
            editTarget
              ? {
                  id:       editTarget.id,
                  title:    editTarget.title,
                  subtitle: editTarget.subtitle,
                  cta:      editTarget.cta,
                  imgUrl:   editTarget.imgUrl,
                  linkUrl:  editTarget.linkUrl,
                }
              : undefined  // undefined = add mode (no prefill)
          }
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteBannerMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminContentPage;