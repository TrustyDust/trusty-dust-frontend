'use client'

import { useState } from "react"
import {
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  Compass,
  Heart,
  Image as ImageIcon,
  Link2,
  MessageCircle,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react"

const sidebarItems = [
  { label: "Explore", icon: Compass, active: true },
  { label: "Jobs", icon: Briefcase },
  { label: "Verify", icon: ShieldCheck },
]

const composerActions = [
  { label: "Image", icon: ImageIcon },
  { label: "Link", icon: Link2 },
  { label: "Attachment", icon: Paperclip },
]

const feedPosts = [
  {
    id: 1,
    name: "Nova Arkan",
    role: "Product Designer @Galactic",
    trust: "92",
    timestamp: "2m ago",
    content:
      "Experimenting with multi-chain credential sharing. TrustyDust makes it effortless to surface provable wins while keeping wallets private.",
    attachments: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
    likes: 212,
    comments: 54,
    accent: "from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0]",
  },
  {
    id: 2,
    name: "Luna Reyes",
    role: "DeFi Engineer @OrbitOps",
    trust: "88",
    timestamp: "14m ago",
    content:
      "We just shipped a trust-mining bounty. Looking for zk developers who love human-centric UX. Drop your latest build or DM me for briefs.",
    attachments: [
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    ],
    likes: 178,
    comments: 39,
    accent: "from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]",
  },
]

const suggestedPeople = [
  {
    name: "Atlas Kora",
    title: "Growth Lead · HoloNet",
    trust: "96",
    accent: "from-[#3BA3FF] to-[#6B4DFF]",
  },
  {
    name: "Mika Sol",
    title: "Full-stack · LiskDAO",
    trust: "89",
    accent: "from-[#6B4DFF] to-[#42E8E0]",
  },
  {
    name: "Rune Vega",
    title: "Talent Scout · Vault 88",
    trust: "85",
    accent: "from-[#42E8E0] to-[#3BA3FF]",
  },
]

const scrollerAvatars = [
  "NA",
  "LR",
  "AK",
  "MS",
  "RV",
  "JP",
  "SZ",
  "KT",
  "OL",
]

const applications = [
  {
    title: "Lead Social Strategist",
    company: "Aurora Labs",
    status: "Applied",
    accent: "bg-white/5",
  },
  {
    title: "Protocol Community Manager",
    company: "Nebula Guild",
    status: "Accepted",
    accent: "bg-gradient-to-r from-[#42E8E0] to-[#3BA3FF]",
  },
]

const profileMenu = [
  { label: "Profile", intent: "default" },
  { label: "My Posted Job", intent: "default" },
  { label: "Disconnect", intent: "danger" },
]

export default function Dashboard() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714]/80 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,163,255,0.35),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(107,77,255,0.25),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="sticky top-4 z-40">
          <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-white/10 bg-[#030b1e]/80 px-4 py-4 backdrop-blur-2xl shadow-[0_24px_60px_rgba(2,10,31,0.9)] sm:px-6 lg:flex-nowrap">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] border border-white/5 bg-[#050f22] px-4 py-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Posts..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
              />
            </div>

            <button className="hidden items-center gap-2 rounded-2xl border border-[#3BA3FF]/40 bg-gradient-to-r from-[#3587FF] to-[#5E4BFF] px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-[0_10px_40px_rgba(51,129,255,0.35)] transition hover:scale-[1.01] hover:shadow-[0_10px_45px_rgba(83,75,255,0.45)] sm:flex">
              <CloudUpload className="h-4 w-4" />
              Post
            </button>

            <div className="hidden rounded-full border border-white/10 bg-gradient-to-r from-[#3BA3FF]/20 to-[#6B4DFF]/10 px-4 py-2 text-sm font-semibold text-[#AEE5FF] sm:flex">
              $100 DUST
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="rounded-full border border-white/10 bg-[#050f22] p-2 text-gray-300 transition hover:bg-white/10">
                <Bell className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-white/10 bg-[#050f22] p-2 text-gray-300 transition hover:bg-white/10">
                <MessageSquare className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-[#050f22] pl-2 pr-3 text-sm transition hover:bg-white/10"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-base font-semibold">
                    TR
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-14 w-48 rounded-2xl border border-white/10 bg-[#050f22]/95 p-2 shadow-[0_20px_45px_rgba(1,6,20,0.7)]">
                    {profileMenu.map((item) => (
                      <button
                        key={item.label}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                          item.intent === "danger"
                            ? "bg-gradient-to-r from-[#7A1D1D]/60 to-[#B23232]/60 text-red-100 hover:brightness-110"
                            : "text-gray-200 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                        {item.intent === "danger" ? (
                          <span className="text-xs uppercase tracking-wide text-red-200">
                            !
                          </span>
                        ) : (
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <div className="sticky top-28 flex h-fit w-full flex-col gap-6">
              <div className="rounded-[28px] border border-white/10 bg-[#040d1e]/90 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-lg font-bold text-white shadow-[0_0_30px_rgba(66,232,224,0.45)]">
                    TD
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      TrustyDust
                    </p>
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-2 text-sm font-semibold">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.label}
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                        item.active
                          ? "bg-gradient-to-r from-[#2E7FFF] via-[#3BA3FF] to-[#4B5CFF] text-white shadow-[0_12px_40px_rgba(33,104,255,0.35)]"
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#3BA3FF]/30 bg-gradient-to-br from-[#041026] via-[#04152e] to-transparent p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#3BA3FF]/20 p-3 text-[#3BA3FF]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Boost your score</p>
                    <p className="text-lg font-semibold tracking-wide">
                      Trust Level
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Current</span>
                    <span>82%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#3BA3FF] via-[#42E8E0] to-[#6B4DFF]" />
                  </div>
                </div>
                <button className="mt-6 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#3BA3FF]/50 hover:bg-white/10">
                  Boost Your Trust Score
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 lg:max-w-3xl">
            <div className="space-y-6">
              <section className="rounded-[28px] border border-white/10 bg-[#040f25]/70 p-6 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-base font-semibold">
                    TR
                  </div>
                  <div>
                    <p className="text-sm font-semibold">TrustyDust Ops</p>
                    <p className="text-xs text-gray-400">Product Strategist</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400">
                  Type Something…
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex flex-1 items-center gap-2">
                    {composerActions.map((action) => (
                      <button
                        key={action.label}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <action.icon className="h-4 w-4 text-[#3BA3FF]" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                  <button className="rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(59,163,255,0.35)] hover:scale-[1.01]">
                    Add Post
                  </button>
                </div>
              </section>

              <div>
                <h2 className="text-lg font-semibold tracking-wide text-white">
                  Feed
                </h2>
              </div>

              {feedPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-[32px] border border-[#132852] bg-[#030c1d]/85 p-6 shadow-[0_20px_55px_rgba(2,8,27,0.85)] backdrop-blur"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${post.accent} text-lg font-semibold`}
                      >
                        {post.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold">{post.name}</p>
                        <p className="text-xs text-gray-400">{post.role}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#7BDFFF]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Trust {post.trust}
                          <span className="text-gray-500">•</span>
                          {post.timestamp}
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 rounded-full border border-white/10 bg-[#031128] px-3 py-1 text-xs font-semibold text-gray-200 transition hover:bg-white/10">
                      Follow
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-gray-200">{post.content}</p>

                  <div className="mt-4 flex gap-3 overflow-hidden">
                    {post.attachments.map((img) => (
                      <div
                        key={img}
                        className="h-28 flex-1 rounded-2xl border border-white/5 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
                    <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white">
                      <Heart className="h-4 w-4 text-[#FF6EC7]" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white">
                      <MessageCircle className="h-4 w-4 text-[#7BDFFF]" />
                      {post.comments} comments
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </main>

          <aside className="w-full shrink-0 lg:w-72 xl:w-80">
            <div className="sticky top-28 flex h-fit flex-col gap-6">
              <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Suggested
                    </p>
                    <h3 className="text-xl font-semibold">People</h3>
                  </div>
                  <button className="text-xs font-semibold text-[#7BDFFF]">
                    See all
                  </button>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {scrollerAvatars.map((initials) => (
                    <div
                      key={initials}
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold"
                    >
                      {initials}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {suggestedPeople.map((person) => (
                    <div
                      key={person.name}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${person.accent} text-sm font-semibold`}
                        >
                          {person.name
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{person.name}</p>
                          <p className="text-xs text-gray-400">
                            {person.title}
                          </p>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#7BDFFF]">
                            <CheckCircle2 className="h-3 w-3" />
                            Trust {person.trust}
                          </span>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 rounded-xl bg-[#3BA3FF]/10 px-3 py-1 text-xs font-semibold text-[#3BA3FF] transition hover:bg-[#3BA3FF]/20">
                        <UserPlus className="h-3.5 w-3.5" />
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      My Jobs
                    </p>
                    <h3 className="text-xl font-semibold">
                      Application Panel
                    </h3>
                  </div>
                  <Briefcase className="h-5 w-5 text-[#7BDFFF]" />
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {applications.map((application) => (
                    <div
                      key={application.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            {application.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {application.company}
                          </p>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            application.status === "Accepted"
                              ? "bg-[#1C4238] text-[#63F1C2]"
                              : "bg-white/10 text-gray-300"
                          }`}
                        >
                          {application.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
