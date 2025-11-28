"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useConnection, useDisconnect, useSignMessage } from "wagmi"

import { useLoginApi } from "@/hooks/api/auth"
import { AUTH_MESSAGE } from "@/constant/auth"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Address } from "viem"
import { toast } from "sonner"

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<AuthContextType["connecting"]>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const loginApi = useLoginApi()

  const { openConnectModal: connectWithRainbow } = useConnectModal();
  const { address, isConnected } = useConnection()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const {
    login: connectWithPrivyOrigin,
    user: privyUser,
    authenticated,
    signMessage: privySignMessage,
    logout: privyLogout
  } = usePrivy()

  const openLoginModal = useCallback(() => setShowLoginModal(true), [])
  const closeLoginModal = useCallback(() => setShowLoginModal(false), [])
  const connectWithPrivy = () => {
    connectWithPrivyOrigin()
  }

  useEffect(() => {
    const completeRainbowKitLogin = async () => {
      try {
        if (!address || !isConnected || isAuthenticated || loginApi.isPending) return

        const signature = await signMessageAsync({
          message: AUTH_MESSAGE,
          account: address,
        })

        await loginApi.mutateAsync({
          walletAddress: address,
          signature,
          message: AUTH_MESSAGE,
        })

        setIsAuthenticated(true)
        setWalletAddress(address)
        setShowLoginModal(false)

        toast.success('sign in success')
      } catch (error) {
        setIsAuthenticated(false)
        disconnect()

        const message = `Rainbow login failed : ${error}`
        console.error(message)
        toast.error(message)
      } finally {
        setConnecting(null)
      }
    }

    completeRainbowKitLogin()
  }, [address, isConnected])

  useEffect(() => {
    const completePrivyLogin = async () => {
      if (!authenticated || !privyUser?.wallet?.address || isAuthenticated || loginApi.isPending) return

      try {
        const wallet = privyUser.wallet.address
        const sign = await privySignMessage({
          message: AUTH_MESSAGE,
        })

        await loginApi.mutateAsync({
          walletAddress: wallet as Address,
          signature: sign.signature,
          message: AUTH_MESSAGE
        })

        setIsAuthenticated(true)
        setWalletAddress(wallet)
        setShowLoginModal(false)

        toast.success('sign in success')
      } catch (error) {
        setIsAuthenticated(false)
        privyLogout()

        const message = `Privy login failed : ${error}`
        console.error(message)
        toast.error(message)
      } finally {
        setConnecting(null)
      }
    }

    completePrivyLogin()
  }, [authenticated, loginApi, privySignMessage, privyUser])

  const logout = useCallback(async () => {
    try {
      await privyLogout()
      disconnect()
    } catch (error) {
      console.error("Logout error", error)
    } finally {
      setIsAuthenticated(false)
      setWalletAddress(null)
      setShowLoginModal(true)
    }
  }, [disconnect, privyLogout])

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      walletAddress,
      connecting,
      showLoginModal,
      openLoginModal,
      closeLoginModal,
      connectWithRainbow,
      connectWithPrivy,
      logout,
    }),
    [
      closeLoginModal,
      connectWithPrivy,
      connectWithRainbow,
      connecting,
      isAuthenticated,
      logout,
      openLoginModal,
      showLoginModal,
      walletAddress,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export type AuthContextType = {
  isAuthenticated: boolean
  walletAddress: string | null
  connecting: "rainbow" | "privy" | null
  showLoginModal: boolean

  openLoginModal: () => void
  closeLoginModal: () => void
  connectWithRainbow?: (() => void) | undefined
  connectWithPrivy: () => void
  logout: () => void
}
