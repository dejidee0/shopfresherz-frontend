"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/Toaster";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1 min — matches ISR cadence
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <section className="relative overflow-hidden bg-[#f7faf8] px-4 py-10 sm:px-6 lg:px-8">
          {children}

          {/* Global UI overlays — mounted here so they're above everything,
          including CartDrawer (z-40), ChatWidget (z-50), and Lightbox (z-9999) */}
          <Toaster />
          <ConfirmDialog />
        </section>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
