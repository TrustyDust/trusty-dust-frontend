'use client'

import Link from "next/link"
import {
    Briefcase,
    CheckCircle2,
    CloudUpload,
    Heart,
    MessageCircle,
    Plus,
    UserPlus,
    PenSquare
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

const optimize = (url: string) => `${url}?auto=format&fit=crop&w=640&q=60`

// --- DATA DUMMY (Sama seperti sebelumnya) ---
const feedPosts = [
    {
        id: 1,
        name: "Nova Arkan",
        role: "Product Designer @Galactic",
        trust: "92",
        timestamp: "2m ago",
        content: "Experimenting with multi-chain credential sharing. TrustyDust makes it effortless to surface provable wins while keeping wallets private.",
        attachments: [
            optimize("https://images.unsplash.com/photo-1461749280684-dccba630e2f6"),
            optimize("https://images.unsplash.com/photo-1545239351-1141bd82e8a6"),
            optimize("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"),
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
        content: "We just shipped a trust-mining bounty. Looking for zk developers who love human-centric UX. Drop your latest build or DM me for briefs.",
        attachments: [
            optimize("https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e"),
            optimize("https://images.unsplash.com/photo-1451187580459-43490279c0fa"),
            optimize("https://images.unsplash.com/photo-1469474968028-56623f02e42e"),
            optimize("https://images.unsplash.com/photo-1461749280684-dccba630e2f6"),
        ],
        likes: 178,
        comments: 39,
        accent: "from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]",
    },
]

const suggestedPeople = [
    { name: "Atlas Kora", title: "Growth Lead · HoloNet", trust: "96", accent: "from-[#3BA3FF] to-[#6B4DFF]" },
    { name: "Mika Sol", title: "Full-stack · LiskDAO", trust: "89", accent: "from-[#6B4DFF] to-[#42E8E0]" },
    { name: "Rune Vega", title: "Talent Scout · Vault 88", trust: "85", accent: "from-[#42E8E0] to-[#3BA3FF]" },
]

const scrollerAvatars = ["NA", "LR", "AK", "MS", "RV", "JP", "SZ", "KT", "OL"]

const applications = [
    { title: "Lead Social Strategist", company: "Aurora Labs", status: "Applied" },
    { title: "Protocol Community Manager", company: "Nebula Guild", status: "Accepted" },
]

export default function FeedPage() {
    return (
        <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
            {/* Background (Optional, samakan dengan layout utama) */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[#050C24]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.15),transparent_45%)]" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
                <DashboardHeader
                    actions={
                        <>
                            {/* Button di Header juga nge-link ke Add Page */}
                            <Link href="/post/add" className="hidden items-center gap-2 rounded-2xl border border-[#3BA3FF]/40 bg-gradient-to-r from-[#3587FF] to-[#5E4BFF] px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-[0_10px_40px_rgba(51,129,255,0.35)] transition hover:scale-[1.01] hover:shadow-[0_10px_45px_rgba(83,75,255,0.45)] sm:flex">
                                <CloudUpload className="h-4 w-4" /> Post
                            </Link>
                            {/* <div className="hidden rounded-full border border-white/10 bg-gradient-to-r from-[#3BA3FF]/20 to-[#6B4DFF]/10 px-4 py-2 text-sm font-semibold text-[#AEE5FF] sm:flex">
                                $100 DUST
                            </div> */}
                        </>
                    }
                />

                <div className="flex w-full flex-col gap-6 lg:flex-row">
                    <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
                        <DashboardSidebar activeNav="explore" />
                    </aside>

                    <main className="flex-1 pr-2 lg:max-w-3xl">
                        <div className="space-y-6">

                            {/* TRIGGER CARD UNTUK KE HALAMAN ADD */}
                            <section className="rounded-[28px] border border-white/10 bg-[#040f25]/70 p-6 backdrop-blur transition hover:border-[#3BA3FF]/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-base font-semibold">
                                        TR
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">TrustyDust Ops</p>
                                        <p className="text-xs text-gray-400">Product Strategist</p>
                                    </div>
                                </div>

                                {/* Ini sekarang jadi Link Button raksasa */}
                                <Link href="/post/add" className="block w-full text-left">
                                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-gray-400 transition hover:bg-white/10 hover:text-gray-200 group">
                                        <span>What's on your mind?</span>
                                        <PenSquare className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                                    </div>
                                </Link>
                            </section>

                            <div>
                                <h2 className="text-lg font-semibold tracking-wide text-white">Feed</h2>
                            </div>

                            {/* FEED LIST */}
                            {feedPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-[32px] border border-[#132852] bg-[#030c1d]/85 p-6 shadow-[0_20px_55px_rgba(2,8,27,0.85)] backdrop-blur"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${post.accent} text-lg font-semibold`}>
                                                {post.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{post.name}</p>
                                                <p className="text-xs text-gray-400">{post.role}</p>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-[#7BDFFF]">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Trust {post.trust} <span className="text-gray-500">•</span> {post.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-1 rounded-full border border-white/10 bg-[#031128] px-3 py-1 text-xs font-semibold text-gray-200 transition hover:bg-white/10">
                                            Follow <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-200 leading-relaxed">{post.content}</p>
                                    <div className="mt-4 flex gap-3 overflow-hidden">
                                        {post.attachments.map((img) => (
                                            <div key={img} className="h-28 flex-1 rounded-2xl border border-white/5 bg-cover bg-center transition hover:opacity-90 cursor-pointer" style={{ backgroundImage: `url(${img})` }} />
                                        ))}
                                    </div>
                                    <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
                                        <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white hover:bg-white/5">
                                            <Heart className="h-4 w-4 text-[#FF6EC7]" /> {post.likes}
                                        </button>
                                        <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 transition hover:text-white hover:bg-white/5">
                                            <MessageCircle className="h-4 w-4 text-[#7BDFFF]" /> {post.comments} comments
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </main>

                    {/* RIGHT SIDEBAR (Sama persis) */}
                    <aside className="w-full shrink-0 lg:w-72 xl:w-80 hidden lg:block">
                        <div className="sticky top-28 flex h-fit flex-col gap-6">
                            <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Suggested</p>
                                        <h3 className="text-xl font-semibold">People</h3>
                                    </div>
                                    <button className="text-xs font-semibold text-[#7BDFFF]">See all</button>
                                </div>
                                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {scrollerAvatars.map((initials) => (
                                        <div key={initials} className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold">
                                            {initials}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex flex-col gap-3">
                                    {suggestedPeople.map((person) => (
                                        <div key={person.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3 hover:bg-white/10 transition">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${person.accent} text-sm font-semibold`}>
                                                    {person.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{person.name}</p>
                                                    <p className="text-xs text-gray-400">{person.title}</p>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-1 rounded-xl bg-[#3BA3FF]/10 px-3 py-1 text-xs font-semibold text-[#3BA3FF] transition hover:bg-[#3BA3FF]/20">
                                                <UserPlus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">My Jobs</p>
                                        <h3 className="text-xl font-semibold">Application Panel</h3>
                                    </div>
                                    <Briefcase className="h-5 w-5 text-[#7BDFFF]" />
                                </div>
                                <div className="mt-4 flex flex-col gap-4">
                                    {applications.map((app) => (
                                        <div key={app.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold">{app.title}</p>
                                                    <p className="text-xs text-gray-400">{app.company}</p>
                                                </div>
                                                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${app.status === "Accepted" ? "bg-[#1C4238] text-[#63F1C2]" : "bg-white/10 text-gray-300"}`}>
                                                    {app.status}
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
