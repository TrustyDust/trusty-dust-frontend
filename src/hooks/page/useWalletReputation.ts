// src/hooks/useWalletReputation.ts
import { useAnalyzeWalletApi, useWalletSnapshotApi } from "../api/walletReputation"

export const useWalletReputationViewModel = (address?: string) => {
  const analyze = useAnalyzeWalletApi()
  const snapshot = useWalletSnapshotApi(address ?? "")
  return { analyze, snapshot }
}

export const useAnalyzeWallet = useAnalyzeWalletApi
export const useWalletSnapshot = useWalletSnapshotApi
