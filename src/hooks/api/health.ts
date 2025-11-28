import { useApiQuery } from "../page/factory"
import { API_ROUTES } from "@/constant/api"
import type { HealthStatusResponse, SupabaseHealthResponse } from "@/types/api"

export const useApiHealthStatus = () =>
  useApiQuery<HealthStatusResponse>(["health-api"], API_ROUTES.health.status)

export const useSupabaseHealthApi = () =>
  useApiQuery<SupabaseHealthResponse>(["health-supabase"], API_ROUTES.health.supabase)

