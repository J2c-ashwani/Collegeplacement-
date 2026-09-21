# PlacementConnect — Feature Inventory

This document provides a forensic inventory of every feature in the PlacementConnect codebase, classifying its end-to-end integration status prior to PostgreSQL/Supabase migration.

## Integration Status Classification Key

- `FULLY_CONNECTED`: Complete end-to-end path (`UI → Action → API/Action → Auth → Validation → Service → DB → Persistence → UI Update`).
- `PARTIALLY_CONNECTED`: End-to-end path exists but has gaps (e.g. simulation in UI, missing transactions, or incomplete error recovery).
- `FRONTEND_ONLY`: UI and client state exist, but actions simulate mutations without database persistence.
- `BACKEND_ONLY`: API, service, and DB models exist, but no frontend component or user flow invokes them.
- `MOCKED`: UI displays hardcoded dummy data or fake counters instead of querying live database records.
- `DORMANT`: Feature is partially built or behind unexposed routes with no navigation or entry point.
- `ORPHANED`: API or service has zero callers in the active application.
- `BROKEN`: Code contains runtime flaws, foreign key crashes, or data isolation violations.
- `DUPLICATED`: Redundant implementations of the same business rule or capability.
- `DEPRECATED`: Superseded legacy code.
- `UNKNOWN`: Unverified.

---

## Complete Feature Matrix

