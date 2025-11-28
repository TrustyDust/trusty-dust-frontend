import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type { AnalyzeWalletRequest, WalletReputationResponse } from "@/types/api"

export const useAnalyzeWalletApi = () =>
  useMutation<WalletReputationResponse, Error, AnalyzeWalletRequest>({
    mutationFn: (body) => post<WalletReputationResponse>(API_ROUTES.walletReputation.analyze, body),
  })

export const useWalletSnapshotApi = (address: string) =>
  useQuery<WalletReputationResponse>({
    queryKey: ["wallet-reputation", address],
    queryFn: () => get<WalletReputationResponse>(API_ROUTES.walletReputation.latest(address)),
    enabled: !!address,
  })

