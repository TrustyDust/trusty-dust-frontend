// src/hooks/useSocial.ts
import {
  useFeedApi,
  useCreatePostApi,
  usePostDetailApi,
  useReactPostApi,
  useBoostPostApi,
} from "./api/social"

export const useSocialViewModel = (postId?: string) => {
  const feed = useFeedApi()
  const createPost = useCreatePostApi()
  const postDetail = usePostDetailApi(postId ?? "")
  const reactPost = useReactPostApi()
  const boostPost = useBoostPostApi()

  return { feed, createPost, postDetail, reactPost, boostPost }
}

export const useFeed = useFeedApi
export const useCreatePost = useCreatePostApi
export const usePostDetail = usePostDetailApi
export const useReactPost = useReactPostApi
export const useBoostPost = useBoostPostApi
