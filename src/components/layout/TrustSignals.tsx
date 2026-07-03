import { FiHeadphones, FiRefreshCw, FiShield, FiTruck } from "react-icons/fi";

const TRUST_SIGNALS = [
  {
    icon: FiTruck,
    iconBg: "bg-[rgba(249,115,22,0.12)] shadow-[0_4px_12px_rgba(249,115,22,0.1)]",
    iconColor: "text-[#F97316]",
    title: "Fast Delivery",
    subtitle: "Within Lagos 24hrs",
  },
  {
    icon: FiShield,
    iconBg: "bg-[rgba(34,197,94,0.12)] shadow-[0_4px_12px_rgba(34,197,94,0.08)]",
    iconColor: "text-[#22C55E]",
    title: "Secure Payment",
    subtitle: "Flutterwave protected",
  },
  {
    icon: FiRefreshCw,
    iconBg: "bg-[rgba(96,165,250,0.12)] shadow-[0_4px_12px_rgba(96,165,250,0.08)]",
    iconColor: "text-[#60A5FA]",
    title: "Easy Returns",
    subtitle: "24-hour money back",
  },
  {
    icon: FiHeadphones,
    iconBg: "bg-[rgba(251,191,36,0.12)] shadow-[0_4px_12px_rgba(251,191,36,0.08)]",
    iconColor: "text-[#FBBF24]",
    title: "24/7 Support",
    subtitle: "Live chat + WhatsApp",
  },
];

export function TrustSignals() {
  return (
    <div className="w-full bg-[#0F0F0F] border-y border-white/[0.05]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.04]">
        {TRUST_SIGNALS.map(({ icon: Icon, iconBg, iconColor, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3.5 px-6 py-5">
            <span className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${iconBg}`}>
              <Icon className={iconColor} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-white leading-tight">
                {title}
              </span>
              <span className="block mt-1 text-[11px] text-[#555555] leading-tight">
                {subtitle}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
