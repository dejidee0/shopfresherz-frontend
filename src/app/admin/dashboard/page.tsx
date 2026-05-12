"use client";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import StatsCard from "@/components/admin/StatsCard";
import { useDashboard, useLowStock } from "@/lib/hooks/useAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Keep mock data for revenue chart since API doesn't provide monthly breakdown
const revenueData = [
  { month: "Jan", profit: 85000, loss: 60000 },
  { month: "Feb", profit: 72000, loss: 50000 },
  { month: "Mar", profit: 78000, loss: 55000 },
  { month: "Apr", profit: 60000, loss: 45000 },
  { month: "May", profit: 82000, loss: 62000 },
  { month: "Jun", profit: 48000, loss: 22000 },
  { month: "Jul", profit: 70000, loss: 60000 },
  { month: "Aug", profit: 78000, loss: 50000 },
  { month: "Sep", profit: 68000, loss: 52000 },
];

// Mock logistics data - no API available
const logistics = [
  { fleetId: "#TX-990", destination: "Downtown Hub", status: "IN TRANSIT", eta: "14:45" },
  { fleetId: "#TX-114", destination: "Eastside Storage", status: "LOADING", eta: "16:10" },
  { fleetId: "#TX-823", destination: "Main Port", status: "DELAYED", eta: "--:--" },
  { fleetId: "#TX-404", destination: "North Station", status: "IDLE", eta: "N/A" },
];

const sparkRevenue = [{ v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 55 }, { v: 70 }];
const sparkOrders = [{ v: 70 }, { v: 50 }, { v: 60 }, { v: 40 }, { v: 30 }, { v: 45 }];
const sparkPending = [{ v: 20 }, { v: 35 }, { v: 30 }, { v: 50 }, { v: 45 }, { v: 65 }];
const sparkProduct = [{ v: 40 }, { v: 55 }, { v: 45 }, { v: 60 }, { v: 55 }, { v: 65 }];

const statusColors: Record<string, string> = {
  "IN TRANSIT": "bg-green-100 text-green-700",
  LOADING: "bg-yellow-100 text-yellow-700",
  DELAYED: "bg-red-100 text-red-600",
  IDLE: "bg-gray-100 text-gray-500",
};

export default function DashboardPage() {
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard();
  const { data: lowStockData, isLoading: lowStockLoading } = useLowStock();

  // Transform dashboard stats for order status pie chart
  const orderStatusData = dashboardData ? [
    { name: "Pending", value: dashboardData.pendingOrders || 0, color: "#F97316" },
    { name: "Processing", value: dashboardData.totalOrders ? Math.round(dashboardData.totalOrders * 0.3) : 0, color: "#FB923C" },
    { name: "Completed", value: dashboardData.completedOrders || 0, color: "#FDBA74" },
    { name: "Cancelled", value: dashboardData.cancelledOrders || 0, color: "#FED7AA" },
  ] : [];

  const total = orderStatusData.reduce((s, d) => s + d.value, 0);
  const pct = total > 0 ? Math.round((orderStatusData[0]?.value / total) * 100) : 0;

  // Transform low stock data
  const lowStockItems = lowStockData?.map(item => ({
    name: item.productName,
    sku: item.sku || '',
    units: item.availableQty,
    restockLevel: item.threshold || 10,
  })) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {/* <Navbar title="Dashboard" /> */}

        <main className="p-2 md:p-4 lg:p-8 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard
              title="Total Revenue"
              value={dashboardLoading ? "Loading..." : `₦${(dashboardData?.totalRevenue || 0).toLocaleString()}`}
              change="+22%"
              positive
              sparkData={sparkRevenue}
              sparkColor="#10B981"
            />
            <StatsCard
              title="Total Orders"
              value={dashboardLoading ? "Loading..." : (dashboardData?.totalOrders || 0).toString()}
              change="-25%"
              positive={false}
              sparkData={sparkOrders}
              sparkColor="#EF4444"
            />
            <StatsCard
              title="Pending Orders"
              value={dashboardLoading ? "Loading..." : (dashboardData?.pendingOrders || 0).toString()}
              change="+49%"
              positive
              sparkData={sparkPending}
              sparkColor="#10B981"
            />
            <StatsCard
              title="Total Products"
              value={dashboardLoading ? "Loading..." : (dashboardData?.totalProducts || 0).toString()}
              change="+1.9%"
              positive
              sparkData={sparkProduct}
              sparkColor="#F97316"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">Total Revenue</h3>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    ₦{dashboardLoading ? "Loading..." : (dashboardData?.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-[#F97316] font-medium mt-0.5">5% than last month</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#F97316] inline-block" />
                    <span className="text-gray-500">Profit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FED7AA] inline-block" />
                    <span className="text-gray-500">loss</span>
                  </div>
                </div>
              </div>
              <div className="h-56 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} barGap={4}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}
                    //   formatter={(v: number) => [`₦${v.toLocaleString()}`, ""]}
                    />
                    <Bar dataKey="profit" fill="#F97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="loss" fill="#FED7AA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900">Order Status</h3>
              <p className="text-sm text-gray-400 mt-0.5 mb-4">Breakdown of current orders</p>
              <div className="flex justify-center">
                <div className="relative w-44 h-44">
                  <PieChart width={176} height={176}>
                    <Pie data={orderStatusData} cx={80} cy={80} innerRadius={52} outerRadius={80} dataKey="value" paddingAngle={2}>
                      {orderStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-gray-900">{pct}%</span>
                  </div>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {orderStatusData.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Low Stock Alerts</h3>
              <div className="space-y-6 md:space-y-4">
                {lowStockLoading ? (
                  <p className="text-gray-500">Loading low stock items...</p>
                ) : lowStockItems.length === 0 ? (
                  <p className="text-gray-500">No low stock items</p>
                ) : (
                  lowStockItems.map((item) => (
                    <div key={item.sku} className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📦</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#F97316]">{item.units} units</p>
                        <p className="text-xs text-gray-400">RESTOCK LEVEL: {item.restockLevel}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Logistics */}
            <div className="bg-white rounded-xl border border-gray-100 p-2 md:p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Logistics Feed</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 text-left">Fleet ID</th>
                      <th className="pb-3 text-left">Destination</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-right">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {logistics.map((row) => (
                      <tr key={row.fleetId} className="border-y border-gray-100">
                        <td className="py-3 font-medium text-gray-700">{row.fleetId}</td>
                        <td className="py-3 text-gray-600">{row.destination}</td>
                        <td className="py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-gray-500">{row.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}