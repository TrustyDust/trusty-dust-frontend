"use client"

import { useMemo, useId } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

import { AuthProvider } from "@/contexts/auth-context"
import { LoginModal } from "@/components/dashboard/LoginModal"
import { getWagmiConfig } from "@/lib/wagmi"
import { privyConfig } from "@/lib/privy"
import { LoadingProvider } from "@/contexts/loading-context"

const queryClient = new QueryClient()
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function Providers({
  children,
  initialJwt,
}: Readonly<{ children: React.ReactNode; initialJwt?: string | null }>) {
  const wagmiConfig = useMemo(() => getWagmiConfig(), [])
  const loadKey = useId()
  const privyKey = useId()
  const wagmiKey = useId()
  const rkKey = useId()

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider key={loadKey}>
        <PrivyProvider
          key={privyKey}
          appId={privyAppId ?? ""}
          config={privyConfig}
        >
          <WagmiProvider key={wagmiKey} config={wagmiConfig}>
            <RainbowKitProvider key={rkKey}>
              <AuthProvider initialJwt={initialJwt}>
                <TooltipProvider>
                  <div className="contents">
                    {children}
                    <Toaster
                      key="trustydust-toaster"
                      richColors
                      closeButton
                      position="top-right"
                      toastOptions={{
                        style: {
                          background: "hsl(var(--background))",
                          color: "hsl(var(--foreground))",
                          border: "1px solid hsl(var(--border))",
                        },
                      }}
                    />
                    <LoginModal />
                  </div>
                </TooltipProvider>
              </AuthProvider>
            </RainbowKitProvider>
          </WagmiProvider>
        </PrivyProvider>
      </LoadingProvider>
    </QueryClientProvider>
  )
}
