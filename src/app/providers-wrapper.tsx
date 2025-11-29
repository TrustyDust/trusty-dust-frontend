"use client"

import dynamic from "next/dynamic"
import type { PropsWithChildren } from "react"

// WalletConnect/Privy/Wagmi touch indexedDB; disable SSR for the providers bundle.
const ProvidersNoSSR = dynamic(() => import("./providers").then((m) => m.Providers), {
  ssr: false,
})

type ProvidersWrapperProps = Readonly<PropsWithChildren<{ initialJwt?: string | null }>>

export function ProvidersWrapper({ children, initialJwt }: ProvidersWrapperProps) {
  return <ProvidersNoSSR initialJwt={initialJwt}>{children}</ProvidersNoSSR>
}
