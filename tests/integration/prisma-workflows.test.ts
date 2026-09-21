import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Integration & Business Workflows', () => {
  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('verifies partner institutions exist with valid registration codes', async () => {
    const institutions = await prisma.institution.findMany({
      where: { status: 'APPROVED' },
    })

    expect(institutions.length).toBeGreaterThanOrEqual(3)
    const apex = institutions.find((i) => i.code === 'apex-tech')
    expect(apex).toBeDefined()
    expect(apex?.registrationCode).toBe('APX123')
  })

  it('verifies institution has active membership and valid expiry date', async () => {
    const institution = await prisma.institution.findFirst({
      where: { code: 'apex-tech' },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
        },
      },
    })

    expect(institution?.memberships.length).toBeGreaterThan(0)
    const activeMembership = institution?.memberships[0]
    expect(activeMembership?.status).toBe('ACTIVE')
    expect(activeMembership?.endDate).toBeDefined()
    expect(new Date(activeMembership!.endDate!).getTime()).toBeGreaterThan(Date.now())
    expect(activeMembership?.plan.name).toBe('Placement')
  })

  it('verifies student cohort denominator and roster student records', async () => {
    const apex = await prisma.institution.findFirst({ where: { code: 'apex-tech' } })
    const roster = await prisma.institutionRoster.findFirst({
      where: { institutionId: apex?.id },
    })

    expect(roster).toBeDefined()
    expect(roster?.totalExpectedStudents).toBe(600)

    const rosterStudentsCount = await prisma.rosterStudent.count({
      where: { institutionId: apex?.id },
    })
    expect(rosterStudentsCount).toBeGreaterThanOrEqual(50)
  })

  it('verifies student assessment result has overall score and all 8 subscores', async () => {
    const assessmentResult = await prisma.assessmentResult.findFirst({
      include: { student: { include: { user: true } } },
    })

    expect(assessmentResult).toBeDefined()
    expect(assessmentResult?.overallScore).toBeGreaterThanOrEqual(60)
    expect(assessmentResult?.communication).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.technicalReadiness).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.workEthics).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.learningAgility).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.teamOrientation).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.problemSolving).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.professionalBehaviour).toBeGreaterThanOrEqual(0)
    expect(assessmentResult?.interviewReadiness).toBeGreaterThanOrEqual(0)
  })

  it('verifies AssuranceOpportunity correctly separates opportunity from interview rounds', async () => {
    const opportunity = await prisma.assuranceOpportunity.findFirst({
      include: {
        interviews: true,
        student: true,
        job: true,
      },
    })

    expect(opportunity).toBeDefined()
    expect(opportunity?.countsTowardAssurance).toBe(true)
    expect(opportunity?.interviews.length).toBeGreaterThanOrEqual(1)
    expect(opportunity?.interviews[0].roundNumber).toBe(1)
  })

  it('verifies confirmed placement has unique PLC- code and auto-generated employer fee', async () => {
    const placement = await prisma.placement.findFirst({
      where: { status: 'VERIFIED' },
      include: {
        employerFees: true,
        employer: true,
      },
    })

    expect(placement).toBeDefined()
    expect(placement?.placementCode).toMatch(/^PLC-\d{4}-\d{6}$/)
    expect(placement?.employerFees.length).toBeGreaterThanOrEqual(1)
    const fee = placement?.employerFees[0]
    expect(Number(fee?.amount)).toBe(10000)
    expect(Number(fee?.totalAmount)).toBe(11800)
    expect(fee?.status).toBe('GENERATED')
  })
})
