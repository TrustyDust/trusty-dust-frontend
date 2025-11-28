// src/hooks/useHealth.ts
import { useApiHealthStatus, useSupabaseHealthApi } from "../api/health"

export const useHealthViewModel = () => {
  const apiHealth = useApiHealthStatus()
  const supabase = useSupabaseHealthApi()
  return { apiHealth, supabase }
}

export const useApiHealth = useApiHealthStatus
export const useSupabaseHealth = useSupabaseHealthApi
