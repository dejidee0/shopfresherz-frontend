// "use client";

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { HiOutlineEye, HiOutlineShoppingCart, HiOutlineCreditCard } from "react-icons/hi2";

// // ─── Data ────────────────────────────────────────────────────────────────────

// const revenueTrend = [
//   { month: "Jan", value: 4.1 },
//   { month: "Feb", value: 3.2 },
//   { month: "Mar", value: 3.8 },
//   { month: "Apr", value: 4.5 },
//   { month: "May", value: 4.2 },
//   { month: "June", value: 2.1 },
//   { month: "Jul", value: 2.8 },
//   { month: "Aug", value: 3.6 },
//   { month: "Sep", value: 0.9 },
//   { month: "Oct", value: 3.4 },
//   { month: "Nov", value: 1.8 },
//   { month: "Dec", value: 2.3 },
// ];

// const topProducts = [
//   { rank: "01", name: "Samsung Galaxy S24 Ultra", category: "Phone", price: 1450000, image: null },
//   { rank: "02", name: "Samsung Galaxy S24 Ultra", category: "Phones", price: 1450000, image: null },
//   { rank: "03", name: "Samsung Galaxy S24 Ultra", category: "Phones", price: 1450000, image: null },
//   { rank: "04", name: "Samsung Galaxy S24 Ultra", category: "Phone", price: 1450000, image: null },
// ];

// const categoryBreakdown = [
//   { name: "Macbook", value: 18.4, max: 20 },
//   { name: "Smart Watch", value: 9.2, max: 20 },
//   { name: "Iphone", value: 4.1, max: 20 },
//   { name: "Laptop", value: 2.8, max: 20 },
//   { name: "Tablets", value: 2.8, max: 20 },
// ];

// const deviceSplit = [
//   { name: "MOBILE", value: 68, color: "#F97316" },
//   { name: "DESKTOP", value: 24, color: "#14B8A6" },
//   { name: "TABLET", value: 24, color: "#C2410C" },
// ];

// const conversionFunnel = [
//   {
//     icon: HiOutlineEye,
//     label: "Visited Store",
//     sub: "Total unique sessions",
//     value: "12,400",
//     tag: "BASE LINE",
//     tagColor: "text-[#F97316]",
//   },
//   {
//     icon: HiOutlineShoppingCart,
//     label: "Added to Cart",
//     sub: "High purchase intent",
//     value: "5,200",
//     tag: "42% CONV.",
//     tagColor: "text-red-500",
//   },
//   {
//     icon: HiOutlineCreditCard,
//     label: "Checkout",
//     sub: "Confirmed transactions",
//     value: "2,800",
//     tag: "22% GLOBAL",
//     tagColor: "text-orange-400",
//   },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function SectionCard({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
//       {children}
//     </div>
//   );
// }

// function ProductImage() {
//   return (
//     <div className="w-9 h-9 rounded-lg bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center shrink-0">
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//         <rect x="5" y="2" width="14" height="20" rx="2" fill="#F97316" opacity="0.15" />
//         <rect x="8" y="5" width="8" height="1.5" rx="0.75" fill="#F97316" />
//         <rect x="8" y="8" width="8" height="1.5" rx="0.75" fill="#F97316" opacity="0.6" />
//         <rect x="7" y="4" width="10" height="14" rx="1" stroke="#F97316" strokeWidth="1.2" fill="none" />
//       </svg>
//     </div>
//   );
// }

// // ─── Custom tooltip ───────────────────────────────────────────────────────────

