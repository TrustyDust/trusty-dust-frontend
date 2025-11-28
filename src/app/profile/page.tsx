'use client'

import Image from "next/image"
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  AlertCircle,
  Briefcase,
  Camera,
  Heart,
  Link2,
  Loader2,
  MessageCircle,
  PenSquare,
  RotateCcw,
  Upload,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { NavLink } from "@/components/NavLink"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useCurrentUser } from "@/hooks/page/useCurrentUser"
import { useTierHistory } from "@/hooks/page/useTier"
import { useUpdateMe, useUserJobs, useUserPosts } from "@/hooks/page/useUser"
import { formatTimeAgo } from "@/lib/format-time"
import { cn, ipfsToGateway } from "@/lib/utils"
import { trimWalletAddress } from "@/lib/wallet-utils"

import Spark from "../../../public/tier/spark.svg"

type ProfileFormState = {
  username: string
  jobTitle: string
  jobType: string
}

type LinkFields = {
  cv: string
  github: string
  portfolio: string
}

type LinkFieldKey = keyof LinkFields

const FALLBACK_AVATAR = "https://api.dicebear.com/7.x/notionists/svg?seed=trusty"

const LINK_FIELDS_META: Array<{
  key: LinkFieldKey
  label: string
  icon: ReactNode
}> = [
  { key: "cv", label: "CV Upload", icon: <Upload className="h-4 w-4" /> },
  { key: "github", label: "GitHub Link", icon: <Link2 className="h-4 w-4" /> },
  { key: "portfolio", label: "Portfolio Link", icon: <Link2 className="h-4 w-4" /> },
]

const getInitials = (value?: string | null) => {
  if (!value) return "TD"
  return (
    value
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? "")
      .join("") || "TD"
  )
}

const formatReward = (value?: number) => {
  if (typeof value !== "number") return "—"
  return `${value.toLocaleString()} DUST`
}

const getJobStatusBadge = (status?: string) =>
  status === "OPEN"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
    : "border-amber-400/30 bg-amber-500/10 text-amber-100"

