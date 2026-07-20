import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'

/**
 * Global query client configuration.
 *
 * - staleTime: 5 min — data is considered fresh for 5 minutes
 * - retry: 1 — failed requests retry once
 * - refetchOnWindowFocus: false — don't refetch on tab switch (can be noisy)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

/**
 * Wraps the app with all global providers.
 *
 * Provider order matters:
 * 1. QueryClientProvider — server state management
 * 2. TooltipProvider — shared tooltip delay config
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}
