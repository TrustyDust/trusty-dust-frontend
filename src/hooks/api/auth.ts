import { useApiMutation } from "../page/factory"
import { API_ROUTES } from "@/constant/api"
import type { LoginRequest, LoginResponse } from "@/types/api"

export const useLoginApi = () =>
  useApiMutation<LoginResponse, LoginRequest>("post", API_ROUTES.auth.login)

