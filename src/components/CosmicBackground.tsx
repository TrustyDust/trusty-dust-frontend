"use client"

import { CSSProperties, useMemo } from "react"

// Render counts trimmed to lighten DOM/animation load.
const STAR_COUNT = 320
const COMET_COUNT = 4
const RNG_SEED = 42

// Simple deterministic PRNG (mulberry32) so SSR/CSR match.
function createRandom(seed: number) {
  return () => {
    // eslint-disable-next-line no-param-reassign
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Comet = {
  id: string
  delay: number
  duration: number
  startX: number
  startY: number
  angle: number
  translateX: number
  translateY: number
  width: number
  height: number
}

type StarStyle = CSSProperties & {
  "--twinkle-opacity"?: string
  "--twinkle-delay"?: string
}

type Star = {
  id: string
  style: StarStyle
}

const cometPalette = [
  "from-cyan-400/80 via-sky-300/40 to-transparent",
  "from-indigo-400/80 via-indigo-300/30 to-transparent",
  "from-purple-400/80 via-purple-300/30 to-transparent",
]

export function CosmicBackground() {
  const { comets, stars } = useMemo(() => {
    const rand = createRandom(RNG_SEED)

    const cometList: Comet[] = Array.from({ length: COMET_COUNT }).map((_, index) => {
      const travel = 120 + rand() * 60
      return {
        id: `comet-${index}`,
        delay: rand() * 10,
        duration: 10 + rand() * 12,
        startX: rand() * 40 - 20,
        startY: rand() * 40 - 10,
        angle: 35 + rand() * 5,
        translateX: travel,
        translateY: travel / 1.3,
        width: 220 + rand() * 80,
        height: rand() * 1.2 + 0.4,
      }
    })

    const starList: Star[] = Array.from({ length: STAR_COUNT }).map((_, index) => ({
      id: `star-${index}`,
      style: {
        top: `${rand() * 100}%`,
        left: `${rand() * 100}%`,
        width: `${rand() * 2 + 1}px`,
        height: `${rand() * 2 + 1}px`,
        opacity: 0.15 + rand() * 0.15,
        "--twinkle-opacity": `${0.2 + rand() * 0.2}`,
        "--twinkle-delay": `${rand() * 2}s`,
      },
    }))

    return { comets: cometList, stars: starList }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
      <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(59,130,246,0.18),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.18),transparent_50%)]" />

      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            style={star.style}
            className="star absolute rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.4)]"
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {comets.map((comet, index) => (
          <div
            key={comet.id}
            style={
              {
                top: `${comet.startY}%`,
                left: `${comet.startX}%`,
                transform: `rotate(${comet.angle}deg)`,
                width: `${comet.width}px`,
                height: `${comet.height}px`,
                "--tx": `${comet.translateX}px`,
                "--ty": `${comet.translateY}px`,
                "--duration": `${comet.duration}s`,
                "--delay": `${comet.delay}s`,
              } as CSSProperties
            }
            className={`comet-animate absolute bg-linear-to-l ${
              cometPalette[index % cometPalette.length]
            } blur-[1px] opacity-70`}
          >
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_12px_rgba(125,211,252,0.9)]" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="absolute -left-32 top-24 h-[260px] w-[260px] bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-60 w-60 bg-purple-500/10 blur-[160px]" />
      </div>
    </div>
  )
}
