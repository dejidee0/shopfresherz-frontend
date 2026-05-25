// "use client";
// import { FiTruck } from "react-icons/fi";
// import { IoMdNotificationsOutline } from "react-icons/io";
// import { BsBoxSeam } from "react-icons/bs";
// import { IoCard } from "react-icons/io5";
// import { FaSackDollar } from "react-icons/fa6";
// import { useState } from "react";
// import DeliveryConfig from "@/components/admin/settings/DeliveryConfig";
// import TaxConfig from "@/components/admin/settings/TaxConfig";
// import InventoryConfig from "@/components/admin/settings/InventoryConfig";
// import NotificationConfig from "@/components/admin/settings/NotificationConfig";
// import PaymentConfig from "@/components/admin/settings/PaymentConfig";

// const navSections = [
//   {
//     id: "config",
//     label: "Configure Your Store",
//     icon: FiTruck,
//   },
//   {
//     id: "tax",
//     label: "Tax",
//     icon: FaSackDollar,
//   },
//   {
//     id: "payment",
//     label: "Payment",
//     icon: IoCard,
//   },
//   {
//     id: "inventory",
//     label: "Inventory",
//     icon: BsBoxSeam,
//   },
//   {
//     id: "notification",
//     label: "Notification",
//     icon: IoMdNotificationsOutline,
//   },
// ];
// const AdminSettingsPage = () => {
//   const [navState, setNavState] = useState("config");

//   return (
//     <div className="p-2 md:p-4 lg:p-6 flex flex-col gap-6">
//       <p className="text-text-muted text-sm">Configure your store</p>

//       <div className="flex flex-col md:flex-row gap-3">
//         <div className="rounded-md border border-border p-4 lg:w-[30%] h-fit">
//           <nav>
//             <ul className="flex flex-col gap-5">
//               {navSections.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <button
//                     key={item.id}
//                     className="cursor-pointer"
//                     onClick={() => setNavState(item.id)}
//                   >
//                     <li
//                       className={`flex items-center text-xs md:text-sm lg:text-base gap-3 ${navState === item.id ? "text-primary" : "text-text-muted hover:text-secondary"}`}
//                     >
//                       <Icon />
//                       <p>{item.label}</p>
//                     </li>
//                   </button>
//                 );
//               })}
//             </ul>
//           </nav>
//         </div>

//         {navState === "config" ? (
//           <DeliveryConfig />
//         ) : navState === "tax" ? (
//           <TaxConfig />
//         ) : navState === "inventory" ? (
//           <InventoryConfig />
//         ) : navState === "notification" ? (
//           <NotificationConfig />
//         ) : navState === "payment" ? (
//           <PaymentConfig />
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminSettingsPage;

"use client";
import { FiTruck } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { IoCard } from "react-icons/io5";
import { FaSackDollar } from "react-icons/fa6";
import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth"; // adjust to your auth hook
import { adminApi, AdminSettings } from "@/lib/api/admin";
import DeliveryConfig from "@/components/admin/settings/DeliveryConfig";
import TaxConfig from "@/components/admin/settings/TaxConfig";
import InventoryConfig from "@/components/admin/settings/InventoryConfig";
import NotificationConfig from "@/components/admin/settings/NotificationConfig";
import PaymentConfig from "@/components/admin/settings/PaymentConfig";
import { useAuthStore } from "@/store/auth";

const navSections = [
  { id: "config", label: "Configure Your Store", icon: FiTruck },
  { id: "tax", label: "Tax", icon: FaSackDollar },
  { id: "payment", label: "Payment", icon: IoCard },
  { id: "inventory", label: "Inventory", icon: BsBoxSeam },
  { id: "notification", label: "Notification", icon: IoMdNotificationsOutline },
];

const AdminSettingsPage = () => {
  const [navState, setNavState] = useState("config");
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    adminApi
      .getSettings(accessToken)
      .then(setSettings)
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div className="p-2 md:p-4 lg:p-6 flex flex-col gap-6">
      <p className="text-text-muted text-sm">Configure your store</p>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="rounded-md border border-border p-4 lg:w-[30%] h-fit">
          <nav>
            <ul className="flex flex-col gap-5">
              {navSections.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => setNavState(item.id)}
                  >
                    <li
                      className={`flex items-center text-xs md:text-sm lg:text-base gap-3 ${
                        navState === item.id
                          ? "text-primary"
                          : "text-text-muted hover:text-secondary"
                      }`}
                    >
                      <Icon />
                      <p>{item.label}</p>
                    </li>
                  </button>
                );
              })}
            </ul>
          </nav>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-border p-8">
            <p className="text-sm text-text-muted animate-pulse">
              Loading settings…
            </p>
          </div>
        ) : navState === "config" ? (
          <DeliveryConfig token={accessToken!} shipping={settings?.shipping} />
        ) : navState === "tax" ? (
          <TaxConfig token={accessToken!} tax={settings?.tax} />
        ) : navState === "inventory" ? (
          <InventoryConfig token={accessToken!} />
        ) : navState === "notification" ? (
          <NotificationConfig token={accessToken!} notifications={settings?.notifications} />
        ) : navState === "payment" ? (
          <PaymentConfig token={accessToken!} payment={settings?.payment} />
        ) : null}
      </div>
    </div>
  );
};

export default AdminSettingsPage;