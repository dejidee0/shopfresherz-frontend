import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/BreadCrumbs";
import { ProductImageZoom } from "@/features/product/components/ProductImageZoom";
import { PDPActions } from "@/features/product/components/PdpActions";
import { ProductTabs } from "@/features/product/components/ProductTabs";
import { PDPBottomProducts } from "@/features/product/components/PdpBottomProducts";
import { productsApi } from "@/lib/api/products";
import type { Metadata } from "next";

export const revalidate = 120;

interface PDPProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PDPProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await productsApi.getBySlug(slug);
    return {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.description.slice(0, 155),
      openGraph: {
        title: product.name,
        images: [{ url: product.imageUrls?.[0] ?? "" }],
      },
    };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const { slug } = await params;
  let product;

  try {
    product = await productsApi.getBySlug(slug);
  } catch {
    notFound();
  }

  const stockQty = product.stockQty ?? product.availableQty ?? 0;

  // Fetch supporting lists — failures don't break the page
  const [flashDeals, bestSellers, topRated, newArrivals] =
    await Promise.allSettled([
      productsApi.flashDeals().then((deals) => deals.slice(0, 3)),
      productsApi.bestSellers(3),
      productsApi
        .list({ sortBy: "best_rated", pageSize: 3 })
        .then((r) => r.data ?? []),
      productsApi.newArrivals(3),
    ]);

  const breadcrumbs = [
    { label: "Shop", href: "/store" },
    { label: "Shop Grid", href: "/store" },
    {
      label: product.category?.name ?? product.categoryName ?? "",
      href: `/store/category/${product.category?.slug ?? ""}`,
    },
    { label: product.name },
  ];

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* ── Main PDP layout ── */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-10 mt-3 sm:mt-4">

        {/* Left: Image zoom */}
        <div className="w-full lg:w-120 shrink-0">
          <ProductImageZoom
            images={product.imageUrls.map((url) => {
              // Derive Cloudinary variants by injecting transformation segments.
              // Falls back to the original URL for non-Cloudinary sources.
              const toCloudinary = (transforms: string) =>
                url.includes("/upload/")
                  ? url.replace("/upload/", `/upload/${transforms}/`)
                  : url;

              return {
                thumb: toCloudinary("w_128,h_128,c_fit,f_auto,q_auto"),
                display: toCloudinary("w_540,h_540,c_fit,f_auto,q_auto"),
                zoom: toCloudinary("w_1600,h_1600,c_fit,f_auto,q_auto:best"),
                original: url,
              };
            })}
            productName={product.name}
            isOutOfStock={stockQty <= 0}
          />
        </div>

        {/* Right: Product info + actions */}
        <div className="flex-1 min-w-0">
          <PDPActions product={product} />
        </div>
      </div>

      {/* ── Tabs: Description / Additional Info / Specification / Review ── */}
      <ProductTabs product={product} />

      {/* ── Bottom product rows ── */}
      <PDPBottomProducts
        flashSaleToday={
          flashDeals.status === "fulfilled" ? flashDeals.value : []
        }
        bestSellers={
          bestSellers.status === "fulfilled" ? bestSellers.value : []
        }
        topRated={topRated.status === "fulfilled" ? topRated.value : []}
        newArrivals={
          newArrivals.status === "fulfilled" ? newArrivals.value : []
        }
      />
    </div>
  );
}