export default function ProfilePage() {
  const {
    user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUser()
  const userId = user?.id ?? ""

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorData,
    refetch: refetchPosts,
  } = useUserPosts(userId)

  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
    error: jobsErrorData,
    refetch: refetchJobs,
  } = useUserJobs(userId)

  const {
    data: tierData,
    isLoading: tierLoading,
    isError: tierError,
    error: tierErrorData,
    refetch: refetchTier,
  } = useTierHistory()

  const updateProfile = useUpdateMe()
  const [formState, setFormState] = useState<ProfileFormState>({
    username: "",
    jobTitle: "",
    jobType: "",
  })
  const [linkFields, setLinkFields] = useState<LinkFields>({
    cv: "",
    github: "",
    portfolio: "",
  })
  const [isEditModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    setFormState({
      username: user.username ?? "",
      jobTitle: user.jobTitle ?? "",
      jobType: user.jobType ?? "",
    })
  }, [user])

  const isFormDirty = useMemo(() => {
    if (!user) return false
    return (
      formState.username !== (user.username ?? "") ||
      formState.jobTitle !== (user.jobTitle ?? "") ||
      formState.jobType !== (user.jobType ?? "")
    )
  }, [formState, user])

  const handleInputChange =
    (field: keyof ProfileFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const handleLinkChange =
    (field: LinkFieldKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setLinkFields((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const closeEditModal = () => {
    if (updateProfile.isPending) return
    setEditModalOpen(false)
  }

  const handleUpdateProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !isFormDirty || updateProfile.isPending) return

    const payload: Record<string, string> = {}
    if (formState.username !== (user.username ?? "")) payload.username = formState.username.trim()
    if (formState.jobTitle !== (user.jobTitle ?? "")) payload.jobTitle = formState.jobTitle.trim()
    if (formState.jobType !== (user.jobType ?? "")) payload.jobType = formState.jobType.trim()

    updateProfile.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated")
        setEditModalOpen(false)
        refetchUser()
      },
      onError: (error) => {
        toast.error(error?.message ?? "Failed to update profile")
      },
    })
  }

  const posts = postsData?.data ?? []
  const jobs = jobsData?.data ?? []
  const tierHistory = tierData?.history ?? []
  const tierLabel = tierData?.tier ?? user?.tier ?? "—"
  const walletDisplay = user?.walletAddress ? trimWalletAddress(user.walletAddress) : "—"
  const profileSubtitle = user?.jobTitle ?? user?.jobType ?? "Complete your profile to boost trust."

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714]/85 px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* --- Background Layer --- */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,163,255,0.35),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(107,77,255,0.25),_transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader/>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar activeNav="verify" boostScore={user?.trustScore ?? 0} />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 space-y-6">
            {/* Profile Header */}
            <section className="rounded-[32px] border border-white/10 bg-[#030b1e]/90 p-6 shadow-[0_20px_60px_rgba(5,8,20,0.8)] backdrop-blur">
              {userLoading ? (
                <div className="h-52 animate-pulse rounded-[28px] bg-[#04112b]" />
              ) : userError ? (
                <div className="rounded-[28px] border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
                  <p className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    Failed to load your profile
                  </p>
                  <p className="mt-1 text-xs text-red-200">{userError.message}</p>
                  <button
                    type="button"
                    className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-100 transition hover:border-red-200"
                    onClick={() => refetchUser()}
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="rounded-[28px] bg-gradient-to-r from-[#04112b] via-[#061c3f] to-[#082356] p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username ?? "Profile avatar"}
                            width={80}
                            height={80}
                            unoptimized
                            className="rounded-full border-4 border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-xl font-semibold">
                            {getInitials(user?.username)}
                          </div>
                        )}
                        <Image src={Spark} alt="Tier badge" width={32} height={32} className="absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold">{user?.username ?? walletDisplay}</h1>
                        <p className="text-sm text-gray-400">{profileSubtitle}</p>
                        <p className="text-xs text-gray-500">Wallet {walletDisplay}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm text-gray-200">
                        Current Tier
                        <p className="text-lg font-semibold text-white">{tierLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditModalOpen(true)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                      >
                        Edit profile
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-300 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Trust Score</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{user?.trustScore ?? 0}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Posts</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{posts.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Jobs Posted</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{jobs.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Wallet</p>
                      <p className="mt-2 text-lg font-semibold text-white">{walletDisplay}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#050f22]/90 p-6 shadow-[0_15px_50px_rgba(5,10,30,0.65)] backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">My posts</h2>
                  <p className="text-sm text-gray-400">Latest updates you shared with the community.</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:border-[#2E7FFF]/50 hover:text-white disabled:opacity-60"
                  onClick={() => refetchPosts()}
                  disabled={postsLoading}
                >
                  <RotateCcw className={cn("h-3.5 w-3.5", postsLoading && "animate-spin text-white")} />
                  Refresh
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {postsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={`post-skeleton-${index}`} className="h-36 animate-pulse rounded-2xl bg-white/5" />
                  ))
                ) : postsError ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                    <p className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4" />
                      Failed to load posts
                    </p>
                    <p className="mt-1 text-xs text-red-200">
                      {postsErrorData?.message ?? "Please try refreshing your timeline."}
                    </p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-gray-300">
                    You haven't posted yet. Share updates to grow your credibility.
                  </div>
                ) : (
                  posts.map((post) => (
                    <article key={post.id} className="rounded-[24px] border border-white/10 bg-[#030b1e]/80 p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-xs font-semibold">
                          {getInitials(user?.username)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{user?.username ?? walletDisplay}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                        </div>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-200">{post.text}</p>

                      {post.media.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {post.media.map((media) => (
                            <div key={media.id} className="relative h-28 overflow-hidden rounded-2xl border border-white/5">
                              <Image src={ipfsToGateway(media.url ?? "")} alt="Post asset" fill unoptimized className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                          <Heart className="h-3.5 w-3.5 text-[#FF6EC7]" />
                          {post.reactionCounts.like} likes
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                          <MessageCircle className="h-3.5 w-3.5 text-[#7BDFFF]" />
                          {post.reactionCounts.comment} comments
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
              <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <PenSquare className="h-5 w-5 text-[#6B4DFF]" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Edit profile</h3>
                  <p className="text-xs text-gray-400">Polish your profile to improve discovery.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Update your public information, highlight your specialties, and make it easier for recruiters to reach out.
              </p>
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(36,122,255,0.35)] transition hover:brightness-110"
              >
                Open editor
              </button>
            </section>
            <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]">
                    <Image src={Spark} alt="Tier badge" width={28} height={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">My tier journey</p>
                    <p className="text-xs text-gray-400">Realtime sync from zk tier service</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-gray-200 transition hover:border-[#2E7FFF]/50 hover:text-white disabled:opacity-60"
                  onClick={() => refetchTier()}
                  disabled={tierLoading}
                >
                  <RotateCcw className={cn("h-3 w-3", tierLoading && "animate-spin text-white")} />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#050f22]/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Current tier</p>
                <p className="mt-2 text-2xl font-semibold text-white">{tierLabel}</p>
              </div>

              <div className="mt-4 space-y-3">
                {tierLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={`tier-skeleton-${index}`} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                  ))
                ) : tierError ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                    <p className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4" />
                      Can't fetch tier history
                    </p>
                    <p className="mt-1 text-xs text-red-200">
                      {tierErrorData?.message ?? "Please refresh to sync your tier journey."}
                    </p>
                  </div>
                ) : tierHistory.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center text-xs text-gray-300">
                    No tier upgrades recorded yet.
                  </div>
                ) : (
                  tierHistory.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-white/10 bg-[#040f25]/70 px-4 py-3 text-sm text-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{entry.tier}</span>
                        <span className="text-[11px] text-gray-500">{formatTimeAgo(entry.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-400">Score {entry.score}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">My posted jobs</h3>
                  <p className="text-xs text-gray-400">Opportunities you've created for the community.</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold text-gray-200 transition hover:border-[#6B4DFF]/50 hover:text-white disabled:opacity-60"
                  onClick={() => refetchJobs()}
                  disabled={jobsLoading}
                >
                  <RotateCcw className={cn("h-3.5 w-3.5", jobsLoading && "animate-spin text-white")} />
                  Sync
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {jobsLoading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <div key={`job-skeleton-${index}`} className="h-28 animate-pulse rounded-2xl bg-white/5" />
                  ))
                ) : jobsError ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                    <p className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4" />
                      Unable to load posted jobs
                    </p>
                    <p className="mt-1 text-xs text-red-200">
                      {jobsErrorData?.message ?? "Please refresh to try again."}
                    </p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-xs text-gray-300">
                    You have not posted any jobs yet. Share work opportunities to attract talent.
                  </div>
                ) : (
                  jobs.map((job) => (
                    <article key={job.id} className="rounded-[24px] border border-white/10 bg-[#030b1e]/80 p-4 text-sm text-gray-300">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-base font-semibold text-white">{job.title}</h4>
                          <p className="text-[11px] text-gray-400">
                            {job.companyName ?? "Independent"} · {job.location ?? "Remote"}
                          </p>
                        </div>
                        <span className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                          getJobStatusBadge(job.status),
                        )}>
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-[#42E8E0]" />
                          {job.jobType ?? "Flexible"}
                        </span>
                        <span>Reward {formatReward(job.reward)}</span>
                        <span>{job.applications} applicants</span>
                        <span>Trust score ≥ {job.minTrustScore}</span>
                      </div>
                      <p className="mt-2 text-[11px] text-gray-500">Created {formatTimeAgo(job.createdAt)}</p>
                    </article>
                  ))
                )}
              </div>
            </section>

          
          </aside>
        </div>
      </div>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        formState={formState}
        onInputChange={handleInputChange}
        onSubmit={handleUpdateProfile}
        isSaving={updateProfile.isPending}
        submitError={updateProfile.error}
        isDirty={isFormDirty}
        userAvatar={user?.avatar}
        linkFields={linkFields}
        onLinkChange={handleLinkChange}
      />
    </div>
  )
}

type EditProfileModalProps = {
  open: boolean
  onClose: () => void
  formState: ProfileFormState
  onInputChange: (field: keyof ProfileFormState) => (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isSaving: boolean
  isDirty: boolean
  submitError: Error | null
  userAvatar?: string | null
  linkFields: LinkFields
  onLinkChange: (field: LinkFieldKey) => (event: ChangeEvent<HTMLInputElement>) => void
}

function EditProfileModal({
  open,
  onClose,
  formState,
  onInputChange,
  onSubmit,
  isSaving,
  isDirty,
  submitError,
  userAvatar,
  linkFields,
  onLinkChange,
}: EditProfileModalProps) {
  if (!open) return null

  const avatarSrc = userAvatar ?? FALLBACK_AVATAR

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="relative w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#030b1e]/95 p-6 shadow-[0_25px_80px_rgba(2,6,20,0.65)]">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-gray-400 transition hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Profile</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">Edit profile</h2>
              <div className="text-xs text-gray-500">Fields marked with * are public</div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[220px,1fr]">
            <div className="rounded-3xl border border-white/10 bg-[#050f22] p-5 text-center">
              <div className="relative mx-auto h-28 w-28">
                <Image
                  src={avatarSrc}
                  alt="Current avatar"
                  fill
                  unoptimized
                  className="rounded-3xl border border-white/10 object-cover"
                />
                <label className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(46,127,255,0.5)]">
                  <input type="file" className="hidden" />
                  <span className="inline-flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    Replace
                  </span>
                </label>
              </div>
              <p className="mt-6 text-sm text-gray-400">Recommended: 400x400px, PNG or JPG</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm text-gray-400">
                Display name*
                <input
                  value={formState.username}
                  onChange={onInputChange("username")}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none"
                  placeholder="Type here"
                />
              </label>
              <label className="text-sm text-gray-400">
                Job title*
                <input
                  value={formState.jobTitle}
                  onChange={onInputChange("jobTitle")}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none"
                  placeholder="e.g. Product Designer"
                />
              </label>
              <label className="text-sm text-gray-400">
                Job type*
                <input
                  value={formState.jobType}
                  onChange={onInputChange("jobType")}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none"
                  placeholder="Full-time, Contract, ..."
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {LINK_FIELDS_META.map(({ key, label, icon }) => (
              <label key={key} className="text-sm text-gray-400">
                {label}
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3">
                  <span className="text-gray-500">{icon}</span>
                  <input
                    value={linkFields[key]}
                    onChange={onLinkChange(key)}
                    placeholder="Paste link"
                    className="w-full bg-transparent text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
              </label>
            ))}
          </div>

          {submitError ? (
            <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-100">
              {submitError.message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(36,122,255,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
