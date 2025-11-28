"use client"

import dynamic from "next/dynamic"
import type { PropsWithChildren } from "react"

// WalletConnect/Privy/Wagmi touch indexedDB; disable SSR for the providers bundle.
const ProvidersNoSSR = dynamic(() => import("./providers").then((m) => m.Providers), {
  ssr: false,
})

export function ProvidersWrapper({ children }: Readonly<PropsWithChildren>) {
  return <ProvidersNoSSR>{children}</ProvidersNoSSR>
}
