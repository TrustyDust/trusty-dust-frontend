'use client'

import Link from "next/link"
import { ComponentType } from "react"
import { Briefcase, Compass, ShieldCheck } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type NavKey = "explore" | "jobs" | "verify"

type NavItem = {
  label: string
  icon: ComponentType<{ className?: string }>
  key: NavKey
  href: string
}

const navItems: NavItem[] = [
  { label: "Explore", icon: Compass, key: "explore", href: "/" },
  { label: "Jobs", icon: Briefcase, key: "jobs", href: "/jobs" },
  { label: "Verify", icon: ShieldCheck, key: "verify", href: "/verify" },
]

type SidebarNavCardProps = {
  active?: NavKey
}

export function SidebarNavCard({ active = "explore" }: Readonly<SidebarNavCardProps>) {
  const pathname = usePathname()

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#040d1e]/90 p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-lg font-bold text-white shadow-[0_0_30px_rgba(66,232,224,0.45)]">
          TD
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            TrustyDust
          </p>
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 text-sm font-semibold">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 transition",
              item.key === active || pathname === item.href
                ? "bg-gradient-to-r from-[#2E7FFF] via-[#3BA3FF] to-[#4B5CFF] text-white shadow-[0_12px_40px_rgba(33,104,255,0.35)]"
                : "text-gray-300 hover:bg-white/10",
            )}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
