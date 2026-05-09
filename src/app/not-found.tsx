"use client";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { GoHome } from "react-icons/go";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex flex-col items-center p-2 md:p-4 lg:p-6 mb-20">
        <img src="/images/error404.png" alt="error-404" className=" md:h-80" />
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl lg:text-3xl font-semibold">
            404, Page not found
          </p>
          <p className="text-center text-text-muted text-sm w-full md:w-[60%]">
            Something went wrong. It's look that your requested could not be
            found. It's look like the link is broken or the page is removed.
          </p>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <Button onClick={() => router.back()} className="flex gap-2">
              <FaArrowLeft /> GO BACK
            </Button>
            <Link href={"/store"}>
              <Button variant="secondary">
                {" "}
                <GoHome /> GO TO HOME
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
