"use client";

import { useMemo, useRef, useState } from "react";
import { LuImage, LuPencil } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import AddContentModal from "@/components/admin/AddContentModal";
import AddPromoModal from "@/components/admin/AddPromoModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  useBanners,
  useDeleteBanner,
  usePromoAdminList,
  usePromoPublic,
  useDeletePromo,
  useDeleteSingletonPromo,
  useAllPromoSections,
} from "@/lib/hooks/useAdmin";
import {
  PROMO_PLACEMENTS,
  PROMO_MULTI_ITEM_PLACEMENTS,
  type PromoDto,
  type PromoPlacement,
} from "@/lib/api/admin";
import { productsApi } from "@/lib/api/products";

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
  /** Real database id for hero/flash-sale rows; a display slug for singleton
   *  placements (best-deal, accessories-promo, laptop-promo, store-promo-banner) —
   *  those never expose a real id via the public read endpoint, so it's
   *  resolved on demand (see resolveProductId) when editing/deleting. */
  id: string;
  placement: PromoPlacement;
  title: string;
  productId?: string;
  productName?: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  /** Best Deal placement only — not currently returned by the backend, see PromoDto.videoUrl. */
  videoUrl?: string;
  tag?: string;
  description?: string;
  slug?: string;
  raw: PromoDto;
}

interface BannerModalState {
  type: "banner";
  data: ContentRow | null;
}

interface PromoModalState {
  type: "promo";
  placement: PromoPlacement;
  data: PromoRow | null;
}

type ModalState = BannerModalState | PromoModalState | null;

type DeleteState =
  | { kind: "banner"; item: ContentRow }
  | { kind: "promo"; item: PromoRow };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely handles both plain array and paged { items: [] } responses */
function toArray<T>(data: T[] | { items: T[] } | T | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && "items" in (data as object)) {
    const items = (data as { items: T[] }).items;
    if (Array.isArray(items)) return items;
  }
  if (typeof data === "object" && "id" in (data as object)) {
    return [data as T];
  }
  return [];
}

function promoToRow(p: PromoDto, placement: PromoPlacement): PromoRow {
  return {
    id: p.id,
    placement,
    title: p.title ?? p.name ?? "Untitled",
    productId: p.productId,
    productName: p.title ?? p.name,
    subtitle: p.subtitle,
    ctaText: p.ctaText ?? p.buttonText,
    imageUrl: p.imageUrl,
    videoUrl: p.videoUrl,
    tag: p.tag,
    description: p.description,
    slug: p.slug,
    raw: p,
  };
}

/**
 * Resolves the real productId behind a promo row — already known for rows
 * that carry one directly, otherwise looked up via the product's slug, with
 * a name-search fallback for rows whose slug is missing (confirmed live:
 * some promo reads return `slug: null` even though the row's title matches a
 * real product). Some promo rows are pure legacy/demo content with no real
 * product behind them at all (confirmed live: no productId, no slug, and no
 * catalog match by name) — for those this correctly returns null, and the
 * edit modal falls back to a searchable product picker instead of blocking.
 */
async function resolveProductId(row: PromoRow): Promise<string | null> {
  if (row.productId) return row.productId;

  if (row.slug) {
    try {
      const product = await productsApi.getBySlug(row.slug);
      return product.id;
    } catch {
      // fall through to name search
    }
  }

  if (row.title) {
    try {
      const result = await productsApi.search({ q: row.title, page: 1, pageSize: 5 });
      const exactMatch = result.data?.find(
        (p) => p.name.toLowerCase() === row.title.toLowerCase(),
      );
      return (exactMatch ?? result.data?.[0])?.id ?? null;
    } catch {
      return null;
    }
  }

  return null;
}

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
            <span className="font-semibold text-gray-700">&quot;{title}&quot;</span>? This
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
    <div className="flex flex-col w-full rounded-md bg-white border border-border">
      {content.imgUrl ? (
        <img src={content.imgUrl} alt={content.title} className="object-cover h-48 w-full rounded-t-md" />
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-t-md">
          <LuImage className="text-gray-400 text-2xl" />
        </div>
      )}
      <div className="flex flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 break-words text-sm">{content.title}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${content.live ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {content.live ? "Live" : "Draft"}
          </span>
        </div>
        {content.subtitle && <p className="text-gray-400 text-xs">{content.subtitle}</p>}
        <p className="text-gray-400 text-xs break-words">CTA: {content.cta}</p>
        <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-100">
          <button onClick={onEdit} className="flex flex-1 items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#F97316] transition-colors px-3 py-2.5 rounded-md hover:bg-orange-50 min-h-11">
            <LuPencil size={15} /> Edit
          </button>
          <button onClick={onDelete} disabled={deleteDisabled} className="flex flex-1 items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-3 py-2.5 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-11">
            <RiDeleteBinLine size={15} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Promo card (live-style storefront preview + placement label) ────────────

function PromoPreviewThumb({ promo }: { promo: PromoRow }) {
  return (
    <div className="relative w-full min-h-32 rounded-lg overflow-hidden bg-[#1A1A2E] flex items-end">
      {promo.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={promo.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      )}
      <div className="relative z-10 p-2.5 w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        {promo.tag && (
          <span className="inline-block text-[9px] font-bold uppercase tracking-wide text-white bg-[#F97316] rounded-full px-2 py-0.5 mb-1">
            {promo.tag}
          </span>
        )}
        <p className="text-white text-xs font-bold line-clamp-2 break-words">{promo.title}</p>
        {promo.ctaText && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-[#F97316] bg-white rounded px-2 py-0.5 break-words">
            {promo.ctaText}
          </span>
        )}
      </div>
    </div>
  );
}

