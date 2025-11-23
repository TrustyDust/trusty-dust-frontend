import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { AnchorHTMLAttributes, forwardRef } from "react"

import { cn } from "@/lib/utils"

interface NavLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
  className?: string
  activeClassName?: string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const pathname = usePathname()
    const hrefString =
      typeof href === "string" ? href : href.pathname ?? ""
    const isActive =
      hrefString !== "" &&
      (pathname === hrefString ||
        (hrefString !== "/" && pathname.startsWith(hrefString)))

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        aria-current={isActive ? "page" : undefined}
        {...props}
      />
    )
  },
)

NavLink.displayName = "NavLink"

export { NavLink }
