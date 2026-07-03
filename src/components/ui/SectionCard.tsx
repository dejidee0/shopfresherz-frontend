export default function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#141414] rounded-[12px] border-[0.5px] border-white/[0.08] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${className}`}>
      {children}
    </div>
  );
}
