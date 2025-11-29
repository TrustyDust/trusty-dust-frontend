import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import { reqQueryUrl } from "@/lib/utils"
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

export const FEED_PAGE_SIZE = 3

export const useInfiniteFeedApi = (options?: { limit?: number; commentPreviewLimit?: number }) => {
  const limit = options?.limit ?? FEED_PAGE_SIZE
  const commentPreviewLimit = options?.commentPreviewLimit ?? 3

  return useInfiniteQuery<SocialFeedResponse>({
    queryKey: ["social-feed", limit, commentPreviewLimit],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      get<SocialFeedResponse>(
        reqQueryUrl(API_ROUTES.social.feed, {
          limit,
          commentPreviewLimit,
          cursor: pageParam ?? undefined,
        }),
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export const useFeedApi = () => useInfiniteFeedApi()

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

