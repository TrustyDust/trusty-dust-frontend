'use client'

import type { FormEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  RotateCcw,
  Search,
  Send,
  User,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { ROUTES } from "@/constant/route"
import { useAuth } from "@/contexts/auth-context"
import { useConversations, useCreateConversation, useMessages, useSendMessage } from "@/hooks/page/useChat"
import { useCurrentUser } from "@/hooks/page/useCurrentUser"
import { useSearchPeople } from "@/hooks/page/useUser"
import { formatTimeAgo } from "@/lib/format-time"
import { cn } from "@/lib/utils"
import type { Conversation, ConversationParticipant } from "@/types/api"

const getParticipantLabel = (participant?: ConversationParticipant | null) => {
  if (!participant) return "Unknown member"
  if (participant.username?.trim()) return participant.username
  return `User ${participant.userId.slice(0, 6)}`
}

const getConversationTitle = (conversation: Conversation, currentUserId?: string | null) => {
  if (conversation.title?.trim()) return conversation.title
  const others = conversation.participants.filter((participant) => participant.userId !== currentUserId)
  if (others.length === 0) return "Direct chat"
  return others.map((participant) => getParticipantLabel(participant)).join(", ")
}

const getConversationInitials = (conversation: Conversation, currentUserId?: string | null) => {
  const source =
    conversation.title?.trim() ||
    conversation.participants.find((participant) => participant.userId !== currentUserId)?.username ||
    "TD"

  return source
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const getConversationLastActivity = (conversation: Conversation) =>
  conversation.lastMessage?.createdAt ?? conversation.updatedAt ?? conversation.createdAt

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [hasInitializedConversation, setHasInitializedConversation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [pendingParticipantId, setPendingParticipantId] = useState<string | null>(null)
  const searchKeyword = searchQuery.trim()

  const { isAuthenticated, openLoginModal } = useAuth()
  const { user } = useCurrentUser()

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    isFetching: conversationsFetching,
    isError: conversationsError,
    error: conversationsErrorData,
    refetch: refetchConversations,
  } = useConversations({ enabled: isAuthenticated })

  const conversationIdForMessages = selectedConversationId ?? ""
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorData,
    refetch: refetchMessages,
  } = useMessages(conversationIdForMessages)

  const sendMessage = useSendMessage()
  const createConversation = useCreateConversation()

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  )

  const participantNameMap = useMemo(() => {
    if (!selectedConversation) return {}
    return selectedConversation.participants.reduce<Record<string, string>>((acc, participant) => {
      acc[participant.userId] = getParticipantLabel(participant)
      return acc
    }, {})
  }, [selectedConversation])

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter((conversation) => {
      const title = getConversationTitle(conversation, user?.id).toLowerCase()
      const participants = conversation.participants
        .map((participant) => getParticipantLabel(participant).toLowerCase())
        .join(" ")
      const lastMessage = conversation.lastMessage?.text?.toLowerCase() ?? ""
      return title.includes(query) || participants.includes(query) || lastMessage.includes(query)
    })
  }, [conversations, searchQuery, user?.id])

  const shouldShowPeopleFallback =
    !conversationsLoading && !conversationsError && filteredConversations.length === 0

  const {
    data: peopleSearchResult,
    isLoading: peopleLoading,
    isError: peopleError,
    error: peopleErrorData,
    refetch: refetchPeople,
  } = useSearchPeople({
    keyword: searchKeyword || undefined,
    limit: 8,
    enabled: isAuthenticated && shouldShowPeopleFallback,
  })

  const peopleResults = peopleSearchResult?.data ?? []

  useEffect(() => {
    if (!isAuthenticated || conversationsLoading || conversations.length === 0) return
    const paramId = searchParams.get("conversationId")

    if (paramId && conversations.some((conversation) => conversation.id === paramId)) {
      setSelectedConversationId(paramId)
      setHasInitializedConversation(true)
      return
    }

    if (!hasInitializedConversation) {
      setSelectedConversationId(conversations[0].id)
      setHasInitializedConversation(true)
    }
  }, [conversations, conversationsLoading, searchParams, isAuthenticated, hasInitializedConversation])

  useEffect(() => {
    if (!selectedConversationId || conversations.length === 0 || conversationsFetching) return
    const exists = conversations.some((conversation) => conversation.id === selectedConversationId)
    if (!exists) {
      setSelectedConversationId(conversations[0]?.id ?? null)
    }
  }, [conversations, selectedConversationId, conversationsFetching])

  useEffect(() => {
    setMessageInput("")
  }, [selectedConversationId])

  useEffect(() => {
    if (!messagesEndRef.current) return
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages, selectedConversationId])

  const handleStartConversation = (participantId: string) => {
    if (!participantId || participantId === user?.id || createConversation.isPending) return
    setPendingParticipantId(participantId)
    createConversation.mutate(
      { participantIds: [participantId] },
      {
        onSuccess: async (conversation) => {
          toast.success("Conversation started")
          await refetchConversations()
          setSelectedConversationId(conversation.id)
          setHasInitializedConversation(true)
          const params = new URLSearchParams(searchParams.toString())
          params.set("conversationId", conversation.id)
          const queryString = params.toString()
          router.replace(`${ROUTES.chat}${queryString ? `?${queryString}` : ""}`, { scroll: false })
        },
        onError: (error) => {
          toast.error(error?.message ?? "Failed to start conversation")
        },
        onSettled: () => {
          setPendingParticipantId(null)
        },
      },
    )
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setHasInitializedConversation(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set("conversationId", conversationId)
    const queryString = params.toString()
    router.replace(`${ROUTES.chat}${queryString ? `?${queryString}` : ""}`, { scroll: false })
  }

  const handleBackToList = () => {
    setSelectedConversationId(null)
    router.replace(ROUTES.chat, { scroll: false })
  }

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedConversationId) return
    const trimmed = messageInput.trim()
    if (!trimmed) return

    sendMessage.mutate(
      { conversationId: selectedConversationId, content: trimmed },
      {
        onSuccess: () => {
          setMessageInput("")
          refetchMessages()
          refetchConversations()
        },
        onError: (error) => {
          toast.error(error?.message ?? "Failed to send message")
        },
      },
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 pb-10">
          <DashboardHeader actions={<div className="w-8" />} />
          <div className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">Sign in to continue</h2>
            <p className="mt-2 text-sm text-gray-400">
              Chat requires an authenticated session. Please log in to access your inbox.
            </p>
            <button
              type="button"
              className="mt-6 rounded-full border border-white/10 bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-6 py-3 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)] transition hover:brightness-110"
              onClick={openLoginModal}
            >
              Open login modal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
        <DashboardHeader actions={<div className="w-8" />} />

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar />
          </aside>

          <section
            className={cn(
              "flex w-full flex-col rounded-[28px] border border-white/10 bg-[#040f25]/80 backdrop-blur",
              selectedConversationId ? "hidden lg:flex" : "flex",
              "lg:w-80 xl:w-96",
            )}
          >
            <div className="border-b border-white/5 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">All messages</h2>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-gray-300 transition hover:border-[#2E7FFF]/40 hover:text-white disabled:opacity-60"
                  onClick={() => refetchConversations()}
                  disabled={conversationsLoading}
                >
                  <RotateCcw
                    className={cn("h-3.5 w-3.5", conversationsLoading && "animate-spin text-white")}
                  />
                  Refresh
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search messages or people"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-[#0A1325] py-3 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                />
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
              {conversationsLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`conversation-skeleton-${index}`}
                    className="h-16 w-full animate-pulse rounded-2xl border border-white/5 bg-white/5"
                  />
                ))
              ) : conversationsError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                  <p className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    Failed to load conversations
                  </p>
                  <p className="mt-1 text-xs text-red-200">
                    {conversationsErrorData?.message ?? "Something went wrong while fetching your inbox."}
                  </p>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#FF8080]"
                    onClick={() => refetchConversations()}
                  >
                    Try again
                  </button>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-[#050f22]/70 px-4 py-4 text-sm text-gray-200">
                    {conversations.length === 0
                      ? "You don't have any conversations yet. Start one with the people below."
                      : "No conversations match your search. Start a new thread with these people instead."}
                  </div>
                  {peopleLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`people-skeleton-${index}`}
                        className="h-16 w-full animate-pulse rounded-2xl border border-white/5 bg-white/5"
                      />
                    ))
                  ) : peopleError ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                      <p className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="h-4 w-4" />
                        Unable to load people
                      </p>
                      <p className="mt-1 text-xs text-red-200">
                        {peopleErrorData?.message ?? "Please retry to discover trusted builders."}
                      </p>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#FF8080]"
                        onClick={() => refetchPeople()}
                      >
                        Try again
                      </button>
                    </div>
                  ) : peopleResults.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-6 text-center text-sm text-gray-300">
                      We couldn't find anyone matching your filters yet.
                    </div>
                  ) : (
                    peopleResults.map((person) => (
                      <div
                        key={person.id}
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#050f22]/80 p-4 text-sm text-gray-200 xl:flex-row xl:items-center xl:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-xs font-semibold text-white">
                            {(person.username ?? person.jobTitle ?? "TD")
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {person.username ?? "Unnamed builder"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {person.jobTitle ?? "No job title"}
                              {person.jobType ? ` · ${person.jobType}` : ""}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Tier {person.tier} · {person.trustScore} trust score
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#2E7FFF]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => handleStartConversation(person.id)}
                          disabled={createConversation.isPending || pendingParticipantId === person.id}
                        >
                          {pendingParticipantId === person.id && createConversation.isPending ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                              Starting...
                            </>
                          ) : (
                            <>
                              <User className="h-3.5 w-3.5" />
                              Start chat
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const title = getConversationTitle(conversation, user?.id)
                  const initials = getConversationInitials(conversation, user?.id)
                  const lastActivity = getConversationLastActivity(conversation)
                  const lastMessagePreview =
                    conversation.lastMessage?.text && conversation.lastMessage.text.length > 90
                      ? `${conversation.lastMessage.text.slice(0, 90).trimEnd()}...`
                      : conversation.lastMessage?.text ?? "No messages yet"

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all",
                        selectedConversationId === conversation.id
                          ? "border-[#2E7FFF]/40 bg-[#0B1A38]"
                          : "border-transparent hover:bg-white/5",
                      )}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E7FFF] via-[#3BA3FF] to-[#6B4DFF] text-sm font-bold shadow-lg">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="truncate font-semibold">{title}</h4>
                          <span className="text-[10px] text-gray-500">{formatTimeAgo(lastActivity)}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          {conversation.participants.length} participant
                          {conversation.participants.length > 1 ? "s" : ""}
                        </p>
                        <p className="mt-1 truncate text-xs text-gray-500">{lastMessagePreview}</p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </section>

          <section
            className={cn(
              "relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#030b1e]/90 backdrop-blur",
              selectedConversationId ? "flex" : "hidden lg:flex",
            )}
          >
            {selectedConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-white/5 bg-[#050C24]/50 px-6 py-5 lg:px-8">
                  <div className="flex items-center gap-4">
                    <button onClick={handleBackToList} className="mr-1 flex lg:hidden">
                      <ChevronDown className="h-6 w-6 rotate-90 text-gray-300" />
                    </button>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-sm font-bold shadow-lg">
                      {getConversationInitials(selectedConversation, user?.id)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {getConversationTitle(selectedConversation, user?.id)}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          {selectedConversation.participants.length} participant
                          {selectedConversation.participants.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition hover:bg-white/10 disabled:opacity-60"
                    onClick={() => refetchMessages()}
                    disabled={messagesLoading}
                  >
                    <RotateCcw className={cn("h-3.5 w-3.5", messagesLoading && "animate-spin text-white")} />
                    Sync messages
                  </button>
                </div>

                <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
                  {messagesLoading ? (
                    <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-gray-200">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Fetching messages...
                    </div>
                  ) : messagesError ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                      <p className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="h-4 w-4" />
                        Failed to load messages
                      </p>
                      <p className="mt-1 text-xs text-red-200">
                        {messagesErrorData?.message ?? "Please try refreshing the thread."}
                      </p>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#FF8080]"
                        onClick={() => refetchMessages()}
                      >
                        Retry
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-6 text-center text-sm text-gray-300">
                      No messages yet. Say hello 👋
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = message.senderId === user?.id
                      const senderLabel = isMine ? "You" : participantNameMap[message.senderId] ?? "Member"
                      return (
                        <div
                          key={message.id}
                          className={cn("flex", isMine ? "justify-end" : "justify-start")}
                        >
                          {!isMine && (
                            <div className="mr-3 mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#42E8E0] via-[#3BA3FF] to-[#6B4DFF] text-xs font-bold">
                              {senderLabel
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                          <div className="max-w-[75%] space-y-1">
                            <div className={cn("text-sm font-semibold", isMine && "text-right")}>
                              {senderLabel}
                            </div>
                            <div
                              className={cn(
                                "rounded-2xl p-4 text-sm leading-relaxed",
                                isMine
                                  ? "rounded-tr-none bg-[#2E7FFF] text-white shadow-[0_10px_30px_rgba(33,104,255,0.35)]"
                                  : "rounded-tl-none border border-white/5 bg-[#0A1325] text-gray-200",
                              )}
                            >
                              <p className="whitespace-pre-wrap">{message?.content ?? "No message"}</p>
                            </div>
                            <div
                              className={cn(
                                "text-[10px] text-gray-500",
                                isMine ? "text-right" : "text-left",
                              )}
                            >
                              {formatTimeAgo(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="sticky bottom-0 border-t border-white/5 bg-[#050C24]/60 px-4 py-5 backdrop-blur sm:px-6"
                >
                  <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-[#0A1325] px-4 py-3">
                    <input
                      type="text"
                      placeholder="Type something..."
                      value={messageInput}
                      onChange={(event) => setMessageInput(event.target.value)}
                      className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    />

                    <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                      <button
                        type="button"
                        className="text-gray-500 transition hover:text-[#2E7FFF]"
                        aria-label="Attach image"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 transition hover:text-[#2E7FFF]"
                        aria-label="Attach link"
                      >
                        <Link2 className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 transition hover:text-[#2E7FFF]"
                        aria-label="Attach file"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!messageInput.trim() || sendMessage.isPending}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <Send className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center text-sm text-gray-400">
                <p className="text-lg font-semibold text-white">Select a conversation to get started</p>
                <p>Pick a chat from the left panel to view messages and continue collaborating.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
