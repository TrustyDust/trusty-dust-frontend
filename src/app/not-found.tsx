'use client'

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030714] px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-linear-to-br from-[#050C24] via-[#040a18] to-[#040914]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(107,77,255,0.2),transparent_40%)]" />
      </div>

      <div className="relative z-10 max-w-lg text-center space-y-6 rounded-4xl border border-white/10 bg-[#030b1e]/80 p-10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
          TrustyDust Navigation
        </p>
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0]">
          404
        </h1>
        <p className="text-2xl font-semibold">Signal Lost In The Nebula</p>
        <p className="text-sm text-gray-400">
          The star path you tried to reach is either uncharted or has been
          decommissioned. Plot a new trajectory back to the dashboard and keep
          building your reputation.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-8 py-3 text-sm font-semibold shadow-[0_15px_45px_rgba(46,127,255,0.45)] transition hover:scale-105"
        >
          Return To Dashboard
        </Link>
      </div>
    </div>
  )
}
