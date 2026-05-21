const SEGMENTS = [
  "Nigeria's most trusted destination for tech enthusiasts",
  "Fresh gadgets at competitive prices",
  "Free shipping on orders over ₦100,000",
  "Up to 59% off on select products",
  "New arrivals every week — don't miss out",
];

export function MarqueeBanner() {
  return (
    <div className="w-full bg-[#F5820A] overflow-hidden">
      <div
        className="flex w-max animate-[marquee_15s_linear_infinite] [@keyframes_marquee]{0%{transform:translateX(0%)}100%{transform:translateX(-100%)}} hover:[animation-play-state:paused]"
        aria-label="ShopFresherz tagline"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center whitespace-nowrap py-3.5"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {SEGMENTS.map((text, i) => (
              <span key={i} className="flex items-center">
                <span className="text-[13px] font-medium text-white tracking-wide px-8">
                  {text}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
