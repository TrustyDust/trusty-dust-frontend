import { useMutation } from "@tanstack/react-query"
import { post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type { GenerateProofRequest, ZkProofResponse, VerifyProofRequest, VerifyProofResponse } from "@/types/api"

export const useGenerateProofApi = () =>
  useMutation<ZkProofResponse, Error, GenerateProofRequest>({
    mutationFn: (body) => post<ZkProofResponse>(API_ROUTES.zk.generate, body),
  })

export const useVerifyProofApi = () =>
  useMutation<VerifyProofResponse, Error, VerifyProofRequest>({
    mutationFn: (body) => post<VerifyProofResponse>(API_ROUTES.zk.verify, body),
  })

