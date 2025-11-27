// src/hooks/useAuth.ts
import { useApiMutation } from "./factory";

export const useLogin = () =>
    useApiMutation<{ jwt: string; data: any }, { walletAddress: string; signature: string; message: string }>(
        "post",
        "/api/v1/auth/login"
    );
