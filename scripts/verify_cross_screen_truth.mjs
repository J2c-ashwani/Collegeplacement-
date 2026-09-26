import { chromium } from 'playwright';
import { encode } from 'next-auth/jwt';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = '/Users/ashwanikumar/Documents/antigravity/joyful-nobel/placementconnect';
const ARTIFACT_DIR = '/Users/ashwanikumar/.gemini/antigravity/brain/c2546591-f352-4b88-aeb1-4daf5aa51f51';
const DOWNLOADS_DIR = '/Users/ashwanikumar/Downloads';
const PACKAGE_DIR = path.join(DOWNLOADS_DIR, 'PlacementConnect_Final_Review_Package');
const PORT = 3439;
const BASE_URL = `http://localhost:${PORT}`;

function getAuthSecret() {
  const envPath = path.join(WORKSPACE_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^(?:AUTH_SECRET|NEXTAUTH_SECRET)=["']?([^"'\r\n]+)["']?/m);
    if (match) return match[1];
  }
  return 'super-secret-nextauth-token-for-placementconnect-2026';
}

async function mintCookie(secret, payload) {
  return await encode({
    token: {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    },
    secret,
    salt: 'authjs.session-token',
  });
}

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 307 || res.status === 302) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server did not start at ${url}`);
}

async function run() {
  fs.mkdirSync(PACKAGE_DIR, { recursive: true });
  console.log('Starting Next.js production server for Cross-Screen Truth Verification...');
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: WORKSPACE_DIR,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'ignore',
  });

  try {
    await waitForServer(`${BASE_URL}/login`);
    const secret = getAuthSecret();

    const tokens = {
      STUDENT: await mintCookie(secret, {
        id: 'usr-student-apex-01',
        sub: 'usr-student-apex-01',
        name: 'Aarav Sharma',
        email: 'student1@apex.edu.in',
        role: 'STUDENT',
        studentId: 'stu-apex-2026-01',
      }),
      INSTITUTION_ADMIN: await mintCookie(secret, {
        id: 'usr-tpo-apex-01',
        sub: 'usr-tpo-apex-01',
        name: 'Prof. S. Venkataraman',
        email: 'tpo@apex.edu.in',
        role: 'INSTITUTION_ADMIN',
        institutionId: 'inst-apex-2026',
      }),
      EMPLOYER: await mintCookie(secret, {
        id: 'usr-emp-nexa-01',
        sub: 'usr-emp-nexa-01',
        name: 'Vikramaditya Rao',
        email: 'vikram.rao@nexatech.io',
        role: 'EMPLOYER',
        employerId: 'emp-nexatech-2026',
      }),
    };

    const browser = await chromium.launch({ headless: true });

    // Step 1: Automated Cross-Screen Single-Truth Assertions
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
    console.log('✓ Assertion Passed: /employer/interviews has explicit 0-100 rubric boundaries and 6-gate checklist.');

    // C. Student Interviews View
    const stuIvContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await stuIvContext.addCookies([
      { name: 'authjs.session-token', value: tokens.STUDENT, domain: 'localhost', path: '/' },
    ]);
    const stuIvPage = await stuIvContext.newPage();
    await stuIvPage.goto(`${BASE_URL}/student/interviews`, { waitUntil: 'networkidle' });
    const stuIvText = await stuIvPage.innerText('body');

    if (!stuIvText.includes('30 Sep 2026') || !stuIvText.includes('03 Oct 2026')) {
      throw new Error('Assertion Failed: /student/interviews dates do not match canonical graph (30 Sep / 03 Oct)');
    }
    if (stuIvText.includes('28 Sep 2026')) {
      throw new Error('Assertion Failed: /student/interviews still contains old 28 Sep date');
    }
    console.log('✓ Assertion Passed: /student/interviews displays the exact same canonical dates (30 Sep & 03 Oct).');

    // D. TPO Students View
    const tpoContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await tpoContext.addCookies([
      { name: 'authjs.session-token', value: tokens.INSTITUTION_ADMIN, domain: 'localhost', path: '/' },
    ]);
    const tpoPage = await tpoContext.newPage();
    await tpoPage.goto(`${BASE_URL}/institution/students`, { waitUntil: 'networkidle' });
    const tpoText = await tpoPage.innerText('body');

    if (!tpoText.includes('30 Sep 2026') || !tpoText.includes('03 Oct 2026')) {
      throw new Error('Assertion Failed: /institution/students dates do not match canonical graph');
    }
    if (tpoText.includes('28 Sep 2026')) {
      throw new Error('Assertion Failed: /institution/students still contains old 28 Sep date');
    }
    console.log('✓ Assertion Passed: /institution/students displays the exact same canonical dates (30 Sep & 03 Oct).');

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
