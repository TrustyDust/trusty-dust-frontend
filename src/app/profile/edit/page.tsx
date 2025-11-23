'use client'

import { Camera, LinkIcon, Upload } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

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

export default function EditProfilePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714]/85 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,163,255,0.35),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(107,77,255,0.25),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader
          actions={
            <>
              <button className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:flex">
                $100 DUST
              </button>
              <button className="rounded-full border border-transparent bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)]">
                Become Pro Member
              </button>
            </>
          }
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar activeNav="jobs" boostScore={90} boostLabel="Audit your score" />
          </aside>

          <main className="flex-1 space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-[#030b1e]/90 p-6 shadow-[0_20px_60px_rgba(5,8,20,0.8)] backdrop-blur">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src="/tier/avatar.png"
                      alt="Profile"
                      className="h-32 w-32 rounded-full border-4 border-white/10 object-cover"
                    />
                    <button className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] p-2 text-white shadow-[0_5px_20px_rgba(46,127,255,0.5)]">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-lg font-semibold">Portfolio</p>
                </div>

                <div className="flex flex-1 flex-col gap-4">
                  <label className="text-sm text-gray-400">
                    Profile Name
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                      placeholder="Type here"
                    />
                  </label>
                  <label className="text-sm text-gray-400">
                    Title Job
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                      placeholder="Type here"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { label: "CV Upload", icon: <Upload className="h-4 w-4" /> },
                  { label: "Github Link", icon: <LinkIcon className="h-4 w-4" /> },
                  { label: "Portfolio Link", icon: <LinkIcon className="h-4 w-4" /> },
                ].map(({ label, icon }) => (
                  <label key={label} className="text-sm text-gray-400">
                    {label}
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3">
                      <span className="text-gray-500">{icon}</span>
                      <input
                        placeholder="Type here"
                        className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                      />
                    </div>
                  </label>
                ))}
              </div>

              <button className="mt-4 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-400 hover:text-white">
                + Add More
              </button>

              <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] py-3 text-sm font-semibold shadow-[0_12px_40px_rgba(30,112,255,0.45)]">
                Save Changes
              </button>
            </section>
          </main>

          <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
            <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF]">
                  <img src="/tier/spark.png" alt="Spark" className="h-8 w-8" />
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
                      level.active ? "border-[#357dff]/60 bg-[#041233]/80 text-white" : "border-white/10 bg-white/5 text-gray-300"
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
