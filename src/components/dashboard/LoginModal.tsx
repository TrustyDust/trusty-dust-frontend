'use client'

import Image from "next/image"
import { X } from "lucide-react"
import Logo from "../../../public/logo.png"

import { useAuth } from "@/contexts/auth-context"

export function LoginModal() {
  const {
    showLoginModal,
    isAuthenticated,
    connecting,
    connectWithPrivy,
    connectWithRainbow,
    closeLoginModal,
  } = useAuth()

  if (isAuthenticated || !showLoginModal) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={closeLoginModal}
    >
      <div
        className="relative w-full max-w-md rounded-4xl border border-white/15 bg-[#030b1e]/95 p-8 text-center shadow-[0_30px_80px_rgba(3,6,18,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10"
          onClick={closeLoginModal}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex justify-center">
          <Image
            src={Logo}
            alt="Login"
            width={96}
            height={96}
            className="rounded-full border-4 border-white/10"
          />
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Login Trustydust</h2>
        <p className="mt-2 text-sm text-gray-400">
          Choose how you want to enter the SocialFi dashboard.
        </p>
        <div className="mt-6 space-y-4">
          <button
            onClick={connectWithPrivy}
            disabled={!!connecting}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-linear-to-r from-[#131b2f] to-[#0e1423] px-5 py-4 text-left text-sm font-semibold text-white transition hover:border-[#3BA3FF]"
          >
            <span>Login with Google Privy</span>
            <span className="text-xs text-gray-400">
              {connecting === "privy" ? "Connecting..." : "Privy"}
            </span>
          </button>
          <button
            onClick={connectWithRainbow}
            disabled={!!connecting}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-linear-to-r from-[#1c2a48] to-[#16213b] px-5 py-4 text-left text-sm font-semibold text-white transition hover:border-[#6B4DFF]"
          >
            <span>Login with Rainbow Kit</span>
            <span className="text-xs text-gray-400">
              {connecting === "rainbow" ? "Connecting..." : "Rainbow"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
