import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import { useJwtPayload, useUserId, useIsAuthenticatedFromJwt } from "./useJwt"
import type { UserProfile } from "@/types/api"

/**
 * Hook untuk mendapatkan current user dari JWT cookies dan API
 * Mengkombinasikan data dari JWT (user ID, wallet) dengan full profile dari API
 * 
 * @returns {
 *   user: UserProfile | undefined - Full user profile dari API
 *   userId: string | null - User ID dari JWT
 *   isLoading: boolean - Loading state dari API
 *   isAuthenticated: boolean - Apakah user authenticated berdasarkan JWT
 *   error: Error | null - Error dari API jika ada
 *   refetch: () => void - Function untuk refetch user data
 *   isReady: boolean - True jika user data sudah loaded dan authenticated
 * }
 */
export function useCurrentUser() {
  const jwtPayload = useJwtPayload()
  const userId = useUserId()
  const isAuthenticated = useIsAuthenticatedFromJwt()
  
  // Fetch user data dari API hanya jika authenticated
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: () => get<UserProfile>(API_ROUTES.users.me),
    enabled: isAuthenticated, // Only fetch if authenticated
  })

  return useMemo(
    () => ({
      user,
      userId,
      walletAddress: jwtPayload?.walletAddress || user?.walletAddress || null,
      isAuthenticated,
      isLoading: isAuthenticated && isLoading,
      error,
      refetch,
      // Helper untuk check jika user data sudah loaded
      isReady: !isLoading && !!user && isAuthenticated,
    }),
    [user, userId, jwtPayload, isAuthenticated, isLoading, error, refetch]
  )
}

/**
 * Hook untuk mendapatkan hanya user ID dari JWT (lebih ringan)
 * Tidak melakukan API call
 */
export function useCurrentUserId() {
  return useUserId()
}

/**
 * Hook untuk mendapatkan wallet address dari JWT atau user profile
 * @returns wallet address atau null
 */
export function useCurrentWalletAddress(): string | null {
  const { walletAddress, user } = useCurrentUser()
  return walletAddress || user?.walletAddress || null
}

