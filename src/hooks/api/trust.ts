import { useApiQuery } from "../factory"
import { API_ROUTES } from "@/constant/api"

export const useTrustScoreApi = () => useApiQuery(["trust-score"], API_ROUTES.trust.score)

