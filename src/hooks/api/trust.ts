import { useApiQuery } from "../service/factory"
import { API_ROUTES } from "@/constant/api"
import type { TrustScoreResponse } from "@/types/api"

export const useTrustScoreApi = () =>
  useApiQuery<TrustScoreResponse>(["trust-score"], API_ROUTES.trust.score)

