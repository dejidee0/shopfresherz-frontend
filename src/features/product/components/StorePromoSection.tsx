import Link from "next/link";
import Image from "next/image";

export function StorePromoSection() {
  return (
    <section className="py-8">
      <div className="max-w-content mx-auto px-2 sm:px-4 lg:px-10">

        {/* Two cards side by side — stacks on mobile only */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* ── Apple HomePod Mini – Light Card ── */}
          <article className="relative flex-1 overflow-hidden rounded-xl bg-[#F5F5F5] px-6 py-7 sm:px-7 sm:py-8">
            {/* Grid: text left | image right, always side by side inside card */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              {/* Text column */}
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit rounded-sm bg-[#F5820A] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-white">
                  Introducing
                </span>
                <h2 className="text-lg font-extrabold leading-snug text-[#111111] sm:text-xl lg:text-2xl xl:text-3xl">
                  New Apple<br />Homepod Mini
                </h2>
                <p className="text-xs leading-5 text-[#6B7280] sm:text-sm sm:leading-6">
                  Jam-packed with innovation, HomePod mini delivers unexpectedly.
                </p>
                <Link
                  href="/store/category/all"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F5820A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#dc7605]"
                >
                  Shop Now →
                </Link>
              </div>

              {/* Image column — fixed width so it never squishes */}
              <div className="w-[80px] sm:w-[80px] lg:w-[150px] xl:w-[180px] shrink-0">
                <Image
                  src="/images/speaker.png"
                  alt="Apple Homepod Mini"
                  width={180}
                  height={180}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </div>
          </article>

          {/* ── Xiaomi Mi 11 Ultra – Dark Card ── */}
          <article className="relative flex-1 overflow-hidden rounded-xl bg-[#181818] px-6 py-7 sm:px-7 sm:py-8">
            {/* Purple price badge */}
            <div className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED] text-xs font-extrabold leading-tight text-white shadow-lg sm:h-14 sm:w-14 sm:text-sm">
              $590
            </div>

            {/* Grid: text left | image right, always side by side inside card */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              {/* Text column */}
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit rounded-sm bg-[#F5820A] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-white">
                  Introducing New
                </span>
                <h2 className="text-lg font-extrabold leading-snug text-white sm:text-xl lg:text-2xl xl:text-3xl">
                  Xiaomi Mi 11 Ultra<br />12GB+256GB
                </h2>
                <p className="text-xs leading-5 text-[#9CA3AF] sm:text-sm sm:leading-6">
                  *Data provided by internal laboratories. Industry measurment.
                </p>
                <Link
                  href="/store/category/all"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#111111] transition-colors hover:bg-[#F0F0F0]"
                >
                  Shop Now →
                </Link>
              </div>

              {/* Image column — fixed width so it never squishes */}
              <div className="w-[80px] sm:w-[100px] lg:w-[130px] xl:w-[160px] shrink-0">
                <Image
                  src="/images/xiaomi.png"
                  alt="Xiaomi Mi 11 Ultra"
                  width={160}
                  height={220}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}