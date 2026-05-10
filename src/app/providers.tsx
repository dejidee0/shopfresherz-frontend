'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/Toaster'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,   // 1 min — matches ISR cadence
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Global UI overlays — mounted here so they're above everything,
          including CartDrawer (z-40), ChatWidget (z-50), and Lightbox (z-9999) */}
      <Toaster />
      <ConfirmDialog />
    </QueryClientProvider>
  )
}