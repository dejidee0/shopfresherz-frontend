"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/Toaster";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSessionManager } from "@/lib/hooks/useSessionManager";

export function Providers({ children }: { children: React.ReactNode }) {
  useSessionManager();

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
        {children}

        {/* Global UI overlays — mounted here so they're above everything,
          including CartDrawer (z-40), ChatWidget (z-50), and Lightbox (z-9999) */}
        <Toaster />
        <ConfirmDialog />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
