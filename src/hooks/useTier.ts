// src/hooks/useTier.ts
import { useApiQuery } from "./factory";

export const useTierHistory = () =>
    useApiQuery(["tier-history"], "/api/v1/tier/me");
