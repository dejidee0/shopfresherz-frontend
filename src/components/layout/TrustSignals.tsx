import { FaShippingFast } from "react-icons/fa";
import { LiaAwardSolid } from "react-icons/lia";
import { MdOutlinePayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const TRUST_SIGNALS = [
  {
    icon: FaShippingFast,
    title: "FASTER DELIVERY",
    subtitle: "Delivery in 24/H",
  },
  {
    icon: LiaAwardSolid,
    title: "24 HOURS RETURN",
    subtitle: "100% money-back guarantee",
  },
  {
    icon: MdOutlinePayment,
    title: "SECURE PAYMENT",
    subtitle: "Your money is safe",
  },
  {
    icon: BiSupport,
    title: "SUPPORT 24/7",
    subtitle: "Live contact/message",
  },
];

export function TrustSignals() {
  return (
    <div className="w-full border border-[#E5E7EB] rounded-card">
      <div className="max-w-content mx-auto md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-[#E5E7EB]">
          {TRUST_SIGNALS.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex flex-col md:flex-row items-center md:gap-3 p-2 md:py-5 md:px-6"
            >
              <Icon className="text-[#111111] shrink-0" size={28} />
              <div className="flex flex-col">
                <p className="text-sm text-center md:text-start font-bold text-[#111111] leading-tight">
                  {title}
                </p>
                <p className="text-xs text-center md:text-start text-[#6B7280] mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
