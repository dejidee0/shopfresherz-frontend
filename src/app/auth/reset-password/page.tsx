"use client";
import { Button } from "@/components/ui/Button";
import AuthCard from "@/features/auth/components/AuthCard";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center my-20">
      <AuthCard className="flex flex-col gap-3 p-4 md:p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold md:text-xl">Reset Password</p>
          <p className="text-text-muted text-xs text-center">
            Enter your new password
          </p>
        </div>

        <form className="flex flex-col items-center p-5 gap-5">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="email" className="text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="rounded-md border border-border p-2"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="confirmPassword" className="text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="rounded-md border border-border p-2"
            />
          </div>
          <Button className="flex gap-2 w-full">
            Reset Password <FaArrowRight />
          </Button>
        </form>

        <div className="text-xs pb-4 flex flex-col gap-2 border-b border-border">
          <p className="flex gap-2">
            Already have account?
            <Link href={"/auth/login"}>
              {" "}
              <button className="text-accent cursor-pointer">Sign In</button>
            </Link>
          </p>
          <p className="flex gap-2">
            Don't have account?
            <Link href={"/auth/register"}>
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

export default ResetPasswordPage;