| Feature | UI Route | Component | API Endpoint | Service Layer | DB Model(s) | Tests | Initial Audit Status | Remediated Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Marketing & SEO** | `/`, `/for-colleges`, `/for-students`, `/for-employers`, `/placement-assurance`, `/faqs`, `/contact`, `/terms`, `/privacy` | Server Components, Header, Footer | None | None | None | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Public Credential Verification** | `/verify/[id]` | Public verify page | None (Direct DB read) | `storage.service.ts` | `Student`, `StudentBadge`, `Badge`, `Institution` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Public Registration Link Guard** | `/register/[code]` | Dynamic page | `/api/register/[code]` | None | `Institution`, `InstitutionMembership` | E2E Playwright, Unit | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Student Institutional Enrolment** | `/register/[code]` | `student-register-form.tsx` | `/api/students` (POST) | None | `User`, `Student`, `StudentProfile`, `RosterStudent`, `AuditLog` | E2E Playwright, Vitest | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Authentication & RBAC** | `/login`, `/register` | Login form, Register form | `/api/auth/[...nextauth]`, `/api/auth/register` | `auth.ts`, `auth-utils.ts` | `User`, `Session`, `VerificationToken` | E2E Playwright, Vitest | `PARTIALLY_CONNECTED` (Missing `employerId` in session) | `FULLY_CONNECTED` |
| **Password Reset & Email Verification** | N/A (Direct API) | None | `/api/auth/verify-email`, `forgot-password`, `reset-password` | `auth-utils.ts` | `VerificationToken`, `User` | None | `ORPHANED` | `ORPHANED` (API ready for future UI) |
| **Order Creation (Server-Side Pricing)** | Embedded in payment flows | Checkout button | `/api/payments/create-order` (POST) | `payment.service.ts` | `Order`, `InstitutionPlan`, `ProgrammePlan`, `EmployerFee`, `Coupon` | Vitest, E2E | `BACKEND_ONLY` (API tested, UI checkout modal missing) | `FULLY_CONNECTED` |
| **Payment Verification & Activation** | Embedded in checkout callback | Verification handler | `/api/payments/verify` (POST) | `payment.service.ts` | `Payment`, `Order`, `Invoice`, `StudentProgramme`, `InstitutionMembership`, `EmployerFee` | Vitest | `PARTIALLY_CONNECTED` (Non-transactional, risk of partial failure) | `FULLY_CONNECTED` |
| **Razorpay Webhook Processing** | `/api/webhooks/razorpay` | None | `/api/webhooks/razorpay` (POST) | `payment.service.ts` | `Order` | E2E Playwright, Vitest | `BROKEN` (Did not activate programmes on `payment.captured`) | `FULLY_CONNECTED` |
| **Student Dashboard** | `/student/dashboard` | Student Overview | Server Component direct DB read | None | `Student`, `StudentProgramme`, `StudentAssessment`, `AssuranceOpportunity`, `Badge` | E2E Playwright | `PARTIALLY_CONNECTED` (Fell back to `prisma.student.findFirst()`) | `FULLY_CONNECTED` |
| **9-Dimension Diagnostic Runner** | `/student/assessment` | `assessment-runner.tsx` | `/api/assessments/submit` (POST), `/api/assessments/questions` (GET) | Scoring algorithms | `AssessmentQuestion`, `StudentAssessment`, `AssessmentAnswer`, `AssessmentResult`, `StudentBadge` | Vitest | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Diagnostic Scorecard & Percentile** | `/student/score` | Scorecard View | Server Component direct DB read | None | `StudentAssessment`, `AssessmentResult` | E2E Playwright | `PARTIALLY_CONNECTED` (Mock score fallbacks `?? 82`) | `FULLY_CONNECTED` |
| **Student Badges Wallet** | `/student/badges` | Badges View | Server Component direct DB read | None | `Badge`, `StudentBadge` | E2E Playwright | `PARTIALLY_CONNECTED` (Fell back to `prisma.student.findFirst()`) | `FULLY_CONNECTED` |
| **Job Catalog & Match Scoring** | `/student/jobs` | Job Card Grid | `/api/jobs` (GET) | `matching.service.ts` | `Job`, `Employer`, `StudentProfile`, `AssessmentResult` | Vitest | `PARTIALLY_CONNECTED` (No 1-click apply; apply button only routed to `/student/interviews`) | `FULLY_CONNECTED` |
| **Student Job Applications Pipeline** | `/student/applications` | `student-applications-table.tsx` | Missing `/api/applications` | None | `Application`, `Job`, `Employer` | None | `FRONTEND_ONLY` (Fell back to mock TechCorp/CloudNova apps) | `FULLY_CONNECTED` |
| **3-Interview Assurance Quota Tracker** | `/student/interviews`, `/student/dashboard` | Opportunity Timeline | `/api/opportunities` (GET) | None | `StudentProgramme`, `AssuranceOpportunity`, `Interview` | Vitest, E2E | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Student Digital Document Vault** | `/student/documents` | `student-documents-vault.tsx` | `/api/documents` (GET, POST) | `storage.service.ts` | `Document`, `DocumentAccessLog` | E2E Playwright | `FRONTEND_ONLY` (Simulated upload via `handleUploadSimulate`, leaked Aarav Sharma docs) | `FULLY_CONNECTED` |
| **Student Profile & Employer Consent** | `/student/profile` | Profile Form | Server Component direct DB read | None | `StudentProfile`, `Student` | Vitest | `PARTIALLY_CONNECTED` (Fell back to `prisma.student.findFirst()`) | `FULLY_CONNECTED` |
| **Student Offers & Placement Acceptance** | `/student/offers` | Offers View | Server Component direct DB read | None | `Offer`, `Placement`, `Document` | E2E Playwright | `PARTIALLY_CONNECTED` (Fell back to `prisma.student.findFirst()`) | `FULLY_CONNECTED` |
| **Institution TPO Overview & 4 Denominators** | `/institution/overview` | KPI Cards & Funnel | Server Component direct DB read | None | `Institution`, `InstitutionRoster`, `Student`, `StudentAssessment`, `Placement` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Institution Student Directory** | `/institution/students` | `student-directory-table.tsx` | Server Component direct DB read | None | `Student`, `User`, `StudentProfile`, `StudentAssessment` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Institution Registration & QR Studio** | `/institution/registration` | `qr-code-studio.tsx` | `/api/institutions/[id]/qr` (GET) | None | `Institution`, `InstitutionRoster` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Institution Evidence Center & Gap Tracker** | `/institution/placements` | Evidence View | `/api/institutions/[id]/evidence-export` (GET) | None | `Placement`, `Offer`, `Student`, `Employer` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Institution Campus Recruitment Drives** | `/institution/drives` | `institution-drives-table.tsx` | Server Component direct DB read | None | `Job`, `Employer`, `Application` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Institution Corporate MOUs & Activity Log** | `/institution/mous` | `institution-mous-table.tsx` | Server Component direct DB read | None | `MOU`, `InstitutionActivity` | E2E Playwright | `MOCKED` (Fallback mock records `mou-apex-01` when empty) | `FULLY_CONNECTED` |
| **Institution Placement & CTC Reports** | `/institution/reports` | Analytics View | Server Component direct DB read | None | `Placement`, `Job`, `Student` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Employer Overview & Recruitment Velocity** | `/employer/overview` | Pipeline Funnel | Server Component direct DB read | None | `Job`, `Application`, `Interview`, `Offer`, `Placement` | E2E Playwright | `BROKEN` (Cross-tenant leak via `prisma.employer.findFirst()`) | `FULLY_CONNECTED` |
| **Employer Job Requisition Manager** | `/employer/jobs` | `job-posting-manager.tsx` | `/api/jobs` (POST, GET) | None | `Job`, `Employer` | None | `FRONTEND_ONLY` (Simulated vacancy creation in React state) | `FULLY_CONNECTED` |
| **Employer Candidate Sourcing & Shortlist** | `/employer/candidates` | `candidate-pipeline-table.tsx` | `/api/opportunities` (POST) | `matching.service.ts` | `Student`, `StudentProfile`, `AssessmentResult`, `Badge` | E2E Playwright | `FRONTEND_ONLY` (Simulated scheduling in React state, ignored `employerVisibilityConsent`) | `FULLY_CONNECTED` |
| **Employer Mega-Drive Slot Coordinator** | `/employer/interviews` | `mega-drive-slot-coordinator.tsx` | Direct service invocation | `mega-drive.service.ts` | `Job`, `Interview`, `AssuranceOpportunity` | Vitest, E2E | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Employer Offers & Verification** | `/employer/offers` | Offers Manager | `/api/offers` (POST) | None | `Offer`, `Job`, `Student` | Vitest | `BACKEND_ONLY` (API built, UI lacked submission form) | `FULLY_CONNECTED` |
| **Employer Agreement-Based Invoicing** | `/employer/invoices` | `employer-invoices-table.tsx` | `/api/employer-fees` (GET) | None | `EmployerFee`, `EmployerFeeRule`, `Invoice` | E2E Playwright | `MOCKED` (Fell back to mock invoices `INV-2026-001`) | `FULLY_CONNECTED` |
| **Employer Corporate Identity Profile** | `/employer/profile` | `employer-profile-form.tsx` | Missing `/api/employer-profile` | None | `Employer`, `EmployerUser` | E2E Playwright | `FRONTEND_ONLY` (Simulated save via `setTimeout`) | `FULLY_CONNECTED` |
| **Admin Overview & Growth Control Tower** | `/admin/overview` | `growth-control-tower.tsx` | Server Component direct DB read | `capacity.service.ts` | All primary models | Vitest, E2E | `MOCKED` (Fell back to `20` students and `₹12.5L` fake revenue) | `FULLY_CONNECTED` |
| **Admin Partner Colleges Management** | `/admin/institutions` | Institutions Directory | `/api/institutions` (GET, POST) | None | `Institution`, `InstitutionMembership`, `InstitutionPlan` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Admin Platform Student Directory** | `/admin/students` | `admin-student-directory.tsx` | Server Component direct DB read | None | `Student`, `User`, `StudentProgramme`, `StudentAssessment` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Admin Corporate Employer Directory** | `/admin/employers` | `admin-employer-directory.tsx` | Server Component direct DB read | None | `Employer`, `Job`, `EmployerFee` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Admin Platform Jobs Catalog** | `/admin/jobs` | `admin-jobs-directory.tsx` | Server Component direct DB read | None | `Job`, `Employer`, `Application` | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Admin Placement & Billing Audit** | `/admin/placements` | Placements Ledger | `/api/placements` (GET, POST, PATCH) | None | `Placement`, `Offer`, `EmployerFee` | Vitest, E2E | `BROKEN` (Foreign key crash on non-seeded employer placement confirmation) | `FULLY_CONNECTED` |
| **Admin Immutable Audit Log Viewer** | `/admin/audit-logs` | `admin-audit-table.tsx` | Direct DB read | `audit-logger.ts` | `AuditLog`, `User` | E2E Playwright | `MOCKED` (Fell back to `log-boot-1` dummy records when empty) | `FULLY_CONNECTED` |
| **Admin Global Configuration Console** | `/admin/settings` | `admin-settings-form.tsx` | Missing `/api/admin/settings` | None | `Setting` | E2E Playwright | `FRONTEND_ONLY` (Simulated save via `setTimeout`) | `FULLY_CONNECTED` |
| **Global Command Palette (`Cmd + K`)** | Header & Global Shortcut | `command-palette.tsx` | None | None | None | E2E Playwright | `PARTIALLY_CONNECTED` (Hardcoded Aarav Sharma preview, lacks role-based command hiding) | `FULLY_CONNECTED` |
| **Slide-Over Notification Center** | Header Bell Icon | `notification-drawer.tsx` | Missing `/api/notifications` | None | `Notification` | E2E Playwright | `FRONTEND_ONLY` (Hardcoded `INITIAL_NOTIFICATIONS` in memory) | `FULLY_CONNECTED` |
| **Enterprise Data Table Standard** | All directory pages | `enterprise-data-table.tsx` | None (Client table engine) | None | None | E2E Playwright | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Audit Logging Infrastructure** | Platform-wide | None | None | `audit.service.ts` vs `audit-logger.ts` | `AuditLog` | Vitest | `DUPLICATED` (Two separate audit log implementations) | `FULLY_CONNECTED` |
| **Health Probe & Telemetry** | `/api/health` | None | `/api/health` (GET) | None | Database connection ping | Vitest, E2E | `FULLY_CONNECTED` | `FULLY_CONNECTED` |
| **Roster Bulk CSV Import** | Direct API / TPO | None | `/api/roster/import` (POST) | None | `InstitutionRoster`, `RosterStudent` | Vitest | `BACKEND_ONLY` (API built and tested, no UI file-drop component) | `FULLY_CONNECTED` |
