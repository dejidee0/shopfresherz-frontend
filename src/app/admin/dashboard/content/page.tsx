"use client";

import { useState, useMemo } from "react";
import { LuImage, LuPencil } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import AddContentModal from "@/components/admin/AddContentModal";
import AddPromoModal from "@/components/admin/AddPromoModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  useAccessoriesPromo,
  useBanners,
  useBestDealPromo,
  useDeleteBanner,
  useHeroPromo,
  useLaptopPromo,
} from "@/lib/hooks/useAdmin";
import { PromoDto } from "@/lib/api/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentRow {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  cta: string;
  imgUrl?: string;
  linkUrl?: string;
  live: boolean;
}

export interface PromoRow {
  id: string;
  title: string;
  productId?: string;
  productName?: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  tag?: string;
  slug?: string;
  raw: PromoDto; // keep original for edit prefill
}

type SectionKey = "banner" | "hero" | "bestDeal" | "accessories" | "laptop";

interface BannerModalState {
  type: "banner";
  data: ContentRow | null;
}

interface PromoModalState {
  type: "promo";
  section: Exclude<SectionKey, "banner">;
  data: PromoRow | null;
}

type ModalState = BannerModalState | PromoModalState | null;

interface DeleteState {
  section: SectionKey;
  item: ContentRow | PromoRow;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely handles both plain array and paged { items: [] } responses */
function toArray<T>(data: T[] | { items: T[] } | T | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && "items" in (data as object)) {
    const items = (data as { items: T[] }).items;
    if (Array.isArray(items)) return items;
  }
  // Some endpoints return a single object — wrap it
  if (typeof data === "object" && "id" in (data as object)) {
    return [data as T];
  }
  return [];
}

function promoToRow(p: PromoDto): PromoRow {
  return {
    id: p.id,
    title: p.title ?? p.name ?? "Untitled",
    subtitle: p.subtitle,
    ctaText: p.ctaText ?? p.buttonText,
    imageUrl: p.imageUrl,
    tag: p.tag,
    slug: p.slug,
    raw: p,
  };
}

const SECTION_LABELS: Record<SectionKey, string> = {
  banner: "Hero Banners",
  hero: "Hero Promos",
  bestDeal: "Best Deals Promo",
  accessories: "Accessories Promo",
  laptop: "Laptop Promo",
};

// ─── Delete confirm dialog ────────────────────────────────────────────────────

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
          <p className="font-bold text-gray-900 text-base">Delete Item</p>
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

// ─── Content card (banners) ───────────────────────────────────────────────────

