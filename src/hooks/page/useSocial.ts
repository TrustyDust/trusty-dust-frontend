
import { useInfiniteFeedApi, useCreatePostApi, usePostDetailApi, useReactPostApi, useBoostPostApi } from "../api/social"

export default function useSocialViewModel () {
  const feed = useInfiniteFeedApi()
  const createPost = useCreatePostApi()
  return { feed, createPost }
}

export const useFeed = useInfiniteFeedApi
export const useCreatePost = useCreatePostApi
export const usePostDetail = usePostDetailApi
export const useReactPost = useReactPostApi
export const useBoostPost = useBoostPostApi
