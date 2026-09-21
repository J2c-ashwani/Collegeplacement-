import { test, expect } from '@playwright/test'

test.describe('Expansion Tracks Browser Acceptance Journeys', () => {
  test('Test 1: Health Check & Production Security Headers', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('ok')
    expect(data.timestamp).toBeDefined()
    // Verify zero technical leaks
    expect(data.database).toBeUndefined()
    expect(data.latencyMs).toBeUndefined()

    // Verify security headers
    const headers = response.headers()
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
  })

  test('Test 2: Public Verifiable Credential Page with Privacy Controls', async ({ page }) => {
    // Visit public verification route
    await page.goto('/verify/STU-2026-000182')

    // Verify verified badge and candidate name
    await expect(page.locator('h1')).toContainText('Official PlacementConnect Verification')
    await expect(page.locator('text=Verified & Active Credential')).toBeVisible()
    await expect(page.locator('text=Recipient').first()).toBeVisible()

    // Verify LinkedIn Add-to-Profile button exists with legitimate URL
    const linkedinBtn = page.locator('a:has-text("Add credential to LinkedIn profile")')
    await expect(linkedinBtn).toBeVisible()
    const href = await linkedinBtn.getAttribute('href')
    expect(href).toContain('linkedin.com/profile/add')
    expect(href).toContain('PlacementConnect')

    // Verify privacy safeguard notice
    await expect(page.locator('text=Privacy Safeguard & Data Redaction Notice')).toBeVisible()
  })

  test('Test 3: Institutional Placement Evidence Center & Gap Tracker', async ({ page }) => {
    // Login as TPO
    await page.goto('/login')
    await page.fill('input[name="email"]', 'tpo@apextech.edu.in')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/institution/overview', { timeout: 10000 })

    await page.goto('/institution/placements')

    // Verify renamed supporting documentation title
    await expect(page.locator('h1')).toContainText('Placement Evidence & Supporting Records')
    await expect(page.locator('text=NAAC / NIRF Supporting Documentation')).toBeVisible()

    // Verify Proactive Documentation Gap Tracker Widget
    await expect(page.locator('text=Documentation Gap Tracker')).toBeVisible()
    await expect(page.locator('text=Accreditation Supporting Record Verification')).toBeVisible()
    await expect(page.locator('text=Missing Offers')).toBeVisible()
    await expect(page.locator('text=Pending Joinings')).toBeVisible()

    // Verify Download Evidence CSV button
    await expect(page.locator('text=Download Placement Evidence (CSV)')).toBeVisible()
  })

  test('Test 4: Employer Cluster Mega-Drive Slot Coordinator', async ({ page }) => {
    // Login as Employer
    await page.goto('/login')
    await page.fill('input[name="email"]', 'recruiter@techcorp.example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/employer/overview', { timeout: 10000 })

    await page.goto('/employer/interviews')

    // Verify Mega-Drive slot coordinator
    await expect(page.locator('text=Cluster Mega-Drive Slot Coordinator')).toBeVisible()
    await expect(page.locator('text=Configurable Interview Capacity Calculator')).toBeVisible()

    // Verify live capacity numbers
    await expect(page.locator('text=Total Capacity')).toBeVisible()
    await expect(page.locator('text=Active Mega-Drive Slot Ledger')).toBeVisible()

    // Verify status badges and quota ledger
    await expect(page.locator('text=Attended').first()).toBeVisible()
    await expect(page.locator('text=No-Show').first()).toBeVisible()
    await expect(page.locator('text=Emp. Cancelled').first()).toBeVisible()
  })


  test('Test 5: Student Mega-Drive Available Slot Claim Banner', async ({ page }) => {
    // Login as Student
    await page.goto('/login')
    await page.fill('input[name="email"]', 'aarav.sharma@apextech.edu.in')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/student/dashboard', { timeout: 10000 })

    await page.goto('/student/interviews')

    // Verify available cluster mega drive slot banner
    await expect(page.locator('text=Cluster Mega-Drive Live')).toBeVisible()
    await expect(page.locator('button:has-text("Claim Interview Slot")')).toBeVisible()
    await expect(page.locator('text=Assurance Rule:')).toBeVisible()
  })
})

