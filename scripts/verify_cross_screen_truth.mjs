import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const DOWNLOADS_DIR = '/Users/ashwanikumar/Downloads';
const PACKAGE_DIR = path.join(DOWNLOADS_DIR, 'PlacementConnect_Final_Review_Package');
const ARTIFACT_DIR = '/Users/ashwanikumar/.gemini/antigravity/brain/c2546591-f352-4b88-aeb1-4daf5aa51f51';

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/api/health`).catch(() => null);
      if (res && res.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  return false;
}

async function run() {
  console.log('Starting Next.js production server for Cross-Screen Truth Verification...');
  const server = spawn('npm', ['run', 'start', '--', '-p', '3000'], {
    cwd: '/Users/ashwanikumar/Documents/antigravity/joyful-nobel/placementconnect',
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000' },
  });

  try {
    const ready = await waitForServer(BASE_URL);
    if (!ready) {
      throw new Error('Server failed to start on port 3000 within timeout.');
    }

    const browser = await chromium.launch({ headless: true });

    // Acquire session tokens
    const tokens = {};
    for (const [role, email] of [
      ['STUDENT', 'aarav.sharma@apex.edu'],
      ['EMPLOYER', 'recruiter@nexatech.com'],
      ['INSTITUTION_ADMIN', 'tpo@apex.edu'],
    ]) {
      console.log(`Authenticating as ${role} (${email})...`);
      const loginContext = await browser.newContext();
      const loginPage = await loginContext.newPage();
      await loginPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
      await loginPage.fill('input[type="email"]', email);
      await loginPage.fill('input[type="password"]', 'Password@123');
      await loginPage.click('button[type="submit"]');
      try {
        await loginPage.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
      } catch (err) {
        const errEl = await loginPage.$('[role="alert"]');
        const errText = errEl ? await errEl.innerText() : 'No alert element found';
        console.error(`Login failed for ${role} (${email}). Page alert: "${errText}"`);
        throw err;
      }
      const cookies = await loginContext.cookies();
      const sessionCookie = cookies.find((c) => c.name.includes('session-token'));
      tokens[role] = sessionCookie ? sessionCookie.value : '';
      console.log(`✓ Authenticated ${role}. Token acquired.`);
      await loginContext.close();
    }

    console.log('Executing Cross-Screen Truth Assertions across Student, TPO and Recruiter...');

    // A. Recruiter Candidates View
    const empCandContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await empCandContext.addCookies([
      { name: 'authjs.session-token', value: tokens.EMPLOYER, domain: 'localhost', path: '/' },
    ]);
    const empCandPage = await empCandContext.newPage();
    await empCandPage.goto(`${BASE_URL}/employer/candidates`, { waitUntil: 'networkidle' });
    const empCandText = await empCandPage.innerText('body');

    // Assert: NexaTech R2 is 30 Sep, FinCore is 03 Oct, zero 28 Sep conflict
    if (!empCandText.includes('30 Sep 2026') || !empCandText.includes('14:30–15:30 IST')) {
      throw new Error('Assertion Failed: /employer/candidates missing canonical NexaTech Round 2 (30 Sep 2026 • 14:30–15:30 IST)');
    }
    if (!empCandText.includes('03 Oct 2026')) {
      throw new Error('Assertion Failed: /employer/candidates missing canonical FinCore Opportunity #2 date (03 Oct 2026)');
    }
    if (empCandText.includes('28 Sep 2026')) {
      throw new Error('Assertion Failed: /employer/candidates still contains old conflicting "28 Sep 2026" string');
    }
    if (empCandText.includes('Top 20%')) {
      throw new Error('Assertion Failed: /employer/candidates still contains ambiguous "Top 20%" label');
    }
    if (empCandText.includes('Professional Decor.')) {
      throw new Error('Assertion Failed: /employer/candidates still contains awkward "Professional Decor." label');
    }
    if (!empCandText.includes('Domain & Role Application') || !empCandText.includes('Professionalism')) {
      throw new Error('Assertion Failed: /employer/candidates missing canonical 9th dimension or Professionalism');
    }
    if (!empCandText.includes('Shortlist 5 for Round 2')) {
      throw new Error('Assertion Failed: /employer/candidates missing unambiguous "Shortlist 5 for Round 2" button');
    }
    if (!empCandText.includes('N = 14,820')) {
      throw new Error('Assertion Failed: /employer/candidates missing defensible percentile population (N = 14,820)');
    }
    console.log('✓ Assertion Passed: /employer/candidates is 100% reconciled to Canonical Assurance Graph.');

    // B. Recruiter Interviews View
    const empIvContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await empIvContext.addCookies([
      { name: 'authjs.session-token', value: tokens.EMPLOYER, domain: 'localhost', path: '/' },
    ]);
    const empIvPage = await empIvContext.newPage();
    await empIvPage.goto(`${BASE_URL}/employer/interviews`, { waitUntil: 'networkidle' });
    const empIvText = await empIvPage.innerText('body');
    const empIvUpper = empIvText.toUpperCase();
    if (!empIvUpper.includes('ALLOWED RANGE: 0–100') && !empIvUpper.includes('ALLOWED RANGE: 0-100')) {
      throw new Error('Assertion Failed: /employer/interviews missing explicit 0-100 rubric validation range');
    }
    if (!empIvUpper.includes('PRE-CERTIFICATION') || !empIvUpper.includes('GATES VERIFIED')) {
      throw new Error('Assertion Failed: /employer/interviews missing pre-certification checklist');
    }
    if (!empIvText.includes('30 Sep 2026') || !empIvText.includes('19 Sep 2026')) {
      throw new Error('Assertion Failed: /employer/interviews missing canonical dates for Aarav Sharma');
    }
    if (!empIvUpper.includes('ROUND 1 CERTIFIED: ATTENDED • EVALUATED • COMPLETED')) {
      throw new Error('Assertion Failed: /employer/interviews missing explicit Round 1 scope badge');
    }
    if (!empIvText.includes('Opportunity #1: IN PROGRESS — Round 2 Confirmed')) {
      throw new Error('Assertion Failed: /employer/interviews missing Model A Opportunity 1 In Progress indicator');
    }
    if (!empIvText.includes('Back to Shortlist Funnel')) {
      throw new Error('Assertion Failed: /employer/interviews missing concise Back to Shortlist Funnel link');
    }
    console.log('✓ Assertion Passed: /employer/interviews has explicit Round 1 scope and Model A opportunity state.');

    // C. Student Interviews View
    const stuIvContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await stuIvContext.addCookies([
      { name: 'authjs.session-token', value: tokens.STUDENT, domain: 'localhost', path: '/' },
    ]);
    const stuIvPage = await stuIvContext.newPage();
    await stuIvPage.goto(`${BASE_URL}/student/interviews`, { waitUntil: 'networkidle' });
    const stuIvText = await stuIvPage.innerText('body');

    if (stuIvText.includes('Invalid Date')) {
      throw new Error('Assertion Failed: /student/interviews still contains "Invalid Date"!');
    }
    if (stuIvText.includes('28 Sep 2026')) {
      throw new Error('Assertion Failed: /student/interviews still contains old 28 Sep date');
    }
    if (stuIvText.includes('Interview Rounds (2 Scheduled)')) {
      throw new Error('Assertion Failed: /student/interviews still contains erroneous "2 Scheduled" round count');
    }
    if (!stuIvText.includes('1 COMPLETED • 1 CONFIRMED')) {
      throw new Error('Assertion Failed: /student/interviews missing dynamic round breakdown "1 COMPLETED • 1 CONFIRMED"');
    }
    if (!stuIvText.includes('1 Active In Progress • 1 Scheduled • 1 In Matching Pipeline')) {
      throw new Error('Assertion Failed: /student/interviews missing Model A pipeline summary status');
    }
    if (!stuIvText.includes('Assurance Protection: Claiming reserves your slot immediately without deducting quota')) {
      throw new Error('Assertion Failed: /student/interviews missing unambiguous Mega-Drive quota protection copy');
    }
    if (!stuIvText.includes('30 Sep 2026') || !stuIvText.includes('03 Oct 2026')) {
      throw new Error('Assertion Failed: /student/interviews dates do not match canonical graph (30 Sep / 03 Oct)');
    }
    console.log('✓ Assertion Passed: /student/interviews has zero "Invalid Date", dynamic rounds, and Model A lifecycle.');

    // D. TPO Students View
    const tpoContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await tpoContext.addCookies([
      { name: 'authjs.session-token', value: tokens.INSTITUTION_ADMIN, domain: 'localhost', path: '/' },
    ]);
    const tpoPage = await tpoContext.newPage();
    await tpoPage.goto(`${BASE_URL}/institution/students`, { waitUntil: 'networkidle' });
    const tpoText = await tpoPage.innerText('body');

    if (tpoText.includes('Invalid Date')) {
      throw new Error('Assertion Failed: /institution/students contains "Invalid Date"!');
    }
    if (tpoText.includes('COMPLETED (COUNTED 1/3)')) {
      throw new Error('Assertion Failed: /institution/students still shows contradictory "COMPLETED (COUNTED 1/3)" for active Opportunity #1');
    }
    if (!tpoText.includes('STAGE 1: IN PROGRESS')) {
      throw new Error('Assertion Failed: /institution/students missing Model A "STAGE 1: IN PROGRESS" badge');
    }
    if (!tpoText.includes('INTERVIEWING (OPP #1 IN PROGRESS)')) {
      throw new Error('Assertion Failed: /institution/students roster table missing "INTERVIEWING (OPP #1 IN PROGRESS)" candidate status');
    }
    if (!tpoText.includes('PC-ASSESS-2026-v1')) {
      throw new Error('Assertion Failed: /institution/students missing assessment dataset version (PC-ASSESS-2026-v1)');
    }
    if (!tpoText.includes('30 Sep 2026') || !tpoText.includes('03 Oct 2026')) {
      throw new Error('Assertion Failed: /institution/students dates do not match canonical graph');
    }
    if (tpoText.includes('28 Sep 2026')) {
      throw new Error('Assertion Failed: /institution/students still contains old 28 Sep date');
    }
    console.log('✓ Assertion Passed: /institution/students displays Model A Opportunity #1 In Progress and dataset versioning.');

    // Step 2: Re-render updated PDFs and 1440px PNGs with intentional print pagination
    console.log('Re-exporting updated PDFs and PNGs into Downloads...');
    const exportTargets = [
      {
        prefix: '03a_recruiter_candidate_pool_shortlist_detail',
        page: empCandPage,
      },
      {
        prefix: '03b_recruiter_interview_scheduling_and_evaluation',
        page: empIvPage,
      },
      {
        prefix: '04_tpo_student_roster_and_aarav_sharma_detail',
        page: tpoPage,
      },
      {
        prefix: '06b_student_assurance_interviews_lifecycle',
        page: stuIvPage,
      },
    ];

    for (const t of exportTargets) {
      const pdfPkg = path.join(PACKAGE_DIR, `${t.prefix}.pdf`);
      const pdfDl = path.join(DOWNLOADS_DIR, `${t.prefix}.pdf`);
      const pdfArt = path.join(ARTIFACT_DIR, `${t.prefix}.pdf`);

      const pngFullPkg = path.join(PACKAGE_DIR, `${t.prefix}_full_1440px.png`);
      const pngFirstPkg = path.join(PACKAGE_DIR, `${t.prefix}_first_screen_1440px.png`);
      const pngFullArt = path.join(ARTIFACT_DIR, `${t.prefix}_full_1440px.png`);
      const pngFirstArt = path.join(ARTIFACT_DIR, `${t.prefix}_first_screen_1440px.png`);

      await t.page.pdf({
        path: pdfPkg,
        format: 'A4',
        printBackground: true,
        margin: { top: '8mm', bottom: '8mm', left: '6mm', right: '6mm' },
      });
      fs.copyFileSync(pdfPkg, pdfDl);
      fs.copyFileSync(pdfPkg, pdfArt);

      await t.page.screenshot({ path: pngFullPkg, fullPage: true });
      await t.page.screenshot({ path: pngFirstPkg, fullPage: false });
      fs.copyFileSync(pngFullPkg, pngFullArt);
      fs.copyFileSync(pngFirstPkg, pngFirstArt);
    }

    await browser.close();
    console.log('ALL CROSS-SCREEN TRUTH ASSERTIONS PASSED! Updated PDFs and PNGs exported to Downloads.');
  } finally {
    server.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error('Cross-Screen Truth Verification Failed:', err);
  process.exit(1);
});
