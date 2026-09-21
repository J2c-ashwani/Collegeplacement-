"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, Building2, Users, Briefcase, FileText, 
  Video, GraduationCap, CheckCircle, 
  Star, Shield, UserCircle, QrCode, LogOut,
  History, Settings, CreditCard, Award, FileCheck
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Role = 'admin' | 'institution' | 'student' | 'employer'

interface DashboardSidebarProps {
  role: Role
  user?: { name: string; email: string; role: string }
}

export function DashboardSidebar({ role, user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navItems = {
    admin: [
      { title: "Platform Overview", icon: LayoutDashboard, url: "/admin/overview" },
      { title: "Partner Institutions", icon: Building2, url: "/admin/institutions" },
      { title: "Student Directory", icon: Users, url: "/admin/students" },
      { title: "Corporate Employers", icon: Building2, url: "/admin/employers" },
      { title: "Job Postings", icon: Briefcase, url: "/admin/jobs" },
      { title: "Placements & Billing", icon: GraduationCap, url: "/admin/placements" },
      { title: "Audit Trail", icon: History, url: "/admin/audit-logs" },
      { title: "Platform Settings", icon: Settings, url: "/admin/settings" },
    ],
    institution: [
      { title: "Funnel Overview", icon: LayoutDashboard, url: "/institution/overview" },
      { title: "Student Directory", icon: Users, url: "/institution/students" },
      { title: "Registration & QR", icon: QrCode, url: "/institution/registration" },
      { title: "Verified Placements", icon: GraduationCap, url: "/institution/placements" },
      { title: "Campus Drives", icon: Briefcase, url: "/institution/drives" },
      { title: "MoUs & Activities", icon: FileText, url: "/institution/mous" },
      { title: "Placement Reports", icon: Award, url: "/institution/reports" },
    ],
    student: [
      { title: "Dashboard", icon: LayoutDashboard, url: "/student/dashboard" },
      { title: "Diagnostic Assessment", icon: CheckCircle, url: "/student/assessment" },
      { title: "My Scorecard", icon: Star, url: "/student/score" },
      { title: "Verified Badges", icon: Shield, url: "/student/badges" },
      { title: "Job Opportunities", icon: Briefcase, url: "/student/jobs" },
      { title: "3-Assurance Interviews", icon: Video, url: "/student/interviews" },
      { title: "Job Applications", icon: Briefcase, url: "/student/applications" },
      { title: "Offer Letters", icon: FileText, url: "/student/offers" },
      { title: "Document Vault", icon: FileCheck, url: "/student/documents" },
      { title: "Student Profile", icon: UserCircle, url: "/student/profile" },
    ],
    employer: [
      { title: "Recruiter Overview", icon: LayoutDashboard, url: "/employer/overview" },
      { title: "Job Openings", icon: Briefcase, url: "/employer/jobs" },
      { title: "Candidate Pipeline", icon: Users, url: "/employer/candidates" },
      { title: "Interviews", icon: Video, url: "/employer/interviews" },
      { title: "Offers & Hires", icon: FileText, url: "/employer/offers" },
      { title: "Invoices & Fees", icon: CreditCard, url: "/employer/invoices" },
      { title: "Company Profile", icon: Building2, url: "/employer/profile" },
    ],
  }

  const items = navItems[role] || []

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800">
      <SidebarHeader className="border-b border-slate-200/80 p-4">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-slate-900 tracking-tight dark:text-white leading-tight">
              PlacementConnect
            </span>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 capitalize">
              {role === 'institution' ? 'Institution Partner' : role === 'admin' ? 'Platform Operations' : role === 'employer' ? 'Recruiter Portal' : 'Student Portal'}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url || (item.url !== `/${role}/overview` && item.url !== '/student/dashboard' && pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                      }`}
                      render={<Link href={item.url} />}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200/80 p-3 bg-slate-50/50 dark:bg-slate-900/50">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-xs shadow-xs shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-xs text-slate-800 truncate dark:text-slate-200">{user.name}</span>
                <span className="text-[11px] text-slate-500 truncate dark:text-slate-400">{user.email}</span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
