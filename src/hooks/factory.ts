// src/hooks/factory.ts
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { get, post, patch, del } from "@/lib/http-client";

export const useApiQuery = <T>(
    key: any[],
    endpoint: string,
    options?: UseQueryOptions<T>
) => {
    return useQuery<T>({
        queryKey: key,
        queryFn: () => get<T>(endpoint),
        ...options,
    });
};

export const useApiMutation = <T, B = any>(
    method: "post" | "patch" | "delete",
    endpoint: string,
    options?: UseMutationOptions<T, unknown, B>
) => {
    return useMutation<T, unknown, B>({
        mutationFn: (body: B) => {
            if (method === "post") return post<T>(endpoint, body);
            if (method === "patch") return patch<T>(endpoint, body);
            return del<T>(endpoint);
        },
        ...options,
    });
};
