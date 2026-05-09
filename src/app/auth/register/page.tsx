"use client"
import AuthCard from "@/features/auth/components/AuthCard"
import LoginForm from "@/features/auth/components/LoginForm"


const RegisterPage = () => {
  return (
     <div className="flex items-center justify-center my-20">
      <AuthCard>
        <LoginForm/>
      </AuthCard>
    </div>
  )
}

export default RegisterPage