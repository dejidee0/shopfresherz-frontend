"use client";
import { Button } from "@/components/ui/Button";
import AuthCard from "@/features/auth/components/AuthCard";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const VerifyEmailPage = () => {
  return (
    <div className="flex items-center justify-center my-20">
      <AuthCard className="flex flex-col gap-3 p-4 md:p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold md:text-xl">Verify Your Email Address</p>
          <p className="text-text-muted text-xs text-center">
            We've sent a verification code to your email. Please enter it below to continue.
          </p>
        </div>

        <form className="flex flex-col items-center p-5 gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="verification-code" className="text-sm">
              Verification Code
            </label>
            <input
              id="verification-code"
              type="text"
              className="rounded-md border border-border p-2"
            />
          </div>
          <Button className="flex gap-2 w-full">
            VERIFY ME <FaArrowRight />
          </Button>
        </form>
      </AuthCard>
    </div>
  );
};

export default VerifyEmailPage;
