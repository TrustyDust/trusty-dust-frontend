import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query"
import { get, post, patch, del } from "@/lib/http-client"

export const useApiQuery = <TData>(
  key: QueryKey,
  endpoint: string,
  options?: UseQueryOptions<TData, Error, TData, QueryKey>,
) => {
  return useQuery<TData, Error>({
    queryKey: key,
    queryFn: () => get<TData>(endpoint),
    ...options,
  })
}

export const useApiMutation = <TData, TVariables = void>(
  method: "post" | "patch" | "delete",
  endpoint: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
) => {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables: TVariables) => {
      if (method === "post") return post<TData>(endpoint, variables)
      if (method === "patch") return patch<TData>(endpoint, variables)
      return del<TData>(endpoint)
    },
    ...options,
  })
}
