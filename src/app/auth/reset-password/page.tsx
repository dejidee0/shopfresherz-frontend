"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import AuthCard from "@/features/auth/components/AuthCard";
import { authApi } from "@/lib/api/auth";
import { toast } from "@/store/toast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryEmail = params.get("email");

    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextEmail = email.trim().toLowerCase();
    const nextOtp = otp.trim();

    if (!nextEmail || !emailPattern.test(nextEmail)) {
      setError("Enter the email address that received the reset code.");
      return;
    }

    if (!/^\d{6}$/.test(nextOtp)) {
      setError("Enter the 6-digit reset code from your email.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await authApi.resetPassword({
        email: nextEmail,
        otp: nextOtp,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      toast.success("Password reset", "You can now sign in with your new password.");
      router.push("/auth/login");
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err && typeof err.message === "string"
          ? err.message
          : "Unable to reset password. Check your code and try again.";
      toast.error("Password reset failed", message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-20 px-4">
      <AuthCard className="flex flex-col gap-3 p-4 md:p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold md:text-xl">Reset Password</p>
          <p className="text-text-muted text-xs text-center">
            Enter your email, 6-digit code, and new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center p-5 gap-5" noValidate>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="email" className="text-sm">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => {
                setError("");
                setEmail(event.target.value);
              }}
              autoComplete="email"
              placeholder="customer@example.com"
              className="rounded-md border border-border p-2"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="otp" className="text-sm">
              Reset Code
            </label>
            <input
              type="text"
              id="otp"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setError("");
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
              }}
              autoComplete="one-time-code"
              placeholder="123456"
              className="rounded-md border border-border p-2 tracking-[0.3em]"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="newPassword" className="text-sm">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(event) => {
                setError("");
                setNewPassword(event.target.value);
              }}
              autoComplete="new-password"
              className="rounded-md border border-border p-2"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="confirmPassword" className="text-sm">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => {
                setError("");
                setConfirmPassword(event.target.value);
              }}
              autoComplete="new-password"
              className="rounded-md border border-border p-2"
            />
          </div>

          {error && (
            <p className="w-full text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="flex gap-2 w-full" isLoading={isSubmitting}>
            Reset Password <FaArrowRight />
          </Button>
        </form>

        <div className="text-xs pb-4 flex flex-col gap-2 border-b border-border">
          <p className="flex gap-2">
            Already have account?
            <Link href="/auth/login">
              <button className="text-accent cursor-pointer">Sign In</button>
            </Link>
          </p>
          <p className="flex gap-2">
            Need a new code?
            <Link href="/auth/forget-password">
              <button className="text-accent cursor-pointer">Request Code</button>
            </Link>
          </p>
        </div>

        <p className="text-xs py-3">
          Reset codes expire after 15 minutes. Request a new code if yours has expired.
        </p>
      </AuthCard>
    </div>
  );
};

export default ResetPasswordPage;
