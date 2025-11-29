import { PrivyClientConfig } from "@privy-io/react-auth"

export const privyConfig: PrivyClientConfig = {
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
}
