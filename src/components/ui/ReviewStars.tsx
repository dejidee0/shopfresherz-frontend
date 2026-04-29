import { HiStar, HiOutlineStar } from "react-icons/hi2";

interface ReviewStarsProps {
  rating: number;
  max?: number;
  size?: number;
}

export default function ReviewStars({ rating, max = 5, size = 16 }: ReviewStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        i < rating ? (
          <HiStar key={i} size={size} className="text-[#F97316]" />
        ) : (
          <HiOutlineStar key={i} size={size} className="text-gray-300" />
        )
      ))}
    </div>
  );
}