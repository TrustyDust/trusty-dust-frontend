// src/hooks/useTier.ts
import { useTierHistoryApi } from "./api/tier"

export const useTierViewModel = () => {
  const tier = useTierHistoryApi()
  return { tier }
}

export const useTierHistory = useTierHistoryApi
