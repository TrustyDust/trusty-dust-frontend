// src/hooks/useUser.ts
import {
  useMeApi,
  useUpdateMeApi,
  useSearchPeopleApi,
  useSuggestedUsersApi,
  useFollowUserApi,
  useUnfollowUserApi,
  usePublicProfileApi,
  useUserPostsApi,
  useUserJobsApi,
} from "../api/user"

export const useUserViewModel = (id?: string, query?: string) => {
  const me = useMeApi()
  const suggested = useSuggestedUsersApi()
  const profile = usePublicProfileApi(id ?? "")
  const posts = useUserPostsApi(id ?? "")
  const jobs = useUserJobsApi(id ?? "")
  const search = useSearchPeopleApi(query ?? "")

  return { me, suggested, profile, posts, jobs, search }
}

export const useMe = useMeApi
export const useUpdateMe = useUpdateMeApi
export const useSearchPeople = useSearchPeopleApi
export const useSuggestedUsers = useSuggestedUsersApi
export const useFollowUser = useFollowUserApi
export const useUnfollowUser = useUnfollowUserApi
export const usePublicProfile = usePublicProfileApi
export const useUserPosts = useUserPostsApi
export const useUserJobs = useUserJobsApi
