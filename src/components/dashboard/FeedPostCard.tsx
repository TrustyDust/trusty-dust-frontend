"use client"

import { FormEvent, useState } from "react"
import { CheckCircle2, Heart, Loader2, MessageCircle, Plus, Send } from "lucide-react"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { FeedPost, SocialFeedResponse } from "@/types/api"
import { formatTimeAgo } from "@/lib/format-time"
import { ipfsToGateway } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useReactPostApi } from "@/hooks/api/social"
import { useFollowUserApi, useUnfollowUserApi } from "@/hooks/api/user"

interface FeedPostCardProps {
  post: FeedPost
  viewerId?: string | null
}

const accentColors = [
  "from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0]",
  "from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]",
  "from-[#6B4DFF] via-[#42E8E0] to-[#3BA3FF]",
]

const COMMENT_CHAR_LIMIT = 300

function getAccentColor(index: number): string {
  return accentColors[index % accentColors.length]
}

function getInitials(username: string | null | undefined, userId: string): string {
  if (username) {
    return username
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  return userId.slice(0, 2).toUpperCase()
}

function useFeedPostInteractions(post: FeedPost, viewerId?: string | null) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentError, setCommentError] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<"LIKE" | "COMMENT" | null>(null)

  const queryClient = useQueryClient()
  const reactMutation = useReactPostApi(post.id)
  const followMutation = useFollowUserApi()
  const unfollowMutation = useUnfollowUserApi()

  const authorName = post.author.username || `User ${post.author.id.slice(0, 8)}`
  const authorInitials = getInitials(post.author.username, post.author.id)
  const accentColor = getAccentColor(post.id.codePointAt(0) ?? 0)
  const canFollow =
    viewerId === undefined || viewerId === null ? true : viewerId !== post.author.id

  const updateFeedCache = (updater: (current: FeedPost) => FeedPost) => {
    queryClient.setQueryData<SocialFeedResponse>(["social-feed"], (prev) => {
      if (!prev) return prev
      return {
        ...prev,
        data: prev.data.map((item) => (item.id === post.id ? updater(item) : item)),
      }
    })
  }

  const handleFollowToggle = async () => {
    if (!canFollow) {
      return
    }
    try {
      if (post.author.isFollowedByViewer) {
        await unfollowMutation.mutateAsync({ id: post.author.id })
        updateFeedCache((current) => ({
          ...current,
          author: { ...current.author, isFollowedByViewer: false },
        }))
        toast.success(`Unfollowed ${authorName}`)
      } else {
        await followMutation.mutateAsync({ id: post.author.id })
        updateFeedCache((current) => ({
          ...current,
          author: { ...current.author, isFollowedByViewer: true },
        }))
        toast.success(`Following ${authorName}`)
      }
      await queryClient.invalidateQueries({ queryKey: ["suggested-users"] })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update follow state"
      toast.error(message)
    }
  }

  const handleLike = () => {
    if (reactMutation.isPending) {
      return
    }
    if (post.viewerReaction === "LIKE") {
      toast.info("You already liked this post")
      return
    }
    setPendingAction("LIKE")
    reactMutation.mutate(
      { type: "LIKE" },
      {
        onSuccess: () => {
          updateFeedCache((current) => ({
            ...current,
            viewerReaction: "LIKE",
            reactionCounts: {
              ...current.reactionCounts,
              like: current.reactionCounts.like + 1,
            },
          }))
          toast.success("Post liked")
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to like post")
        },
        onSettled: () => setPendingAction(null),
      },
    )
  }

  const handleCommentToggle = () => {
    setIsCommenting((prev) => !prev)
    setCommentError(null)
  }

  const handleCommentChange = (value: string) => {
    setCommentText(value)
    if (commentError) {
      setCommentError(null)
    }
  }

  const handleCommentCancel = () => {
    setIsCommenting(false)
    setCommentText("")
    setCommentError(null)
  }

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed) {
      setCommentError("Comment cannot be empty")
      return
    }
    setPendingAction("COMMENT")
    reactMutation.mutate(
      { type: "COMMENT", commentText: trimmed },
      {
        onSuccess: () => {
          setCommentText("")
          setIsCommenting(false)
          setCommentError(null)
          updateFeedCache((current) => ({
            ...current,
            reactionCounts: {
              ...current.reactionCounts,
              comment: current.reactionCounts.comment + 1,
            },
          }))
          queryClient.invalidateQueries({ queryKey: ["social-feed"] })
          toast.success("Comment added")
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to add comment"
          setCommentError(message)
          toast.error(message)
        },
        onSettled: () => setPendingAction(null),
      },
    )
  }

  const isFollowPending = followMutation.isPending || unfollowMutation.isPending
  const isLikeAction = pendingAction === "LIKE" && reactMutation.isPending
  const isCommentAction = pendingAction === "COMMENT" && reactMutation.isPending

  return {
    authorName,
    authorInitials,
    accentColor,
    canFollow,
    isCommenting,
    commentText,
    commentError,
    handleCommentChange,
    handleCommentSubmit,
    handleCommentToggle,
    handleCommentCancel,
    handleFollowToggle,
    handleLike,
    isFollowPending,
    isLikeAction,
    isCommentAction,
  }
}

