"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

import { AuthProvider } from "@/contexts/auth-context"
import { LoginModal } from "@/components/dashboard/LoginModal"
import { wagmiConfig } from "@/lib/wagmi"

const queryClient = new QueryClient()
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={privyAppId ?? ""}
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
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster
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
