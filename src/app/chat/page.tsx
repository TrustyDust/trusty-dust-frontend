'use client'

import { useState } from "react"
import {
    Search,
    ChevronDown,
    Image as ImageIcon,
    Link2,
    FileText,
    Sparkles,
    Send
} from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import Image from "next/image"

// -----------------------------------------------------------------------------
// DUMMY DATA
// -----------------------------------------------------------------------------
const chatContacts = [
    {
        id: 1,
        name: "Family Mart",
        role: "Web 3 Builder",
        avatar: "FM",
        lastMessage: "Lorem ipsum dolor sit amet consectetur...",
        time: "10.02 Am",
        unread: 1,
        online: true,
        color: "from-[#F0B90B] to-[#F8D33A]",
    },
    {
        id: 2,
        name: "Alpha Guild",
        role: "Community Manager",
        avatar: "AG",
        lastMessage: "We are ready for the partnership!",
        time: "09.45 Am",
        unread: 0,
        online: false,
        color: "from-[#3BA3FF] to-[#6B4DFF]",
    },
    {
        id: 3,
        name: "Nova Arkan",
        role: "Product Designer",
        avatar: "NA",
        lastMessage: "Can you send the Figma file?",
        time: "Yesterday",
        unread: 2,
        online: true,
        color: "from-[#FF6EC7] to-[#9F63FF]",
    },
    {
        id: 4,
        name: "Trusty Support",
        role: "Official Support",
        avatar: "TS",
        lastMessage: "Your verification is complete.",
        time: "Yesterday",
        unread: 0,
        online: true,
        color: "from-[#42E8E0] to-[#3BA3FF]",
    },
]

const activeChatMessages = [
    {
        id: 1,
        sender: "them",
        text: "Lorem ipsum dolor sit amet consectetur. sit amet consectetur.",
        time: "10.02 Am",
    },
    {
        id: 2,
        sender: "me",
        text: "Lorem ipsum dolor sit amet consectetur. sit amet consectetur.",
        time: "10.02 Am",
        status: "read",
    },
    {
        id: 3,
        sender: "them",
        text: "Lorem ipsum dolor sit amet consectetur. sit amet consectetur.",
        images: [
            // optimize("https://images.unsplash.com/photo-1620321023374-d1a68fbc720d"),
            // optimize("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"),
            // optimize("https://images.unsplash.com/photo-1614728853913-1e32005e30b7"),
            // optimize("https://images.unsplash.com/photo-1634152962476-4b8a00e1915c"),
        ],
        time: "10.02 Am",
    },
    {
        id: 4,
        sender: "me",
        text: "Lorem ipsum dolor sit amet consectetur. sit amet consectetur.",
        time: "10.02 Am",
        status: "read",
    },
]

