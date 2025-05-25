"use client"

import React, { useEffect } from "react"
import { Home, User, MessageCircle, File } from "lucide-react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setActiveTab, NavigationTab } from "@/store/features/navigationSlice"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import * as Tooltip from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const navItems = [
  { key: "home" as NavigationTab, href: "/home", icon: Home },
  { key: "chat" as NavigationTab, href: "/chat", icon: MessageCircle },
  { key: "health-record" as NavigationTab, href: "/health-record", icon: File },
  { key: "profile" as NavigationTab, href: "/profile", icon: User },
] as const

export function BottomNavigation() {
  const dispatch = useDispatch()
  const activeTab = useSelector(
    (state: RootState) => state.navigation.activeTab
  )
  const pathname = usePathname()

  useEffect(() => {
    const found = navItems.find((item) => pathname.startsWith(item.href))
    if (found && activeTab !== found.key) {
      dispatch(setActiveTab(found.key))
    }
  }, [pathname, dispatch, activeTab])

  const handleTabClick = (tab: NavigationTab) => {
    dispatch(setActiveTab(tab))
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
      <nav
        className={cn(
          "flex items-center justify-between bg-neutral-900/70 border border-white/10 rounded-full shadow-2xl px-2 py-2 min-w-[70vw] max-w-md mx-auto backdrop-blur-md gap-1 pointer-events-auto"
        )}
        aria-label="Main navigation"
      >
        {navItems.map(({ key, href, icon: Icon }) => (
          <Tooltip.Root
            key={key}
            delayDuration={0}
          >
            <Tooltip.Trigger asChild>
              <Link
                href={href}
                aria-label={key}
                tabIndex={0}
                className="flex-1 flex justify-center focus:outline-none"
              >
                <Button
                  variant={activeTab === key ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-full transition-all duration-200",
                    activeTab === key
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-110"
                      : "text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                  )}
                  aria-current={activeTab === key ? "page" : undefined}
                  onClick={() => handleTabClick(key)}
                >
                  <Icon className="w-16 h-16" />
                </Button>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                className="rounded bg-neutral-800 px-2 py-1 text-xs text-white shadow-md animate-fade-in"
                sideOffset={8}
              >
                {key
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                <Tooltip.Arrow className="fill-neutral-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </nav>
    </div>
  )
}

export default BottomNavigation
