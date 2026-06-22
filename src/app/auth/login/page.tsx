"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { useLogin, useRegister, useGoogleAuth } from "@/lib/hooks/useAuth";
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from "@react-oauth/google";
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
      <span className="text-[11px] font-bold uppercase text-slate-500">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 shadow-sm transition focus-within:border-[#F5820A] focus-within:ring-4 focus-within:ring-[#F5820A]/10">
        <span className="text-[17px]">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
        />
      </span>
    </label>
  );
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase text-slate-500">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 shadow-sm transition focus-within:border-[#F5820A] focus-within:ring-4 focus-within:ring-[#F5820A]/10">
        <FiLock className="text-[17px]" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#F5820A]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </span>
    </label>
  );
}

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

function Benefit({ icon, title, text }: BenefitProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-950">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function ShopFresherzAuth() {
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

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState<number>();

  const { mutate: login, isPending: loginPending, error: loginError } = useLogin();
  const {
    mutate: register,
    isPending: registerPending,
    error: registerError,
  } = useRegister();

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


  useEffect(() => {
    if (!googleButtonContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setGoogleButtonWidth(Math.floor(width));
    });
    observer.observe(googleButtonContainerRef.current);
    return () => observer.disconnect();
  }, []);

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
    <section className="relative overflow-hidden bg-[#f7faf8] md:px-4 py-10  lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative mx-auto grid w-full max-w-6xl  rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden border-r border-slate-200 bg-[#fbfdfc] p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#F5820A] text-xl text-white shadow-lg shadow-orange-200">
                <FiShoppingBag />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-950">ShopFresherz</p>
                <p className="text-[11px] font-bold uppercase text-emerald-700">
                  Gadget Store
                </p>
              </div>
            </div>

            <div className="mt-12 max-w-md">
              <p className="inline-flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#b45309]">
                <FiCheckCircle />
                Member dashboard
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-950">
                Fresh gadgets, secure checkout, and faster order tracking.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Sign in once to manage orders, saved items, delivery updates, and
                exclusive ShopFresherz deals from one clean account.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-5">
            <Benefit
              icon={<FiShield />}
              title="Protected account"
              text="Your saved details and order activity stay secure."
            />
            <Benefit
              icon={<FiTruck />}
              title="Live order updates"
              text="Follow your delivery from checkout to doorstep."
            />
            <Benefit
              icon={<FiZap />}
              title="Early deal access"
              text="Members see select flash deals before everyone else."
            />
          </div>

          <div className="mt-12 grid grid-cols-3 gap-3">
            {[
              { value: "50K+", label: "Customers" },
              { value: "15+", label: "Categories" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                <p className="text-xl font-extrabold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <div className="p-2 md:p-6 lg:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#F5820A] text-lg text-white">
              <FiShoppingBag />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-950">ShopFresherz</p>
              <p className="text-[10px] font-bold uppercase text-emerald-700">
                Gadget Store
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1">
            {(["signin", "signup"] as AuthMode[]).map((authMode) => {
              const active = mode === authMode;

              return (
                <button
                  key={authMode}
                  type="button"
                  onClick={() => switchMode(authMode)}
                  className={`h-8 md:h-11 rounded-md text-sm font-bold transition ${
                    active
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {authMode === "signin" ? "Sign in" : "Create account"}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-bold uppercase text-[#F5820A]">
              {isSignup ? "New here?" : "Welcome back"}
            </p>
            <h2 className="mt-2 text-lg md:text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {isSignup ? "Create your ShopFresherz account" : "Access your account"}
            </h2>
            <p className="mt-2 text-xs md:text-sm md:leading-6 text-slate-600">
              {isSignup
                ? "Set up your account to save wishlists, track orders, and shop faster."
                : "Sign in to continue shopping, track orders, and manage your gadgets."}
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {isSignup && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First name"
                  icon={<FiUser />}
                  placeholder="John"
                  value={firstName}
                  onChange={setFirstName}
                  autoComplete="given-name"
                />
                <Field
                  label="Last name"
                  icon={<FiUser />}
                  placeholder="Doe"
                  value={lastName}
                  onChange={setLastName}
                  autoComplete="family-name"
                />
              </div>
            )}

            <Field
              label="Email address"
              icon={<FiMail />}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />

            <PasswordField
              label="Password"
              placeholder={isSignup ? "Min 8 chars, 1 uppercase, 1 number" : "Enter your password"}
              value={password}
              onChange={setPassword}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />

            {isSignup && (
              <PasswordField
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />
            )}

            {!isSignup ? (
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-[#F5820A]"
                  />
                  Remember me
                </label>
                <Link
                  href="/auth/forget-password"
                  className="text-sm font-bold text-[#F5820A] transition hover:text-[#d96f06]"
                >
                  Forgot password?
                </Link>
              </div>
            ) : (
              <label className="flex cursor-pointer items-start gap-2 pt-1 text-sm leading-6 text-slate-600">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#F5820A]"
                />
                <span>
                  I agree to ShopFresherz{" "}
                  <a href="#" className="font-bold text-[#F5820A] hover:text-[#d96f06]">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-bold text-[#F5820A] hover:text-[#d96f06]">
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading || googlePending}
              className="mt-1 flex h-10 md:h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F5820A] text-sm font-extrabold uppercase text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#df7408] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-bold uppercase text-slate-400">
              or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

         <div className="grid grid-cols-1 gap-3 w-full">
          <div ref={googleButtonContainerRef} className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="rectangular"
              // width={googleButtonWidth}
              text={isSignup ? "signup_with" : "signin_with"}
            />
          </div>
         </div>



          <p className="mt-6 text-center text-sm text-slate-500">
            Need help?{" "}
            <Link
              href="/store/support"
              className="font-bold text-[#F5820A] transition hover:text-[#d96f06]"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export { ShopFresherzAuth as LoginPage };
export default ShopFresherzAuth;
