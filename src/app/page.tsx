"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  Briefcase,
  CheckCircle2,
  CloudUpload,
  Image as ImageIcon,
  Link2,
  Loader2,
  Paperclip,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { NavLink } from "@/components/NavLink"
import { FeedPostCard } from "@/components/dashboard/FeedPostCard"
import { FeedPostSkeleton } from "@/components/dashboard/FeedPostSkeleton"
import useSocialViewModel from "@/hooks/page/useSocial"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useSuggestedUsersApi, useFollowUserApi, useMeApi } from "@/hooks/api/user"
import { useMyJobsApi } from "@/hooks/api/jobs"
import type { SocialFeedResponse, UserSuggestion } from "@/types/api"
import { getErrorMessage } from "@/lib/get-error-message"

const composerActions = [
  { label: "Image", icon: ImageIcon },
  { label: "Link", icon: Link2 },
  { label: "Attachment", icon: Paperclip },
]

const POST_CHARACTER_LIMIT = 500

const SUGGESTED_SCROLLER_SKELETONS = [
  "scroller-1",
  "scroller-2",
  "scroller-3",
  "scroller-4",
  "scroller-5",
  "scroller-6",
]

const SUGGESTED_CARD_SKELETONS = ["suggest-card-1", "suggest-card-2", "suggest-card-3"]
const JOB_CARD_SKELETONS = ["job-card-1", "job-card-2", "job-card-3"]

