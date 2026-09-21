"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, Building2, Users, Briefcase, FileText, 
  Video, GraduationCap, CheckCircle, 
  Star, Shield, UserCircle, QrCode, LogOut,
  History, Settings, CreditCard, Award, FileCheck,
  TrendingUp, Mail
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

interface NavSection {
  group: string
  items: {
    title: string
    icon: React.ComponentType<{ className?: string }>
    url: string
  }[]
}

export function DashboardSidebar({ role, user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navSections: Record<Role, NavSection[]> = {
    admin: [
      {
        group: "Command Center",
        items: [
          { title: "Platform Overview", icon: LayoutDashboard, url: "/admin/overview" },
          { title: "GrowthOS Control Tower", icon: TrendingUp, url: "/admin/growth" },
        ],
      },
      {
        group: "Network & Sourcing",
        items: [
          { title: "College Acquisition", icon: Building2, url: "/admin/growth/colleges" },
          { title: "Employer Demand", icon: Briefcase, url: "/admin/growth/employers" },
          { title: "Outreach Vault", icon: Mail, url: "/admin/growth/outreach" },
          { title: "Partner Institutions", icon: Building2, url: "/admin/institutions" },
          { title: "Student Cohorts", icon: Users, url: "/admin/students" },
          { title: "Corporate Employers", icon: Building2, url: "/admin/employers" },
        ],
      },
      {
        group: "Operations",
        items: [
          { title: "Job Postings", icon: Briefcase, url: "/admin/jobs" },
          { title: "Placements & Billing", icon: GraduationCap, url: "/admin/placements" },
        ],
      },
      {
        group: "Governance & System",
        items: [
          { title: "Audit Trail", icon: History, url: "/admin/audit-logs" },
          { title: "Platform Settings", icon: Settings, url: "/admin/settings" },
        ],
      },
    ],
    institution: [
      {
        group: "Overview",
        items: [
          { title: "Placement Dashboard", icon: LayoutDashboard, url: "/institution/overview" },
        ],
      },
      {
        group: "Students & Batch",
        items: [
          { title: "Cohort Roster", icon: Users, url: "/institution/students" },
          { title: "Registration & QR", icon: QrCode, url: "/institution/registration" },
        ],
      },
      {
        group: "Hiring & Drives",
        items: [
          { title: "Verified Placements", icon: GraduationCap, url: "/institution/placements" },
          { title: "Campus Drives", icon: Briefcase, url: "/institution/drives" },
        ],
      },
      {
        group: "Partnerships",
        items: [
          { title: "MoUs & Industry Activity", icon: FileText, url: "/institution/mous" },
        ],
      },
      {
        group: "Accreditation & Reporting",
        items: [
          { title: "Placement Evidence & Support", icon: Award, url: "/institution/reports" },
        ],
      },
    ],
    employer: [
      {
        group: "Command Center",
        items: [
          { title: "Recruiter Overview", icon: LayoutDashboard, url: "/employer/overview" },
        ],
      },
      {
        group: "Hiring & Pipeline",
        items: [
          { title: "Active Job Openings", icon: Briefcase, url: "/employer/jobs" },
          { title: "Candidate Pool", icon: Users, url: "/employer/candidates" },
          { title: "Interviews", icon: Video, url: "/employer/interviews" },
          { title: "Offers & Hires", icon: FileText, url: "/employer/offers" },
        ],
      },
      {
        group: "Commercials",
        items: [
          { title: "Placement Invoices", icon: CreditCard, url: "/employer/invoices" },
        ],
      },
      {
        group: "Organization",
        items: [
          { title: "Company Profile", icon: Building2, url: "/employer/profile" },
        ],
      },
    ],
    student: [
      {
        group: "Overview",
        items: [
          { title: "Career Dashboard", icon: LayoutDashboard, url: "/student/dashboard" },
        ],
      },
      {
        group: "Career Readiness",
        items: [
          { title: "Diagnostic Assessment", icon: CheckCircle, url: "/student/assessment" },
          { title: "My Scorecard", icon: Star, url: "/student/score" },
          { title: "Verified Credentials", icon: Shield, url: "/student/badges" },
        ],
      },
      {
        group: "Opportunities",
        items: [
          { title: "Assurance Interviews", icon: Video, url: "/student/interviews" },
          { title: "Campus Jobs", icon: Briefcase, url: "/student/jobs" },
          { title: "Job Applications", icon: FileText, url: "/student/applications" },
          { title: "Offer Letters", icon: Award, url: "/student/offers" },
        ],
      },
      {
        group: "Dossier",
        items: [
          { title: "Academic Profile", icon: UserCircle, url: "/student/profile" },
          { title: "Document Vault", icon: FileCheck, url: "/student/documents" },
        ],
      },
    ],
  }

  const sections = navSections[role] || []

  const getPersonaLabel = () => {
    switch (role) {
      case 'institution': return 'Institution Network'
      case 'admin': return 'Operations Intelligence'
      case 'employer': return 'Corporate Hiring'
      case 'student': return 'Candidate Launchpad'
    }
  }

  return (
    <Sidebar className="border-r border-slate-200/90 bg-white dark:bg-slate-900 dark:border-slate-800">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-slate-200/80 p-3.5">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="h-8 w-8 rounded-md bg-[#0F2744] dark:bg-slate-800 flex items-center justify-center text-white shadow-2xs group-hover:bg-[#1E40AF] transition-colors shrink-0">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-slate-900 tracking-tight dark:text-white leading-tight truncate">
              PlacementConnect
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider truncate">
              {getPersonaLabel()}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Role-Specific Navigation Sections */}
      <SidebarContent className="px-2 py-2.5 overflow-y-auto space-y-4">
        {sections.map((section) => (
          <SidebarGroup key={section.group} className="p-0">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 mb-0.5">
              {section.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = 
                    pathname === item.url || 
                    (item.url !== `/${role}/overview` && item.url !== '/student/dashboard' && pathname.startsWith(item.url))

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[4px] text-xs font-medium transition-colors relative ${
                          isActive 
                            ? "bg-slate-100 text-[#0F2744] font-semibold dark:bg-slate-800 dark:text-white" 
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
                        }`}
                        render={<Link href={item.url} />}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#1E40AF] rounded-r-full" />
                        )}
                        <item.icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#1E40AF] dark:text-sky-400" : "text-slate-400"}`} />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-slate-200/80 p-2.5 bg-slate-50/60 dark:bg-slate-900/60">
        {user && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="h-7 w-7 bg-[#0F2744] text-white rounded-md flex items-center justify-center font-bold text-xs shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-slate-800 truncate dark:text-slate-200 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate dark:text-slate-400 leading-tight">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition shrink-0"
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
