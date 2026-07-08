"use client"
import AuthCard from "@/features/auth/components/AuthCard"
import LoginForm from "@/features/auth/components/LoginForm"
import AuthLeftPanel from "@/features/auth/components/AuthLeftPanel"


const RegisterPage = () => {
  return (
    <div className="grid min-h-screen bg-[#F5F2ED] lg:grid-cols-[45%_55%]">
      <AuthLeftPanel />
      <main className="flex items-center justify-center bg-[#F5F2ED] px-6 py-12">
        <AuthCard>
          <LoginForm />
        </AuthCard>
      </main>
    </div>
  )
}

export default RegisterPage
