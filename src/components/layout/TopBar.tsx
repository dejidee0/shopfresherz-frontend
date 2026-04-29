import { FiPhone } from 'react-icons/fi'
import { RiInstagramLine } from 'react-icons/ri'
import { FaTruck } from 'react-icons/fa'

export function TopBar() {
  return (
    <div className="w-full bg-[#0D0D0D] text-white text-xs h-9 flex items-center">
      <div className="max-w-content mx-auto w-full px-10 flex items-center justify-between">
        {/* Left: Free shipping */}
        <div className="flex items-center gap-2">
          <FaTruck className="text-[#F5820A]" size={14} />
          <span>Free Shipping on orders over ₦500</span>
        </div>

        {/* Center: Promo */}
        <div className="hidden md:block text-center">
          Up to{' '}
          <span className="text-[#F5820A] font-bold text-base">59%</span>{' '}
          OFF
        </div>

        {/* Right: Contact */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+2349075308722"
            className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors"
          >
            <FiPhone size={12} />
            <span>+234 907 530 8722</span>
          </a>
          <a
            href="https://instagram.com/fresherzgadget"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#F5820A] transition-colors"
          >
            <RiInstagramLine size={13} />
            <span>shopfresherz</span>
          </a>
        </div>
      </div>
    </div>
  )
}