# PlacementConnect — Audit Remediation Plan

This remediation plan categorizes every finding from the forensic audit by architectural severity (P0, P1, P2, P3), specifying the root cause, expected behavior, remediation code fix, and verification test.

---

## P0 — Critical Issues (Security, Isolation, Financial & Data Integrity)

### AUD-P0-01: Employer Cross-Tenant Data Leakage via `findFirst()` Fallback
- **Severity**: `P0`
- **Affected Files**: `src/types/next-auth.d.ts`, `src/lib/auth.ts`, `src/lib/auth.config.ts`, `src/app/(dashboard)/employer/*`
- **Problem**: NextAuth Session type only exposed `institutionId`. For `EMPLOYER` users, `employerId` was never attached to the JWT/Session. Consequently, 5 employer pages (`invoices`, `offers`, `overview`, `interviews`, `jobs`) checked `session.user.institutionId` (which was null) and fell back to `prisma.employer.findFirst()`, displaying the first employer's confidential candidate lists and invoices to any logged-in recruiter.
- **Fix**:
  1. Add `employerId: string | null` to `Session`, `User`, and `JWT` interfaces.
  2. Update `auth.ts` credentials provider to query `user.employerUsers` and attach `employerId` to user token.
  3. Replace all `prisma.employer.findFirst()` fallbacks in employer pages with strict `session.user.employerId` scoping, rendering an empty profile onboarding state if no employer is linked.
- **Verification**: Multi-tenant isolation test asserting Recruiter B cannot see Recruiter A's jobs or invoices.
- **Status**: `REMEDIATING`

### AUD-P0-02: Student Data Leakage via `findFirst()` Fallback
- **Severity**: `P0`
- **Affected Files**: 8 student workspace pages (`badges`, `interviews`, `dashboard`, `jobs`, `assessment`, `offers`, `score`, `profile`)
- **Problem**: In all 8 student pages, if `student` for the logged-in user was null (e.g. an admin previewing or a new user), the page fell back to `prisma.student.findFirst()`, displaying Aarav Sharma's private employability subscores, test answers, interview links, and job offers. Furthermore, `student/documents` and `student/applications` displayed hardcoded dummy records when records were empty.
- **Fix**:
  1. Eliminate all `prisma.student.findFirst()` fallbacks in student pages.
  2. If student profile is missing, render an actionable onboarding state prompting enrolment via the college link.
  3. Replace dummy fallback arrays with genuine empty states.
- **Verification**: Playwright test logging in with a new non-enrolled user asserting zero Aarav Sharma records leak.
- **Status**: `REMEDIATING`

### AUD-P0-03: Financial Partial Failure & Non-Transactional Webhook Activation
- **Severity**: `P0`
- **Affected Files**: `src/app/api/payments/verify/route.ts`, `src/app/api/webhooks/razorpay/route.ts`, `src/services/payment.service.ts`
- **Problem**:
  1. `payments/verify` performed payment capture, order status transition, invoice generation, and student programme activation in non-transactional sequential queries. If an error occurred mid-sequence, the customer was charged without their programme being activated.
  2. In `webhooks/razorpay`, when `payment.captured` event arrived, it updated `order.status = 'PAID'` but NEVER activated the student programme or institution membership. If the student closed the tab before redirecting, they were charged but left in `PAYMENT_PENDING`.
- **Fix**:
  1. Create `activateOrderPayment()` in `src/services/payment.service.ts` wrapped in an atomic `prisma.$transaction`.
  2. Call `activateOrderPayment()` from both `payments/verify` and `webhooks/razorpay` to guarantee idempotent, atomic activation.
- **Verification**: Vitest automated transaction test and duplicate webhook test.
- **Status**: `REMEDIATING`

---

## P1 — High Issues (Broken Workflows, Disconnected APIs & Telemetry)

### AUD-P1-01: Foreign Key Constraint Crash on Placement Confirmation
- **Severity**: `P1`
- **Affected Files**: `src/app/api/placements/route.ts`
- **Problem**: When confirming a placement for an employer without a custom `EmployerFeeRule`, line 145 assigned `employerFeeRuleId: feeRule?.id || 'fee-rule-${offer.employerId}'`. Because that ID does not exist in the database, PostgreSQL threw a foreign key violation, aborting placement confirmation.
- **Fix**: Wrap placement confirmation in `prisma.$transaction`. Look up the platform default fee rule (`where: { employerId: null, isActive: true }`), or upsert a valid default fee rule before inserting the `EmployerFee`.
- **Verification**: Vitest placement workflow test for newly registered non-seeded employers.
- **Status**: `REMEDIATING`

