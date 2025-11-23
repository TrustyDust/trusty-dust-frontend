type BoostTrustCardProps = {
  score?: number
  label?: string
}

export function BoostTrustCard({
  score = 82,
  label = "Boost your score",
}: BoostTrustCardProps) {
  return (
    <div className="rounded-[28px] border border-[#3BA3FF]/30 bg-gradient-to-br from-[#041026] via-[#04152e] to-transparent p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#3BA3FF]/20 p-3 text-[#3BA3FF]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 11l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-300">{label}</p>
          <p className="text-lg font-semibold tracking-wide">Trust Level</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Current</span>
          <span>{score}%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3BA3FF] via-[#42E8E0] to-[#6B4DFF]"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <button className="mt-6 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#3BA3FF]/50 hover:bg-white/10">
        Boost Your Trust Score
      </button>
    </div>
  )
}
