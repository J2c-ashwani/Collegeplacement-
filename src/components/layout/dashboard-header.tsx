'use client'

import * as React from "react"
import { Bell, UserCircle, LogOut, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signOut } from "next-auth/react"
import { CommandPalette } from "@/components/layout/command-palette"
import { NotificationDrawer } from "@/components/layout/notification-drawer"

interface DashboardHeaderProps {
  showSearch?: boolean
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const role = user?.role
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [notifOpen, setNotifOpen] = React.useState(false)

  const getRoleLabel = (r?: string | null) => {
    switch (r) {
      case 'STUDENT': return { label: 'Candidate', color: 'bg-slate-100 text-slate-700 border-slate-200' }
      case 'INSTITUTION_ADMIN': return { label: 'Institution Admin', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
      case 'EMPLOYER': return { label: 'Corporate Recruiter', color: 'bg-sky-50 text-sky-800 border-sky-200' }
      case 'SUPER_ADMIN':
      case 'OPERATIONS': return { label: 'Operations Admin', color: 'bg-indigo-50 text-[#0F2744] border-indigo-200' }
      default: return { label: 'Verified User', color: 'bg-slate-50 text-slate-700 border-slate-200' }
    }
  }

  const roleMeta = getRoleLabel(role)

  return (
    <>
      <header className="flex h-12 items-center justify-between gap-4 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs px-5 dark:bg-slate-900/95 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="hidden sm:flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border ${roleMeta.color}`}>
              {roleMeta.label}
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] font-mono font-medium text-slate-500">Batch of 2026</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Global Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/80 text-xs text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors shadow-2xs"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search or command...</span>
            <kbd className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Slide-over Notification Drawer Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotifOpen(true)}
            className="relative text-slate-500 hover:text-slate-800"
            aria-label="Open notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full h-8 w-8 flex items-center justify-center hover:opacity-90 transition cursor-pointer border border-slate-200 focus:outline-hidden">
              <Avatar className="h-8 w-8 text-xs font-semibold bg-indigo-50 text-indigo-600">
                <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-slate-600">
                <UserCircle className="mr-2 h-4 w-4" />
                Role: <span className="font-medium ml-1 capitalize">{role?.toLowerCase().replace('_', ' ')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-xs text-rose-600 cursor-pointer focus:text-rose-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Command Palette and Notification Center Dialogs */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} role={role || undefined} />
      <NotificationDrawer open={notifOpen} onOpenChange={setNotifOpen} />
    </>
  )
}