// function CustomTooltip({ active, payload, label }: any) {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2">
//         <p className="text-xs text-gray-400 mb-0.5">{label}</p>
//         <p className="text-sm font-bold text-gray-900">{payload[0].value}%</p>
//       </div>
//     );
//   }
//   return null;
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function AnalyticsPage() {
//   return (
//     <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8 space-y-6">
//       {/* Page heading */}
//       <div>
//         <h2 className=" text-sm lg:text-xl font-bold text-text-muted tracking-tight">
//           Track your store performance
//         </h2>
//       </div>

//       {/* ── Revenue Trend ─────────────────────────────────────── */}
//       <SectionCard className="p-5 sm:p-6">
//         <p className="text-sm font-semibold text-gray-400 mb-4">Revenue Trend</p>
//         <div className="h-52 sm:h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#F97316" stopOpacity={0.18} />
//                   <stop offset="95%" stopColor="#F97316" stopOpacity={0.01} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="4 4" />
//               <XAxis
//                 dataKey="month"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fontSize: 11, fill: "#9CA3AF" }}
//               />
//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fontSize: 11, fill: "#9CA3AF" }}
//                 tickFormatter={(v) => `${v}%`}
//                 domain={[0, 10]}
//                 ticks={[0, 2, 4, 6, 8, 10]}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Area
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#F97316"
//                 strokeWidth={2}
//                 fill="url(#revenueGrad)"
//                 dot={{ r: 4, fill: "#F97316", strokeWidth: 0 }}
//                 activeDot={{ r: 6, fill: "#F97316", stroke: "#fff", strokeWidth: 2 }}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </SectionCard>

//       {/* ── Top Products + Category Breakdown ─────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Top Products */}
//         <SectionCard className="lg:col-span-2 p-5 sm:p-6">
//           <h3 className="font-bold text-gray-900 mb-5">Top Products</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm min-w-105">
//               <thead>
//                 <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
//                   <th className="pb-3 text-center w-10">#</th>
//                   <th className="pb-3 text-left pl-3">Product</th>
//                   <th className="pb-3 text-center">Category</th>
//                   <th className="pb-3 text-right">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {topProducts.map((p) => (
//                   <tr
//                     key={p.rank}
//                     className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors"
//                   >
//                     <td className="py-3.5 text-center text-sm font-semibold text-gray-400">
//                       {p.rank}
//                     </td>
//                     <td className="py-3.5 pl-3">
//                       <div className="flex items-center gap-3">
//                         <ProductImage />
//                         <span className="font-medium text-gray-800 text-sm">{p.name}</span>
//                       </div>
//                     </td>
//                     <td className="py-3.5 text-center">
//                       <span className="px-3 py-1 text-xs font-medium bg-orange-50 text-orange-500 border border-orange-100 rounded-full">
//                         {p.category}
//                       </span>
//                     </td>
//                     <td className="py-3.5 text-right font-bold text-[#F97316]">
//                       ₦{p.price.toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </SectionCard>

//         {/* Category Breakdown */}
//         <SectionCard className="p-5 sm:p-6">
//           <h3 className="font-bold text-gray-900">Category Breakdown</h3>
//           <p className="text-xs text-gray-400 mt-0.5 mb-5">Revenue distribution across segments</p>
//           <div className="space-y-4">
//             {categoryBreakdown.map((cat) => {
//               const pct = (cat.value / cat.max) * 100;
//               return (
//                 <div key={cat.name}>
//                   <div className="flex items-center justify-between mb-1.5">
//                     <span className="text-sm font-medium text-gray-700">{cat.name}</span>
//                     <span className="text-xs font-semibold text-gray-500">
//                       ₦ {cat.value}M
//                     </span>
//                   </div>
//                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-[#F97316] rounded-full transition-all duration-700"
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </SectionCard>
//       </div>

//       {/* ── Device Split + Conversion Funnel ──────────────────── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* Device Split */}
//         <SectionCard className="p-5 sm:p-6">
//           <h3 className="font-bold text-gray-900">Device Split</h3>
//           <p className="text-xs text-gray-400 mt-0.5 mb-4">Sessions by hardware type</p>
//           <div className="flex flex-col items-center">
//             <div className="w-44 h-44">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={deviceSplit}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={52}
//                     outerRadius={80}
//                     paddingAngle={3}
//                     dataKey="value"
//                     strokeWidth={0}
//                   >
//                     {deviceSplit.map((entry, i) => (
//                       <Cell key={i} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="flex items-center justify-center gap-5 mt-4">
//               {deviceSplit.map((d) => (
//                 <div key={d.name} className="flex flex-col items-center gap-1">
//                   <div className="flex items-center gap-1.5">
//                     <span
//                       className="w-2.5 h-2.5 rounded-full"
//                       style={{ background: d.color }}
//                     />
//                     <span className="text-sm font-bold text-gray-700">{d.value}%</span>
//                   </div>
//                   <span className="text-[10px] font-bold text-gray-400 tracking-widest">
//                     {d.name}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </SectionCard>

//         {/* Conversion Funnel */}
//         <SectionCard className="p-5 sm:p-6">
//           <h3 className="font-bold text-gray-900 mb-5">Conversion Funnel</h3>
//           <div className="space-y-2">
//             {conversionFunnel.map((step, i) => {
//               const Icon = step.icon;
//               const isLast = i === conversionFunnel.length - 1;
//               return (
//                 <div key={step.label}>
//                   <div className="flex items-center justify-between py-3">
//                     <div className="flex items-center gap-4">
//                       {/* Icon bubble */}
//                       <div className="w-11 h-11 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
//                         <Icon size={20} className="text-[#F97316]" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-800">{step.label}</p>
//                         <p className="text-xs text-gray-400">{step.sub}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xl font-black text-gray-900 tracking-tight">
//                         {step.value}
//                       </p>
//                       <p className={`text-[10px] font-bold tracking-wider ${step.tagColor}`}>
//                         {step.tag}
//                       </p>
//                     </div>
//                   </div>
//                   {!isLast && <div className="h-px bg-gray-100" />}
//                 </div>
//               );
//             })}
//           </div>
//         </SectionCard>
//       </div>
//     </div>
//   );
// }

"use client";

import { adminApi, AnalyticsData } from "@/lib/api/admin";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import {
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineArchiveBox,
  HiOutlineExclamationTriangle,
  HiOutlineClipboardDocument,
  HiOutlineTruck,
} from "react-icons/hi2";


// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `₦${(n / 1_000).toFixed(1)}K`
    : `₦${n.toLocaleString()}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg = "bg-orange-50",
  iconColor = "text-[#F97316]",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <SectionCard className="p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon size={22} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-xl font-black text-gray-900 tracking-tight mt-0.5">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </SectionCard>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
        <HiOutlineClipboardDocument size={24} className="text-orange-300" />
      </div>
      <p className="text-sm font-medium text-gray-500">No recent orders yet</p>
      <p className="text-xs text-gray-400 mt-1">
        Orders will appear here once customers start purchasing.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {accessToken} = useAuthStore()

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const res = await adminApi.getAnalytics(accessToken!)
          setData(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-7 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <HiOutlineExclamationTriangle size={24} className="text-red-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Failed to load analytics
          </p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#F97316] text-white text-sm font-bold rounded-lg hover:bg-orange-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-sm lg:text-xl font-bold text-gray-400 tracking-tight">
          Track your store performance
        </h2>
      </div>

      {/* ── Revenue Stats ──────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Revenue
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={HiOutlineCurrencyDollar}
            label="Today"
            value={fmt(data.revenueToday)}
            sub="Revenue today"
          />
          <StatCard
            icon={HiOutlineCurrencyDollar}
            label="This Week"
            value={fmt(data.revenueThisWeek)}
            sub="Revenue this week"
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatCard
            icon={HiOutlineCurrencyDollar}
            label="This Month"
            value={fmt(data.revenueThisMonth)}
            sub="Revenue this month"
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
          />
          <StatCard
            icon={HiOutlineCurrencyDollar}
            label="Total Revenue"
            value={fmt(data.totalRevenue)}
            sub="All time revenue"
            iconBg="bg-green-50"
            iconColor="text-green-500"
          />
        </div>
      </div>

      {/* ── Orders Stats ───────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Orders
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={HiOutlineShoppingCart}
            label="Today"
            value={data.ordersToday}
            sub="Orders placed today"
          />
          <StatCard
            icon={HiOutlineClipboardDocument}
            label="Pending"
            value={data.pendingOrders}
            sub="Awaiting action"
            iconBg="bg-yellow-50"
            iconColor="text-yellow-500"
          />
          <StatCard
            icon={HiOutlineShoppingBag}
            label="Processing"
            value={data.processingOrders}
            sub="Being prepared"
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatCard
            icon={HiOutlineTruck}
            label="Shipped"
            value={data.shippedOrders}
            sub="On the way"
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
          />
        </div>
      </div>

      {/* ── Bottom grid: Customers + Inventory + Recent Orders ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers & Inventory summary */}
        <div className="space-y-4">
          <StatCard
            icon={HiOutlineUsers}
            label="Total Customers"
            value={data.totalCustomers.toLocaleString()}
            sub={`+${data.newUsersToday} new today`}
            iconBg="bg-teal-50"
            iconColor="text-teal-500"
          />
          <StatCard
            icon={HiOutlineShoppingBag}
            label="Total Products"
            value={data.totalProducts.toLocaleString()}
            sub="Listed in store"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-500"
          />
          <StatCard
            icon={HiOutlineExclamationTriangle}
            label="Low Stock"
            value={data.lowStockProducts}
            sub="Products need restocking"
            iconBg="bg-red-50"
            iconColor="text-red-400"
          />
        </div>

        {/* Recent Orders */}
        <SectionCard className="lg:col-span-2 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <span className="text-xs font-semibold text-gray-400">
              {data.totalOrders} total
            </span>
          </div>

          {data.recentOrders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 text-left">Order Number</th>
                    <th className="pb-3 text-left">Customer Email</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr
                      key={order.id? order.id : order.orderNumber}
                      className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors"
                    >
                      <td className="py-3 font-medium text-[#F97316] text-xs">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-gray-600">
                        {order.customerEmail ?? "—"}
                      </td>
                      <td className="py-3 text-right font-bold text-gray-800">
                        {order.total != null ? fmt(order.total) : "—"}
                      </td>
                      <td className="py-3 text-center">
                        {order.status ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-50 text-orange-500 border border-orange-100">
                            {order.status}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * PREVIOUS ANALYTICS PAGE (mock data version) — kept for reference
 * Uncomment and swap with the export above to revert.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * import {
 *   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
 *   ResponsiveContainer, PieChart, Pie, Cell,
 * } from "recharts";
 * import { HiOutlineEye, HiOutlineShoppingCart, HiOutlineCreditCard } from "react-icons/hi2";
 *
 * const revenueTrend = [
 *   { month: "Jan", value: 4.1 }, { month: "Feb", value: 3.2 },
 *   { month: "Mar", value: 3.8 }, { month: "Apr", value: 4.5 },
 *   { month: "May", value: 4.2 }, { month: "June", value: 2.1 },
 *   { month: "Jul", value: 2.8 }, { month: "Aug", value: 3.6 },
 *   { month: "Sep", value: 0.9 }, { month: "Oct", value: 3.4 },
 *   { month: "Nov", value: 1.8 }, { month: "Dec", value: 2.3 },
 * ];
 *
 * const topProducts = [
 *   { rank: "01", name: "Samsung Galaxy S24 Ultra", category: "Phone", price: 1450000 },
 *   { rank: "02", name: "Samsung Galaxy S24 Ultra", category: "Phones", price: 1450000 },
 *   { rank: "03", name: "Samsung Galaxy S24 Ultra", category: "Phones", price: 1450000 },
 *   { rank: "04", name: "Samsung Galaxy S24 Ultra", category: "Phone", price: 1450000 },
 * ];
 *
 * const categoryBreakdown = [
 *   { name: "Macbook", value: 18.4, max: 20 },
 *   { name: "Smart Watch", value: 9.2, max: 20 },
 *   { name: "Iphone", value: 4.1, max: 20 },
 *   { name: "Laptop", value: 2.8, max: 20 },
 *   { name: "Tablets", value: 2.8, max: 20 },
 * ];
 *
 * const deviceSplit = [
 *   { name: "MOBILE", value: 68, color: "#F97316" },
 *   { name: "DESKTOP", value: 24, color: "#14B8A6" },
 *   { name: "TABLET", value: 24, color: "#C2410C" },
 * ];
 *
 * const conversionFunnel = [
 *   { icon: HiOutlineEye, label: "Visited Store", sub: "Total unique sessions",
 *     value: "12,400", tag: "BASE LINE", tagColor: "text-[#F97316]" },
 *   { icon: HiOutlineShoppingCart, label: "Added to Cart", sub: "High purchase intent",
 *     value: "5,200", tag: "42% CONV.", tagColor: "text-red-500" },
 *   { icon: HiOutlineCreditCard, label: "Checkout", sub: "Confirmed transactions",
 *     value: "2,800", tag: "22% GLOBAL", tagColor: "text-orange-400" },
 * ];
 *
 * export default function AnalyticsPageLegacy() { ... }
 */