"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import AuthLeftPanel from "@/features/auth/components/AuthLeftPanel";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleAuth, useLogin, useRegister } from "@/lib/hooks/useAuth";
import { toast } from "@/store/toast";

type AuthMode = "signin" | "signup";

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

function Field({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[#666666]">{label}</span>
      <span className="flex h-12 items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#FFFFFF] px-3 text-[#888888] transition focus-within:border-[rgba(249,115,22,0.5)] focus-within:ring-4 focus-within:ring-[#F97316]/10">
        <span className="text-[17px]">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111111] outline-none placeholder:text-[#AAAAAA]"
        />
      </span>
    </label>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
}: Omit<FieldProps, "icon" | "type">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[#666666]">{label}</span>
      <span className="flex h-12 items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#FFFFFF] px-3 text-[#888888] transition focus-within:border-[rgba(249,115,22,0.5)] focus-within:ring-4 focus-within:ring-[#F97316]/10">
        <FiLock className="text-[17px]" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111111] outline-none placeholder:text-[#AAAAAA]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="grid h-8 w-8 place-items-center rounded-md text-[#666666] transition hover:bg-black/[0.04] hover:text-[#111111]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </span>
    </label>
  );
}

export default function ShopFresherzAuth() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { mutate: googleAuth, isPending: googlePending } = useGoogleAuth();
  const { mutate: login, isPending: loginPending, error: loginError } = useLogin();
  const { mutate: register, isPending: registerPending, error: registerError } = useRegister();

  const loading = isSignup ? registerPending : loginPending;
  const error = isSignup ? registerError?.message : loginError?.message;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setRemember(false);
    setAgreedToTerms(false);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetForm();
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google sign in failed", "No credential returned from Google.");
      return;
    }
    googleAuth(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    toast.error("Google sign in failed", "Could not complete Google sign-in. Please try again.");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!agreedToTerms) {
        alert("Please agree to the terms.");
        return;
      }
      register({ firstName, lastName, email, password, confirmPassword });
      return;
    }

    login({ email, password });
  };

  return (
    <section className="grid min-h-screen bg-[#F5F2ED] lg:grid-cols-[45%_55%]">
      <AuthLeftPanel />

      <main className="flex items-center justify-center bg-[#F5F2ED] px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src="/icons/logo-mark.png"
              alt="ShopFresherz"
              width={40}
              height={40}
              style={{ borderRadius: '10px', objectFit: 'contain' }}
            />
            <div>
              <p className="text-base font-extrabold text-[#111111]">ShopFresherz</p>
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#F97316]">
                Gadget Store
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 rounded-[12px] border border-[rgba(0,0,0,0.07)] bg-[#FFFFFF] p-1">
            {(["signin", "signup"] as AuthMode[]).map((authMode) => {
              const active = mode === authMode;
              return (
                <button
                  key={authMode}
                  type="button"
                  onClick={() => switchMode(authMode)}
                  className={`h-11 rounded-[9px] text-sm font-medium transition-all duration-200 ${
                    active ? "bg-[#F5F2ED] text-[#111111]" : "text-[#888888] hover:text-[#111111]"
                  }`}
                >
                  {authMode === "signin" ? "Sign in" : "Create account"}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-bold uppercase text-[#F97316]">
              {isSignup ? "New here?" : "Welcome back"}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.5px] text-[#111111]">
              {isSignup ? "Create your account" : "Access your account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#666666]">
              {isSignup
                ? "Save wishlists, track orders, and shop faster."
                : "Sign in to continue shopping, track orders, and manage your gadgets."}
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {isSignup && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" icon={<FiUser />} placeholder="John" value={firstName} onChange={setFirstName} autoComplete="given-name" />
                <Field label="Last name" icon={<FiUser />} placeholder="Doe" value={lastName} onChange={setLastName} autoComplete="family-name" />
              </div>
            )}

            <Field label="Email address" icon={<FiMail />} type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />
            <PasswordField label="Password" placeholder={isSignup ? "Min 8 chars, 1 uppercase, 1 number" : "Enter your password"} value={password} onChange={setPassword} autoComplete={isSignup ? "new-password" : "current-password"} />

            {isSignup && (
              <PasswordField label="Confirm password" placeholder="Re-enter your password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            )}

            {!isSignup ? (
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#666666]">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-black/[0.12] accent-[#F97316]" />
                  Remember me
                </label>
                <Link href="/auth/forget-password" className="text-sm font-bold text-[#F97316] transition hover:underline">
                  Forgot password?
                </Link>
              </div>
            ) : (
              <label className="flex cursor-pointer items-start gap-2 pt-1 text-sm leading-6 text-[#666666]">
                <input type="checkbox" checked={agreedToTerms} onChange={(event) => setAgreedToTerms(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 rounded border-black/[0.12] accent-[#F97316]" />
                <span>
                  I agree to ShopFresherz{" "}
                  <a href="#" className="font-bold text-[#F97316] hover:underline">Terms</a>{" "}
                  and{" "}
                  <a href="#" className="font-bold text-[#F97316] hover:underline">Privacy Policy</a>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading || googlePending}
              className="sf-btn-primary mt-1 h-[52px] w-full rounded-[12px] text-[15px] font-bold disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {isSignup ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>
                  {isSignup ? "Create account" : "Sign in"}
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/[0.08]" />
            <span className="text-[11px] font-bold uppercase text-[#888888]">or</span>
            <div className="h-px flex-1 bg-black/[0.08]" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            shape="rectangular"
            text={isSignup ? "signup_with" : "signin_with"}
          />

          <p className="mt-6 text-center text-sm text-[#666666]">
            Need help?{" "}
            <Link href="/store/support" className="font-bold text-[#F97316] transition hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </main>
    </section>
  );
}
