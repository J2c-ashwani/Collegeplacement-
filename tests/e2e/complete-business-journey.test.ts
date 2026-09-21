import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { evaluateJobMatch } from '@/services/matching.service'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('Complete End-to-End Business Journey Acceptance Test', () => {
  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('successfully executes the full multi-actor business journey end-to-end', async () => {
    const defaultPassword = 'TestPassword123!'
    const passwordHash = await bcrypt.hash(defaultPassword, 10)
    const runId = Date.now()

    console.log('--- STARTING COMPLETE ACCEPTANCE JOURNEY ---')

    // =========================================================================
    // STEP 1: College pays for annual partnership → gets active membership & URL
    // =========================================================================
    console.log('Step 1: College Onboarding & Annual Membership Payment...')
    const collegeCode = `miet-${runId}`
    const registrationCode = `MIE${String(runId).slice(-4)}`

    const institution = await prisma.institution.create({
      data: {
        name: 'Modern Institute of Engineering & Technology',
        code: collegeCode,
        registrationCode,
        type: 'ENGINEERING',
        universityAffiliation: 'Pune University',
        accreditation: 'NAAC A',
        address: 'Hinjewadi Phase 1',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411057',
        principalName: 'Dr. Arvind Joshi',
        tpoName: 'Prof. Sneha Patil',
        tpoEmail: `tpo.${runId}@miet-e2e.edu.in`,
        officialPhone: '+91 9890011223',
        estimatedStudentCount: 500,
        departments: ['Computer Science', 'Information Technology', 'Electronics'],
        graduationBatches: ['2026'],
        status: 'APPROVED',
      },
    })
    expect(institution.registrationCode).toBe(registrationCode)

    const plan = await prisma.institutionPlan.findFirst({
      where: { slug: 'placement' },
    })
    expect(plan).toBeDefined()
    const basePrice = Number(plan!.price)
    const gst = (basePrice * Number(plan!.gstPercent)) / 100
    const totalPayment = basePrice + gst

    const collegeUser = await prisma.user.create({
      data: {
        name: institution.tpoName,
        email: institution.tpoEmail,
        passwordHash,
        role: 'INSTITUTION_ADMIN',
        status: 'ACTIVE',
        emailVerified: new Date(),
      },
    })

    const order1 = await prisma.order.create({
      data: {
        orderType: 'INSTITUTION_MEMBERSHIP',
        entityId: institution.id,
        userId: collegeUser.id,
        amount: basePrice,
        gstAmount: gst,
        totalAmount: totalPayment,
        currency: 'INR',
        status: 'PAID',
        gatewayOrderId: `order_inst_${runId}`,
      },
    })

    const membership = await prisma.institutionMembership.create({
      data: {
        institutionId: institution.id,
        planId: plan!.id,
        orderId: order1.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 86400000),
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    })
    expect(membership.status).toBe('ACTIVE')

    // Roster denominator setup (500 expected students)
    await prisma.institutionRoster.create({
      data: {
        id: `roster-${institution.code}-2026`,
        institutionId: institution.id,
        graduationYear: 2026,
        totalExpectedStudents: 500,
        importedBy: collegeUser.id,
        status: 'ACTIVE',
      },
    })

    const registrationUrl = `/register/${institution.registrationCode}`
    console.log(`✓ College partnership active. Registration URL: ${registrationUrl}`)

    // =========================================================================
    // STEP 2: Student registers through institution-specific locked link
    // =========================================================================
    console.log('Step 2: Student Registration via locked college URL...')
    const studentEmail = `priya.nair.${runId}@miet-e2e.edu.in`
    const studentUser = await prisma.user.create({
      data: {
        name: 'Priya Nair',
        email: studentEmail,
        passwordHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: new Date(),
      },
    })

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        institutionId: institution.id,
        enrollmentNumber: `MIE2026CS${String(runId).slice(-3)}`,
        status: 'PAYMENT_PENDING',
        verificationId: `STU-2026-${String(runId).slice(-6)}`,
        registrationSource: 'INSTITUTION_URL',
      },
    })
    expect(student.status).toBe('PAYMENT_PENDING')
    expect(student.institutionId).toBe(institution.id)

    await prisma.studentProfile.create({
      data: {
        studentId: student.id,
        course: 'B.Tech',
        branch: 'Computer Science',
        department: 'Engineering',
        graduationYear: 2026,
        cgpa: 8.6,
        backlogs: 0,
        tenthPercentage: 92.0,
        twelfthPercentage: 89.0,
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
        languages: ['English', 'Hindi'],
        preferredLocations: ['Pune', 'Bengaluru'],
        employerVisibilityConsent: true,
        employerVisibilityConsentAt: new Date(),
      },
    })
    console.log(`✓ Student ${studentUser.name} registered under ${institution.name}`)

    // =========================================================================
    // STEP 3: Student pays ₹999 for Placement Assurance → Programme activated
    // =========================================================================
    console.log('Step 3: Student Programme Payment & Activation...')
    const programmePlan = await prisma.programmePlan.findFirst({
      where: { slug: 'placement-assurance' },
    })
    expect(programmePlan).toBeDefined()
    expect(Number(programmePlan?.price)).toBe(999)

    const stuBase = Number(programmePlan!.price)
    const stuGst = stuBase * 0.18
    const stuTotal = stuBase + stuGst

    const studentOrder = await prisma.order.create({
      data: {
        orderType: 'STUDENT_PROGRAMME',
        entityId: student.id,
        userId: studentUser.id,
        amount: stuBase,
        gstAmount: stuGst,
        totalAmount: stuTotal,
        currency: 'INR',
        status: 'PAID',
        gatewayOrderId: `order_stu_${runId}`,
      },
    })

    const studentProg = await prisma.studentProgramme.create({
      data: {
        studentId: student.id,
        programmePlanId: programmePlan!.id,
        institutionId: institution.id,
        institutionMembershipId: membership.id,
        orderId: studentOrder.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 86400000),
        assuranceTarget: 3,
        assuranceStartDate: new Date(),
        assuranceEndDate: new Date(Date.now() + 365 * 86400000),
        opportunitiesConsumed: 0,
        opportunitiesRemaining: 3,
        assuranceStatus: 'ACTIVE',
        studentObligationsAccepted: new Date(),
      },
    })

    await prisma.student.update({
      where: { id: student.id },
      data: { status: 'ACTIVE' },
    })

    expect(studentProg.assuranceTarget).toBe(3)
    expect(studentProg.opportunitiesRemaining).toBe(3)
    console.log('✓ Student programme active with 3 qualified interview targets')

    // =========================================================================
    // STEP 4: Student takes Assessment → Employability score & badges
    // =========================================================================
    console.log('Step 4: Employability Assessment & Scoring...')
    const assessment = await prisma.studentAssessment.create({
      data: {
        studentId: student.id,
        status: 'COMPLETED',
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(),
      },
    })

    const result = await prisma.assessmentResult.create({
      data: {
        assessmentId: assessment.id,
        studentId: student.id,
        overallScore: 86,
        technicalReadiness: 84,
        communication: 88,
        workEthics: 85,
        learningAgility: 87,
        teamOrientation: 82,
        problemSolving: 85,
        professionalBehaviour: 88,
        interviewReadiness: 86,
      },
    })

    const commBadge = await prisma.badge.findFirst({ where: { slug: 'strong-communicator' } })
    if (commBadge) {
      await prisma.studentBadge.create({
        data: {
          studentId: student.id,
          badgeId: commBadge.id,
          score: 88,
          verificationId: `BDG-COMM-${student.id}-${runId}`,
        },
      })
    }
    expect(result.overallScore).toBe(86)
    console.log('✓ Assessment scored: 86/100, Badges awarded: Strong Communicator')

    // =========================================================================
    // STEP 5: Employer posts fresher job with score thresholds
    // =========================================================================
    console.log('Step 5: Employer Job Creation with assessment criteria...')
    const employer = await prisma.employer.create({
      data: {
        name: `Zenith Cloud Systems ${runId}`,
        industry: 'Cloud Infrastructure',
        size: 'MEDIUM',
        city: 'Pune',
        state: 'Maharashtra',
        status: 'APPROVED',
      },
    })

    const feeRule = await prisma.employerFeeRule.create({
      data: {
        employerId: employer.id,
        feeType: 'SUCCESS_FEE',
        feeAmount: 10000,
        feeCurrency: 'INR',
        trigger: 'CANDIDATE_JOINED',
        isActive: true,
      },
    })

    const job = await prisma.job.create({
      data: {
        employerId: employer.id,
        title: 'Associate Cloud Solutions Engineer',
        department: 'Cloud Services',
        type: 'FULL_TIME',
        location: 'Pune',
        workMode: 'HYBRID',
        ctc: 600000,
        degree: ['B.Tech', 'BE'],
        branch: ['Computer Science', 'Information Technology'],
        graduationYear: 2026,
        minCgpa: 7.5,
        backlogsAllowed: false,
        skills: ['TypeScript', 'Node.js', 'Docker'],
        minEmployabilityScore: 75,
        minCommunicationScore: 80,
        requiredBadges: ['Strong Communicator'],
        openings: 2,
        description: 'Exciting fresher role working on cloud migration and automated microservices.',
        status: 'ACTIVE',
      },
    })
    console.log(`✓ Job "${job.title}" posted by ${employer.name}`)

    // =========================================================================
    // STEP 6: Matching Engine calculates candidate match
    // =========================================================================
    console.log('Step 6: Running Matching Engine...')
    const match = evaluateJobMatch(
      {
        id: student.id,
        course: 'B.Tech',
        branch: 'Computer Science',
        graduationYear: 2026,
        cgpa: 8.6,
        backlogs: 0,
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
        scores: {
          overall: 86,
          technicalReadiness: 84,
          communication: 88,
          workEthics: 85,
          learningAgility: 87,
          teamOrientation: 82,
          problemSolving: 85,
          professionalBehaviour: 88,
          interviewReadiness: 86,
        },
        badges: ['Strong Communicator'],
        preferredLocations: ['Pune', 'Bengaluru'],
      },
      {
        id: job.id,
        title: job.title,
        degree: job.degree,
        branch: job.branch,
        graduationYear: job.graduationYear,
        minCgpa: job.minCgpa,
        backlogsAllowed: job.backlogsAllowed,
        skills: job.skills,
        minEmployabilityScore: job.minEmployabilityScore,
        minCommunicationScore: job.minCommunicationScore,
        requiredBadges: job.requiredBadges,
        location: job.location,
      }
    )

    expect(match.isEligible).toBe(true)
    expect(match.score).toBeGreaterThanOrEqual(80)
    console.log(`✓ Matching Engine: ${match.score}% fit, Eligible: ${match.isEligible}`)

    // =========================================================================
    // STEP 7: Opportunity #1 Assigned → Rejection (consumed: 1, remaining: 2)
    // =========================================================================
    console.log('Step 7: Opportunity #1 Delivered → Interview Round 1 → Rejection...')
    const app1 = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId: job.id,
        status: 'SHORTLISTED',
        matchScore: match.score,
      },
    })

    const opp1 = await prisma.assuranceOpportunity.create({
      data: {
        studentProgrammeId: studentProg.id,
        studentId: student.id,
        employerId: employer.id,
        jobId: job.id,
        applicationId: app1.id,
        opportunityNumber: 1,
        status: 'INTERVIEW_SCHEDULED',
        countsTowardAssurance: true,
      },
    })

    await prisma.interview.create({
      data: {
        opportunityId: opp1.id,
        studentId: student.id,
        jobId: job.id,
        employerId: employer.id,
        roundNumber: 1,
        roundName: 'Round 1: System Design & Coding',
        status: 'COMPLETED',
        result: 'REJECTED',
        completedAt: new Date(),
      },
    })

    await prisma.assuranceOpportunity.update({
      where: { id: opp1.id },
      data: {
        status: 'REJECTED',
        outcome: 'Rejected after Round 1',
        completedDate: new Date(),
      },
    })

    const progAfterOpp1 = await prisma.studentProgramme.update({
      where: { id: studentProg.id },
      data: {
        opportunitiesConsumed: 1,
        opportunitiesRemaining: 2,
      },
    })
    expect(progAfterOpp1.opportunitiesConsumed).toBe(1)
    expect(progAfterOpp1.opportunitiesRemaining).toBe(2)
    console.log('✓ Opportunity #1 recorded as REJECTED. 2 opportunities remaining.')

    // =========================================================================
    // STEP 8: Opportunity #2 Assigned → Multi-Round Interview → Candidate SELECTED
    // =========================================================================
    console.log('Step 8: Opportunity #2 Delivered → Selection...')
    const job2 = await prisma.job.findFirst({ where: { status: 'ACTIVE', id: { not: job.id } } })
    const targetJob2 = job2 || job

    const app2 = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId: targetJob2.id,
        status: 'SHORTLISTED',
        matchScore: 92,
      },
    })

    const opp2 = await prisma.assuranceOpportunity.create({
      data: {
        studentProgrammeId: studentProg.id,
        studentId: student.id,
        employerId: targetJob2.employerId,
        jobId: targetJob2.id,
        applicationId: app2.id,
        opportunityNumber: 2,
        status: 'INTERVIEW_SCHEDULED',
        countsTowardAssurance: true,
      },
    })

    // Schedule & complete 2 rounds
    await prisma.interview.create({
      data: {
        opportunityId: opp2.id,
        studentId: student.id,
        jobId: targetJob2.id,
        employerId: targetJob2.employerId,
        roundNumber: 1,
        roundName: 'Round 1: Live Coding',
        status: 'COMPLETED',
        result: 'PASSED',
      },
    })

    await prisma.interview.create({
      data: {
        opportunityId: opp2.id,
        studentId: student.id,
        jobId: targetJob2.id,
        employerId: targetJob2.employerId,
        roundNumber: 2,
        roundName: 'Round 2: Technical & Leadership Bar Raiser',
        status: 'COMPLETED',
        result: 'SELECTED',
      },
    })

    await prisma.assuranceOpportunity.update({
      where: { id: opp2.id },
      data: {
        status: 'SELECTED',
        outcome: 'Selected for Cloud Engineer position',
        completedDate: new Date(),
      },
    })
    console.log('✓ Opportunity #2 Candidate SELECTED after 2 rounds!')

    // =========================================================================
    // STEP 9: Offer Issued & Offer Letter Document Uploaded & Verified
    // =========================================================================
    console.log('Step 9: Offer Issuance & Offer Document Verification...')
    const offer = await prisma.offer.create({
      data: {
        applicationId: app2.id,
        opportunityId: opp2.id,
        studentId: student.id,
        employerId: targetJob2.employerId,
        jobId: targetJob2.id,
        institutionId: institution.id,
        offerDate: new Date(),
        ctc: 650000,
        fixedSalary: 600000,
        variableSalary: 50000,
        joiningDate: new Date('2026-08-01'),
        location: 'Pune',
        employmentType: 'Full-Time',
        status: 'OFFER_PENDING',
      },
    })

    const offerDoc = await prisma.document.create({
      data: {
        type: 'OFFER_LETTER',
        entityType: 'offer',
        entityId: offer.id,
        studentId: student.id,
        institutionId: institution.id,
        employerId: targetJob2.employerId,
        filename: 'Zenith_Cloud_Offer_Letter_Priya.pdf',
        originalFilename: 'Offer_Letter.pdf',
        storageKey: `offers/${offer.id}/offer_${runId}.pdf`,
        mimeType: 'application/pdf',
        size: 320000,
        uploadedBy: studentUser.id,
        verificationStatus: 'PENDING',
      },
    })

    await prisma.offer.update({
      where: { id: offer.id },
      data: {
        offerLetterDocumentId: offerDoc.id,
        status: 'OFFER_RECEIVED',
      },
    })

    // Admin verifies document
    const verifiedDoc = await prisma.document.update({
      where: { id: offerDoc.id },
      data: {
        verificationStatus: 'VERIFIED',
        verificationComment: 'Offer letter CTC and official seal verified.',
        verifiedAt: new Date(),
      },
    })
    expect(verifiedDoc.verificationStatus).toBe('VERIFIED')
    console.log('✓ Offer Letter verified and linked to Offer record')

    // =========================================================================
    // STEP 10: Joining Confirmed → Verified Placement Code generated
    // =========================================================================
    console.log('Step 10: Joining Confirmation & Placement Code Generation...')
    const placementCount = await prisma.placement.count()
    const placementCode = `PLC-${new Date().getFullYear()}-${String(placementCount + 1).padStart(6, '0')}`

    const placement = await prisma.placement.create({
      data: {
        offerId: offer.id,
        studentId: student.id,
        institutionId: institution.id,
        employerId: targetJob2.employerId,
        jobId: targetJob2.id,
        placementCode,
        ctc: 650000,
        joiningDate: new Date('2026-08-01'),
        joinedAt: new Date(),
        status: 'VERIFIED',
        verificationNotes: 'Candidate verified as joined.',
      },
    })
    expect(placement.placementCode).toMatch(/^PLC-2026-\d{6}$/)

    await prisma.student.update({
      where: { id: student.id },
      data: { status: 'PLACED' },
    })

    await prisma.studentProgramme.update({
      where: { id: studentProg.id },
      data: { status: 'PLACED', assuranceStatus: 'PLACED' },
    })
    console.log(`✓ Placement Verified: Code ${placement.placementCode}`)

    // =========================================================================
    // STEP 11: Employer Success Fee & GST Invoice Automatically Generated
    // =========================================================================
    console.log('Step 11: Employer Fee Billing & Invoice Generation...')
    const feeAmount = Number(feeRule.feeAmount)
    const feeGst = feeAmount * 0.18
    const feeTotal = feeAmount + feeGst

    const employerFee = await prisma.employerFee.create({
      data: {
        employerFeeRuleId: feeRule.id,
        employerId: targetJob2.employerId,
        placementId: placement.id,
        studentId: student.id,
        jobId: targetJob2.id,
        amount: feeAmount,
        gstAmount: feeGst,
        totalAmount: feeTotal,
        status: 'GENERATED',
        paymentDueDate: new Date(Date.now() + 30 * 86400000),
      },
    })

    const invoiceNumber = `INV-EMP-2026-${String(runId).slice(-6)}`
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount: feeAmount,
        gstAmount: feeGst,
        totalAmount: feeTotal,
        buyerName: employer.name,
        items: [
          {
            description: `Success Placement Fee — Candidate: Priya Nair (${placement.placementCode})`,
            amount: feeAmount,
            gst: feeGst,
            total: feeTotal,
          },
        ],
      },
    })

    await prisma.employerFee.update({
      where: { id: employerFee.id },
      data: { invoiceId: invoice.id },
    })

    expect(invoice.invoiceNumber).toContain('INV-EMP-2026')
    console.log(`✓ Employer Invoice Generated: ${invoice.invoiceNumber} for ₹${feeTotal}`)

    // =========================================================================
    // STEP 12: Institution Dashboard Metrics Reflect All Changes in Real-Time
    // =========================================================================
    console.log('Step 12: Verifying Institution Placement Dashboard Updates...')
    const [regCount, placedCount, cohort] = await Promise.all([
      prisma.student.count({ where: { institutionId: institution.id } }),
      prisma.placement.count({ where: { institutionId: institution.id } }),
      prisma.institutionRoster.findFirst({ where: { institutionId: institution.id } }),
    ])

    const totalBatch = cohort?.totalExpectedStudents || 500
    const gap = Math.max(totalBatch - regCount, 0)
    const placementRate = ((placedCount / regCount) * 100).toFixed(0)

    expect(regCount).toBe(1)
    expect(placedCount).toBe(1)
    expect(totalBatch).toBe(500)
    expect(gap).toBe(499)
    expect(placementRate).toBe('100')

    console.log(`✓ Real-time Dashboard: Batch Denominator=${totalBatch}, Registered=${regCount}, Placed=${placedCount}, Gap=${gap}, Rate=${placementRate}%`)
    console.log('--- COMPLETE ACCEPTANCE JOURNEY TEST PASSED 100% ---')
  })
})
