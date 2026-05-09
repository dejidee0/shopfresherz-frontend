import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";

const LoginForm = () => {
  const [authStatus, setAuthStatus] = useState("signin");
  const path = usePathname();
  const router = useRouter()

  // write logic that will display form based on route
 // Run only when path changes
  useEffect(() => {
    if (path.endsWith("login")) {
      setAuthStatus("signin");
    } else if (path.endsWith("register")) {
      setAuthStatus("signup");
    }
  }, [path]);

  return (
    <>
      <div className="flex border-b border-b-border ">
        <div
          onClick={() => router.push("/auth/login")}
          className={`${authStatus === "signin" && "border-b-4"} flex items-center justify-center px-10 py-5 border-b-primary w-[50%] cursor-pointer`}
        >
          <p className="font-semibold">Sign In</p>
        </div>

        <div
          onClick={() => router.push("/auth/register")}
          className={`${authStatus === "signup" && "border-b-4"} flex items-center justify-center px-10 py-5 border-b-primary w-[50%] cursor-pointer`}
        >
          <p className="font-semibold">Sign Up</p>
        </div>
      </div>
      {authStatus === "signin" && (
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

          <Button className="w-full">
            {" "}
            SIGN IN <FaArrowRight />
          </Button>

          {/* <p>--------------------- or ---------------------</p> */}

          {/* //Google login button */}
          {/* // Apple login button */}
        </form>
      )}

      {authStatus === "signup" && (
        <form className="flex flex-col items-center p-5 gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="fullname" className="text-sm">
              Name
            </label>
            <input
              id="fullname"
              type="text"
              className="rounded-md border border-border p-2"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="rounded-md border border-border p-2"
            />
          </div>

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

          <div className="flex gap-2 items-start">
            <input type="checkbox" name="" id="" className="accent-amber-600" />
            <p className="text-xs">
              Do you agree to shopfresher’z{" "}
              <a href="#" className="text-purple-600">
                Terms of Condition
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600">
                Privacy Policy
              </a>
              ?
            </p>
          </div>

          <Button className="w-full">
            {" "}
            SIGN UP <FaArrowRight />
          </Button>

          {/* <p>--------------------- or ---------------------</p> */}

          {/* //Google login button */}
          {/* // Apple login button */}
        </form>
      )}
    </>
  );
};

export default LoginForm;
