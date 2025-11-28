import { useMutation } from "@tanstack/react-query"
import { post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useGenerateProofApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.zk.generate, body),
  })

export const useVerifyProofApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.zk.verify, body),
  })

