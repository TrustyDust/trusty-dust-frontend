// src/components/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, ShoppingBag, User, PenSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Feed", path: "/feed" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  return (
    <nav className="fixed left-0 top-0 h-full w-20 bg-card border-r border-border z-50 flex flex-col items-center py-8 gap-8">
      <Link href="/" className="mb-4">
        <div className="w-12 h-12 bg-linear-to-br from-neon-pink to-neon-cyan rounded-xl glow-pink flex items-center justify-center">
          <span className="text-2xl font-bold font-orbitron">T</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-neon-pink text-primary-foreground glow-pink"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-6 h-6" />
            </Link>
          )
        })}
      </div>

      <Link
        href="/feed"
        className="w-12 h-12 bg-neon-cyan rounded-full flex items-center justify-center glow-cyan hover:scale-110 transition-transform"
      >
        <PenSquare className="w-6 h-6 text-secondary-foreground" />
      </Link>
    </nav>
  )
}

export default Navbar
