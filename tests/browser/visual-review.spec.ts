import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const SCREENSHOT_DIR = '/Users/ashwanikumar/.gemini/antigravity/brain/ee878678-be73-4c43-b334-ca6d944bbb6e/screenshots'

test.describe('Track 6: Executive Visual Acceptance Review — 1440px Viewport', () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
    }
  })

  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test.use({
    viewport: { width: 1440, height: 900 },
  })

  test('Capture Screen 1: Public Homepage (/)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01_public_landing_1440px.png'),
      fullPage: false,
    })
  })

  test('Capture Screen 2: GrowthOS Command Center (/admin/growth)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@placementconnect.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/admin/overview', { timeout: 10000 })

    await page.goto('/admin/growth')
    await expect(page.locator('text=GrowthOS Command Center')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02_admin_growth_1440px.png'),
      fullPage: false,
    })
  })

  test('Capture Screen 3: Institution / TPO Command Center (/institution/overview)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'tpo@apextech.edu.in')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/institution/overview', { timeout: 10000 })

    await expect(page.locator('text=Placement Command Center')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03_institution_overview_1440px.png'),
      fullPage: false,
    })
  })

  test('Capture Screen 4: Employer Command Center (/employer/overview)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'recruiter@techcorp.example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/employer/overview', { timeout: 10000 })

    await expect(page.locator('text=Recruiter Command Center')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04_employer_overview_1440px.png'),
      fullPage: false,
    })
  })

  test('Capture Screen 5: Student Career Launchpad (/student/dashboard)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'aarav.sharma@apextech.edu.in')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/student/dashboard', { timeout: 10000 })

    await expect(page.locator('text=Career Launchpad')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05_student_dashboard_1440px.png'),
      fullPage: false,
    })
  })
})
