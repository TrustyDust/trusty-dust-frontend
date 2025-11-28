import { useApiQuery } from "../factory"
import { API_ROUTES } from "@/constant/api"

export const useApiHealthStatus = () => useApiQuery(["health-api"], API_ROUTES.health.status)

export const useSupabaseHealthApi = () => useApiQuery(["health-supabase"], API_ROUTES.health.supabase)

