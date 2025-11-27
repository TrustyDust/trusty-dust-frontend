// src/hooks/useHealth.ts
import { useApiQuery } from "./factory";

export const useApiHealth = () =>
    useApiQuery(["health-api"], "/api/v1/health");

export const useSupabaseHealth = () =>
    useApiQuery(["health-supabase"], "/api/v1/health/supabase");
