"use client"

import { useEffect, useState } from "react"
import { Activity, CheckCircle2, Wallet, TrendingUp, Shield, Sparkles } from "lucide-react"

interface WalletAnalyzeLoadingProps {
  walletAddress: string
}

const analyzeSteps = [
  { label: "Fetching on-chain data", icon: Activity },
  { label: "Analyzing transaction history", icon: Wallet },
  { label: "Calculating trust metrics", icon: TrendingUp },
  { label: "Generating reputation score", icon: Shield },
  { label: "Finalizing analysis", icon: Sparkles },
]

export function WalletAnalyzeLoading({ walletAddress }: WalletAnalyzeLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Reset when component mounts
    setCurrentStep(0)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100
        }
        // Accelerate progress as it goes
        const increment = prev < 30 ? 2 : prev < 70 ? 1.5 : 1
        return Math.min(prev + increment, 100)
      })
    }, 150)

    // Simulate step changes
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analyzeSteps.length - 1) {
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [walletAddress])

  // Calculate progress per step
  const progressPerStep = 100 / analyzeSteps.length
  const stepProgress = Math.min(
    ((currentStep + 1) * progressPerStep) + 
    ((progress % progressPerStep) / progressPerStep) * progressPerStep,
    100
  )

  return (
    <section className="rounded-[32px] border border-white/5 bg-[#030b1e]/90 p-8 backdrop-blur relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E7FFF]/10 via-[#6B4DFF]/10 to-[#42E8E0]/10 animate-pulse" />
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 15 }).map((_, i) => {
              const left = (i * 7) % 100
              const top = (i * 11) % 100
              const size = 3 + (i % 4)
              const delay = (i * 0.3) % 2
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-[float_3s_ease-in-out_infinite]"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${delay}s`,
                  }}
                />
              )
            })}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] rounded-full blur-xl opacity-50 animate-pulse" />
            <Wallet className="h-8 w-8 text-[#3BA3FF] relative z-10 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Analyzing Wallet
            </p>
            <p className="text-xs text-gray-400 font-mono truncate max-w-md">
              {walletAddress}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2E7FFF] via-[#6B4DFF] to-[#42E8E0] transition-all duration-300 relative"
              style={{ width: `${stepProgress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {Math.round(stepProgress)}%
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {analyzeSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isPending = index > currentStep

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#2E7FFF]/20 to-[#6B4DFF]/20 border border-[#3BA3FF]/30 scale-[1.02]"
                    : isCompleted
                    ? "bg-white/5 border border-white/10 opacity-70"
                    : "bg-white/5 border border-white/5 opacity-40"
                }`}
              >
                <div className="relative">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : isActive ? (
                    <>
                      <div className="absolute inset-0 bg-[#3BA3FF] rounded-full animate-ping opacity-75" />
                      <Icon className="h-5 w-5 text-[#3BA3FF] relative z-10 animate-spin" />
                    </>
                  ) : (
                    <Icon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <p
                  className={`text-sm flex-1 ${
                    isActive
                      ? "text-white font-semibold"
                      : isCompleted
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                  {isActive && (
                    <span className="inline-block ml-2">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                        .
                      </span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                        .
                      </span>
                    </span>
                  )}
                </p>
              </div>
            )
          })}
        </div>

        {/* Animated wallet address visualization */}
        <div className="mt-6 p-4 rounded-xl bg-[#050f22]/60 border border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Activity className="h-3 w-3" />
            <span>Scanning blockchain...</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-6 bg-gradient-to-t from-[#2E7FFF]/20 to-[#6B4DFF]/20 rounded-sm animate-[wave_1s_ease-in-out_infinite]"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

