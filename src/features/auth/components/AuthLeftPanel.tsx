import Image from "next/image";

const STATS = [
  { value: "500+", label: "Products" },
  { value: "10K+", label: "Customers" },
  { value: "99%", label: "Satisfaction" },
];

const FEATURES = [
  "100% Authentic Products — No fakes, ever",
  "Secure Payments via Flutterwave",
  "Fast Delivery across Nigeria",
  "24/7 Customer Support",
];

export function AuthLeftPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[#0A0A0A] p-12 lg:flex lg:min-h-screen lg:flex-col">
      {/* Decorative background layers */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 65%)",
          top: "-100px",
          left: "-100px",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 65%)",
          bottom: "-80px",
          right: "-80px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-center" style={{ zIndex: 1 }}>
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3">
          <Image
            src="/icons/logo-mark.png"
            alt="ShopFresherz"
            width={48}
            height={48}
            style={{ borderRadius: "12px", objectFit: "contain" }}
          />
          <div>
            <div className="text-[18px] font-bold text-white">ShopFresherz</div>
            <div className="text-[11px] uppercase tracking-[1.5px] text-[#555555]">
              Gadget Store
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-[340px] text-[40px] font-extrabold leading-[1.15] tracking-[-1px] text-white">
          Nigeria&apos;s <span className="text-[#F97316]">Premium</span> Tech Store
        </div>
        <div className="mt-4 max-w-[320px] text-[15px] leading-[1.7] text-[#666666]">
          Shop the latest gadgets, electronics, and accessories with fast delivery and secure
          payments.
        </div>

        {/* Stats */}
        <div className="mt-10 flex gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-[28px] font-extrabold text-[#F97316]">{value}</div>
              <div className="mt-0.5 text-[12px] text-[#555555]">{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-10 flex flex-col gap-4">
          {FEATURES.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(249,115,22,0.15)] text-[12px] font-bold text-[#F97316]">
                ✓
              </span>
              <span className="text-[14px] text-[#888888]">{item}</span>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="mt-auto border-t border-white/[0.06] pt-10">
          <div className="text-[13px] italic leading-[1.7] text-[#555555]">
            &quot;Fresh Tech, Every Time — ShopFresherz&quot;
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AuthLeftPanel;
