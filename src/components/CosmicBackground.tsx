'use client'

const COMET_COUNT = 780

const COMETS = Array.from({ length: COMET_COUNT }).map((_, index) => ({
  id: `comet-${index}`,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 12,
  startX: Math.random() * 90 - 10,
  startY: Math.random() * 90 - 10,
  angle: Math.random() * 40 - 20,
  trailLength: Math.random() * 12 + 6,
  lineWidth: Math.random() * 0.25 + 0.1,
  coreRadius: Math.random() * 0.1 + 0.15,
}))

export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-[#01020b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(66,232,224,0.2),transparent_50%)] blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="comet-trail" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="80%" stopColor="#7BDFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3BA3FF" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="comet-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#7BDFFF" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {COMETS.map((comet) => (
          <g key={comet.id} transform={`rotate(${comet.angle} 50 50)`}>
            <line
              x1={comet.startX}
              y1={comet.startY}
              x2={comet.startX - comet.trailLength}
              y2={comet.startY}
              stroke="url(#comet-trail)"
              strokeWidth={comet.lineWidth}
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="x1"
                values={`${comet.startX};${comet.startX + 30}`}
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                values={`${comet.startX - comet.trailLength};${comet.startX + 3}`}
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y1"
                values={`${comet.startY};${comet.startY - 10}`}
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values={`${comet.startY};${comet.startY - 10}`}
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
            </line>
            <circle
              cx={comet.startX}
              cy={comet.startY}
              r={comet.coreRadius}
              fill="url(#comet-core)"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values={`${comet.startX};${comet.startX + 30}`}
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${comet.startY};${comet.startY - 10}`}
                dur={`${comet.duration}s`}
                begin={`${comet.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      <div className="absolute inset-0 animate-starfield bg-[radial-gradient(circle_at_25%_5%,rgba(255,255,255,0.12),transparent_50%)] blur-3xl opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(1,4,12,0.8)_70%,rgba(1,4,12,1)_100%)]" />
    </div>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      animateTransform: React.DetailedHTMLProps<
        React.SVGProps<SVGAnimateElement>,
        SVGAnimateElement
      >
    }
  }
}
