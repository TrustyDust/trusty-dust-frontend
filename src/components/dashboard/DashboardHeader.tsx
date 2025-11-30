import Link from "next/link"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  Bell,
  Briefcase,
  ChevronDown,
  Inbox,
  Loader2,
  MessageSquare,
  Power,
  Search,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { ROUTES } from "@/constant/route"
import { useAuth } from "@/contexts/auth-context"
import { useConversations } from "@/hooks/page/useChat"
import { useCurrentUser } from "@/hooks/page/useCurrentUser"
import { useNotifications, useMarkNotificationRead } from "@/hooks/page/useNotifications"
import { formatTimeAgo } from "@/lib/format-time"
import { cn } from "@/lib/utils"
import { trimWalletAddress } from "@/lib/wallet-utils"
import type { NotificationItem, NotificationListResponse } from "@/types/api"

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
  // { label: "My Posted Job", icon: <Briefcase className="h-4 w-4" /> },
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
}: Readonly<DashboardHeaderProps>) {
  const { isAuthenticated, logout, openLoginModal } = useAuth()
  const queryClient = useQueryClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const { user } = useCurrentUser()
  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    isError: notificationsError,
    error: notificationsErrorData,
    refetch: refetchNotifications,
  } = useNotifications({ enabled: isAuthenticated })
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    isError: conversationsError,
    error: conversationsErrorData,
    refetch: refetchConversations,
  } = useConversations({ enabled: isAuthenticated })
  const markNotificationRead = useMarkNotificationRead()
  
  const displayName = useMemo(() => {
    if (user?.username) return user.username
    if (user?.walletAddress) return trimWalletAddress(user.walletAddress)
    return ""
  }, [user])

  const unreadNotificationCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  )

  const recentConversations = useMemo(
    () => conversations.slice(0, 5),
    [conversations],
  )

  const handleNotificationToggle = () => {
    setIsNotificationOpen((prev) => {
      const next = !prev
      if (next) {
        setIsChatOpen(false)
        setIsMenuOpen(false)
      }
      return next
    })
  }

  const handleChatToggle = () => {
    setIsChatOpen((prev) => {
      const next = !prev
      if (next) {
        setIsNotificationOpen(false)
        setIsMenuOpen(false)
      }
      return next
    })
  }

  const handleNotificationInteraction = (notification: NotificationItem) => {
    if (notification.isRead || markNotificationRead.isPending) return

    markNotificationRead.mutate(notification.id, {
      onSuccess: () => {
        queryClient.setQueryData<NotificationListResponse>(["notifications"], (prev) => {
          if (!prev) return prev
          return prev.map((item) =>
            item.id === notification.id
              ? { ...item, isRead: true, readAt: new Date().toISOString() }
              : item,
          )
        })
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to mark notification as read")
      },
    })
  }

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
      if (
        isNotificationOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false)
      }
      if (isChatOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isMenuOpen, filterMenuOpen, isNotificationOpen, isChatOpen])

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
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-[#030b1e]/80 px-4 py-4 backdrop-blur-2xl shadow-[0_24px_60px_rgba(2,10,31,0.9)] sm:px-6 lg:flex-nowrap">
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
                          ? "bg-linear-to-r from-[#2E7FFF]/30 to-[#6B4DFF]/30 text-white"
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
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                aria-label="Open notifications"
                className="relative rounded-full border border-white/10 bg-[#050f22] p-2 text-gray-300 transition hover:bg-white/10"
                onClick={handleNotificationToggle}
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2E7FFF] px-1 text-[9px] font-semibold text-white">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                ) : null}
              </button>
              {isNotificationOpen ? (
                <div className="absolute right-0 top-12 w-[22rem] rounded-3xl border border-white/10 bg-[#020714]/95 p-4 shadow-[0_25px_60px_rgba(1,4,16,0.85)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Notifications</p>
                      <p className="text-xs text-gray-500">Realtime updates from your network.</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-gray-200 transition hover:border-[#2E7FFF]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => refetchNotifications()}
                      disabled={notificationsLoading}
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-sm text-gray-200">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Syncing notifications...
                      </div>
                    ) : notificationsError ? (
                      <div className="space-y-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-3">
                        <div className="flex items-center gap-2 text-sm text-red-100">
                          <AlertCircle className="h-4 w-4" />
                          <span>{notificationsErrorData?.message ?? "Unable to load notifications."}</span>
                        </div>
                        <button
                          type="button"
                          className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-red-100 transition hover:border-red-200 hover:text-white"
                          onClick={() => refetchNotifications()}
                        >
                          Try again
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-6 text-center text-sm text-gray-300">
                        <Inbox className="h-6 w-6 text-gray-500" />
                        <p className="font-semibold text-white">All quiet for now</p>
                        <p className="text-xs text-gray-500">
                          You'll see new follower activity, job updates, and trust events here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          className={cn(
                            "flex w-full items-start gap-3 rounded-2xl border border-white/5 bg-[#050f22]/80 px-3 py-3 text-left text-sm text-gray-200 transition hover:border-[#2E7FFF]/40 hover:bg-white/5",
                            !notification.isRead && "border-[#2E7FFF]/70 bg-white/5",
                          )}
                          onClick={() => handleNotificationInteraction(notification)}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-100">{notification.message}</p>
                            <p className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</p>
                          </div>
                          {!notification.isRead ? (
                            <span className="mt-1 h-2 w-2 rounded-full bg-[#42E8E0]" />
                          ) : null}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={chatRef}>
              <button
                type="button"
                aria-label="Open chat inbox"
                className="rounded-full border border-white/10 bg-[#050f22] p-2 text-gray-300 transition hover:bg-white/10"
                onClick={handleChatToggle}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              {isChatOpen ? (
                <div className="absolute right-0 top-12 w-[22rem] rounded-3xl border border-white/10 bg-[#020714]/95 p-4 shadow-[0_25px_60px_rgba(1,4,16,0.85)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Latest conversations</p>
                      <p className="text-xs text-gray-500">Continue collaborating with your crew.</p>
                    </div>
                    <Link
                      href={ROUTES.chat}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-gray-200 transition hover:border-[#42E8E0]/40 hover:text-white"
                      onClick={() => setIsChatOpen(false)}
                    >
                      Open chat
                    </Link>
                  </div>
                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                    {conversationsLoading ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-sm text-gray-200">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Syncing conversations...
                      </div>
                    ) : conversationsError ? (
                      <div className="space-y-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-3">
                        <div className="flex items-center gap-2 text-sm text-red-100">
                          <AlertCircle className="h-4 w-4" />
                          <span>{conversationsErrorData?.message ?? "Unable to load chat threads."}</span>
                        </div>
                        <button
                          type="button"
                          className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-red-100 transition hover:border-red-200 hover:text-white"
                          onClick={() => refetchConversations()}
                        >
                          Try again
                        </button>
                      </div>
                    ) : recentConversations.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-6 text-center text-sm text-gray-300">
                        <MessageSquare className="h-6 w-6 text-gray-500" />
                        <p className="font-semibold text-white">No chats yet</p>
                        <p className="text-xs text-gray-500">
                          Start a conversation from a job post or user profile to see it here.
                        </p>
                      </div>
                    ) : (
                      recentConversations.map((conversation) => {
                        const otherParticipants = conversation.participants.filter(
                          (participant) => participant.userId !== user?.id,
                        )
                        const conversationTitle =
                          conversation.title ||
                          (otherParticipants.length > 0
                            ? otherParticipants
                                .map((participant) => participant.username ?? `User ${participant.userId.slice(0, 6)}`)
                                .join(", ")
                            : "Direct chat")
                        const lastMessagePreview = conversation.lastMessage?.text ?? "No messages yet"
                        const trimmedPreview =
                          lastMessagePreview.length > 90
                            ? `${lastMessagePreview.slice(0, 90).trimEnd()}...`
                            : lastMessagePreview
                        const lastActivity =
                          conversation.lastMessage?.createdAt ?? conversation.updatedAt

                        return (
                          <Link
                            key={conversation.id}
                            href={`${ROUTES.chat}?conversationId=${conversation.id}`}
                            className="flex w-full items-start justify-between gap-3 rounded-2xl border border-white/5 bg-[#050f22]/80 px-3 py-3 text-left transition hover:border-[#42E8E0]/40 hover:bg-white/5"
                            onClick={() => setIsChatOpen(false)}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-100" title={conversationTitle}>
                                {conversationTitle}
                              </p>
                              <p className="mt-1 text-xs text-gray-500" title={lastMessagePreview}>
                                {trimmedPreview}
                              </p>
                            </div>
                            <span className="text-[11px] text-gray-500">{formatTimeAgo(lastActivity)}</span>
                          </Link>
                        )
                      })
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-[#050f22] pl-2 pr-3 text-sm transition hover:bg-white/10"
                onClick={() => {
                  setIsNotificationOpen(false)
                  setIsChatOpen(false)
                  setIsMenuOpen((prev) => !prev)
                }}
              >
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#051431] border border-white/5">
                  <span className="text-xs font-semibold text-[#42E8E0]">
                    {user?.dustBalance?.toLocaleString() ?? 0} DUST
                  </span>
                </div>
                <p className="text-sm font-semibold p-4">{displayName}</p>
                {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-base font-semibold">
                  TR
                </div> */}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-60 rounded-3xl border border-white/10 bg-[#020714]/95 p-4 shadow-[0_25px_60px_rgba(1,4,16,0.8)]">
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-linear-to-r from-[#071935] to-[#050d21] px-3 py-3">
                    <div className="flex items-center gap-3">
                      {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#3BA3FF] via-[#6B4DFF] to-[#42E8E0] text-sm font-semibold">
                        TR
                      </div> */}
                      <div className="text-left">
                        <p className="text-sm font-semibold">{displayName}</p>
                        <p className="text-xs text-gray-400">{user?.jobTitle ?? user?.jobType}</p>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-white/10 bg-linear-to-br from-[#42E8E0] to-[#6B4DFF]" />
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
            className="rounded-full border border-white/10 bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-6 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)]"
            onClick={openLoginModal}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}
