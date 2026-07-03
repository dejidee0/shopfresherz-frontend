"use client"
import AuthCard from "@/features/auth/components/AuthCard"
import LoginForm from "@/features/auth/components/LoginForm"


const RegisterPage = () => {
  return (
    <div className="grid min-h-screen bg-[#0A0A0A] lg:grid-cols-[45%_55%]">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-[#F97316] via-[#C2410C] to-[#7C1900] lg:flex lg:items-center lg:justify-center">
        <div className="absolute -left-16 top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative text-center">
          <div className="text-[120px] font-black tracking-[-4px] text-white [text-shadow:0_0_35px_rgba(255,255,255,0.35)]">SF</div>
          <div className="mt-2 text-[26px] font-bold text-white">ShopFresherz</div>
          <div className="mt-1 text-[15px] text-white/70">Fresh Tech, Every Time</div>
          <div className="mt-8 space-y-3 text-left text-sm text-white/80">
            <p>✓ 100% Authentic Products</p>
            <p>✓ Secure Payments via Flutterwave</p>
            <p>✓ Fast Delivery Across Nigeria</p>
          </div>
        </div>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <AuthCard>
          <LoginForm />
        </AuthCard>
      </main>
    </div>
  )
}

export default RegisterPage
