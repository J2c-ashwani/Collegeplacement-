import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { OutreachSequenceVault } from './outreach-sequence-vault'

export default async function AdminGrowthOutreachPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const [drafts, sequences, replies, suppressedCount] = await Promise.all([
    prisma.growthOutreach.findMany({
      include: {
        collegeProspect: true,
        employerProspect: true,
        step: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.outreachSequence.findMany({
      include: {
        steps: { orderBy: { stepNumber: 'asc' } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.replyEvent.findMany({
      include: {
        outreach: {
          select: {
            subject: true,
            prospectType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.collegeProspect.count({ where: { dnc: true } }).then(async (c) => {
      const e = await prisma.employerProspect.count({ where: { dnc: true } })
      return c + e
    }),
  ])

  const initialDrafts = drafts.map((d) => ({
    id: d.id,
    prospectType: d.prospectType,
    subject: d.subject,
    body: d.body,
    status: d.status,
    isSafeAction: d.isSafeAction,
    createdAt: d.createdAt.toISOString(),
    collegeProspect: d.collegeProspect
      ? {
          id: d.collegeProspect.id,
          name: d.collegeProspect.name,
          tpoName: d.collegeProspect.tpoName,
          tpoEmail: d.collegeProspect.tpoEmail,
          region: d.collegeProspect.region,
          freshnessStatus: d.collegeProspect.freshnessStatus,
        }
      : null,
    employerProspect: d.employerProspect
      ? {
          id: d.employerProspect.id,
          companyName: d.employerProspect.companyName,
          recruiterName: d.employerProspect.recruiterName,
          recruiterEmail: d.employerProspect.recruiterEmail,
          region: d.employerProspect.region,
          freshnessStatus: d.employerProspect.freshnessStatus,
        }
      : null,
    step: d.step
      ? {
          stepNumber: d.step.stepNumber,
          channel: d.step.channel,
        }
      : null,
  }))

  const initialSequences = sequences.map((s) => ({
    id: s.id,
    name: s.name,
    targetType: s.targetType,
    description: s.description,
    isActive: s.isActive,
    steps: s.steps.map((st) => ({
      id: st.id,
      stepNumber: st.stepNumber,
      delayDays: st.delayDays,
      templateSubject: st.templateSubject,
      templateBody: st.templateBody,
      channel: st.channel,
    })),
    _count: s._count,
  }))

  const initialReplies = replies.map((r) => ({
    id: r.id,
    senderEmail: r.senderEmail,
    snippet: r.snippet,
    body: r.body,
    intent: r.intent,
    confidence: r.confidence,
    suggestedAction: r.suggestedAction,
    requiresHumanReview: r.requiresHumanReview,
    createdAt: r.createdAt.toISOString(),
    outreach: r.outreach,
  }))

  return (
    <OutreachSequenceVault
      initialDrafts={initialDrafts}
      initialSequences={initialSequences}
      initialReplies={initialReplies}
      initialSuppressedCount={suppressedCount}
    />
  )
}
