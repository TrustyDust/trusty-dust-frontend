import { cn } from "@/lib/utils"

import { BoostTrustCard } from "./BoostTrustCard"
import { SidebarNavCard, NavKey } from "./SidebarNavCard"

type DashboardSidebarProps = {
  activeNav?: NavKey
  boostScore?: number
  boostLabel?: string
  className?: string
}

export function DashboardSidebar({
  activeNav = "explore",
  boostScore = 82,
  boostLabel,
  className,
}: DashboardSidebarProps) {
  return (
    <div className={cn("sticky top-28 flex h-fit w-full flex-col gap-6", className)}>
      <SidebarNavCard active={activeNav} />
      <BoostTrustCard fallbackScore={boostScore} label={boostLabel} />
    </div>
  )
}
