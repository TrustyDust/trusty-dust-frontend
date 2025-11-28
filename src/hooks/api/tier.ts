import { useApiQuery } from "../service/factory"
import { API_ROUTES } from "@/constant/api"
import type { TierResponse } from "@/types/api"

export const useTierHistoryApi = () =>
  useApiQuery<TierResponse>(["tier-history"], API_ROUTES.tier.me)

