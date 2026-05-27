export const CarouselSkeleton = () => {
  return (
    <div
      className="lg:col-span-2 relative overflow-hidden rounded-2xl h-50 sm:h-70 lg:h-105 bg-gray-200 animate-pulse"
      aria-hidden="true"
    >
      {/* Slide track skeleton */}
      <div className="flex h-full">
        <div className="min-w-full h-full relative">
          {/* Mobile/Tablet image placeholder */}
          <div className="absolute inset-y-0 right-0 w-[55%] md:hidden bg-gray-300" />

          {/* Text block skeleton */}
          <div className="relative z-10 flex flex-col justify-center h-full pl-4 pr-[48%] py-5 sm:pl-6 sm:pr-[50%] sm:py-7 md:flex-1 md:pr-0 md:pl-0 md:py-8">
            <div className="h-3 w-20 bg-gray-300 rounded mb-3" />

            <div className="h-5 sm:h-6 md:h-8 w-40 sm:w-56 bg-gray-300 rounded mb-3" />

            <div className="hidden xs:block sm:block">
              <div className="h-3 w-32 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-28 bg-gray-300 rounded mb-4" />
            </div>

            <div className="h-8 w-24 bg-gray-300 rounded-lg" />
          </div>

          {/* Desktop image placeholder */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="w-full h-75 sm:h-85 md:h-90 lg:h-100 md:max-w-95 lg:max-w-110 bg-gray-300 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Dot indicators skeleton */}
      <div className="absolute bottom-3 sm:bottom-4 left-8.75 sm:left-6 lg:left-10 flex items-center gap-1.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-gray-300 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export const HeroPromoSkeleton = () => {
  return (
    <div
      className="
    group relative
    bg-[#0B0C0E] rounded-xl lg:rounded-2xl overflow-hidden
    flex flex-col
    h-40 sm:h-50
    lg:flex-1 lg:h-auto
    border border-white/5
    animate-pulse
  "
      aria-hidden="true"
    >
      {/* Badge skeleton */}
      <span
        className="
      absolute top-2.5 right-2.5 sm:top-3 sm:right-3 lg:top-4 lg:right-4
      bg-gray-700 rounded px-3 py-1 h-4 w-12
    "
      />

      {/* Text block skeleton */}
      <div className="absolute bottom-0 left-0 z-10 p-3 sm:p-4 lg:p-7 flex flex-col justify-end">
        {/* Tag */}
        <div className="h-2 w-16 bg-gray-700 rounded mb-1" />

        {/* Title lines */}
        <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
        <div className="h-4 w-24 bg-gray-700 rounded mb-3" />

        {/* CTA button */}
        <div className="h-6 w-20 bg-gray-600 rounded-lg" />
      </div>

      {/* Right-side image skeleton */}
      <div className="absolute hidden sm:block md:right-0 md:bottom-0 w-[55%] h-[110%] bg-gray-800 rounded-lg" />
    </div>
  );
};
