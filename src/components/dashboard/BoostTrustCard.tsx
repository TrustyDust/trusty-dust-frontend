import { Loader2, RotateCcw } from "lucide-react"

import { useTrustScoreApi } from "@/hooks/api/trust"

type BoostTrustCardProps = {
  label?: string
  fallbackScore?: number
}

export function BoostTrustCard({
  label = "Boost your score",
  fallbackScore = 0,
}: BoostTrustCardProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useTrustScoreApi()

  const rawScore = data?.trustScore ?? fallbackScore
  const cappedScore = Math.min(Math.max(rawScore, 0), 1000)
  const percentage = Math.min(Math.round((cappedScore / 1000) * 100), 100)

  return (
    <div className="rounded-[28px] border border-[#3BA3FF]/30 bg-gradient-to-br from-[#041026] via-[#04152e] to-transparent p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#3BA3FF]/20 p-3 text-[#3BA3FF]">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 11l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-300">{label}</p>
          <p className="text-lg font-semibold tracking-wide">Trust Level</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {error?.message ?? "Unable to fetch trust score."}
          </div>
        ) : null}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Current</span>
          <span className="font-semibold text-white">
            {isLoading ? "Syncing…" : `${cappedScore.toLocaleString()}/1000`}
          </span>
        </div>
        <div className="h-3 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3BA3FF] via-[#42E8E0] to-[#6B4DFF] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-[11px] text-gray-500">
          {percentage}% to Nova tier
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:border-[#42E8E0]/50 hover:text-white disabled:opacity-60"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RotateCcw className={isLoading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          Refresh
        </button>
      </div>
    </div>
  )
}
