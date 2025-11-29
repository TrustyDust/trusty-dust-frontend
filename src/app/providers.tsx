"use client"

import { useMemo, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

import { AuthProvider } from "@/contexts/auth-context"
import { LoginModal } from "@/components/dashboard/LoginModal"
import { getWagmiConfig } from "@/lib/wagmi"
import { setupErrorHandler } from "@/lib/error-handler"

const queryClient = new QueryClient()
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function Providers({
  children,
  initialJwt,
}: Readonly<{ children: React.ReactNode; initialJwt?: string | null }>) {
  const wagmiConfig = useMemo(() => getWagmiConfig(), [])

  // Setup error handler untuk suppress chrome.runtime errors dari wallet extensions
  useEffect(() => {
    setupErrorHandler()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={privyAppId ?? ""}
        key="privy-provider"
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#3BA3FF",
          },
          loginMethods: ["email", "google", "wallet"],
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider>
            <AuthProvider initialJwt={initialJwt}>
              <TooltipProvider>
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
              </TooltipProvider>
            </AuthProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  )
}
