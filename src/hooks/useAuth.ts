// src/hooks/useAuth.ts
import { useLoginApi } from "./api/auth"

export const useAuthViewModel = () => {
  const login = useLoginApi()
  return { login }
}

export const useLogin = useLoginApi
