import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useFeedApi = () =>
  useQuery({
    queryKey: ["social-feed"],
    queryFn: () => get(API_ROUTES.social.feed),
  })

export const useCreatePostApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.social.createPost, body),
  })

export const usePostDetailApi = (id: string) =>
  useQuery({
    queryKey: ["post-detail", id],
    queryFn: () => get(API_ROUTES.social.postDetail(id)),
    enabled: !!id,
  })

export const useReactPostApi = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: unknown }) => post(API_ROUTES.social.reactPost(id), body),
  })

export const useBoostPostApi = () =>
  useMutation({
    mutationFn: ({ id }: { id: string }) => post(API_ROUTES.social.boostPost(id)),
  })

