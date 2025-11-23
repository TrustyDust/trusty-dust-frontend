"use client"

import { CSSProperties } from "react"

const STAR_COUNT = 1000
const COMET_COUNT = 10

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

const comets: Comet[] = Array.from({ length: COMET_COUNT }).map((_, index) => {
  const travel = 120 + Math.random() * 60
  return {
    id: `comet-${index}`,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 12,
    startX: Math.random() * 40 - 20,
    startY: Math.random() * 40 - 10,
    angle: 35 + Math.random() * 5,
    translateX: travel,
    translateY: travel / 1.3,
    width: 220 + Math.random() * 80,
    height: Math.random() * 1.2 + 0.4,
  }
})

type StarStyle = CSSProperties & {
  "--twinkle-opacity"?: string
  "--twinkle-delay"?: string
}

type Star = {
  id: string
  style: StarStyle
}

const stars: Star[] = Array.from({ length: STAR_COUNT }).map((_, index) => ({
  id: `star-${index}`,
  style: {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 2 + 1}px`,
    height: `${Math.random() * 2 + 1}px`,
    opacity: 0.15 + Math.random() * 0.15,
    "--twinkle-opacity": `${0.2 + Math.random() * 0.2}`,
    "--twinkle-delay": `${Math.random() * 2}s`,
  },
}))

const cometPalette = [
  "from-cyan-400/80 via-sky-300/40 to-transparent",
  "from-indigo-400/80 via-indigo-300/30 to-transparent",
  "from-purple-400/80 via-purple-300/30 to-transparent",
]

export function CosmicBackground() {
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
