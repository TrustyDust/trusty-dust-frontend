import { useMutation, useQuery } from "@tanstack/react-query"

import { API_ROUTES } from "@/constant/api"
import { del, get, patch, post } from "@/lib/http-client"
import type {
  PaginatedResponse,
  SuccessResponse,
  UpdateUserRequest,
  UserProfile,
  UserProfileJob,
  UserProfilePost,
  UserPublicProfile,
  UserSearchResponse,
  UserSuggestion,
} from "@/types/api"

export const useMeApi = () =>
  useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: () => get<UserProfile>(API_ROUTES.users.me),
  })

export const useUpdateMeApi = () =>
  useMutation<UserProfile, Error, UpdateUserRequest>({
    mutationFn: (body) => patch<UserProfile>(API_ROUTES.users.update, body),
  })

type SearchPeopleParams =
  | string
  | ({
      keyword?: string
      jobTitle?: string
      jobType?: string
      limit?: number
      cursor?: string
      enabled?: boolean
    } | undefined)

export const useSearchPeopleApi = (params?: SearchPeopleParams) => {
  const normalized =
    typeof params === "string"
      ? {
          keyword: params,
          enabled: params.trim().length > 0,
        }
      : params ?? {}

  const { enabled, keyword, jobTitle, jobType, limit, cursor } = normalized

  const searchParams = new URLSearchParams()
  const trimmedKeyword = keyword?.trim()
  const trimmedJobTitle = jobTitle?.trim()
  const trimmedJobType = jobType?.trim()
  if (trimmedKeyword) searchParams.set("keyword", trimmedKeyword)
  if (trimmedJobTitle) searchParams.set("jobTitle", trimmedJobTitle)
  if (trimmedJobType) searchParams.set("jobType", trimmedJobType)
  if (typeof limit === "number") searchParams.set("limit", String(limit))
  if (cursor) searchParams.set("cursor", cursor)

  const queryString = searchParams.toString()
  const requestUrl = queryString
    ? `${API_ROUTES.users.searchPeople}?${queryString}`
    : API_ROUTES.users.searchPeople
  const shouldEnable =
    enabled ?? (searchParams.has("keyword") || searchParams.has("jobTitle") || searchParams.has("jobType"))

  return useQuery<UserSearchResponse>({
    queryKey: ["search-people", queryString || "all"],
    queryFn: () => get<UserSearchResponse>(requestUrl),
    enabled: shouldEnable,
    staleTime: 30_000,
  })
}

export const useSuggestedUsersApi = () =>
  useQuery<UserSuggestion[]>({
    queryKey: ["suggested-users"],
    queryFn: () => get<UserSuggestion[]>(API_ROUTES.users.suggested),
  })

export const useFollowUserApi = () =>
  useMutation<SuccessResponse, Error, { id: string }>({
    mutationFn: ({ id }) => post<SuccessResponse>(API_ROUTES.users.follow(id)),
  })

export const useUnfollowUserApi = () =>
  useMutation<SuccessResponse, Error, { id: string }>({
    mutationFn: ({ id }) => del<SuccessResponse>(API_ROUTES.users.unfollow(id)),
  })

export const usePublicProfileApi = (id: string) =>
  useQuery<UserPublicProfile>({
    queryKey: ["user-public", id],
    queryFn: () => get<UserPublicProfile>(API_ROUTES.users.profile(id)),
    enabled: !!id,
  })

export const useUserPostsApi = (id: string) =>
  useQuery<PaginatedResponse<UserProfilePost>>({
    queryKey: ["user-posts", id],
    queryFn: () => get<PaginatedResponse<UserProfilePost>>(API_ROUTES.users.profilePosts(id)),
    enabled: !!id,
  })

export const useUserJobsApi = (id: string) =>
  useQuery<PaginatedResponse<UserProfileJob>>({
    queryKey: ["user-jobs", id],
    queryFn: () => get<PaginatedResponse<UserProfileJob>>(API_ROUTES.users.profileJobs(id)),
    enabled: !!id,
  })

