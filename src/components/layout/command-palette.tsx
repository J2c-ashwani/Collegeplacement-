'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Search,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Settings,
  History,
  FileCheck,
  Award,
  TrendingUp,
  Sparkles,
  Mail,
} from "lucide-react"

interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  role?: string
}

export function CommandPalette({ open: controlledOpen, onOpenChange: controlledOnOpenChange, role }: CommandPaletteProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const isAdmin = !role || role === 'SUPER_ADMIN' || role === 'OPERATIONS'
  const isInstitution = !role || role === 'INSTITUTION_ADMIN' || isAdmin
  const isEmployer = !role || role === 'EMPLOYER' || isAdmin
  const isStudent = !role || role === 'STUDENT' || isAdmin
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (isControlled) {
        controlledOnOpenChange?.(value)
      } else {
        setInternalOpen(value)
      }
    },
    [isControlled, controlledOnOpenChange]
  )

  // 360 entity inspection dialog state
  const [student360Open, setStudent360Open] = React.useState(false)

  // Keyboard shortcut listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    const handleCustomOpen = () => setOpen(true)

    document.addEventListener("keydown", down)
    window.addEventListener("open-command-palette", handleCustomOpen)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("open-command-palette", handleCustomOpen)
    }
  }, [open, setOpen])

  const runCommand = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Operational Command Palette"
        description="Search platform entities, trigger business workflows, or jump to workspaces"
      >
        <CommandInput placeholder="Type a command, workflow, or search student / college..." />
        <CommandList className="max-h-[380px]">
          <CommandEmpty>No matching operational results found.</CommandEmpty>

          {/* Quick Business Actions */}
          <CommandGroup heading="Business Workflows & Shortcuts">
            {isAdmin && (
              <>
                <CommandItem
                  onSelect={() => runCommand(() => router.push("/admin/growth"))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span>GrowthOS Control Tower: Assurance Capacity & Deficit</span>
                  <Badge variant="outline" className="ml-auto text-[10px] bg-indigo-50 text-indigo-700">
                    3N Liquidity
                  </Badge>
                </CommandItem>

                <CommandItem
                  onSelect={() => runCommand(() => router.push("/admin/growth/outreach"))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span>Outreach Approval Vault (Human-in-the-Loop Gate)</span>
                  <Badge variant="outline" className="ml-auto text-[10px] bg-emerald-50 text-emerald-700">
                    Approval Safe
                  </Badge>
                </CommandItem>

                <CommandItem
                  onSelect={() => runCommand(() => router.push("/admin/growth/colleges"))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>College Acquisition CRM: 11-Dimension ICP Sourcing</span>
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    Supply
                  </Badge>
                </CommandItem>

                <CommandItem
                  onSelect={() => runCommand(() => router.push("/admin/growth/employers"))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span>Employer Demand CRM: Sourcing Fresher Capacity</span>
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    Demand
                  </Badge>
                </CommandItem>
              </>
            )}
            {isAdmin && (
              <CommandItem
                onSelect={() =>
                  runCommand(() => {
                    setStudent360Open(true)
                  })
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Users className="h-4 w-4 text-purple-600 mr-2" />
                <span>Cross-Entity 360° View: Student Candidate Inspector</span>
                <Badge variant="outline" className="ml-auto text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  360 Live
                </Badge>
              </CommandItem>
            )}

            {isAdmin && (
              <CommandItem
                onSelect={() => runCommand(() => router.push("/admin/students"))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Search className="h-4 w-4 text-blue-600" />
                <span>Find Student by Name or Enrollment Number</span>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  Admin
                </Badge>
              </CommandItem>
            )}

            {isEmployer && (
              <CommandItem
                onSelect={() => runCommand(() => router.push("/employer/jobs"))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-emerald-600" />
                <span>Create New Employer Job Opening</span>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  Recruiter
                </Badge>
              </CommandItem>
            )}

            {isInstitution && (
              <CommandItem
                onSelect={() => runCommand(() => router.push("/institution/placements"))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="h-4 w-4 text-amber-600" />
                <span>View Pending Offer Documents & Gap Tracker</span>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  TPO
                </Badge>
              </CommandItem>
            )}

            {isEmployer && (
              <CommandItem
                onSelect={() => runCommand(() => router.push("/employer/invoices"))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="h-4 w-4 text-purple-600" />
                <span>View Unpaid Corporate Employer Invoices</span>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  Billing
                </Badge>
              </CommandItem>
            )}

            {isAdmin && (
              <CommandItem
                onSelect={() => runCommand(() => router.push("/admin/institutions"))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Clock className="h-4 w-4 text-rose-600" />
                <span>Expiring Partner Institutions in 30 Days</span>
                <Badge variant="outline" className="ml-auto text-[10px] text-rose-600 border-rose-200">
                  Review
                </Badge>
              </CommandItem>
            )}
          </CommandGroup>

          {/* Admin Operations Workspaces */}
          {isAdmin && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Platform Operations (Admin)">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/overview"))}>
                  <ShieldAlert className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Assurance Capacity & Growth Control Tower</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/students"))}>
                  <Users className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Platform Student Directory</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/employers"))}>
                  <Building2 className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Corporate Employer Management</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/jobs"))}>
                  <Briefcase className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Platform Job Openings Catalog</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/audit-logs"))}>
                  <History className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Append-Only Audit Trail</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
                  <Settings className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Global Platform Settings</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {/* Institution Workspaces */}
          {isInstitution && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Institution (TPO)">
                <CommandItem onSelect={() => runCommand(() => router.push("/institution/overview"))}>
                  <GraduationCap className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Placement Funnel Overview</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/institution/drives"))}>
                  <Briefcase className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Campus Hiring Drives Calendar</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/institution/mous"))}>
                  <FileText className="h-4 w-4 text-slate-500 mr-2" />
                  <span>MoU & Industry Engagements</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/institution/reports"))}>
                  <Award className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Placement & CTC Analytics Reports</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {/* Employer Workspaces */}
          {isEmployer && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Employer Recruiter">
                <CommandItem onSelect={() => runCommand(() => router.push("/employer/invoices"))}>
                  <CreditCard className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Success Fee Invoices & Receipts</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/employer/profile"))}>
                  <Building2 className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Corporate Profile & Recruiter Team</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {/* Student Workspaces */}
          {isStudent && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Student Portal">
                <CommandItem onSelect={() => runCommand(() => router.push("/student/documents"))}>
                  <FileCheck className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Digital Document Vault</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/student/applications"))}>
                  <Briefcase className="h-4 w-4 text-slate-500 mr-2" />
                  <span>Job Application Stages</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/student/interviews"))}>
                  <ShieldAlert className="h-4 w-4 text-slate-500 mr-2" />
                  <span>3-Assurance Guaranteed Interview Slots</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>

      {/* Cross-Entity 360 View Modal */}
      <Dialog open={student360Open} onOpenChange={setStudent360Open}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Cross-Entity 360° View — Student Candidate
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Aggregated cross-entity snapshot linking academic profile, diagnostic scores, applications, assurance quota, and verified placement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="p-6 text-center space-y-3">
              <Search className="h-8 w-8 text-slate-300 mx-auto" />
              <h4 className="font-semibold text-sm text-slate-700">Search for a student to view their 360° profile</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the command palette search to find a specific student, then select &ldquo;360° View&rdquo; to see their aggregated profile across all platform entities.
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                This view will display live data from the student&apos;s actual records.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setStudent360Open(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  setStudent360Open(false)
                  router.push("/admin/students")
                }}
              >
                View Student Directory <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

