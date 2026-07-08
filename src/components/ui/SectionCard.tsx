export default function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[12px] border-[0.5px] border-[rgba(0,0,0,0.07)] shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}
