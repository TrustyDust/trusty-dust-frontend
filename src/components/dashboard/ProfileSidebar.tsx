"use client"

import Image from "next/image"

interface Tier {
  label: string
  minScore: number
  logo: any
}

interface GrowthAction {
  label: string
  points: string
}

interface ProfileSidebarProps {
  activeTier: Tier
  trustLevels: Tier[]
  progressPercent: number
  currentScore: number
  growthActions: GrowthAction[]
}

export default function ProfileSidebar({
  activeTier,
  trustLevels,
  progressPercent,
  currentScore,
  growthActions,
}: ProfileSidebarProps) {
  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
      {/* CURRENT TIER CARD */}
      <section className="flex flex-col items-center rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
        <div className="mb-2 flex flex-col items-center justify-center">
          <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
            <Image
              src={activeTier.logo}
              alt="Current Tier"
              className="relative h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(59,163,255,0.5)]"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">{activeTier.label}</h2>
        </div>

        {/* Tier List */}
        <div className="w-full">
          <p className="mb-3 text-left text-[14px] font-semibold text-white">
            Get To Know Level
          </p>

          <div className="space-y-3">
            {trustLevels.map((level) => {
              const isActive = level.label === activeTier.label
              return (
                <div
                  key={level.label}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all ${
                    isActive
                      ? "border-cyan-500/50 bg-[#041233] text-white shadow-[0_0_20px_rgba(46,127,255,0.15)_inset]"
                      : "border-white/5 bg-white/2 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={level.logo}
                      alt={level.label}
                      className={`h-8 w-8 object-contain ${
                        !isActive && "opacity-60 grayscale"
                      }`}
                    />
                    <span className="font-medium">{level.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Your Score :</span>
            <span className="font-semibold text-white">{currentScore}</span>
          </div>
          <div className="mt-3 h-3 w-full rounded-full bg-[#1a1f36]">
            <div
              className="h-full rounded-full bg-[#2E7FFF] shadow-[0_0_10px_#2E7FFF] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* GROWTH ACTIONS */}
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
  )
}
