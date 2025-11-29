import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type {
  SocialFeedResponse,
  CreatePostRequest,
  PostWithMedia,
  PostDetailResponse,
  ReactPostBody,
  PostReactionResponse,
  BoostPostBody,
  PostBoostResponse,
} from "@/types/api"

export const useFeedApi = () =>
  useQuery<SocialFeedResponse>({
    queryKey: ["social-feed"],
    queryFn: () => get<SocialFeedResponse>(API_ROUTES.social.feed),
  })

export const useCreatePostApi = () =>
  useMutation<PostWithMedia, Error, CreatePostRequest | FormData>({
    mutationFn: (body) => post<PostWithMedia>(API_ROUTES.social.createPost, body),
  })

export const usePostDetailApi = (id: string) =>
  useQuery<PostDetailResponse>({
    queryKey: ["post-detail", id],
    queryFn: () => get<PostDetailResponse>(API_ROUTES.social.postDetail(id)),
    enabled: !!id,
  })

export const useReactPostApi = (id: string) =>
  useMutation<PostReactionResponse, Error, ReactPostBody>({
    mutationFn: (body) => post<PostReactionResponse>(API_ROUTES.social.reactPost(id), body),
  })

export const useBoostPostApi = (id: string) =>
  useMutation<PostBoostResponse, Error, BoostPostBody | undefined>({
    mutationFn: (body) => post<PostBoostResponse>(API_ROUTES.social.boostPost(id), body),
  })

