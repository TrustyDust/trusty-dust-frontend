"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useConnection, useDisconnect, useSignMessage } from "wagmi"

import { useLoginApi } from "@/hooks/api/auth"
import { AUTH_MESSAGE } from "@/constant/auth"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Address } from "viem"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constant/route"
import { useLoading } from "./loading-context"

const AuthContext = createContext<AuthContextType | null>(null)

const checkExpiration = (jwt: string | null | undefined) => {
  try {
    if (!jwt) return false
    const payloadBase64 = jwt.split(".")[1]
    if (!payloadBase64) return false

    const decodedPayload = JSON.parse(atob(payloadBase64))
    const exp = decodedPayload.exp
    if (!exp) return false

    const now = Math.floor(Date.now() / 1000)
    return now < exp
  } catch (error) {
    console.warn("Invalid JWT:", error)
    return false
  }
}

export function AuthProvider({
  children,
  initialJwt,
}: Readonly<{ children: React.ReactNode; initialJwt?: string | null }>) {
  const router = useRouter()
  const loginApi = useLoginApi()
  const { hide: hideLoad, show: showLoad } = useLoading()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<AuthContextType["connecting"]>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const { openConnectModal } = useConnectModal();
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

  useEffect(() => {
    const storedJwt =
      initialJwt ??
      (
        typeof document !== "undefined"
          ? document.cookie.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1] ?? null
          : null
      )

    const valid = checkExpiration(storedJwt)
    if (!valid && storedJwt) {
      if (typeof document !== "undefined") {
        document.cookie = "jwt=; Max-Age=0; path=/"
        router.replace(ROUTES.signIn)
      }
      return
    }
    if (valid) {
      setIsAuthenticated(true)
    }
  }, [initialJwt, router])

  useEffect(() => {
    const completeRainbowKitLogin = async () => {
      try {
        const storedJwt =
          initialJwt ??
          (
            typeof document !== "undefined"
              ? document.cookie.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1] ?? null
              : null
          )

        const valid = checkExpiration(storedJwt)

        if (!address || !isConnected || isAuthenticated || loginApi.isPending || valid) return

        const signature = await signMessageAsync({
          message: AUTH_MESSAGE,
          account: address as Address,
        })

        showLoad()
        await loginApi.mutateAsync({
          walletAddress: address as Address,
          signature,
          message: AUTH_MESSAGE,
        })

        setIsAuthenticated(true)
        setWalletAddress(address)
        setShowLoginModal(false)

        toast.success('sign in success')
        router.replace(ROUTES.home)
      } catch (error) {
        setIsAuthenticated(false)
        disconnect()

        const message = `Rainbow login failed : ${error}`
        console.error(message)
        toast.error(message)
      } finally {
        hideLoad()
        setConnecting(null)
      }
    }

    completeRainbowKitLogin()
  }, [
    initialJwt,
    address,
    isConnected
  ])

  useEffect(() => {
    const completePrivyLogin = async () => {
      const storedJwt =
        initialJwt ??
        (
          typeof document !== "undefined"
            ? document.cookie.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1] ?? null
            : null
        )

      const valid = checkExpiration(storedJwt)
      if (
        !authenticated ||
        !privyUser?.wallet?.address ||
        isAuthenticated ||
        loginApi.isPending ||
        valid
      ) return

      try {
        const wallet = privyUser.wallet.address
        const sign = await privySignMessage({
          message: AUTH_MESSAGE,
        })

        showLoad()
        await loginApi.mutateAsync({
          walletAddress: wallet as Address,
          signature: sign.signature,
          message: AUTH_MESSAGE
        })

        setIsAuthenticated(true)
        setWalletAddress(wallet)
        setShowLoginModal(false)

        toast.success('sign in success')
        router.replace(ROUTES.home)
      } catch (error) {
        setIsAuthenticated(false)
        privyLogout()

        const message = `Privy login failed : ${error}`
        console.error(message)
        toast.error(message)
      } finally {
        hideLoad()
        setConnecting(null)
      }
    }

    completePrivyLogin()
  }, [authenticated, privyUser])

  const logout = useCallback(async () => {
    try {
      await privyLogout()
      disconnect()

      if (typeof document !== "undefined") {
        document.cookie = "jwt=; Max-Age=0; path=/"
        router.replace(ROUTES.signIn)
      }

      router.replace(ROUTES.signIn)
    } catch (error) {
      console.error("Logout error", error)
    } finally {
      setIsAuthenticated(false)
      setWalletAddress(null)
    }
  }, [disconnect, privyLogout])

  const connectWithPrivy = () => {
    connectWithPrivyOrigin()
  }

  const connectWithRainbow = () => {
    if (isConnected) {
      disconnect()
      openConnectModal && openConnectModal()
    } else {
      openConnectModal && openConnectModal()
    }
  }


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
