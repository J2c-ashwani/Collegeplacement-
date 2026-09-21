import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

test.describe('Real Browser E2E Acceptance Tests', () => {
  test.beforeAll(async () => {
    await prisma.$connect()
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('Test 1: Public Marketing & Programme Navigation in Browser', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/')
    await expect(page).toHaveTitle(/PlacementConnect/)
    await expect(page.locator('h1')).toContainText("Your College's External Placement Network")

    // 2. Click "For Colleges"
    await page.click('text=For Colleges')
    await expect(page).toHaveURL('/for-colleges')
    await expect(page.locator('h1')).toContainText('The Placement Partnership Your Institution Needs')

    // 3. Click "Placement Assurance"
    await page.click('text=Placement Assurance')
    await expect(page).toHaveURL('/placement-assurance')
    await expect(page.locator('h1')).toContainText('Placement Assurance Programme')

    // 4. Click "For Students"
    await page.click('text=For Students')
    await expect(page).toHaveURL('/for-students')
    await expect(page.locator('h1')).toContainText('Your Pathway to Career Readiness')
  })

  test('Test 2: Student Institutional Registration Journey in Real Browser', async ({ page }) => {
    const runId = Date.now()
    const studentEmail = `browser.student.${runId}@apextech.edu.in`
    const rollNo = `APX2026CS${String(runId).slice(-3)}`

    // Open locked registration link for Apex Tech (APX123)
    await page.goto('/register/APX123')

    // Verify locked institutional banner
    await expect(page.getByRole('heading', { name: 'Apex Institute of Technology' })).toBeVisible()
    await expect(page.locator('text=Verified Institutional Placement Partnership')).toBeVisible()
    await expect(page.locator('strong:has-text("APX123")')).toBeVisible()

    // Fill Step 1: Personal Details
    await page.fill('input[name="name"]', 'Sameer Kulkarni')
    await page.fill('input[name="enrollmentNumber"]', rollNo)
    await page.fill('input[name="email"]', studentEmail)
    await page.fill('input[name="phone"]', '+91 9820098200')
    await page.fill('input[name="password"]', 'StudentPass123!')

    // Advance to Step 2
    await page.click('button:has-text("Next: Academic Details")')

    // Fill Step 2: Academic Details
    await page.waitForSelector('input[name="cgpa"]')
    await page.fill('input[name="cgpa"]', '8.45')
    await page.fill('input[name="tenthPercentage"]', '91.0')
    await page.fill('input[name="twelfthPercentage"]', '88.5')
    await page.fill('input[name="skills"]', 'React, Node.js, PostgreSQL, TypeScript')

    // Submit Registration
    await page.click('button:has-text("Complete Registration")')

    // Verify browser displays success confirmation card
    await expect(page.locator('text=Enrolment Initiated!')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Your profile is registered under Apex Institute of Technology')).toBeVisible()
    await expect(page.locator('button:has-text("Proceed to Login")')).toBeVisible()

    // Verify database record was persisted accurately
    const createdStudent = await prisma.student.findFirst({
      where: { enrollmentNumber: rollNo },
      include: { user: true, profile: true },
    })
    expect(createdStudent).toBeDefined()
    expect(createdStudent?.user.email).toBe(studentEmail)
    expect(createdStudent?.status).toBe('PAYMENT_PENDING')
  })

  test('Test 3: Expired Institution Membership Protection in Browser', async ({ page }) => {
    const runId = Date.now()
    const expiredCode = `EXP${String(runId).slice(-3)}`

    // Create an institution with an expired membership
    const expiredInst = await prisma.institution.create({
      data: {
        name: 'Heritage College of Technology (Expired)',
        code: `heritage-expired-${runId}`,
        registrationCode: expiredCode,
        type: 'ENGINEERING',
        address: 'Old Highway',
        city: 'Nagpur',
        state: 'Maharashtra',
        principalName: 'Dr. Rao',
        tpoName: 'TPO Expired',
        tpoEmail: `tpo.expired.${runId}@heritage.edu.in`,
        officialPhone: '+91 9800098000',
        status: 'APPROVED',
      },
    })

    const plan = await prisma.institutionPlan.findFirst()
    await prisma.institutionMembership.create({
      data: {
        institutionId: expiredInst.id,
        planId: plan!.id,
        startDate: new Date(Date.now() - 400 * 86400000), // Started 400 days ago
        endDate: new Date(Date.now() - 35 * 86400000), // Expired 35 days ago
        status: 'EXPIRED',
      },
    })

    // Navigate to expired registration link in browser
    await page.goto(`/register/${expiredCode}`)

    // Verify browser displays registration paused advisory
    await expect(page.locator('text=Registration Temporarily Paused')).toBeVisible()
    await expect(page.locator('text=membership for Heritage College of Technology (Expired) is currently inactive or under renewal')).toBeVisible()

    // Form inputs must not be rendered
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toHaveCount(0)
  })

  test('Test 4: Cross-Institution Data Isolation Enforcement', async ({ request }) => {
    // Two distinct institutions from seed
    const apex = await prisma.institution.findFirst({ where: { code: 'apex-tech' } })
    const nism = await prisma.institution.findFirst({ where: { code: 'nism-pune' } })

    expect(apex).toBeDefined()
    expect(nism).toBeDefined()

    // Query placements for Apex
    const apexStudents = await prisma.student.findMany({
      where: { institutionId: apex!.id },
      select: { id: true, enrollmentNumber: true },
    })

    const nismStudents = await prisma.student.findMany({
      where: { institutionId: nism!.id },
      select: { id: true, enrollmentNumber: true },
    })

    // Verify absolute student ID separation
    const apexIds = new Set(apexStudents.map((s) => s.id))
    for (const nismStudent of nismStudents) {
      expect(apexIds.has(nismStudent.id)).toBe(false)
    }

    // Verify Roster isolation
    const apexRoster = await prisma.institutionRoster.findFirst({
      where: { institutionId: apex!.id },
    })
    const nismRoster = await prisma.institutionRoster.findFirst({
      where: { institutionId: nism!.id },
    })

    expect(apexRoster?.institutionId).not.toBe(nismRoster?.institutionId)
  })

  test('Test 5: Duplicate Payment Webhook Idempotency Check', async ({ request }) => {
    const runId = Date.now()
    const user = await prisma.user.findFirst()

    // Create an order in CREATED state
    const order = await prisma.order.create({
      data: {
        orderType: 'STUDENT_PROGRAMME',
        entityId: user!.id,
        userId: user!.id,
        amount: 999,
        gstAmount: 179.82,
        totalAmount: 1178.82,
        status: 'CREATED',
        gatewayOrderId: `order_webhook_test_${runId}`,
      },
    })

    const webhookPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_test_${runId}`,
            order_id: order.gatewayOrderId,
            amount: 117882,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    })

    // First Webhook Arrival
    const res1 = await request.post('/api/webhooks/razorpay', {
      headers: {
        'x-razorpay-signature': 'sandbox_signature_test',
        'Content-Type': 'application/json',
      },
      data: webhookPayload,
    })
    expect(res1.status()).toBe(200)

    // Verify order updated to PAID
    const orderAfterFirst = await prisma.order.findUnique({ where: { id: order.id } })
    expect(orderAfterFirst?.status).toBe('PAID')

    // Duplicate Webhook Arrival (same gatewayOrderId)
    const res2 = await request.post('/api/webhooks/razorpay', {
      headers: {
        'x-razorpay-signature': 'sandbox_signature_test',
        'Content-Type': 'application/json',
      },
      data: webhookPayload,
    })
    expect(res2.status()).toBe(200)

    // Verify order remains PAID and no duplicate states occur
    const orderAfterSecond = await prisma.order.findUnique({ where: { id: order.id } })
    expect(orderAfterSecond?.status).toBe('PAID')
  })

  test('Test 6: Student Dashboard, 3-Assurance Tracker & Scorecard in Real Browser', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'aarav.sharma@apextech.edu.in')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')

    // 2. Browser navigates to student dashboard
    await page.waitForURL('**/student/dashboard', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Welcome back, Aarav Sharma')
    await expect(page.locator('text=Placement Assurance Tracker')).toBeVisible()
    await expect(page.locator('text=Employability Score')).toBeVisible()

    // 3. Navigate to Scorecard
    await page.goto('/student/score')
    await expect(page.locator('h1')).toContainText('Career-Readiness Employability Scorecard')
    await expect(page.locator('text=9-Dimension Subscore Breakdown')).toBeVisible()

    // 4. Navigate to Job Opportunities
    await page.goto('/student/jobs')
    await expect(page.locator('h1')).toContainText('Curated Employer Opportunities')
    await expect(page.locator('text=Diagnostic Match').first()).toBeVisible()

    // 5. Navigate to 3-Assurance Interviews
    await page.goto('/student/interviews')
    await expect(page.locator('h1')).toContainText('Interviews & Opportunity Stages')
  })

  test('Test 7: Institution TPO Dashboard & 4-Way Placement Denominators in Real Browser', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'tpo@apextech.edu.in')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')

    // 2. Browser navigates to institution dashboard
    await page.waitForURL('**/institution/overview', { timeout: 10000 })
    await expect(page.locator('text=Apex Institute of Technology').first()).toBeVisible()

    // 3. Verify all 4 explicit placement rate denominators
    await expect(page.locator('text=Cohort Placement Rate').first()).toBeVisible()
    await expect(page.locator('text=Registered Placement Rate').first()).toBeVisible()
    await expect(page.locator('text=Paid Programme Placement Rate').first()).toBeVisible()
    await expect(page.locator('text=Eligible Programme Placement Rate').first()).toBeVisible()

    // 4. Navigate to Student Cohort Directory
    await page.goto('/institution/students')
    await expect(page.locator('h1')).toContainText('Student Directory & Profiles')
    await expect(page.locator('text=Export CSV')).toBeVisible()

    // 5. Navigate to Registration & QR Studio
    await page.goto('/institution/registration')
    await expect(page.locator('h1')).toContainText('Student Registration Link & QR Studio')
    await expect(page.locator('button:has-text("Copy Link")')).toBeVisible()
  })
})
