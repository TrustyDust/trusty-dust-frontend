import type { Metadata } from "next"
import "../css/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { CosmicBackground } from "@/components/CosmicBackground"
import { ProvidersWrapper } from "./providers-wrapper"

export const metadata: Metadata = {
  title: "Trusty Dust",
  description: "SocialFi Build on Lisk",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CosmicBackground />
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  )
}
