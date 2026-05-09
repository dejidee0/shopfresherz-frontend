"use client";
import { Button } from "@/components/ui/Button";
import AuthCard from "@/features/auth/components/AuthCard";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const ForgetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center my-20">
      <AuthCard className="flex flex-col gap-3 p-4 md:p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold md:text-xl">Reset Password</p>
          <p className="text-text-muted text-xs text-center">
            Enter the email address or mobile phone number associated with your
            ShopFresherz account.
          </p>
        </div>

        <form className="flex flex-col items-center p-5 gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              className="rounded-md border border-border p-2"
            />
          </div>
          <Button className="flex gap-2 w-full">
            Send Code <FaArrowRight />
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

export default ForgetPasswordPage;
