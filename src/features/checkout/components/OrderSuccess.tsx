'use client'

import Link from 'next/link'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

export default function OrderSuccessPage() {
  return (
    <div className="bg-[#F5F2ED] max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-6 min-h-[60vh] flex items-center justify-center">
      <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-4 max-w-sm w-full p-8">

        {/* Icon */}
        <div className="relative flex items-center justify-center">
          {/* Outer soft ring */}
          <div className="w-24 h-24 rounded-full bg-green-100/70" />
          {/* Inner filled circle */}
          <div className="absolute w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
            <FiCheckCircle size={32} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">
            Your order is successfully placed
          </h1>
          <p className="text-sm text-[#666666]">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

       

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-11 px-8 rounded bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors mt-2"
        >
          HOME PAGE <FiArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
