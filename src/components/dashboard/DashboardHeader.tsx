import Link from "next/link"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import {
  Bell,
  Briefcase,
  ChevronDown,
  MessageSquare,
  Power,
  Search,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

type ProfileMenuIntent = "default" | "danger"

export type ProfileMenuItem = {
  label: string
  intent?: ProfileMenuIntent
  icon?: ReactNode
  href?: string
  onSelect?: () => void
}

export type SearchFilterOption = {
  label: string
  value: string
  icon?: ReactNode
}

const defaultProfileMenu: ProfileMenuItem[] = [
  { label: "Profile", icon: <User className="h-4 w-4" />, href: "/profile" },
  // { label: "Edit Profile", icon: <User className="h-4 w-4" />, href: "/profile/edit" },
  { label: "My Posted Job", icon: <Briefcase className="h-4 w-4" /> },
  { label: "Disconnect", intent: "danger", icon: <Power className="h-4 w-4" /> },
]

type DashboardHeaderProps = {
  searchPlaceholder?: string
  actions?: ReactNode
  profileMenuItems?: ProfileMenuItem[]
  className?: string
  searchFilters?: SearchFilterOption[]
  selectedFilter?: string
  onFilterChange?: (value: string) => void
}

export function DashboardHeader({
  actions,
  profileMenuItems = defaultProfileMenu,
  searchPlaceholder = "Search Posts...",
  className,
  searchFilters,
  selectedFilter,
  onFilterChange,
}: DashboardHeaderProps) {
  const { isAuthenticated, connectWithPrivy, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
      if (
        filterMenuOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isMenuOpen, filterMenuOpen])

  const menuItems = useMemo(
    () =>
      profileMenuItems.map((item) => {
        if (item.intent === "danger" && !item.onSelect) {
          return { ...item, onSelect: logout }
        }
        return item
      }),
    [logout, profileMenuItems],
  )

  const selectedFilterLabel = useMemo(() => {
    if (!searchFilters || !selectedFilter) return null
    const match = searchFilters.find((opt) => opt.value === selectedFilter)
    return match ?? null
  }, [searchFilters, selectedFilter])

  return (
    <div className={cn("sticky top-4 z-40", className)}>
      <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-white/10 bg-[#030b1e]/80 px-4 py-4 backdrop-blur-2xl shadow-[0_24px_60px_rgba(2,10,31,0.9)] sm:px-6 lg:flex-nowrap">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] border border-white/5 bg-[#050f22] px-4 py-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {searchFilters && selectedFilterLabel && onFilterChange ? (
            <div className="relative" ref={filterRef}>
              <button
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10"
                onClick={() => setFilterMenuOpen((prev) => !prev)}
              >
                {selectedFilterLabel.icon ? (
                  <span className="text-lg">{selectedFilterLabel.icon}</span>
                ) : null}
                {selectedFilterLabel.label}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {filterMenuOpen && (
                <div className="absolute right-0 top-12 w-44 rounded-[18px] border border-white/10 bg-[#020714]/95 p-2 shadow-[0_20px_50px_rgba(1,4,18,0.7)]">
                  {searchFilters.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange(option.value)
                        setFilterMenuOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-left text-gray-200 transition",
                        option.value === selectedFilter
                          ? "bg-gradient-to-r from-[#2E7FFF]/30 to-[#6B4DFF]/30 text-white"
                          : "hover:bg-white/5",
                      )}
                    >
                      {option.icon ? (
                        <span className="text-lg text-gray-400">{option.icon}</span>
                      ) : null}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {actions}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="rounded-full border border-white/10 bg-[#050f22] p-2 text-gray-300 transition hover:bg-white/10">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-white/10 bg-[#050f22] p-2 text-gray-300 transition hover:bg-white/10">
              <MessageSquare className="h-4 w-4" />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#050f22] pl-2 pr-3 text-sm transition hover:bg-white/10"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-base font-semibold">
                  TR
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-60 rounded-[24px] border border-white/10 bg-[#020714]/95 p-4 shadow-[0_25px_60px_rgba(1,4,16,0.8)]">
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-gradient-to-r from-[#071935] to-[#050d21] px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-sm font-semibold">
                        TR
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">DeadSfx</p>
                        <p className="text-xs text-gray-400">UI UX Designer</p>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-white/10 bg-gradient-to-br from-[#42E8E0] to-[#6B4DFF]" />
                  </div>
                  <div className="mt-3 space-y-2">
                    {menuItems.map((item) => {
                      const content = (
                        <span className="flex items-center gap-3">
                          {item.icon ? (
                            <span className="text-gray-400">{item.icon}</span>
                          ) : null}
                          {item.label}
                        </span>
                      )

                      const baseClass = cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition",
                        item.intent === "danger"
                          ? "border-transparent bg-gradient-to-r from-[#5a0d15] to-[#b9323a] text-red-100 hover:brightness-110"
                          : "border-white/10 bg-[#050f22] text-gray-200 hover:border-[#2E7FFF]/40",
                      )

                      if (item.href) {
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            className={baseClass}
                            onClick={() => {
                              setIsMenuOpen(false)
                              item.onSelect?.()
                            }}
                          >
                            {content}
                          </Link>
                        )
                      }

                      return (
                        <button
                          key={item.label}
                          className={baseClass}
                          onClick={() => {
                            setIsMenuOpen(false)
                            item.onSelect?.()
                          }}
                        >
                          {content}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            className="rounded-full border border-white/10 bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-6 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)]"
            onClick={connectWithPrivy}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}