export default function Dashboard() {
  const queryClient = useQueryClient()
  const { feed, createPost } = useSocialViewModel()
  const me = useMeApi()
  const [composerText, setComposerText] = useState("")
  const [composerError, setComposerError] = useState<string | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const feedPages = (feed.data?.pages ?? []) as SocialFeedResponse[]
  const feedPosts = useMemo(() => feedPages.flatMap((page) => page.data), [feedPages])
  const hasNoPosts = !feed.isLoading && !feed.error && feedPosts.length === 0

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
          feed.fetchNextPage().catch(() => {})
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage])

  const remainingCharacters = Math.max(0, POST_CHARACTER_LIMIT - composerText.length)

  const handleComposerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = composerText.trim()
    if (!trimmed) {
      setComposerError("Post cannot be empty")
      return
    }
    const formData = new FormData()
    formData.append("text", trimmed)
    try {
      setComposerError(null)
      await createPost.mutateAsync(formData)
      setComposerText("")
      toast.success("Post published to the feed")
      await queryClient.invalidateQueries({ queryKey: ["social-feed"] })
    } catch (error) {
      const message = getErrorMessage(error)
      setComposerError(message)
      toast.error(message)
    }
  }

  const handleComposerAction = (label: string) => {
    toast.info(`${label} uploads will be available soon`)
  }

  return (
    <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
        <DashboardHeader
          actions={
            <div className="hidden rounded-full border border-white/10 bg-linear-to-r from-[#3BA3FF]/20 to-[#6B4DFF]/10 px-4 py-2 text-sm font-semibold text-[#AEE5FF] sm:flex">
              $100 DUST
            </div>
          }
        />

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar activeNav="explore" />
          </aside>

          <main className="flex-1 pr-2 lg:max-w-3xl">
            <div className="space-y-6">
              <section className="rounded-[28px] border border-white/10 bg-[#040f25]/70 p-6 backdrop-blur">
                <form className="space-y-4" onSubmit={handleComposerSubmit}>
                  <Textarea
                    value={composerText}
                    onChange={(event) => {
                      setComposerText(event.target.value)
                      if (composerError) {
                        setComposerError(null)
                      }
                    }}
                    maxLength={POST_CHARACTER_LIMIT}
                    placeholder="Share something with the community…"
                    className="min-h-[120px] border-white/10 bg-white/5 text-sm text-gray-100 placeholder:text-gray-500"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                    <span>{remainingCharacters} characters left</span>
                    {composerError && <span className="text-red-400">{composerError}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      {composerActions.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={() => handleComposerAction(action.label)}
                          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <action.icon className="h-4 w-4 text-[#3BA3FF]" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={createPost.isPending || !composerText.trim()}
                      className="flex items-center gap-2 rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(59,163,255,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {createPost.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CloudUpload className="h-4 w-4" />
                      )}
                      {createPost.isPending ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </section>

              <div>
                <h2 className="text-lg font-semibold tracking-wide text-white">
                  Feed
                </h2>
              </div>

              {/* Loading State */}
              {feed.isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <FeedPostSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {!feed.isLoading && feed.error && (
                <div className="rounded-4xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-2" />
                  <p className="text-sm font-semibold text-red-300 mb-1">
                    Failed to load feed
                  </p>
                  <p className="text-xs text-red-400/80">
                    {feed.error instanceof Error
                      ? feed.error.message
                      : "Something went wrong. Please try again."}
                  </p>
                  <button
                    onClick={() => feed.refetch()}
                    className="mt-4 rounded-full bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/30"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty State */}
              {hasNoPosts && (
                <div className="rounded-4xl border border-white/10 bg-[#030c1d]/85 p-12 text-center">
                  <p className="text-sm font-semibold text-gray-300 mb-2">
                    No posts yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Be the first to share something with the community!
                  </p>
                </div>
              )}

              {/* Feed Posts */}
              {!feed.isLoading && !feed.error && feedPosts.length > 0 && (
                <>
                  <div className="space-y-6">
                    {feedPosts.map((post) => (
                      <FeedPostCard key={post.id} post={post} viewerId={me.data?.id} />
                    ))}
                  </div>
                  <div ref={loadMoreRef} className="h-8 w-full" aria-hidden />
                  {feed.isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more posts…
                    </div>
                  )}
                  {!feed.isFetchingNextPage && feed.hasNextPage && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => feed.fetchNextPage()}
                        className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10"
                      >
                        Load more
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          <aside className="w-full shrink-0 lg:w-72 xl:w-80">
            <div className="sticky top-28 flex h-fit flex-col gap-6">
              <SuggestedPeoplePanel />
              <MyJobsPanel />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SuggestedPeoplePanel() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch, error } = useSuggestedUsersApi()
  const followMutation = useFollowUserApi()
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)

  const suggestions = data ?? []
  const scrollerPeople = suggestions.slice(0, 8)

  const getInitials = (user: UserSuggestion) => {
    if (user.username) {
      return user.username
        .split(" ")
        .map((word) => word[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    }
    return user.id.slice(0, 2).toUpperCase()
  }

  const accentPalette = [
    "from-[#3BA3FF] to-[#6B4DFF]",
    "from-[#6B4DFF] to-[#42E8E0]",
    "from-[#42E8E0] to-[#3BA3FF]",
  ]

  const handleFollow = async (user: UserSuggestion) => {
    if (pendingUserId) return
    setPendingUserId(user.id)
    try {
      await followMutation.mutateAsync({ id: user.id })
      toast.success(`Following ${user.username ?? "new connection"}`)
      queryClient.setQueryData<SocialFeedResponse>(["social-feed"], (prev) => {
        if (!prev) return prev
        return {
          ...prev,
          data: prev.data.map((post) =>
            post.author.id === user.id
              ? {
                  ...post,
                  author: { ...post.author, isFollowedByViewer: true },
                }
              : post,
          ),
        }
      })
      await queryClient.invalidateQueries({ queryKey: ["suggested-users"] })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setPendingUserId(null)
    }
  }

  const renderScroller = () => {
    if (isLoading) {
      return SUGGESTED_SCROLLER_SKELETONS.map((id) => (
        <Skeleton
          key={id}
          className="h-12 w-12 rounded-full border border-white/10 bg-white/5"
        />
      ))
    }
    if (scrollerPeople.length > 0) {
      return scrollerPeople.map((user) => (
        <div
          key={user.id}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold"
        >
          {getInitials(user)}
        </div>
      ))
    }
    return <p className="text-xs text-gray-500">No suggestions right now</p>
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Suggested</p>
          <h3 className="text-xl font-semibold">People</h3>
        </div>
        <NavLink
          href={"/chat"}
          className="text-xs font-semibold text-[#7BDFFF] transition-colors hover:text-[#7BDFFF]/80"
        >
          See all
        </NavLink>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">{renderScroller()}</div>

      <div className="mt-4 flex flex-col gap-3">
        {isLoading &&
          SUGGESTED_CARD_SKELETONS.map((skeletonId) => (
            <div key={skeletonId} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          ))}

        {isError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs text-red-200">
            <p>{getErrorMessage(error)}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-full border border-red-500/40 px-3 py-1 font-semibold text-red-200 transition hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && suggestions.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-xs text-gray-400">
            No suggested people yet. Engage with the feed to get better matches.
          </div>
        )}

        {!isLoading &&
          !isError &&
          suggestions.map((person, index) => {
            const accent = accentPalette[index % accentPalette.length]
            const isPending = pendingUserId === person.id && followMutation.isPending

            return (
              <div
                key={person.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${accent} text-sm font-semibold`}
                  >
                    {getInitials(person)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{person.username ?? "Anon user"}</p>
                    <p className="text-xs text-gray-400">{person.jobTitle ?? "Generalist"}</p>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#7BDFFF]">
                      <CheckCircle2 className="h-3 w-3" />
                      Trust {person.trustScore}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFollow(person)}
                  disabled={isPending}
                  className="flex items-center gap-1 rounded-xl bg-[#3BA3FF]/10 px-3 py-1 text-xs font-semibold text-[#3BA3FF] transition hover:bg-[#3BA3FF]/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  Follow
                </button>
              </div>
            )
          })}
      </div>
    </section>
  )
}

function MyJobsPanel() {
  const { data, isLoading, isError, refetch, error } = useMyJobsApi()
  const jobs = data ?? []
  const recentJobs = jobs.slice(0, 4)

  const getStatusClass = (status: string) =>
    status === "OPEN" ? "bg-[#1C4238] text-[#63F1C2]" : "bg-white/10 text-gray-300"

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">My Jobs</p>
          <h3 className="text-xl font-semibold">Application Panel</h3>
        </div>
        <Briefcase className="h-5 w-5 text-[#7BDFFF]" />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {isLoading &&
          JOB_CARD_SKELETONS.map((skeletonId) => (
            <div
              key={skeletonId}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-2 h-3 w-20" />
              <Skeleton className="mt-4 h-3 w-24" />
            </div>
          ))}

        {isError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs text-red-200">
            <p>{getErrorMessage(error)}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-full border border-red-500/40 px-3 py-1 font-semibold text-red-200 transition hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && recentJobs.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-xs text-gray-400">
            You have not created any jobs yet. Publish a role to start receiving applicants.
          </div>
        )}

        {!isLoading &&
          !isError &&
          recentJobs.map((job) => {
            const applicationsCount = job.applications?.length ?? 0
            return (
              <div key={job.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.companyName ?? "Unknown company"}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
                      {job.jobType ?? "Flexible"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-300">
                  <span>
                    Reward <strong className="text-white">{job.reward.toLocaleString()} DUST</strong>
                  </span>
                  <span>{applicationsCount} applicants</span>
                </div>
              </div>
            )
          })}
      </div>
    </section>
  )
}
