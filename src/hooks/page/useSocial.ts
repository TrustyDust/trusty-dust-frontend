
import { useFeedApi, useCreatePostApi, usePostDetailApi, useReactPostApi, useBoostPostApi } from "../api/social"

export default function useSocialViewModel () {
  const feed = useFeedApi()
  const createPost = useCreatePostApi()
  return { feed, createPost }
}

export const useFeed = useFeedApi
export const useCreatePost = useCreatePostApi
export const usePostDetail = usePostDetailApi
export const useReactPost = useReactPostApi
export const useBoostPost = useBoostPostApi
