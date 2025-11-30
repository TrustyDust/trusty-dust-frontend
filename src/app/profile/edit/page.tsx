'use client'

import { useState } from "react"
import { Camera, LinkIcon, Upload } from "lucide-react"
import Image from "next/image"

import Dust from "../../../../public/tier/dust.svg"
import Spark from "../../../../public/tier/spark.svg"
import Flare from "../../../../public/tier/flare.svg"
import Nova from "../../../../public/tier/nova.svg"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import  ProfileSidebar  from "@/components/dashboard/ProfileSidebar";



interface ExtraField {
  id: number;
}


const USER_STATS = {
  currentScore: 600,
}
const MAX_PROGRESS = 4000

// const userAvatar = user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=placeholder"



const trustLevels = [
  { label: "Dust", minScore: 0, logo: Dust },
  { label: "Spark", minScore: 600, logo: Spark },
  { label: "Flare", minScore: 1600, logo: Flare },
  { label: "Nova", minScore: 3800, logo: Nova },
]

const growthActions = [
  { label: "Like", points: "+1 Pts" },
  { label: "Comment", points: "+1 Pts" },
  { label: "Get Hired", points: "+1 Pts" },
  { label: "Recommendation", points: "+1 Pts" },
]

export default function EditProfilePage() {
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);


  const activeTierIndex = trustLevels.findLastIndex(tier => USER_STATS.currentScore >= tier.minScore)
  const activeTier = trustLevels[activeTierIndex]
  const nextTier = trustLevels[activeTierIndex + 1]


let progressPercent = (USER_STATS.currentScore / MAX_PROGRESS) * 100;
if (progressPercent > 100) progressPercent = 100;

const handleAddField = () => {
    setExtraFields(prev => [...prev, { id: Date.now() }]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714]/85 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-linear-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.35),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(107,77,255,0.25),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader
          actions={
            <>
              {/* <button className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:flex">
                $100 DUST
              </button> */}
              <button className="rounded-full border border-transparent bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)]">
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
            <section className="rounded-4xl border border-white/10 bg-[#030b1e]/90 p-6 shadow-[0_20px_60px_rgba(5,8,20,0.8)] backdrop-blur">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Image
                      src={"https://api.dicebear.com/7.x/notionists/svg?seed=placeholder"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-full border-4 border-white/10 object-cover"
                      unoptimized
                    />
                    <button className="absolute bottom-0 right-0 rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] p-2 text-white shadow-[0_5px_20px_rgba(46,127,255,0.5)]">
                      <Camera className="h-4 w-4" />
                    </button>

                    <button className="absolute bottom-0 right-0 rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] p-2 text-white shadow-[0_5px_20px_rgba(46,127,255,0.5)]">
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

  {/* EXTRA FIELDS */}
  {extraFields.map(field => (
    <label key={field.id} className="text-sm text-gray-400">
      Extra Field
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3">
        <span className="text-gray-500"><LinkIcon className="h-4 w-4" /></span>
        <input
          placeholder="Type here"
          className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
        />
      </div>
    </label>
  ))}
</div>

{/* <button
  onClick={handleAddField}
  className="mt-4 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-400 hover:text-white"
>
  + Add More
</button> */}


              <button className="mt-4 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-3 text-sm text-gray-400 hover:text-white">
                + Add More
              </button>

              <button className="mt-6 w-full rounded-2xl bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] py-3 text-sm font-semibold shadow-[0_12px_40px_rgba(30,112,255,0.45)]">
                Save Changes
              </button>
            </section>
          </main>

<aside className="w-full shrink-0 space-y-6 lg:w-72 xl:w-80">
  <ProfileSidebar
    activeTier={activeTier}
    trustLevels={trustLevels}
    progressPercent={progressPercent}
    currentScore={USER_STATS.currentScore}
    growthActions={growthActions}
  />
</aside>

        </div>
      </div>
    </div>
  )
}