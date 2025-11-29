"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Smile, Users, Loader2, AlertCircle, X, CheckCircle2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { WalletAnalyzeLoading } from "@/components/dashboard/WalletAnalyzeLoading"
import { useAnalyzeWalletApi } from "@/hooks/api/walletReputation"
import { useCurrentUserId } from "@/hooks/page/useCurrentUser"
import { useTypingEffect } from "@/hooks/useTypingEffect"
import { isValidEthereumAddress, normalizeWalletAddress } from "@/lib/wallet-utils"
import { toast } from "sonner"
import Image from "next/image"
import type { WalletReputationResponse } from "@/types/api"

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

// Default chain ID untuk Ethereum mainnet
const DEFAULT_CHAIN_ID = 4202

// Helper function untuk mendapatkan tier image path
function getTierImagePath(tier: string): string {
  const tierLower = tier.toLowerCase()
  if (tierLower === "dust") return "/tier/dust.svg"
  if (tierLower === "spark") return "/tier/spark.svg"
  if (tierLower === "flare") return "/tier/flare.svg"
  if (tierLower === "nova") return "/tier/nova.svg"
  return "/tier/spark.svg" // default
}

export default function VerifyPage() {
  const [mode, setMode] = useState<"jobs" | "people">("jobs")
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [analyzeResult, setAnalyzeResult] = useState<WalletReputationResponse | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [addressError, setAddressError] = useState<string | null>(null)
  
  const userId = useCurrentUserId()
  const analyzeWallet = useAnalyzeWalletApi()
  
  // Validate address on change
  const handleAddressChange = (value: string) => {
    setWalletAddress(value)
    
    if (!value.trim()) {
      setAddressError(null)
      return
    }
    
    if (!isValidEthereumAddress(value)) {
      if (value.trim().length < 42) {
        setAddressError("Wallet address must be 42 characters (0x + 40 hex characters)")
      } else if (!value.trim().startsWith("0x")) {
        setAddressError("Wallet address must start with '0x'")
      } else if (!/^0x[a-fA-F0-9]*$/.test(value.trim())) {
        setAddressError("Wallet address contains invalid characters (only 0-9, a-f, A-F allowed)")
      } else {
        setAddressError("Invalid wallet address format")
      }
    } else {
      setAddressError(null)
    }
  }
  
  const handleClearResult = () => {
    setAnalyzeResult(null)
    setWalletAddress("")
    setAddressError(null)
  }
  
  // Typing effect untuk reasoning
  const { displayedText: reasoningText, isTyping: isTypingReasoning } = useTypingEffect(
    analyzeResult?.reasoning || null,
    50 // speed: 50ms per kata
  )
  
  // Staggered animation untuk breakdown items
  useEffect(() => {
    if (!analyzeResult) {
      setVisibleItems(new Set())
      return
    }

    // Reset visible items
    setVisibleItems(new Set())

    // Item breakdown order: Transaction History, Token Holdings, NFT Engagement, DeFi Activity, Contract Interaction
    const itemOrder = [0, 1, 2, 3, 4] // Index untuk setiap item
    const timeouts: NodeJS.Timeout[] = []
    
    itemOrder.forEach((index, orderIndex) => {
      const timeoutId = setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, index]))
      }, 300 + orderIndex * 200) // 300ms initial delay + 200ms per item
      timeouts.push(timeoutId)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [analyzeResult])

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address")
      setAddressError("Wallet address is required")
      return
    }

    // Validate using utility function
    if (!isValidEthereumAddress(walletAddress)) {
      toast.error("Invalid wallet address format")
      handleAddressChange(walletAddress) // Trigger validation to show error
      return
    }

    // Normalize address
    const normalizedAddress = normalizeWalletAddress(walletAddress)
    if (!normalizedAddress) {
      toast.error("Invalid wallet address format")
      return
    }

    // Clear previous result when starting new analysis
    setAnalyzeResult(null)
    setAddressError(null)

    try {
      const result = await analyzeWallet.mutateAsync({
        address: normalizedAddress,
        chainId: DEFAULT_CHAIN_ID,
        userId: userId || undefined,
      })
      
      setAnalyzeResult(result)
      toast.success("Wallet analyzed successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze wallet"
      toast.error(errorMessage)
      setAnalyzeResult(null)
    }
  }

  const isLoading = analyzeWallet.isPending

  return (
    <div className="relative min-h-screen px-4 py-6 pb-10 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,163,255,0.35),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(107,77,255,0.25),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%25%27 height=%27120%25%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

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

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar
              activeNav="verify"
              boostScore={90}
              boostLabel="Audit your score"
            />
          </aside>

          {mode === "jobs" ? (
            <>
              <main className="flex-1 pr-2 lg:max-w-3xl">
                <div className="space-y-6">
                {/* Input Section - Only show when no result or loading */}
                {(!analyzeResult || isLoading) && (
                  <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                    <h1 className="text-2xl font-semibold">
                      Analyze Wallet Reputation
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                      Create a zero-knowledge proof that verifies your reputation
                      tier without exposing your exact score or transaction
                      history.
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex-1 relative">
                          <input
                            value={walletAddress}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isLoading && !addressError && isValidEthereumAddress(walletAddress)) {
                                handleAnalyze()
                              }
                            }}
                            disabled={isLoading}
                            className={(() => {
                              if (addressError) {
                                return "w-full rounded-2xl border px-4 py-3 pr-10 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-red-500/50 bg-red-500/5 focus:border-red-500/70"
                              }
                              if (walletAddress.trim() && isValidEthereumAddress(walletAddress)) {
                                return "w-full rounded-2xl border px-4 py-3 pr-10 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-green-500/50 bg-green-500/5 focus:border-green-500/70"
                              }
                              return "w-full rounded-2xl border px-4 py-3 pr-10 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-white/10 bg-[#050f22] focus:border-[#3BA3FF]/50"
                            })()}
                            placeholder="Enter Wallet Address (0x...)"
                            maxLength={42}
                          />
                          {/* Validation Icon */}
                          {walletAddress.trim() && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {addressError && (
                                <AlertCircle className="h-4 w-4 text-red-400" />
                              )}
                              {!addressError && isValidEthereumAddress(walletAddress) && (
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleAnalyze}
                          disabled={isLoading || !walletAddress.trim() || !!addressError || !isValidEthereumAddress(walletAddress)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-6 py-3 text-sm font-semibold shadow-[0_10px_30px_rgba(46,127,255,0.45)] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_10px_30px_rgba(46,127,255,0.45)]"
                        >
                          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isLoading ? "Analyzing..." : "Analyze"}
                        </button>
                      </div>
                      
                      {/* Validation Error Message */}
                      {addressError && (
                        <div className="flex items-start gap-2 text-xs text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{addressError}</span>
                        </div>
                      )}
                      
                      {/* Validation Success Message */}
                      {walletAddress.trim() && !addressError && isValidEthereumAddress(walletAddress) && (
                        <div className="flex items-start gap-2 text-xs text-green-400">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>Valid wallet address</span>
                        </div>
                      )}
                    </div>
                    
                    {/* API Error State */}
                    {analyzeWallet.error && (
                      <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-300">Analysis failed</p>
                            <p className="text-xs text-red-400/80 mt-1">
                              {analyzeWallet.error instanceof Error
                                ? analyzeWallet.error.message
                                : "Something went wrong. Please try again."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                )}
                
                {/* Show result header with clear button when result exists */}
                {analyzeResult && !isLoading && (
                  <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-semibold">
                          Wallet Analysis Result
                        </h1>
                        <p className="mt-1 text-xs text-gray-400 font-mono">
                          {analyzeResult.address}
                        </p>
                      </div>
                      <button
                        onClick={handleClearResult}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                        Analyze Another
                      </button>
                    </div>
                  </section>
                )}

                {/* Result Section - Only show after analyze and not loading */}
                {analyzeResult && !isLoading && (
                  <section className="rounded-[32px] border border-white/5 bg-[#030b1e]/90 p-6 backdrop-blur">
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <div className="flex flex-1 flex-col gap-4 rounded-[24px] p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white">
                            <Image
                              src={getTierImagePath(analyzeResult.tier)}
                              alt={`${analyzeResult.tier} Tier`}
                              width={176}
                              height={176}
                              className="h-44 w-44"
                            />
                          </div>
                          <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-blue-200">
                              {analyzeResult.tier} Tier
                            </p>
                            <p className="text-4xl font-semibold">{analyzeResult.score} Pts</p>
                            <p className="text-xs text-gray-400">
                              Risk Score {analyzeResult.riskScore}/100
                            </p>
                          </div>
                        </div>
                        {analyzeResult.reasoning && (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-[#050f22]/60 p-4">
                            <p className="text-xs text-gray-400">
                              {reasoningText}
                              {isTypingReasoning && (
                                <span className="inline-block w-2 h-3 ml-1 bg-blue-400 animate-pulse" />
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center rounded-[24px] border border-white/5 bg-[#050f22]/60 p-6">
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                          Score Breakdown
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF]"
                            style={{ width: `${(analyzeResult.score / 1000) * 100}%` }}
                          />
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                          <span>Tier: {analyzeResult.tier}</span>
                          <span>Score: {analyzeResult.score}/1000</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {/* Transaction History */}
                      <div
                        className={`rounded-[20px] border border-white/5 bg-[#050f22]/70 p-4 transition-all duration-500 ${
                          visibleItems.has(0)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>Transaction History</span>
                          <span>{analyzeResult.breakdown.txnScore}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] transition-all duration-700"
                            style={{
                              width: visibleItems.has(0) ? `${(analyzeResult.breakdown.txnScore / 1000) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Token Holdings */}
                      <div
                        className={`rounded-[20px] border border-white/5 bg-[#050f22]/70 p-4 transition-all duration-500 ${
                          visibleItems.has(1)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>Token Holdings</span>
                          <span>{analyzeResult.breakdown.tokenScore}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#42E8E0] to-[#3BA3FF] transition-all duration-700"
                            style={{
                              width: visibleItems.has(1) ? `${(analyzeResult.breakdown.tokenScore / 1000) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* NFT Engagement */}
                      <div
                        className={`rounded-[20px] border border-white/5 bg-[#050f22]/70 p-4 transition-all duration-500 ${
                          visibleItems.has(2)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>NFT Engagement</span>
                          <span>{analyzeResult.breakdown.nftScore}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] transition-all duration-700"
                            style={{
                              width: visibleItems.has(2) ? `${(analyzeResult.breakdown.nftScore / 1000) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* DeFi Activity */}
                      <div
                        className={`rounded-[20px] border border-white/5 bg-[#050f22]/70 p-4 transition-all duration-500 ${
                          visibleItems.has(3)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>DeFi Activity</span>
                          <span>{analyzeResult.breakdown.defiScore}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#42E8E0] to-[#3BA3FF] transition-all duration-700"
                            style={{
                              width: visibleItems.has(3) ? `${(analyzeResult.breakdown.defiScore / 1000) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Contract Interaction */}
                      <div
                        className={`rounded-[20px] border border-white/5 bg-[#050f22]/70 p-4 md:col-span-2 transition-all duration-500 ${
                          visibleItems.has(4)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>Contract Interaction</span>
                          <span>{analyzeResult.breakdown.contractScore}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] transition-all duration-700"
                            style={{
                              width: visibleItems.has(4) ? `${(analyzeResult.breakdown.contractScore / 1000) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Loading State - Enhanced with animated steps */}
                {isLoading && (
                  <WalletAnalyzeLoading walletAddress={walletAddress} />
                )}

                {/* Empty State - Before analyze */}
                {!analyzeResult && !isLoading && (
                  <section className="rounded-[32px] border border-white/5 bg-[#030b1e]/90 p-12 backdrop-blur">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-300 mb-2">
                        No analysis yet
                      </p>
                      <p className="text-xs text-gray-500">
                        Enter a wallet address and click Analyze to see reputation results
                      </p>
                    </div>
                  </section>
                )}
                </div>
              </main>

              <aside className="w-full shrink-0 lg:w-72 xl:w-80">
                <div className="sticky top-28 flex h-fit flex-col gap-6">
                  <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full">
                        <Image
                          src="/tier/spark.svg"
                          alt="Spark badge"
                          className="h-24 w-24"
                          width={96}
                          height={96}
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
                </div>
              </aside>
            </>
          ) : (
            <>
              <main className="flex-1 pr-2 lg:max-w-3xl">
                <div className="space-y-6">
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
                            <Image
                              src={person.avatar}
                              alt={person.name}
                              className="h-14 w-14 rounded-full border border-white/10 object-cover"
                              width={56}
                              height={56}
                            />
                            <Image
                              src={person.badge}
                              alt="badge"
                              className="absolute -bottom-1 -right-1 h-6 w-6"
                              width={24}
                              height={24}
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
                </div>
              </main>

              <aside className="w-full shrink-0 lg:w-72 xl:w-80">
                <div className="sticky top-28 flex h-fit flex-col gap-6">
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
                            <Image
                              src={talent.avatar}
                              alt={talent.name}
                              className="h-10 w-10 rounded-full border border-white/10"
                              width={40}
                              height={40}
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
                </div>
              </aside>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
