'use client'

import Image from "next/image"
import { Heart, MessageCircle, User } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

const optimize = (url: string) => `${url}?auto=format&fit=crop&w=640&q=60`

const profilePosts = [
  {
    id: 1,
    author: "Alex Rivera",
    handle: "@Alexr",
    time: "4 Hours Ago",
    avatar: "/tier/avatar.png",
    content:
      "Just launched my new design project! Really excited to share this with the community. What do you all think about the color palette?",
    likes: 24,
    comments: 2,
    images: [
      optimize("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"),
      optimize("https://images.unsplash.com/photo-1545239351-1141bd82e8a6"),
      optimize("https://images.unsplash.com/photo-1523293832284-4f4a4c5a8b0c"),
      optimize("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"),
    ],
  },
  {
    id: 2,
    author: "Alex Rivera",
    handle: "@Alexr",
    time: "4 Hours Ago",
    avatar: "/tier/avatar.png",
    content: "Morning coffee and coding. Perfect way to start the day! 🚀☕️",
    likes: 18,
    comments: 5,
    images: [],
  },
]

const trustLevels = [
  { label: "Dust", active: false },
  { label: "Spark", active: true },
  { label: "Flare", active: false },
  { label: "Nova", active: false },
]

const growthActions = [
  { label: "Like", points: "+1 Pts" },
  { label: "Comment", points: "+1 Pts" },
  { label: "Get Hired", points: "+1 Pts" },
  { label: "Recommendation", points: "+1 Pts" },
]

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714]/85 px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* --- Background Layer --- */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,163,255,0.35),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(107,77,255,0.25),_transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader
          actions={
            <>
              <button className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:flex">
                Jobs
                <User className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-transparent bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)]">
                Become Pro Member
              </button>
            </>
          }
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar activeNav="verify" boostScore={90} boostLabel="Audit your score" />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 space-y-6">
            {/* Profile Header */}
            <section className="rounded-[32px] border border-white/10 bg-[#030b1e]/90 p-6 shadow-[0_20px_60px_rgba(5,8,20,0.8)] backdrop-blur">
              <div className="rounded-[28px] bg-gradient-to-r from-[#04112b] via-[#061c3f] to-[#082356] p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src="/tier/avatar.png"
                      alt="Walter White"
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white/10 object-cover"
                    />
                    <Image
                      src="/tier/spark.png"
                      alt="Spark badge"
                      width={32}
                      height={32}
                      className="absolute -bottom-1 -right-1"
                    />
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Walter White</h1>
                    <p className="text-sm text-gray-400">UI/UX Designer</p>
                  </div>

                  <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                    Edit Profile
                  </button>
                </div>

                <div className="mt-6 flex gap-6 text-sm font-semibold text-gray-400">
                  <button className="border-b-2 border-[#3BA3FF] pb-2 text-white">Post</button>
                  <button className="pb-2">Job Posted</button>
                </div>
              </div>
            </section>

            {/* POSTS */}
            {profilePosts.map((post) => (
              <article
                key={post.id}
                className="rounded-[28px] border border-white/10 bg-[#050f22]/90 p-6 shadow-[0_15px_50px_rgba(5,10,30,0.65)] backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="rounded-full border border-white/10"
                  />
                  <div>
                    <p className="font-semibold">
                      {post.author} <span className="text-sm text-gray-500">{post.handle}</span>
                    </p>
                    <p className="text-xs text-gray-400">{post.time}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-200">{post.content}</p>

                {/* Images Grid */}
                {post.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {post.images.map((img) => (
                      <div key={img} className="relative h-28 overflow-hidden rounded-2xl border border-white/5">
                        <Image
                          src={img}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-4 text-sm text-gray-300">
                  <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 hover:text-white">
                    <Heart className="h-4 w-4 text-[#FF6EC7]" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 hover:text-white">
                    <MessageCircle className="h-4 w-4 text-[#7BDFFF]" />
                    {post.comments} comments
                  </button>
                </div>
              </article>
            ))}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
            <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]">
                  <Image src="/tier/spark.png" alt="Spark" width={32} height={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Spark</p>
                  <p className="text-xs text-gray-400">Get To Know Level</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {trustLevels.map((level) => (
                  <div
                    key={level.label}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                      level.active
                        ? "border-[#357dff]/60 bg-[#041233]/80 text-white"
                        : "border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    <span>{level.label}</span>
                    <span className="text-xs text-gray-400">{level.active ? 4000 : ""}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Your Score</p>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF]" style={{ width: "65%" }} />
                </div>
                <p className="mt-2 text-sm text-gray-300">4000 pts</p>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold">How To Increase Points</h3>
              <div className="mt-4 space-y-3">
                {growthActions.map((action) => (
                  <div
                    key={action.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200"
                  >
                    <span>{action.label}</span>
                    <span className="text-xs text-[#7BDFFF]">{action.points}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
