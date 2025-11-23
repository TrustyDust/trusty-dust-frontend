'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { usePrivy } from "@privy-io/react-auth"

type LoginMethod = "privy" | "rainbow" | null

type AuthContextValue = {
  isAuthenticated: boolean
  walletAddress: string | null
  connecting: LoginMethod
  connectWithPrivy: () => Promise<void>
  connectWithRainbow: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<LoginMethod>(null)
  const { ready, authenticated, user, login, logout: privyLogout } = usePrivy()

  useEffect(() => {
    if (!ready) return
    setIsAuthenticated(authenticated)
    setWalletAddress(user?.wallet?.address ?? null)
  }, [authenticated, ready, user])

  const connectWithPrivy = useCallback(async () => {
    try {
      setConnecting("privy")
      if (!ready) {
        toast.error("Privy not ready")
        return
      }
      await login()
      toast.success("Authenticated with Privy")
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
      if (typeof window === "undefined") {
        throw new Error("Window is not available")
      }
      const provider = (window as any)?.ethereum
      if (!provider) {
        toast.error("No Ethereum provider detected")
        return
      }
      const accounts = await provider.request({ method: "eth_requestAccounts" })
      setWalletAddress(accounts?.[0] ?? null)
      setIsAuthenticated(true)
      toast.success("Wallet connected")
    } catch (error) {
      console.error(error)
      toast.error("Failed to connect wallet")
    } finally {
      setConnecting(null)
    }
  }, [])

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
      connectWithPrivy,
      connectWithRainbow,
      logout,
    }),
    [connecting, connectWithPrivy, connectWithRainbow, isAuthenticated, logout, walletAddress],
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
