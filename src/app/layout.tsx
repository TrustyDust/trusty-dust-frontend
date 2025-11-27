import type { Metadata } from "next"
import { Providers } from "./providers"
import "../css/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { CosmicBackground } from "@/components/CosmicBackground"

export const metadata: Metadata = {
  title: "Trusty Dust",
  description: "SocialFi Build on Lisk",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CosmicBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