### AUD-P1-02: Missing Job Application Pipeline
- **Severity**: `P1`
- **Affected Files**: `src/app/api/applications/route.ts` (NEW), `src/app/(dashboard)/student/jobs/page.tsx`
- **Problem**: There was NO API route for students to apply for jobs. On `/student/jobs`, the button only navigated to `/student/interviews`. `prisma.application.create` only existed in a test file, leaving `/student/applications` empty.
- **Fix**:
  1. Implement `src/app/api/applications/route.ts` (POST to apply, GET to list).
  2. Add 1-Click Apply button on `/student/jobs` calling `POST /api/applications`.
  3. Ensure application creation checks eligibility, avoids duplicate applications, and creates audit logs.
- **Verification**: Playwright test applying for a job and asserting it appears in `/student/applications`.
- **Status**: `REMEDIATING`

### AUD-P1-03: Frontend Mutations Disconnected from Existing APIs
- **Severity**: `P1`
- **Affected Files**: `job-posting-manager.tsx`, `candidate-pipeline-table.tsx`, `student-documents-vault.tsx`
- **Problem**:
  - `JobPostingManager`: Simulated job creation in React state without calling `POST /api/jobs`.
  - `CandidatePipelineTable`: Simulated interview scheduling in React state without calling `POST /api/opportunities`.
  - `StudentDocumentsVault`: Simulated uploads via `handleUploadSimulate` without calling `POST /api/documents`.
- **Fix**: Wire all three client components to call their respective existing backend APIs with real payloads and state reconciliation.
- **Verification**: Playwright and Vitest tests asserting database records persist after UI actions.
- **Status**: `REMEDIATING`

### AUD-P1-04: Simulated Saves in Recruiter Profile & Admin Settings Forms
- **Severity**: `P1`
- **Affected Files**: `employer-profile-form.tsx`, `admin-settings-form.tsx`
- **Problem**: Both forms used `setTimeout` to simulate saving without persisting to `Employer` or `Setting` models.
- **Fix**: Implement API handlers (`/api/employer-profile` and `/api/admin/settings`) and connect the forms.
- **Verification**: Test asserting settings and profile updates persist in PostgreSQL.
- **Status**: `REMEDIATING`

### AUD-P1-05: Missing Notification API & Mocked Drawer
- **Severity**: `P1`
- **Affected Files**: `src/app/api/notifications/route.ts` (NEW), `src/components/layout/notification-drawer.tsx`
- **Problem**: The notification drawer operated on static in-memory notifications with no backend API to fetch user notifications or mark them read.
- **Fix**: Create `/api/notifications` (GET, PATCH) and connect `notification-drawer.tsx`.
- **Verification**: Test fetching notifications and marking them as read.
- **Status**: `REMEDIATING`

### AUD-P1-06: Hardcoded Fallback Numbers in Admin Overview
- **Severity**: `P1`
- **Affected Files**: `src/app/(dashboard)/admin/overview/page.tsx`
- **Problem**: When real counts were 0, code defaulted to `paidStudentCount: 20`, `totalOpenings: 12`, and revenue `₹12.5L`.
- **Fix**: Display actual computed numbers (`0` students, `0` openings, `₹0.0L` revenue) and ensure `calculateCapacityMetrics` handles 0 students safely.
- **Verification**: Verify Admin Overview shows true database numbers.
- **Status**: `REMEDIATING`

---

## P2 — Medium Issues (Duplicate Implementations & RBAC Enhancements)

### AUD-P2-01: Duplicate Audit Logging Services
- **Severity**: `P2`
- **Affected Files**: `src/lib/audit-logger.ts`, `src/services/audit.service.ts`
- **Fix**: Consolidate both into a single authoritative audit service.
- **Status**: `REMEDIATING`

### AUD-P2-02: Role-Based Action Hiding in Command Palette
- **Severity**: `P2`
- **Affected Files**: `src/components/layout/command-palette.tsx`
- **Fix**: Filter command groups by `session.user.role` so students don't see admin operational shortcuts. Replace hardcoded Aarav Sharma preview with user-scoped or search-driven action.
- **Status**: `REMEDIATING`

### AUD-P2-03: Employer Sourcing Visibility Consent Filter
- **Severity**: `P2`
- **Affected Files**: `src/app/(dashboard)/employer/candidates/page.tsx`
- **Fix**: Filter candidates to include only students who have `profile.employerVisibilityConsent: true`.
- **Status**: `REMEDIATING`

---

## P3 — Low Issues (Code Cleanup & Minor Deprecations)

### AUD-P3-01: Legacy Data Table Deprecation
- **Severity**: `P3`
- **Affected Files**: `src/components/dashboard/data-table.tsx`
- **Fix**: Deprecate in favor of `enterprise-data-table.tsx`.
- **Status**: `REMEDIATING`
