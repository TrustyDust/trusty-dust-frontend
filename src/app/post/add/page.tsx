'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  ImageIcon, 
  Link2, 
  Paperclip, 
  X, 
  Globe, 
  Lock, 
  ChevronDown 
} from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

export default function AddPostPage() {
  const [content, setContent] = useState("")
  const [privacy, setPrivacy] = useState("Public")

  const composerActions = [
    { label: "Image", icon: ImageIcon },
    { label: "Link", icon: Link2 },
    { label: "File", icon: Paperclip },
  ]

  return (
    <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* Background Layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[#050C24]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.15),transparent_45%)]" />
       </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
        <DashboardHeader
            actions={
                <div className="flex items-center gap-3">
                    <Link href="/post" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0A1325] px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10">
                        Cancel
                    </Link>
                </div>
            }
        />

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar activeNav="explore" />
          </aside>

          <main className="flex-1">
            <div className="flex flex-col gap-6 lg:flex-row">
                
                {/* COMPOSER AREA */}
                <div className="flex-1">
                    <div className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 md:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BA3FF]/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            {/* Header: User Info & Privacy */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-lg font-semibold shadow-lg shadow-[#3BA3FF]/20">
                                        TR
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white">TrustyDust Ops</p>
                                        <button className="mt-1 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition">
                                            {privacy === "Public" ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                                            {privacy}
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Text Area */}
                            <div className="min-h-[250px] w-full mb-6">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What do you want to share with the universe today?"
                                    className="w-full h-full min-h-[250px] bg-transparent text-xl md:text-2xl text-white placeholder-gray-500 border-none focus:ring-0 resize-none leading-relaxed"
                                    autoFocus
                                />
                            </div>

                            {/* Separator */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                            {/* Bottom Actions */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                    <span className="text-xs font-medium text-gray-500 mr-2 uppercase tracking-wide">Add to your post</span>
                                    {composerActions.map((action) => (
                                        <button 
                                            key={action.label} 
                                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white hover:border-[#3BA3FF]/50"
                                        >
                                            <action.icon className="h-4 w-4 text-[#3BA3FF]" />
                                            <span className="hidden md:inline">{action.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    className={`w-full md:w-auto rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] 
                                    ${content.length > 0 
                                        ? "bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] shadow-[0_10px_35px_rgba(59,163,255,0.35)] cursor-pointer" 
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
                                    disabled={content.length === 0}
                                >
                                    Post Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - PREVIEW/TIPS */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
                        <h3 className="text-lg font-semibold text-white mb-4">Posting Tips</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-gray-400">
                                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7BDFFF]" />
                                Keep it relevant to Web3 and DeFi trends.
                            </li>
                            <li className="flex gap-3 text-sm text-gray-400">
                                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3BA3FF]" />
                                Use high-quality images to boost engagement (Trust Score +5).
                            </li>
                            <li className="flex gap-3 text-sm text-gray-400">
                                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B4DFF]" />
                                Be respectful and verify your claims.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}