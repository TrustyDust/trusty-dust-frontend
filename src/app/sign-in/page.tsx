'use client'

import { Wallet } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

import Logo from "../../../public/logo.png"

export default function SignInPage() {
  const { connectWithPrivy, connectWithRainbow, connecting } = useAuth()

  const glow = "bg-gradient-to-r from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0]"

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-linear-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.35),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(107,77,255,0.25),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 lg:flex-row lg:items-center lg:gap-12">

        <div className="mb-10 w-full lg:mb-0 lg:w-1/2">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <div className={`h-10 w-10 rounded-full ${glow}`} />
            <span className="text-lg font-semibold tracking-wide">TrustyDust</span>
          </div>
          <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl">
            Welcome back to the galaxy of trusted builders.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/70 sm:text-base">
            Connect with your wallet or Privy account to continue building your SocialFi presence.
            Earn trust, share progress, and land your next opportunity.
          </p>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="relative rounded-[28px] border border-white/10 bg-[#040f25]/80 p-8 shadow-[0_20px_80px_rgba(2,8,27,0.8)] backdrop-blur">
            <div className="absolute inset-0 rounded-[28px] bg-white/5 blur-3xl" />
            <div className="relative space-y-6">
              <div className="text-center">
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
              </div>

              <div className="space-y-3">
                <button
                  onClick={connectWithPrivy}
                  disabled={connecting === "privy"}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#3BA3FF]/50 disabled:opacity-60"
                >
                  <span>Login with Privy</span>
                  <span className="text-xs text-white/80">
                    {connecting === "privy" ? "Connecting..." : "Google / Wallet"}
                  </span>
                </button>
                <button
                  onClick={connectWithRainbow}
                  disabled={connecting === "rainbow"}
                  className={`flex w-full items-center justify-between rounded-2xl border border-white/10 ${glow} px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(94,123,255,0.45)] transition hover:scale-[1.01] disabled:opacity-60`}
                >
                  <span>Connect Wallet (Rainbow)</span>
                  <Wallet className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
