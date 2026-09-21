import { test, expect } from '@playwright/test'

test.describe('GrowthOS AI Marketplace Intelligence & Liquidity Verification', () => {
  test('Test 1: GrowthOS Security Isolation — Non-Admin Access Denied', async ({ request }) => {
    // Attempt unauthenticated access to GrowthOS telemetry and CRM APIs
    const routes = [
      '/api/growth/command-center',
      '/api/growth/actions',
      '/api/growth/colleges',
      '/api/growth/employers',
      '/api/growth/sequences',
      '/api/growth/outreach',
    ]

    for (const route of routes) {
      const res = await request.get(route, {
        headers: { Accept: 'application/json' },
      })
      expect([401, 403]).toContain(res.status())
    }
  })

  test('Test 2: Admin Operations — GrowthOS Command Center & AI Action Queue', async ({ page }) => {
    // 1. Authenticate as Platform Operations Admin
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@placementconnect.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/admin/overview', { timeout: 10000 })

    // 2. Navigate to GrowthOS Control Tower
    await page.goto('/admin/growth')
    await expect(page.locator('text=GrowthOS Command Center')).toBeVisible()

    // 3. Verify Central Marketplace Numbers
    await expect(page.locator('text=Assurance Coverage').first()).toBeVisible()
    await expect(page.locator('text=Employer Capacity').first()).toBeVisible()
    await expect(page.locator('text=Enrolled Student Supply')).toBeVisible()
    await expect(page.locator('text=Action Queue').first()).toBeVisible()

    // 4. Verify CRM Workspaces
    await expect(page.locator('text=GrowthOS CRM Workspaces')).toBeVisible()
    await expect(page.locator('text=College Acquisition CRM').first()).toBeVisible()
    await expect(page.locator('text=Employer Demand CRM').first()).toBeVisible()

    // 5. Verify AI Prioritized Action Queue
    await expect(page.locator('text=Ranked AI Action Queue')).toBeVisible()
    const whyButton = page.locator('button:has-text("Why?")').first()
    if (await whyButton.isVisible()) {
      await whyButton.click()
      await expect(page.locator('text=AI Mathematical Justification: Why this action?')).toBeVisible()
      await expect(page.locator('text=Regional Capacity Gap:')).toBeVisible()
      await page.click('button:has-text("Close")')
    }

    // 6. Test Safe Action Bulk Approval
    const bulkSafeBtn = page.locator('button:has-text("Approve All Safe Actions")')
    if (await bulkSafeBtn.isVisible() && await bulkSafeBtn.isEnabled()) {
      await bulkSafeBtn.click()
    }
  })

  test('Test 3: College Acquisition CRM & 11-Dimension ICP Inspection', async ({ page }) => {
    // Authenticate
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@placementconnect.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/admin/overview', { timeout: 10000 })

    // Navigate to Colleges CRM
    await page.goto('/admin/growth/colleges')
    await expect(page.locator('text=College ICP Sourcing & Acquisition Pipeline')).toBeVisible()
    await expect(page.locator('text=Total Sourced')).toBeVisible()
    await expect(page.locator('text=High ICP Fit')).toBeVisible()

    // Inspect 11-D Breakdown on first prospect
    const breakdownBtn = page.locator('button:has-text("11-D Breakdown")').first()
    if (await breakdownBtn.isVisible()) {
      await breakdownBtn.click()
      await expect(page.locator('text=Deterministic 11-Dimension ICP Model')).toBeVisible()
      await page.keyboard.press('Escape')
    }

    // Inspect Sequence Enrollment Dialog
    const enrollBtn = page.locator('button:has-text("Enroll Sequence")').first()
    if (await enrollBtn.isVisible()) {
      await enrollBtn.click()
      await expect(page.locator('text=Enroll in Outreach Sequence')).toBeVisible()
      await page.click('button:has-text("Cancel")')
    }
  })

  test('Test 4: Employer Demand CRM & Assurance Capacity Pitch Generator', async ({ page }) => {
    // Authenticate
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@placementconnect.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/admin/overview', { timeout: 10000 })

    // Navigate to Employers CRM
    await page.goto('/admin/growth/employers')
    await expect(page.locator('text=Employer Sourcing & Interview Slot Acquisition')).toBeVisible()
    await expect(page.locator('text=Total Discovered')).toBeVisible()
    await expect(page.locator('text=Fresher Hiring Vol')).toBeVisible()

    // Open Assurance Pitch Generator
    const pitchBtn = page.locator('button:has-text("Assurance Pitch")').first()
    if (await pitchBtn.isVisible()) {
      await pitchBtn.click()
      await expect(page.locator('text=Assurance Capacity Pitch')).toBeVisible()
      await expect(page.locator('text=Zero Upfront Listing or Sourcing Fees')).toBeVisible()
      await page.click('button:has-text("Close")')
    }
  })

  test('Test 5: Outreach Vault, Human-in-the-Loop Approval & Reply Simulation', async ({ page }) => {
    // Authenticate
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@placementconnect.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/admin/overview', { timeout: 10000 })

    // Navigate to Outreach Vault
    await page.goto('/admin/growth/outreach')
    await expect(page.locator('text=Human-in-the-Loop Outreach & Cadence Vault')).toBeVisible()
    await expect(page.locator('text=Pending Drafts Queue')).toBeVisible()

    // Switch to Sequences tab
    await page.click('button:has-text("Active Sequences")')
    await expect(page.locator('text=Cadence Timeline').first()).toBeVisible()

    // Switch to Replies tab
    await page.click('button:has-text("Inbound Replies & AI Triage")')
    await expect(page.locator('text=Real-Time AI Reply Classification')).toBeVisible()

    // Switch to Suppression Registry tab
    await page.click('button:has-text("Suppression & DNC Registry")')
    await expect(page.getByRole('heading', { name: /Suppression.*Registry/i })).toBeVisible()
  })
})