function BannerCard({
  content,
  onEdit,
  onDelete,
  deleteDisabled,
}: {
  content: ContentRow;
  onEdit: () => void;
  onDelete: () => void;
  deleteDisabled: boolean;
}) {
  return (
    <div className="flex flex-col min-w-65 lg:w-full rounded-md bg-white border border-border shrink-0">
      {content.imgUrl ? (
        <img src={content.imgUrl} alt={content.title} className="object-cover h-48 w-full rounded-t-md" />
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-t-md">
          <LuImage className="text-gray-400 text-2xl" />
        </div>
      )}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 truncate text-sm">{content.title}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${content.live ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {content.live ? "Live" : "Draft"}
          </span>
        </div>
        {content.subtitle && <p className="text-gray-400 text-xs line-clamp-1">{content.subtitle}</p>}
        <p className="text-gray-400 text-xs">CTA: {content.cta}</p>
        <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-100">
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#F97316] transition-colors px-2 py-1 rounded hover:bg-orange-50">
            <LuPencil size={13} /> Edit
          </button>
          <button onClick={onDelete} disabled={deleteDisabled} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <RiDeleteBinLine size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Promo card ───────────────────────────────────────────────────────────────

function PromoCard({
  promo,
  onEdit,
  onDelete,
  deleteDisabled,
}: {
  promo: PromoRow;
  onEdit: () => void;
  onDelete: () => void;
  deleteDisabled: boolean;
}) {
  return (
    <div className="flex flex-col min-w-55 lg:w-full rounded-md bg-white border border-border shrink-0">
      {promo.imageUrl ? (
        <img src={promo.imageUrl} alt={promo.title} className="object-cover h-48 w-full rounded-t-md" />
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-t-md">
          <LuImage className="text-gray-400 text-2xl" />
        </div>
      )}
      <div className="flex flex-col gap-1.5 p-3">
        <p className="font-semibold text-gray-900 truncate text-sm">{promo.title}</p>
        {promo.subtitle && <p className="text-gray-400 text-xs line-clamp-1">{promo.subtitle}</p>}
        {promo.tag && (
          <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100">
            {promo.tag}
          </span>
        )}
        {promo.ctaText && <p className="text-gray-400 text-xs">CTA: {promo.ctaText}</p>}
        <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-100">
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#F97316] transition-colors px-2 py-1 rounded hover:bg-orange-50">
            <LuPencil size={13} /> Edit
          </button>
          <button onClick={onDelete} disabled={deleteDisabled} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <RiDeleteBinLine size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  isLoading,
  isEmpty,
  showAddButton,
  buttonLabel,
  onAdd,
  children,
}: {
  title: string;
  isLoading: boolean;
  isEmpty: boolean;
  showAddButton?: boolean;
  buttonLabel?: string;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="md:text-2xl font-bold">{title}</p>
        {showAddButton && onAdd && (
          <Button onClick={onAdd} className="text-xs md:text-sm rounded-md cursor-pointer">
            {buttonLabel ?? "Add"}
          </Button>
        )}
      </div>
      <div className="flex overflow-x-auto gap-3.5 pb-2 min-h-20">
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-8">
            <Spinner />
          </div>
        ) : isEmpty ? (
          <div className="flex items-center w-full py-8 text-sm text-gray-400">
            No items found.
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminContentPage = () => {
  const { data: banners, isLoading: isLoadingBanners } = useBanners();
  const { data: heroPromoData, isLoading: isLoadingHeroPromo } = useHeroPromo();
  const { data: bestDealData, isLoading: isLoadingBestDealPromo } = useBestDealPromo();
  const { data: laptopData, isLoading: isLoadingLaptopPromo } = useLaptopPromo();
  const { data: accessoriesData, isLoading: isLoadingAccessoriesPromo } = useAccessoriesPromo();

  const deleteBannerMutation = useDeleteBanner();

  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);

  // ── Data transforms ────────────────────────────────────────────────────────

  const bannerRows = useMemo<ContentRow[]>(() => {
    if (!banners) return [];
    return toArray(banners).map((b) => ({
      id: b.id,
      tag: (b.tag as string | undefined) ?? "",
      title: b.title ?? "Untitled",
      subtitle: b.subtitle,
      cta: b.ctaText ?? "Learn More",
      imgUrl: b.imageUrl,
      linkUrl: b.linkUrl,
      live: b.isActive ?? false,
    }));
  }, [banners]);

  const heroRows    = useMemo(() => toArray(heroPromoData).map(promoToRow),    [heroPromoData]);
  const bestDealRows = useMemo(() => toArray(bestDealData).map(promoToRow),    [bestDealData]);
  const laptopRows   = useMemo(() => toArray(laptopData).map(promoToRow),      [laptopData]);
  const accessoriesRows = useMemo(() => toArray(accessoriesData).map(promoToRow), [accessoriesData]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openAddBanner = () => setModalState({ type: "banner", data: null });


  const openAddPromo = (section: Exclude<SectionKey, "banner">) =>
    setModalState({ type: "promo", section, data: null });
  const openEditBanner = (item: ContentRow) =>
    setModalState({ type: "banner", data: item });

  const openEditPromo = (section: Exclude<SectionKey, "banner">, item: PromoRow) =>
    setModalState({ type: "promo", section, data: item });

  const closeModal = () => setModalState(null);

  const handleDeleteConfirm = async () => {
    if (!deleteState) return;
    if (deleteState.section === "banner") {
      await deleteBannerMutation.mutateAsync(deleteState.item.id);
    } else {
      // TODO: wire per-section delete mutations when backend adds delete endpoints
      // e.g. deleteHeroPromoMutation.mutateAsync(deleteState.item.id)
      console.warn(`Delete not yet implemented for: ${deleteState.section}`);
    }
    setDeleteState(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col p-2 md:p-4 lg:p-6 gap-6">
      <p className="text-sm text-gray-400">Manage Homepage Banners and Content</p>

      {/* Hero Banners */}
      <Section
        title={SECTION_LABELS.banner}
        isLoading={isLoadingBanners}
        isEmpty={bannerRows.length === 0}
        showAddButton
        buttonLabel="Add Banner"
        onAdd={openAddBanner}
      >
        {bannerRows.map((item) => (
          <BannerCard
            key={item.id}
            content={item}
            onEdit={() => openEditBanner(item)}
            onDelete={() => setDeleteState({ section: "banner", item })}
            deleteDisabled={deleteBannerMutation.isPending}
          />
        ))}
      </Section>

      {/* Hero Promos */}
      <Section title={SECTION_LABELS.hero} isLoading={isLoadingHeroPromo} isEmpty={heroRows.length === 0} showAddButton buttonLabel="Add Promo" onAdd={() => openAddPromo("hero")}>
        {heroRows.map((item) => (
          <PromoCard
            key={item.id}
            promo={item}
            onEdit={() => openEditPromo("hero", item)}
            onDelete={() => setDeleteState({ section: "hero", item })}
            deleteDisabled={false}
          />
        ))}
      </Section>

      {/* Best Deals Promo */}
      <Section title={SECTION_LABELS.bestDeal} isLoading={isLoadingBestDealPromo} isEmpty={bestDealRows.length === 0} showAddButton buttonLabel="Add Promo" onAdd={() => openAddPromo("bestDeal")}>
        {bestDealRows.map((item) => (
          <PromoCard
            key={item.id}
            promo={item}
            onEdit={() => openEditPromo("bestDeal", item)}
            onDelete={() => setDeleteState({ section: "bestDeal", item })}
            deleteDisabled={false}
          />
        ))}
      </Section>

      {/* Accessories Promo */}
      <Section title={SECTION_LABELS.accessories} isLoading={isLoadingAccessoriesPromo} isEmpty={accessoriesRows.length === 0} showAddButton buttonLabel="Add Promo" onAdd={() => openAddPromo("accessories")}>
        {accessoriesRows.map((item) => (
          <PromoCard
            key={item.id}
            promo={item}
            onEdit={() => openEditPromo("accessories", item)}
            onDelete={() => setDeleteState({ section: "accessories", item })}
            deleteDisabled={false}
          />
        ))}
      </Section>

      {/* Laptop Promo */}
      <Section title={SECTION_LABELS.laptop} isLoading={isLoadingLaptopPromo} isEmpty={laptopRows.length === 0} showAddButton buttonLabel="Add Promo" onAdd={() => openAddPromo("laptop")}>
        {laptopRows.map((item) => (
          <PromoCard
            key={item.id}
            promo={item}
            onEdit={() => openEditPromo("laptop", item)}
            onDelete={() => setDeleteState({ section: "laptop", item })}
            deleteDisabled={false}
          />
        ))}
      </Section>

      {/* Banner add/edit modal */}
      {modalState?.type === "banner" && (
        <AddContentModal
          isOpen
          onClose={closeModal}
          initialData={
            modalState.data
              ? {
                  id: modalState.data.id,
                  tag: modalState.data.tag,
                  title: modalState.data.title,
                  subtitle: modalState.data.subtitle,
                  cta: modalState.data.cta,
                  imgUrl: modalState.data.imgUrl,
                  linkUrl: modalState.data.linkUrl,
                }
              : undefined
          }
        />
      )}

      {/* Promo edit modal */}
      {modalState?.type === "promo" && (
        <AddPromoModal
          isOpen
          onClose={closeModal}
          section={modalState.section}
          initialData={modalState.data ?? undefined}
        />
      )}

      {/* Delete confirmation */}
      {deleteState && (
        <DeleteConfirmDialog
          title={deleteState.item.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteState(null)}
          isPending={deleteBannerMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminContentPage;