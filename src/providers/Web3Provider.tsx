"use client"

import { PropsWithChildren, useMemo } from "react"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { getWagmiConfig } from "@/lib/wagmi"

export function Web3Provider({ children }: PropsWithChildren) {
  const wagmiConfig = useMemo(() => getWagmiConfig(), [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  )
}
