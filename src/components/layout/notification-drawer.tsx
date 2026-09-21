'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCheck,
  Briefcase,
  Video,
  CreditCard,
  Building2,
  FileCheck,
  GraduationCap,
  ShieldAlert,
  Info,
  ExternalLink,
} from "lucide-react"

export type NotificationCategory =
  | 'Assurance'
  | 'Interviews'
  | 'Applications'
  | 'Billing'
  | 'System'
  | 'Membership'
  | 'Documents'
  | 'Placement'

export interface OperationalNotification {
  id: string
  category: NotificationCategory
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
}

const INITIAL_NOTIFICATIONS: OperationalNotification[] = [
  {
    id: 'notif-1',
    category: 'Assurance',
    title: 'Assurance Capacity Alert: 540 Slot Gap',
    message: 'Active student assurance obligations require employer acquisition before opening new college batches.',
    timestamp: '10 mins ago',
    read: false,
    link: '/admin/overview',
  },
  {
    id: 'notif-2',
    category: 'Interviews',
    title: 'Round 2 Interview Scheduled',
    message: 'Candidate Aarav Sharma confirmed for Technical Architecture round with TechCorp.',
    timestamp: '25 mins ago',
    read: false,
    link: '/employer/interviews',
  },
  {
    id: 'notif-3',
    category: 'Applications',
    title: 'New Candidate Shortlisted',
    message: 'CloudNova shortlisted 4 candidates matching Employability Score >= 80%.',
    timestamp: '1 hour ago',
    read: false,
    link: '/employer/candidates',
  },
  {
    id: 'notif-4',
    category: 'Billing',
    title: 'Employer Success Fee Invoice Generated',
    message: 'Invoice #INV-2026-001 generated for verified placement at TechCorp (Agreement-based rate).',
    timestamp: '2 hours ago',
    read: false,
    link: '/employer/invoices',
  },
  {
    id: 'notif-5',
    category: 'Documents',
    title: 'Offer Letter Uploaded for Verification',
    message: 'Aarav Sharma submitted signed offer letter from TechCorp for institutional verification.',
    timestamp: '3 hours ago',
    read: false,
    link: '/institution/placements',
  },
  {
    id: 'notif-6',
    category: 'Placement',
    title: 'Placement Verified & Joined',
    message: 'Placement PLC-2026-000182 marked VERIFIED_JOINED by TPO admin.',
    timestamp: '4 hours ago',
    read: true,
    link: '/institution/placements',
  },
  {
    id: 'notif-7',
    category: 'Membership',
    title: 'Institution MoU Renewal Notice',
    message: 'Apex Institute of Technology MoU is approaching 30-day review window.',
    timestamp: '1 day ago',
    read: true,
    link: '/institution/mous',
  },
  {
    id: 'notif-8',
    category: 'System',
    title: 'Platform Maintenance Complete',
    message: 'Security audit trail engine updated with append-only integrity checks.',
    timestamp: '2 days ago',
    read: true,
    link: '/admin/audit-logs',
  },
]

interface NotificationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const router = useRouter()
  const [notifications, setNotifications] = React.useState<OperationalNotification[]>(INITIAL_NOTIFICATIONS)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL')

  React.useEffect(() => {
    if (!open) return
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.notifications && data.data.notifications.length > 0) {
          const mapped: OperationalNotification[] = data.data.notifications.map((n: any) => ({
            id: n.id,
            category: (n.type as NotificationCategory) || 'System',
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt).toLocaleDateString(),
            read: n.read,
            link: n.link || undefined,
          }))
          setNotifications(mapped)
        }
      })
      .catch(() => {})
  }, [open])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
    } catch {}
  }

  const handleNotificationClick = async (item: OperationalNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    )
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
    } catch {}

    if (item.link) {
      onOpenChange(false)
      router.push(item.link)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === 'ALL') return true
    return n.category === selectedCategory
  })

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'Assurance':
        return <ShieldAlert className="h-4 w-4 text-rose-600" />
      case 'Interviews':
        return <Video className="h-4 w-4 text-blue-600" />
      case 'Applications':
        return <Briefcase className="h-4 w-4 text-indigo-600" />
      case 'Billing':
        return <CreditCard className="h-4 w-4 text-purple-600" />
      case 'Documents':
        return <FileCheck className="h-4 w-4 text-emerald-600" />
      case 'Placement':
        return <GraduationCap className="h-4 w-4 text-teal-600" />
      case 'Membership':
        return <Building2 className="h-4 w-4 text-amber-600" />
      case 'System':
      default:
        return <Info className="h-4 w-4 text-slate-500" />
    }
  }

  const getCategoryBadgeClass = (category: NotificationCategory) => {
    switch (category) {
      case 'Assurance':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'Interviews':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Applications':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'Billing':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Documents':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Placement':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'Membership':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'System':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const categories: NotificationCategory[] = [
    'Assurance',
    'Interviews',
    'Applications',
    'Billing',
    'Documents',
    'Placement',
    'Membership',
    'System',
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white">
        <SheetHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600" />
              Operational Notifications
              {unreadCount > 0 && (
                <Badge className="bg-indigo-600 text-white text-[11px] font-mono ml-1 px-1.5 py-0.2">
                  {unreadCount} new
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500 mt-0.5">
              Real-time placement alerts, interviews, and billing updates
            </SheetDescription>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 h-8 px-2"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </SheetHeader>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({notifications.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50/80 flex items-start gap-3 ${
                  !item.read ? 'bg-indigo-50/20' : 'bg-white'
                }`}
              >
                <div className="mt-0.5 p-2 rounded-lg bg-slate-100 shrink-0">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium px-2 py-0.2 ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  </div>

                  <h5
                    className={`text-xs font-semibold leading-snug ${
                      !item.read ? 'text-slate-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {item.title}
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  {item.link && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800">
                      <span>View operational details</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {!item.read && (
                  <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
