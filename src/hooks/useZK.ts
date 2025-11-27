// src/hooks/useZK.ts
import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/http-client";

export const useGenerateProof = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/zk/generate", body),
    });

export const useVerifyProof = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/zk/verify", body),
    });
