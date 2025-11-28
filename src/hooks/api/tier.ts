import { useApiQuery } from "../factory"
import { API_ROUTES } from "@/constant/api"

export const useTierHistoryApi = () => useApiQuery(["tier-history"], API_ROUTES.tier.me)

