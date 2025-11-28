import { useQuery, useMutation } from "@tanstack/react-query"
import { get, patch, post, del } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useMeApi = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => get(API_ROUTES.users.me),
  })

export const useUpdateMeApi = () =>
  useMutation({
    mutationFn: (body: unknown) => patch(API_ROUTES.users.update, body),
  })

export const useSearchPeopleApi = (query: string) =>
  useQuery({
    queryKey: ["search-people", query],
    queryFn: () => get(`${API_ROUTES.users.searchPeople}?q=${encodeURIComponent(query)}`),
    enabled: !!query,
  })

export const useSuggestedUsersApi = () =>
  useQuery({
    queryKey: ["suggested-users"],
    queryFn: () => get(API_ROUTES.users.suggested),
  })

export const useFollowUserApi = () =>
  useMutation({
    mutationFn: ({ id }: { id: string }) => post(API_ROUTES.users.follow(id)),
  })

export const useUnfollowUserApi = () =>
  useMutation({
    mutationFn: ({ id }: { id: string }) => del(API_ROUTES.users.unfollow(id)),
  })

export const usePublicProfileApi = (id: string) =>
  useQuery({
    queryKey: ["user-public", id],
    queryFn: () => get(API_ROUTES.users.profile(id)),
    enabled: !!id,
  })

export const useUserPostsApi = (id: string) =>
  useQuery({
    queryKey: ["user-posts", id],
    queryFn: () => get(API_ROUTES.users.profilePosts(id)),
    enabled: !!id,
  })

export const useUserJobsApi = (id: string) =>
  useQuery({
    queryKey: ["user-jobs", id],
    queryFn: () => get(API_ROUTES.users.profileJobs(id)),
    enabled: !!id,
  })

