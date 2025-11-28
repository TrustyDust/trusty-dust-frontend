// src/hooks/useWalletReputation.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@/lib/http-client";

export const useAnalyzeWallet = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/wallet-reputation/analyze", body),
    });

export const useWalletSnapshot = (address: string) =>
    useQuery({
        queryKey: ["wallet-reputation", address],
        queryFn: () => get(`/api/v1/wallet-reputation/${address}`),
        enabled: !!address,
    });
