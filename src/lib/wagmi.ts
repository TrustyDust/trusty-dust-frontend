import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains"

const walletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""

export const wagmiConfig = getDefaultConfig({
  appName: "TrustyDust",
  projectId: walletConnectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
})
