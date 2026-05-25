import Image from "next/image";
import Link from "next/link";

export function LaptopPromoSection() {
  return (
    <section className="bg-[#f5f5f7] py-12 px-6 sm:px-12 md:px-16 lg:px-24 flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Content Column */}
        <div className="flex flex-col items-start space-y-5">
          {/* Discount Badge */}
          <span className="bg-[#FF9A2E] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px]">
            Save up to $200.00
          </span>

          {/* Product Title */}
          <h2 className="text-4xl sm:text-4xl font-bold text-[#111111] tracking-tight">
            Macbook Pro
          </h2>

          {/* Product Specs */}
          <p className="text-[#333333] md:w-[350px] text-lg sm:text-xl font-normal leading-relaxed max-w-md">
            Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage
          </p>

          {/* Shop Button */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#FF9A2E] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-[4px] hover:bg-[#e68a2e] transition-colors group"
          >
            Shop Now
            <svg
              className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Right Image Column with Floating Price */}
        <div className="relative flex justify-center md:justify-end items-center">
          {/* Price Badge Circle */}
          <div className="absolute top-2 left-4 md:left-12 lg:left-20 z-10 bg-[#FF9A2E] text-white w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl border-4 border-white shadow-sm select-none">
            $1999
          </div>

          {/* Laptop Image */}
          <div className="w-full max-w-[480px]">
            <Image
              src="/images/laptop.png" // Ensure your image matches this path
              alt="Macbook Pro"
              width={500}
              height={300}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
