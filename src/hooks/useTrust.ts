// src/hooks/useTrust.ts
import { useApiQuery } from "./factory";

export const useTrustScore = () =>
    useApiQuery(["trust-score"], "/api/v1/trust/score");
