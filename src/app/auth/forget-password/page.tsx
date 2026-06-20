"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import AuthCard from "@/features/auth/components/AuthCard";
import { authApi } from "@/lib/api/auth";
import { toast } from "@/store/toast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextEmail = email.trim().toLowerCase();

    if (!nextEmail) {
      setError("Enter your email address.");
      return;
    }

    if (!emailPattern.test(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await authApi.forgotPassword({ email: nextEmail });
      toast.success(
        "Check your email",
        "If an account exists for that email, a 6-digit reset code has been sent."
      );
      router.push(`/auth/reset-password?email=${encodeURIComponent(nextEmail)}`);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err && typeof err.message === "string"
          ? err.message
          : "Unable to send reset code. Please try again.";
      toast.error("Reset code not sent", message);
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
            Enter the email address associated with your ShopFresherz account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center p-5 gap-5" noValidate>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setError("");
                setEmail(event.target.value);
              }}
              autoComplete="email"
              placeholder="customer@example.com"
              className="rounded-md border border-border p-2"
            />
            {error && (
              <p className="text-xs text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" className="flex gap-2 w-full" isLoading={isSubmitting}>
            Send Code <FaArrowRight />
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
            Don&apos;t have account?
            <Link href="/auth/register">
              <button className="text-accent cursor-pointer">Sign Up</button>
            </Link>
          </p>
        </div>

        <p className="text-xs py-3">
          You may contact Customer Service for help restoring access to your
          account.
        </p>
      </AuthCard>
    </div>
  );
};

export default ForgetPasswordPage;
