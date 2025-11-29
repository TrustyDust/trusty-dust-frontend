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

const isUserRejectedError = (error: unknown): boolean => {
  if (!error) return false
  if (typeof error !== "object") return false
  
  const errorObj = error as Record<string, unknown>
  
  // Safely extract error name/code
  let errorName = ""
  if (typeof errorObj.name === "string") {
    errorName = errorObj.name
  } else if (typeof errorObj.code === "string") {
    errorName = errorObj.code
  }
  
  // Safely extract error message
  const errorMessage = typeof errorObj.message === "string" 
    ? errorObj.message 
    : ""
  
  return (
    errorName === "UserRejectedRequestError" ||
    errorMessage.includes("User rejected") ||
    errorMessage.includes("user rejected") ||
    errorMessage.includes("UserRejectedRequestError")
  )
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
  const [connecting, setConnecting] =
    useState<AuthContextType["connecting"]>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const isProcessingRainbowLogin = useRef(false)
  const isProcessingPrivyLogin = useRef(false)
  const isDisconnecting = useRef(false)

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useConnection()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const {
    login: connectWithPrivyOrigin,
    user: privyUser,
    authenticated,
    signMessage: privySignMessage,
    logout: privyLogout,
  } = usePrivy()

  const openLoginModal = useCallback(() => setShowLoginModal(true), [])
  const closeLoginModal = useCallback(() => setShowLoginModal(false), [])

  useEffect(() => {
    const storedJwt =
      initialJwt ??
      (typeof document === "undefined"
        ? null
        : document.cookie
            .split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1] ?? null)

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
      // Prevent spam: check if already processing
      if (isProcessingRainbowLogin.current) {
        return
      }

      // Don't trigger login if disconnecting
      if (isDisconnecting.current) {
        return
      }

      const storedJwt =
        initialJwt ??
        (typeof document === "undefined"
          ? null
          : document.cookie
              .split("; ")
              .find((row) => row.startsWith("jwt="))
              ?.split("=")[1] ?? null)

      const valid = checkExpiration(storedJwt)

      // Early return if conditions not met
      if (
        !address ||
        !isConnected ||
        isAuthenticated ||
        loginApi.isPending ||
        valid ||
        isLoggingOut
      ) {
        return
      }

      // Set processing flag to prevent multiple calls
      isProcessingRainbowLogin.current = true
      setConnecting("rainbow")

      try {
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

        toast.success("sign in success")
        router.replace(ROUTES.home)
      } catch (error) {
        const isUserRejected = isUserRejectedError(error)

        setIsAuthenticated(false)
        disconnect()

        // Clear JWT from cookies on login failure
        if (typeof document !== "undefined") {
          document.cookie = "jwt=; Max-Age=0; path=/"
          document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        }

        // Don't show toast for user rejection - it's expected behavior
        if (isUserRejected) {
          console.log("User rejected the sign message request")
        } else {
          const message = `Rainbow login failed : ${error}`
          console.error(message)
          toast.error(message)
        }
      } finally {
        hideLoad()
        setConnecting(null)
        isProcessingRainbowLogin.current = false
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
      // Prevent spam: check if already processing
      if (isProcessingPrivyLogin.current) {
        return
      }

      // Don't trigger login if disconnecting
      if (isDisconnecting.current) {
        return
      }

      const storedJwt =
        initialJwt ??
        (typeof document === "undefined"
          ? null
          : document.cookie
              .split("; ")
              .find((row) => row.startsWith("jwt="))
              ?.split("=")[1] ?? null)

      const valid = checkExpiration(storedJwt)
      if (
        !authenticated ||
        !privyUser?.wallet?.address ||
        isAuthenticated ||
        loginApi.isPending ||
        valid ||
        isLoggingOut
      )
        return

      // Set processing flag to prevent multiple calls
      isProcessingPrivyLogin.current = true
      setConnecting("privy")

      try {
        const wallet = privyUser.wallet.address
        const sign = await privySignMessage({
          message: AUTH_MESSAGE,
        })

        showLoad()
        await loginApi.mutateAsync({
          walletAddress: wallet as Address,
          signature: sign.signature,
          message: AUTH_MESSAGE,
        })

        setIsAuthenticated(true)
        setWalletAddress(wallet)
        setShowLoginModal(false)

        toast.success("sign in success")
        router.replace(ROUTES.home)
      } catch (error) {
        const isUserRejected = isUserRejectedError(error)

        setIsAuthenticated(false)
        privyLogout()

        // Clear JWT from cookies on login failure
        if (typeof document !== "undefined") {
          document.cookie = "jwt=; Max-Age=0; path=/"
          document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        }

        // Don't show toast for user rejection - it's expected behavior
        if (isUserRejected) {
          console.log("User rejected the sign message request")
        } else {
          const message = `Privy login failed : ${error}`
          console.error(message)
          toast.error(message)
        }
      } finally {
        hideLoad()
        setConnecting(null)
        isProcessingPrivyLogin.current = false
      }
    }

    completePrivyLogin()
  }, [authenticated, privyUser])

  const logout = useCallback(async () => {
    // Set disconnect flag to prevent re-sign message
    isDisconnecting.current = true
    setIsLoggingOut(true)

    try {
      await privyLogout()
      disconnect()

      // Clear JWT from cookies
      if (typeof document !== "undefined") {
        document.cookie = "jwt=; Max-Age=0; path=/"
        // Also try to clear with different cookie formats for better compatibility
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      }

      setIsAuthenticated(false)
      setWalletAddress(null)
      router.replace(ROUTES.signIn)
    } catch (error) {
      console.error("Logout error", error)
      // Ensure JWT is cleared even if logout fails
      if (typeof document !== "undefined") {
        document.cookie = "jwt=; Max-Age=0; path=/"
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      }
      setIsAuthenticated(false)
      setWalletAddress(null)
      router.replace(ROUTES.signIn)
    } finally {
      setIsLoggingOut(false)
      // Reset disconnect flag after a delay to allow cleanup
      setTimeout(() => {
        isDisconnecting.current = false
      }, 1000)
    }
  }, [disconnect, privyLogout, router])

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
      isLoggingOut,
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
      isLoggingOut,
      logout,
      openLoginModal,
      showLoginModal,
      walletAddress,
    ]
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
  isLoggingOut: boolean
  showLoginModal: boolean

  openLoginModal: () => void
  closeLoginModal: () => void
  connectWithRainbow: (() => void) | undefined
  connectWithPrivy: () => void
  logout: () => void
}
