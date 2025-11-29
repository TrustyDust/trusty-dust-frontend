import { useMemo, useState, useEffect } from "react"

export interface JwtPayload {
  sub: string // user ID
  walletAddress?: string
  exp?: number
  iat?: number
}

/**
 * Decode JWT token dari cookies
 */
export function decodeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token) return null

  try {
    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) return null

    const decodedPayload = JSON.parse(atob(payloadBase64))
    return decodedPayload as JwtPayload
  } catch (error) {
    console.warn("Invalid JWT:", error)
    return null
  }
}

/**
 * Get JWT token dari cookies
 */
export function getJwtFromCookies(): string | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split("; ")
  const jwtCookie = cookies.find((row) => row.startsWith("jwt="))
  return jwtCookie ? jwtCookie.split("=")[1] : null
}

/**
 * Check if JWT token is expired
 */
export function isJwtExpired(token: string | null | undefined): boolean {
  if (!token) return true

  const payload = decodeJwt(token)
  if (!payload || !payload.exp) return true

  const now = Math.floor(Date.now() / 1000)
  return now >= payload.exp
}

/**
 * Hook untuk mendapatkan JWT payload dari cookies
 * Reactive terhadap perubahan cookies (check setiap 1 detik)
 * @returns JWT payload atau null jika tidak ada atau expired
 */
export function useJwtPayload(): JwtPayload | null {
  const [jwt, setJwt] = useState<string | null>(() => getJwtFromCookies())

  useEffect(() => {
    // Initial check
    setJwt(getJwtFromCookies())

    // Check cookies periodically untuk detect perubahan
    const interval = setInterval(() => {
      const currentJwt = getJwtFromCookies()
      setJwt((prev) => {
        // Only update if changed
        if (prev !== currentJwt) {
          return currentJwt
        }
        return prev
      })
    }, 1000)

    // Also listen for storage events (for cross-tab sync)
    const handleStorageChange = () => {
      setJwt(getJwtFromCookies())
    }

    globalThis.window?.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      globalThis.window?.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return useMemo(() => {
    if (!jwt || isJwtExpired(jwt)) return null
    return decodeJwt(jwt)
  }, [jwt])
}

/**
 * Hook untuk mendapatkan user ID dari JWT cookies
 * @returns user ID atau null
 */
export function useUserId(): string | null {
  const payload = useJwtPayload()
  return payload?.sub || null
}

/**
 * Hook untuk mendapatkan wallet address dari JWT cookies
 * @returns wallet address atau null
 */
export function useWalletAddressFromJwt(): string | null {
  const payload = useJwtPayload()
  return payload?.walletAddress || null
}

/**
 * Hook untuk check if user is authenticated berdasarkan JWT cookies
 * @returns true jika JWT valid dan tidak expired
 */
export function useIsAuthenticatedFromJwt(): boolean {
  const payload = useJwtPayload()
  return payload !== null && !!payload.sub
}