const PLACEMENT_LABEL: Record<PromoPlacement, string> =
  Object.fromEntries(PROMO_PLACEMENTS.map((p) => [p.value, p.label])) as Record<
    PromoPlacement,
    string
  >;

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
    <div className="flex flex-col w-full rounded-md bg-white border border-border">
      <PromoPreviewThumb promo={promo} />
      <div className="flex flex-col gap-1.5 p-3.5">
        <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
          {PLACEMENT_LABEL[promo.placement]}
        </span>
        <p className="font-semibold text-gray-900 break-words text-sm">{promo.title}</p>
        {promo.description && (
          <p className="text-gray-400 text-xs line-clamp-2 break-words">{promo.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-100">
          <button onClick={onEdit} className="flex flex-1 items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#F97316] transition-colors px-3 py-2.5 rounded-md hover:bg-orange-50 min-h-11">
            <LuPencil size={15} /> Edit
          </button>
          <button onClick={onDelete} disabled={deleteDisabled} className="flex flex-1 items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-3 py-2.5 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-11">
            <RiDeleteBinLine size={15} /> Delete
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
  headerExtra,
  children,
}: {
  title: string;
  isLoading: boolean;
  isEmpty: boolean;
  showAddButton?: boolean;
  buttonLabel?: string;
  onAdd?: () => void;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <p className="text-xl md:text-2xl font-bold">{title}</p>
          {headerExtra}
        </div>
        {showAddButton && onAdd && (
          <Button onClick={onAdd} className="text-sm rounded-md cursor-pointer self-start sm:self-auto">
            {buttonLabel ?? "Add"}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 min-h-20">
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-8 col-span-full">
            <Spinner />
          </div>
        ) : isEmpty ? (
          <div className="flex items-center w-full py-8 text-sm text-gray-400 col-span-full">
            No promo cards found.
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
  const deleteBannerMutation = useDeleteBanner();

  // Multi-item placements — real admin list endpoint, real ids.
  const { data: heroData, isLoading: isLoadingHero } = usePromoAdminList("hero");
  const { data: flashSaleData, isLoading: isLoadingFlashSale } = usePromoAdminList("flash-sale");

  // Singleton placements — only the public read endpoint exists; real id is
  // resolved on demand (see resolveProductId) when the admin edits/deletes.
  const { data: bestDealData, isLoading: isLoadingBestDeal } = usePromoPublic("best-deal");
  const { data: accessoriesData, isLoading: isLoadingAccessories } = usePromoPublic("accessories-promo");
  const { data: laptopData, isLoading: isLoadingLaptop } = usePromoPublic("laptop-promo");
  const { data: storeBannerData, isLoading: isLoadingStoreBanner } = usePromoPublic("store-promo-banner");

  // Fetch all promo sections to resolve database section GUIDs (needed for media uploads).
  const { data: allSectionsData } = useAllPromoSections();

  const sectionKeyToId = useMemo(() => {
    if (!allSectionsData) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const section of allSectionsData) {
      if (section.sectionKey) {
        map.set(section.sectionKey, section.id);
      }
    }
    return map;
  }, [allSectionsData]);

  const deletePromoMutation = useDeletePromo();
  const deleteSingletonPromoMutation = useDeleteSingletonPromo();

  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);
  const [placementFilter, setPlacementFilter] = useState<PromoPlacement | "all">("all");
  const [resolvingRowId, setResolvingRowId] = useState<string | null>(null);

  const isLoadingPromos =
    isLoadingHero || isLoadingFlashSale || isLoadingBestDeal || isLoadingAccessories || isLoadingLaptop || isLoadingStoreBanner;

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

  const allPromoRows = useMemo<PromoRow[]>(() => {
    return [
      ...toArray(heroData).map((p) => promoToRow(p, "hero")),
      ...toArray(flashSaleData).map((p) => promoToRow(p, "flash-sale")),
      ...toArray(bestDealData).map((p) => promoToRow(p, "best-deal")),
      ...toArray(accessoriesData).map((p) => promoToRow(p, "accessories-promo")),
      ...toArray(laptopData).map((p) => promoToRow(p, "laptop-promo")),
      ...toArray(storeBannerData).map((p) => promoToRow(p, "store-promo-banner")),
    ];
  }, [heroData, flashSaleData, bestDealData, accessoriesData, laptopData, storeBannerData]);

  const visiblePromoRows = useMemo(
    () =>
      placementFilter === "all"
        ? allPromoRows
        : allPromoRows.filter((r) => r.placement === placementFilter),
    [allPromoRows, placementFilter],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openAddBanner = () => setModalState({ type: "banner", data: null });
  const openEditBanner = (item: ContentRow) => setModalState({ type: "banner", data: item });
  const closeModal = () => setModalState(null);

  const openAddPromo = () =>
    setModalState({ type: "promo", placement: "hero", data: null });

  // Guards against a slow singleton-placement resolve landing after a
  // later edit click — without this, an in-flight resolveProductId call
  // could overwrite whatever modal the admin has since opened.
  const editRequestRef = useRef(0);

  const openEditPromo = async (row: PromoRow) => {
    const requestId = ++editRequestRef.current;

    // resolveProductId returns row.productId immediately (no network call)
    // when it's already known — the await only does real work for rows that
    // need a slug/name lookup, which covers both singleton placements and
    // any multi-item row the backend returned without a productId.
    setResolvingRowId(row.id);
    const productId = await resolveProductId(row);
    setResolvingRowId(null);
    if (requestId !== editRequestRef.current) return;
    setModalState({
      type: "promo",
      placement: row.placement,
      data: { ...row, productId: productId ?? row.productId },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteState) return;
    if (deleteState.kind === "banner") {
      await deleteBannerMutation.mutateAsync(deleteState.item.id);
    } else {
      const row = deleteState.item;
      if (PROMO_MULTI_ITEM_PLACEMENTS.includes(row.placement)) {
        await deletePromoMutation.mutateAsync(row.id);
      } else {
        const productId = await resolveProductId(row);
        if (!productId) {
          setDeleteState(null);
          return;
        }
        await deleteSingletonPromoMutation.mutateAsync({ placement: row.placement, productId });
      }
    }
    setDeleteState(null);
  };

  const isDeletePending =
    deleteBannerMutation.isPending || deletePromoMutation.isPending || deleteSingletonPromoMutation.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col p-2 md:p-4 lg:p-6 gap-6">
      <p className="text-sm text-gray-400">Manage Homepage Banners and Promo Cards</p>

      {/* Hero Banners — separate resource, not a promo card */}
      <Section
        title="Hero Banners"
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
            onDelete={() => setDeleteState({ kind: "banner", item })}
            deleteDisabled={deleteBannerMutation.isPending}
          />
        ))}
      </Section>

      {/* Promo Cards — unified across all 6 placements */}
      <Section
        title="Promo Cards"
        isLoading={isLoadingPromos}
        isEmpty={visiblePromoRows.length === 0}
        showAddButton
        buttonLabel="Add Promo"
        onAdd={openAddPromo}
        headerExtra={
          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value as PromoPlacement | "all")}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#F97316] w-full sm:w-auto"
          >
            <option value="all">All placements</option>
            {PROMO_PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        }
      >
        {visiblePromoRows.map((row) => (
          <PromoCard
            key={`${row.placement}-${row.id}`}
            promo={row}
            onEdit={() => openEditPromo(row)}
            onDelete={() => setDeleteState({ kind: "promo", item: row })}
            deleteDisabled={isDeletePending || resolvingRowId === row.id}
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

      {/* Promo add/edit modal */}
      {modalState?.type === "promo" && (
        <AddPromoModal
          isOpen
          onClose={closeModal}
          defaultPlacement={modalState.placement}
          initialData={modalState.data ?? undefined}
          sectionId={
            modalState.data
              ? PROMO_MULTI_ITEM_PLACEMENTS.includes(modalState.data.placement)
                ? modalState.data.id
                : sectionKeyToId.get(modalState.data.placement) ?? modalState.data.id
              : undefined
          }
          allSections={allSectionsData}
        />
      )}

      {/* Delete confirmation */}
      {deleteState && (
        <DeleteConfirmDialog
          title={deleteState.item.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteState(null)}
          isPending={isDeletePending}
        />
      )}
    </div>
  );
};

export default AdminContentPage;
