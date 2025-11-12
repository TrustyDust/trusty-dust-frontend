import type { Metadata } from "next"
import { Providers } from "./providers"
import "../css/globals.css"

export const metadata: Metadata = {
  title: "Trusty Dust",
  description: "SocialFi Build on Lisk",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
