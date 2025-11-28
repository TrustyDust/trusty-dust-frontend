import { useApiMutation } from "../factory"
import { API_ROUTES } from "@/constant/api"

export const useLoginApi = () =>
  useApiMutation<{ jwt: string; data: unknown }, { walletAddress: string; signature: string; message: string }>(
    "post",
    API_ROUTES.auth.login,
  )

