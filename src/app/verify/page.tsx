"use client"

import { useState } from "react"
import { ChevronDown, Smile, Users } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

const trustMetrics = [
  { label: "Transaction history", value: 90 },
  { label: "Token Holdings", value: 90 },
  { label: "NFT Engagement", value: 90 },
  { label: "Contract Interaction", value: 90 },
  { label: "DeFi Activity", value: 90 },
]

const trustLevels = [
  { label: "Dust", points: 2000 },
  { label: "Spark", points: 4000, active: true },
  { label: "Flare", points: 6000 },
  { label: "Nova", points: 8000 },
]

const growthActions = [
  { label: "Like", points: "+1 Pts" },
  { label: "Comment", points: "+1 Pts" },
  { label: "Get Hired", points: "+1 Pts" },
  { label: "Recommendation", points: "+1 Pts" },
]

const peopleDirectory = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  name: "Walter White",
  role: "UI/UX Designer",
  avatar: "/tier/avatar.png",
  badge: "/tier/spark.png",
}))

const suggestedTalents = [
  { name: "Family Mart", title: "Web3 Builder", avatar: "/tier/avatar.png" },
  { name: "Family Mart", title: "Quant Analyst", avatar: "/tier/avatar.png" },
  {
    name: "Family Mart",
    title: "Blockchain Engineer",
    avatar: "/tier/avatar.png",
  },
]

const hotJobs = [
  { title: "Smart Contract Dev", company: "Bybit APAC", location: "Remote" },
  { title: "Smart Contract Dev", company: "Bybit APAC", location: "Remote" },
  { title: "Smart Contract Dev", company: "Bybit APAC", location: "Remote" },
]

export default function VerifyPage() {
  const [mode, setMode] = useState<"jobs" | "people">("jobs")
  const [selectorOpen, setSelectorOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden  px-4 py-6 text-white sm:px-6 lg:px-8">

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader
          searchPlaceholder={
            mode === "people" ? "Search People..." : "Search Wallets..."
          }
          actions={
            <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10"
                  onClick={() => setSelectorOpen((prev) => !prev)}
                >
                  {mode === "people" ? (
                    <>
                      People <Smile className="h-4 w-4 text-yellow-200" />
                    </>
                  ) : (
                    <>
                      Jobs <Users className="h-4 w-4 text-blue-300" />
                    </>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {selectorOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/10 bg-[#030b1e] p-2 shadow-lg">
                    {[
                      { key: "jobs", label: "Jobs" },
                      { key: "people", label: "People" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                          mode === option.key
                            ? "bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] text-white"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                        onClick={() => {
                          setMode(option.key as "jobs" | "people")
                          setSelectorOpen(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          }
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar
              activeNav="verify"
              boostScore={90}
              boostLabel="Audit your score"
            />
          </aside>

          {mode === "jobs" ? (
            <>
              <main className="flex-1 space-y-6">
                <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                  <h1 className="text-2xl font-semibold">
                    Analyze Wallet Reputation
                  </h1>
                  <p className="mt-2 text-sm text-gray-400">
                    Create a zero-knowledge proof that verifies your reputation
                    tier without exposing your exact score or transaction
                    history.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      className="flex-1 rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                      placeholder="Enter Wallet Address"
                    />
                    <button className="rounded-2xl bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-6 py-3 text-sm font-semibold shadow-[0_10px_30px_rgba(46,127,255,0.45)]">
                      Analyze
                    </button>
                  </div>
                </section>

                <section className="rounded-[32px] border border-white/5 bg-[#030b1e]/90 p-6 backdrop-blur">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex flex-1 flex-col gap-4 rounded-[24px p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ">
                          <img
                            src="/tier/spark.svg"
                            alt="Spark Tier"
                            className="h-44 w-44"
                          />
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-blue-200">
                            Spark Tier
                          </p>
                          <p className="text-4xl font-semibold">4000 Pts</p>
                          <p className="text-xs text-gray-400">
                            Trust Level High • Risk Score 12/100
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center rounded-[24px] border border-white/5 bg-[#050f22]/60 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                        Confidence
                      </p>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF]" />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                        <span>Trust Level High</span>
                        <span>Score 4000</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {trustMetrics.map((metric, index) => (
                      <div
                        key={metric.label}
                        className="rounded-[20px] border border-white/5 bg-[#050f22]/70 p-4"
                      >
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>{metric.label}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full ${
                              index % 2 === 0
                                ? "bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF]"
                                : "bg-gradient-to-r from-[#42E8E0] to-[#3BA3FF]"
                            }`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </main>

              <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full">
                      <img
                        src="/tier/spark.svg"
                        alt="Spark badge"
                        className="h-24 w-24"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Spark</p>
                      <p className="text-xs text-gray-400">Get to know level</p>
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
                        <span className="text-xs text-gray-400">
                          {level.points}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Your Score
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF]"
                        style={{ width: "65%" }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">4000 pts</p>
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold">
                    How To Increase Points
                  </h3>
                  <div className="mt-4 space-y-3">
                    {growthActions.map((action) => (
                      <div
                        key={action.label}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200"
                      >
                        <span>{action.label}</span>
                        <span className="text-xs text-[#7BDFFF]">
                          {action.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </>
          ) : (
            <>
              <main className="flex-1 space-y-6">
                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/85 p-6 backdrop-blur">
                  <h2 className="text-2xl font-semibold">People</h2>
                  <div className="mt-6 space-y-4">
                    {peopleDirectory.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center justify-between rounded-[28px] border border-white/10 bg-[#050f22]/80 px-4 py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="h-14 w-14 rounded-full border border-white/10 object-cover"
                            />
                            <img
                              src={person.badge}
                              alt="badge"
                              className="absolute -bottom-1 -right-1 h-6 w-6"
                            />
                          </div>
                          <div>
                            <p className="text-lg font-semibold">
                              {person.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {person.role}
                            </p>
                          </div>
                        </div>
                        <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                          Follow +
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </main>

              <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Suggested for you</h3>
                    <button className="text-sm text-[#7BDFFF]">See all</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {suggestedTalents.map((talent, index) => (
                      <div
                        key={`${talent.name}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={talent.avatar}
                            alt={talent.name}
                            className="h-10 w-10 rounded-full border border-white/10"
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {talent.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {talent.title}
                            </p>
                          </div>
                        </div>
                        <button className="rounded-full border border-white/10 bg-[#051431] px-3 py-1 text-xs text-white">
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold">Hot Job Posted</h3>
                  <div className="mt-4 space-y-3">
                    {hotJobs.map((job, index) => (
                      <div
                        key={`${job.title}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-semibold">
                          BYB
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{job.title}</p>
                          <p className="text-xs text-gray-400">{job.company}</p>
                          <p className="text-xs text-gray-400">
                            {job.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
