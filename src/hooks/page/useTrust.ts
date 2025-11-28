// src/hooks/useTrust.ts
import { useTrustScoreApi } from "../api/trust"

export const useTrustViewModel = () => {
  const trustScore = useTrustScoreApi()
  return { trustScore }
}

export const useTrustScore = useTrustScoreApi
