'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { usePrivy } from "@privy-io/react-auth"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"

type LoginMethod = "privy" | "rainbow" | null

type AuthContextValue = {
  isAuthenticated: boolean
  walletAddress: string | null
  connecting: LoginMethod
  showLoginModal: boolean
  connectWithPrivy: () => Promise<void>
  connectWithRainbow: () => Promise<void>
  toggleLoginModal: () => void
  closeLoginModal: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<LoginMethod>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { ready, authenticated, user, login, logout: privyLogout } = usePrivy()
  const { openConnectModal } = useConnectModal()
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()

  useEffect(() => {
    if (!ready) return
    setIsAuthenticated(authenticated)
    setWalletAddress(user?.wallet?.address ?? null)
    if (authenticated) {
      setShowLoginModal(false)
    }
  }, [authenticated, ready, user])

  useEffect(() => {
    if (wagmiConnected && wagmiAddress) {
      setWalletAddress(wagmiAddress)
      setIsAuthenticated(true)
      setShowLoginModal(false)
    } else if (!wagmiConnected && !authenticated) {
      setWalletAddress(null)
      setIsAuthenticated(false)
    }
  }, [authenticated, wagmiAddress, wagmiConnected])

  const connectWithPrivy = useCallback(async () => {
    try {
      setConnecting("privy")
      if (!ready) {
        toast.error("Privy not ready")
        return
      }
      await login()
      toast.success("Authenticated with Privy")
      setShowLoginModal(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to login with Privy")
    } finally {
      setConnecting(null)
    }
  }, [login, ready])

  const connectWithRainbow = useCallback(async () => {
    try {
      setConnecting("rainbow")
      if (!openConnectModal) {
        toast.error("RainbowKit unavailable")
        return
      }
      openConnectModal()
    } catch (error) {
      console.error(error)
      toast.error("Failed to connect wallet")
    } finally {
      setConnecting(null)
    }
  }, [openConnectModal])

  const logout = useCallback(async () => {
    try {
      await privyLogout()
    } catch (error) {
      console.error(error)
    } finally {
      setIsAuthenticated(false)
      setWalletAddress(null)
      toast("Disconnected from TrustyDust")
    }
  }, [privyLogout])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      walletAddress,
      connecting,
      showLoginModal,
      connectWithPrivy,
      connectWithRainbow,
      toggleLoginModal: () => setShowLoginModal((prev) => !prev),
      closeLoginModal: () => setShowLoginModal(false),
      logout,
    }),
    [connecting, connectWithPrivy, connectWithRainbow, isAuthenticated, logout, showLoginModal, walletAddress],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
