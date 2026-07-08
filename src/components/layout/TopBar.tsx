export function TopBar() {
  return (
    <div className="flex h-9 w-full items-center bg-[#1A1A2E]">
      <div className="grid w-full grid-cols-1 items-center gap-2 px-4 md:grid-cols-3 md:px-8">
        <div className="hidden text-[11px] text-[#666666] md:block">
          Free shipping on orders over ₦100,000
        </div>

        <div className="text-center text-[11px] font-semibold text-[#F97316]">
          Up to 59% OFF - Flash Sale Today
        </div>

        <div className="hidden items-center justify-end md:flex">
          <a
            href="tel:+2349075308722"
            className="text-[11px] text-[#666666] transition-colors hover:text-[#F97316]"
          >
            +234 907 530 8722 · @shopfresherz
          </a>
        </div>
      </div>
    </div>
  )
}
