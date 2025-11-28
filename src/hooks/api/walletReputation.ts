import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useAnalyzeWalletApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.walletReputation.analyze, body),
  })

export const useWalletSnapshotApi = (address: string) =>
  useQuery({
    queryKey: ["wallet-reputation", address],
    queryFn: () => get(API_ROUTES.walletReputation.latest(address)),
    enabled: !!address,
  })

