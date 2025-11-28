"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains"

const walletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""

// Lazily build config to avoid touching WalletConnect (indexedDB) during SSR.
let cachedConfig: ReturnType<typeof getDefaultConfig> | null = null

export function getWagmiConfig() {
  if (cachedConfig) return cachedConfig

  cachedConfig = getDefaultConfig({
    appName: "TrustyDust",
    projectId: walletConnectId,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false,
  })

  return cachedConfig
}
