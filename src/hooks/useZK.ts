// src/hooks/useZK.ts
import { useGenerateProofApi, useVerifyProofApi } from "./api/zk"

export const useZKViewModel = () => {
  const generateProof = useGenerateProofApi()
  const verifyProof = useVerifyProofApi()
  return { generateProof, verifyProof }
}

export const useGenerateProof = useGenerateProofApi
export const useVerifyProof = useVerifyProofApi
