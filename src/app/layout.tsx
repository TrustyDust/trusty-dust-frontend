import type { Metadata } from "next"
import { Providers } from "./providers"
import "../css/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import BackgroundVideo from "@/components/BackgroundVideo"

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
        <BackgroundVideo/>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
