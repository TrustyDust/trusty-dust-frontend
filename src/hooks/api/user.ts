import { useQuery, useMutation } from "@tanstack/react-query"
import { get, patch, post, del } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type {
  UserProfile,
  UpdateUserRequest,
  UserSearchResponse,
  UserSuggestion,
  SuccessResponse,
  UserPublicProfile,
  PaginatedResponse,
  UserProfilePost,
  UserProfileJob,
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

export const useSearchPeopleApi = (query: string) =>
  useQuery<UserSearchResponse>({
    queryKey: ["search-people", query],
    queryFn: () => get<UserSearchResponse>(`${API_ROUTES.users.searchPeople}?q=${encodeURIComponent(query)}`),
    enabled: !!query,
  })

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