export function FeedPostCard({ post, viewerId }: Readonly<FeedPostCardProps>) {
  const {
    authorName,
    authorInitials,
    accentColor,
    canFollow,
    isCommenting,
    commentText,
    commentError,
    handleCommentChange,
    handleCommentSubmit,
    handleCommentToggle,
    handleCommentCancel,
    handleFollowToggle,
    handleLike,
    isFollowPending,
    isLikeAction,
    isCommentAction,
  } = useFeedPostInteractions(post, viewerId)

  const renderFollowIcon = () => {
    if (!canFollow) {
      return null
    }
    if (isFollowPending) {
      return <Loader2 className="h-3.5 w-3.5 animate-spin" />
    }
    if (post.author.isFollowedByViewer) {
      return <CheckCircle2 className="h-3.5 w-3.5 text-[#7BDFFF]" />
    }
    return <Plus className="h-3.5 w-3.5" />
  }

  return (
    <article className="rounded-4xl border border-[#132852] bg-[#030c1d]/85 p-6 shadow-[0_20px_55px_rgba(2,8,27,0.85)] backdrop-blur">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={authorName}
              className="h-14 w-14 rounded-full border-2 border-white/10 object-cover"
              width={56}
              height={56}
            />
          ) : (
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br ${accentColor} text-lg font-semibold`}
            >
              {authorInitials}
            </div>
          )}
          <div>
            <p className="font-semibold">{authorName}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-[#7BDFFF]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Tier {post.author.tier}</span>
              <span className="text-gray-500">•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        {canFollow && (
          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={isFollowPending}
            className={`flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold transition ${
              post.author.isFollowedByViewer
                ? "bg-white/5 text-gray-200 hover:bg-white/10"
                : "bg-[#031128] text-gray-200 hover:bg-white/10"
            } ${isFollowPending ? "opacity-70" : ""}`}
          >
            {renderFollowIcon()}
            {post.author.isFollowedByViewer ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-200">{post.text}</p>

      {post.media?.length ? (
        <div className="mt-4 flex gap-3 overflow-hidden">
          {post.media.map((media) => (
            <div
              key={media.id}
              className="h-28 flex-1 rounded-2xl border border-white/5 bg-cover bg-center"
              style={{ backgroundImage: `url(${ipfsToGateway(media.url)})` }}
            />
          ))}
        </div>
      ) : null}

      {post.commentPreview?.length ? (
        <div className="mt-4 rounded-3xl border border-white/5 bg-[#050f2c]/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7BDFFF]">
            Latest Comments
          </p>
          <div className="mt-3 space-y-3">
            {post.commentPreview.map((comment) => {
              const commenterName =
                comment.author.username || `User ${comment.author.id.slice(0, 6)}`
              return (
                <div key={comment.id} className="text-sm text-gray-200">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-200">{commenterName}</span>
                    <span>•</span>
                    <span>Tier {comment.author.tier}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-300">
                    {comment.text || "Shared an attachment"}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-400">
        <button
          type="button"
          onClick={handleLike}
          disabled={isLikeAction}
          className={`flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white ${
            post.viewerReaction === "LIKE" ? "text-[#FF6EC7]" : ""
          } ${isLikeAction ? "opacity-70" : ""}`}
        >
          {isLikeAction ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#FF6EC7]" />
          ) : (
            <Heart
              className={`h-4 w-4 ${
                post.viewerReaction === "LIKE"
                  ? "fill-[#FF6EC7] text-[#FF6EC7]"
                  : "text-[#FF6EC7]"
              }`}
            />
          )}
          {post.reactionCounts.like}
        </button>
        <button
          type="button"
          onClick={handleCommentToggle}
          className={`flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white ${
            isCommenting ? "bg-white/10 text-white" : ""
          }`}
          aria-expanded={isCommenting}
        >
          <MessageCircle className="h-4 w-4 text-[#7BDFFF]" />
          {post.reactionCounts.comment} comments
        </button>
      </div>

      {isCommenting && (
        <form className="mt-4 space-y-3" onSubmit={handleCommentSubmit}>
          <Textarea
            value={commentText}
            onChange={(event) => handleCommentChange(event.target.value)}
            maxLength={COMMENT_CHAR_LIMIT}
            placeholder="Share your thoughts…"
            className="min-h-[90px] border-white/10 bg-[#050f2c] text-sm text-gray-100 placeholder:text-gray-500"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {commentText.length}/{COMMENT_CHAR_LIMIT}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCommentCancel}
                className="rounded-full border border-white/10 px-3 py-1 text-gray-300 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={commentText.trim().length === 0 || isCommentAction}
                className="flex items-center gap-1 rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-4 py-1 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCommentAction ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Send
              </button>
            </div>
          </div>
          {commentError && <p className="text-xs text-red-400">{commentError}</p>}
        </form>
      )}
    </article>
  )
}
