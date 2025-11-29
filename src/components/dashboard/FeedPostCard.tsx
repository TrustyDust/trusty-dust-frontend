"use client"

import { CheckCircle2, Heart, MessageCircle, Plus } from "lucide-react"
import type { FeedPost } from "@/types/api"
import { formatTimeAgo } from "@/lib/format-time"
import { trimWalletAddress } from "@/lib/wallet-utils"
import Image from "next/image"

interface FeedPostCardProps {
  post: FeedPost
}

const accentColors = [
  "from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0]",
  "from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]",
  "from-[#6B4DFF] via-[#42E8E0] to-[#3BA3FF]",
]

function getAccentColor(index: number): string {
  return accentColors[index % accentColors.length]
}

function getInitials(
  username: string | null | undefined,
  userId: string
): string {
  if (username) {
    return username
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  // Get first 2 chars from user ID as fallback
  return userId.slice(0, 2).toUpperCase()
}

export function FeedPostCard({ post }: Readonly<FeedPostCardProps>) {
  const authorName =
    post.author.username || `User ${post.author.id.slice(0, 8)}`
  const authorInitials = getInitials(post.author.username, post.author.id)
  const accentColor = getAccentColor(post.id.charCodeAt(0))

  const imageUrl = (url:string | null | undefined) => {
    return `https://apricot-decisive-clam-744.mypinata.cloud//${url}`
  }

  return (
    <article className="rounded-4xl border border-[#132852] bg-[#030c1d]/85 p-6 shadow-[0_20px_55px_rgba(2,8,27,0.85)] backdrop-blur">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={authorName}
              className="h-14 w-14 rounded-full object-cover border-2 border-white/10"
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
        {!post.author.isFollowedByViewer && (
          <button className="flex items-center gap-1 rounded-full border border-white/10 bg-[#031128] px-3 py-1 text-xs font-semibold text-gray-200 transition hover:bg-white/10">
            Follow
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-200">{post.text}</p>

      {post.media && post.media.length > 0 && (
        <div className="mt-4 flex gap-3 overflow-hidden">
          {post.media.map((media) => (
            <div
              key={media.id}
              className="h-28 flex-1 rounded-2xl border border-white/5 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl(media.url)})` }}
            />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
        <button
          className={`flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white ${
            post.viewerReaction === "LIKE" ? "text-[#FF6EC7]" : ""
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              post.viewerReaction === "LIKE"
                ? "fill-[#FF6EC7] text-[#FF6EC7]"
                : "text-[#FF6EC7]"
            }`}
          />
          {post.reactionCounts.like}
        </button>
        <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white">
          <MessageCircle className="h-4 w-4 text-[#7BDFFF]" />
          {post.reactionCounts.comment} comments
        </button>
      </div>
    </article>
  )
}