export default function ChatPage() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(1)
    const selectedContact =
        chatContacts.find((c) => c.id === selectedChatId) || chatContacts[0]

    return (
        <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
            {/* Main Container */}
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">

                {/* Header */}
                <DashboardHeader actions={<div className="w-8" />} />

                <div className="flex w-full flex-col gap-6 lg:flex-row">

                    {/* Sidebar */}
                    <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
                        <DashboardSidebar activeNav="jobs" />
                    </aside>

                    {/* CHAT LIST */}
                    <section
    className={`
        flex w-full flex-col rounded-[28px] border border-white/10 
        bg-[#040f25]/80 backdrop-blur 
        ${selectedChatId ? "hidden lg:flex" : "flex"}
        lg:w-80 xl:w-96
    `}
>

                        {/* List Header */}
                        <div className="border-b border-white/5 p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold">All Message</h2>
                                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                                    Newest <ChevronDown className="h-3 w-3" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search Message"
                                    className="w-full rounded-2xl border border-white/5 bg-[#0A1325] py-3 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                                />
                            </div>
                        </div>

                        {/* Contacts */}
                        <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
                            {chatContacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => setSelectedChatId(contact.id)}
                                    className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all ${selectedChatId === contact.id
                                        ? "border border-[#2E7FFF]/30 bg-[#0B1A38]"
                                        : "border border-transparent hover:bg-white/5"
                                        }`}
                                >
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${contact.color} text-sm font-bold text-white shadow-lg`}
                                    >
                                        {contact.avatar}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            <h4 className="truncate font-semibold">{contact.name}</h4>

                                            {contact.unread > 0 && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E7FFF] text-[10px] font-bold text-white">
                                                    {contact.unread}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mb-1 text-xs text-gray-400">{contact.role}</p>

                                        <p
                                            className={`truncate text-xs ${selectedChatId === contact.id
                                                ? "text-gray-300"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            {contact.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* CHAT WINDOW */}
                    <section className={`
    relative flex flex-1 flex-col overflow-hidden rounded-[28px]
    border border-white/10 bg-[#030b1e]/90 backdrop-blur
    ${selectedChatId ? "flex" : "hidden lg:flex"}
`}>

                        {/* Chat Header */}
                        <div className="flex items-center justify-between border-b border-white/5 bg-[#050C24]/50 px-8 py-5">
                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => setSelectedChatId(null)}
                                    className="mr-3 flex lg:hidden"
                                >
                                    <ChevronDown className="h-6 w-6 rotate-90 text-gray-300" />
                                </button>

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${selectedContact.color} text-sm font-bold shadow-lg`}
                                >
                                    {selectedContact.avatar}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold">{selectedContact.name}</h3>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${selectedContact.online ? "bg-green-500" : "bg-gray-500"
                                                }`}
                                        />
                                        <span className="text-xs text-gray-400">
                                            {selectedContact.online ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition hover:bg-white/10">
                                <Sparkles className="h-3.5 w-3.5 text-[#9F63FF]" />
                                Spark
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
                            {activeChatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {/* Avatar */}
                                    {msg.sender === "them" && (
                                        <div
                                            className={`mr-4 mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${selectedContact.color} text-xs font-bold`}
                                        >
                                            {selectedContact.avatar}
                                        </div>
                                    )}

                                    <div className="max-w-[70%] flex flex-col gap-1">

                                        {/* Name + Actions */}
                                        <div className="mb-1 flex items-center gap-4">
                                            <span
                                                className={`text-sm font-bold ${msg.sender === "me" ? "ml-auto" : ""
                                                    }`}
                                            >
                                                {msg.sender === "me" ? "You" : selectedContact.name}
                                            </span>
                                        </div>

                                        {/* Bubble */}
                                        <div
                                            className={`rounded-2xl p-4 text-sm leading-relaxed ${msg.sender === "me"
                                                ? "rounded-tr-none bg-[#2E7FFF] text-white"
                                                : "rounded-tl-none border border-white/5 bg-[#0A1325] text-gray-300"
                                                }`}
                                        >
                                            <p>{msg.text}</p>

                                            {/* Images */}
                                            {msg.images && (
                                                <div className="mt-3 grid grid-cols-4 gap-2">
                                                    {msg.images.map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="group relative aspect-square overflow-hidden rounded-lg border border-white/10"
                                                        >
                                                            <Image
                                                                src={img}
                                                                alt="Message Image"
                                                                className="h-full w-full object-cover transition group-hover:scale-110"
                                                                width={100}
                                                                height={100}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={`mt-1 flex items-center gap-1 text-[10px] text-gray-500 ${msg.sender === "me" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            {msg.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="border-t ... p-6 sticky bottom-0 bg-[#050C24]/60 backdrop-blur">



                            <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-[#0A1325] px-4 py-3">
                                <input
                                    type="text"
                                    placeholder="Type Something"
                                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                                />

                                <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                                    <button className="text-gray-400 transition hover:text-[#2E7FFF]">
                                        <ImageIcon className="h-5 w-5" />
                                    </button>
                                    <button className="text-gray-400 transition hover:text-[#2E7FFF]">
                                        <Link2 className="h-5 w-5" />
                                    </button>
                                    <button className="text-gray-400 transition hover:text-[#2E7FFF]">
                                        <FileText className="h-5 w-5" />
                                    </button>
                                </div>

                                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] shadow-lg transition hover:scale-105">
                                    <Send className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}
