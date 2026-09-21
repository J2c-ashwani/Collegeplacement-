# PlacementConnect — Route-to-Backend Integration Matrix

This document provides a forensic audit of every UI page, layout, dynamic route, and API endpoint across the 12 required architectural integration dimensions.

---

## Part 1: Dashboard UI Pages (36 Pages)

| Route | Page Type | Renders? | Real Data? | Source Service / Method | DB Models Used | Persistence? | Mutation Works? | Error Handling? | Loading State? | Empty State? | Authorization (RBAC)? | Tenant Isolation? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin` & `/admin/overview` | Server Component | Yes | Yes (Partial) | `prisma.count()`, `capacity.service.ts` | `Institution`, `Student`, `Employer`, `Job`, `Placement`, `Order` | N/A (Read) | N/A | Server redirect | Suspense | Yes | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/institutions` | Server Component | Yes | Yes | `prisma.institution.findMany` | `Institution`, `InstitutionMembership` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/students` | Server Component | Yes | Yes | `prisma.student.findMany` | `Student`, `User`, `StudentProgramme`, `StudentAssessment` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/employers` | Server Component | Yes | Yes | `prisma.employer.findMany` | `Employer`, `Job`, `EmployerFee` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/jobs` | Server Component | Yes | Yes | `prisma.job.findMany` | `Job`, `Employer`, `Application` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/placements` | Server Component | Yes | Yes | `prisma.placement.findMany` | `Placement`, `Offer`, `EmployerFee` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/audit-logs` | Server Component | Yes | Yes | `prisma.auditLog.findMany` | `AuditLog`, `User` | N/A (Read) | N/A | Server redirect | Table skeleton | Fallback dummy (Remediated to true empty) | SUPER_ADMIN, OPERATIONS | Platform wide |
| `/admin/settings` | Server + Client Form | Yes | Initial DB read | `admin-settings-form.tsx` | `Setting` | Initial simulated (Remediated: persisted) | Remediated | Toast error | Submit state | N/A | SUPER_ADMIN | Platform wide |
| `/institution` & `/institution/overview` | Server Component | Yes | Yes | `prisma.institution.findUnique`, `prisma.count` | `Institution`, `InstitutionRoster`, `Student`, `StudentAssessment`, `Placement` | N/A (Read) | N/A | Server redirect | Skeleton | Yes (0 denominators handled) | INSTITUTION_ADMIN | Isolated to `session.user.institutionId` |
| `/institution/students` | Server Component | Yes | Yes | `prisma.student.findMany` | `Student`, `User`, `StudentProfile`, `StudentAssessment` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | INSTITUTION_ADMIN | Isolated to `session.user.institutionId` |
| `/institution/registration` | Server Component | Yes | Yes | `prisma.institution.findUnique` | `Institution`, `InstitutionRoster` | N/A (Read) | N/A | Server redirect | Skeleton | Yes | INSTITUTION_ADMIN | Isolated to `session.user.institutionId` |
| `/institution/placements` | Server Component | Yes | Yes | `prisma.placement.findMany` | `Placement`, `Offer`, `Student`, `Employer` | N/A (Read) | N/A | Server redirect | Skeleton | Yes | INSTITUTION_ADMIN | Isolated to `session.user.institutionId` |
| `/institution/drives` | Server Component | Yes | Yes | `prisma.job.findMany` | `Job`, `Employer`, `Application` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | INSTITUTION_ADMIN | Shows active platform partner drives |
| `/institution/mous` | Server Component | Yes | Yes | `prisma.mOU.findMany` | `MOU`, `InstitutionActivity` | N/A (Read) | N/A | Server redirect | Table skeleton | Fallback dummy (Remediated to true empty) | INSTITUTION_ADMIN | Isolated to `session.user.institutionId` |
| `/institution/reports` | Server Component | Yes | Yes | `prisma.placement.findMany` | `Placement`, `Job`, `Student` | N/A (Read) | N/A | Server redirect | Skeleton | Yes (0 placement handling) | INSTITUTION_ADMIN | Isolated to `session.user.institutionId` |
| `/employer` & `/employer/overview` | Server Component | Yes | Yes | `prisma.job.findMany`, `prisma.count` | `Job`, `Application`, `Interview`, `Offer`, `Placement` | N/A (Read) | N/A | Server redirect | Skeleton | Yes | EMPLOYER | Initial: fallback to firstEmp (Remediated: session employerId) |
| `/employer/jobs` | Server + Client Table | Yes | Yes | `job-posting-manager.tsx`, `prisma.job.findMany` | `Job`, `Employer` | Initial simulated (Remediated: POST `/api/jobs`) | Remediated | Modal toast error | Spinner on submit | Yes | EMPLOYER | Isolated to `employerId` |
| `/employer/candidates` | Server + Client Table | Yes | Yes | `candidate-pipeline-table.tsx`, `matching.service.ts` | `Student`, `StudentProfile`, `AssessmentResult`, `Badge` | Initial simulated (Remediated: POST `/api/opportunities`) | Remediated | Toast feedback | Filter spinner | Yes | EMPLOYER | Remediated: filters `employerVisibilityConsent` |
| `/employer/interviews` | Server Component | Yes | Yes | `mega-drive.service.ts`, `prisma.interview.findMany` | `Job`, `Interview`, `AssuranceOpportunity` | N/A (Read) | N/A | Server redirect | Skeleton | Yes | EMPLOYER | Isolated to `employerId` |
| `/employer/offers` | Server Component | Yes | Yes | `prisma.offer.findMany` | `Offer`, `Job`, `Student` | N/A (Read) | N/A | Server redirect | Table skeleton | Yes | EMPLOYER | Isolated to `employerId` |
| `/employer/invoices` | Server Component | Yes | Yes | `prisma.employerFee.findMany` | `EmployerFee`, `EmployerFeeRule`, `Invoice` | N/A (Read) | N/A | Server redirect | Table skeleton | Fallback dummy (Remediated to true empty) | EMPLOYER | Initial: fallback to firstEmp (Remediated: session employerId) |
| `/employer/profile` | Server + Client Form | Yes | Initial DB read | `employer-profile-form.tsx` | `Employer`, `EmployerUser` | Initial simulated (Remediated: persisted) | Remediated | Form validation | Submit spinner | N/A | EMPLOYER | Isolated to user's linked employer |
| `/student` & `/student/dashboard` | Server Component | Yes | Yes | `prisma.student.findFirst` | `Student`, `StudentProgramme`, `StudentAssessment`, `AssuranceOpportunity`, `Badge` | N/A (Read) | N/A | Server redirect | Skeleton | Initial: fallback to firstStu (Remediated: onboarding prompt) | STUDENT | Initial: fallback to firstStu (Remediated: isolated to user) |
| `/student/assessment` | Server + Client Runner | Yes | Yes | `assessment-runner.tsx` -> `/api/assessments/submit` | `AssessmentQuestion`, `StudentAssessment`, `AssessmentAnswer`, `AssessmentResult`, `StudentBadge` | Yes | Yes (Submits & scores answers) | Inline error banner | Submit spinner | Yes (No questions alert) | STUDENT | Isolated to studentId |
| `/student/score` | Server Component | Yes | Yes | `prisma.studentAssessment.findFirst` | `StudentAssessment`, `AssessmentResult` | N/A (Read) | N/A | Server redirect | Skeleton | Initial: mock ?? 82 (Remediated: take assessment CTA) | STUDENT | Initial: fallback to firstStu (Remediated: isolated to user) |
| `/student/badges` | Server Component | Yes | Yes | `prisma.studentBadge.findMany`, `prisma.badge.findMany` | `Badge`, `StudentBadge` | N/A (Read) | N/A | Server redirect | Skeleton | Yes (Shows unearned locked badges) | STUDENT | Initial: fallback to firstStu (Remediated: isolated to user) |
| `/student/jobs` | Server Component | Yes | Yes | `prisma.job.findMany`, `matching.service.ts` | `Job`, `Employer`, `StudentProfile`, `AssessmentResult` | Initial: no apply (Remediated: POST `/api/applications`) | Remediated | Inline alerts | Skeleton | Yes | STUDENT | Initial: fallback to firstStu (Remediated: isolated to user) |
| `/student/applications` | Server Component | Yes | Yes | `prisma.application.findMany` | `Application`, `Job`, `Employer` | N/A (Read) | N/A | Server redirect | Table skeleton | Fallback dummy (Remediated to true empty) | STUDENT | Isolated to student's own applications |
| `/student/interviews` | Server Component | Yes | Yes | `prisma.assuranceOpportunity.findMany` | `StudentProgramme`, `AssuranceOpportunity`, `Interview` | N/A (Read) | N/A | Server redirect | Skeleton | Yes (No interviews booked) | STUDENT | Isolated to student's own opportunities |
| `/student/documents` | Server + Client Vault | Yes | Yes | `student-documents-vault.tsx` -> `/api/documents` | `Document`, `DocumentAccessLog` | Initial simulated (Remediated: POST `/api/documents`) | Remediated | Toast error | Upload progress | Fallback dummy (Remediated to true empty) | STUDENT | Isolated to student's own documents |
| `/student/offers` | Server Component | Yes | Yes | `prisma.offer.findMany` | `Offer`, `Job`, `Employer`, `Placement` | N/A (Read) | N/A | Server redirect | Skeleton | Yes | STUDENT | Isolated to student's own offers |
| `/student/profile` | Server Component | Yes | Yes | `prisma.studentProfile.findFirst` | `StudentProfile`, `Student` | N/A (Read) | N/A | Server redirect | Skeleton | Initial: fallback to firstStu (Remediated: isolated to user) | STUDENT | Isolated to student's own profile |

---

## Part 2: Public & Authentication Pages (13 Pages)

| Route | Page Type | Renders? | Real Data? | Source Service / Endpoint | DB Models Used | Persistence? | Mutation Works? | Error Handling? | Loading State? | Empty State? | Authorization? | Tenant Isolation? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/for-colleges` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/for-students` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/for-employers` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/placement-assurance` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/faqs` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/contact` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/terms` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/privacy` | Server Component | Yes | Static | None | None | N/A | N/A | N/A | Prerendered | N/A | Public | Public |
| `/register/[code]` | Dynamic Page | Yes | Yes | `/api/register/[code]` | `Institution`, `InstitutionMembership` | Yes | Yes | 403 Membership Expired banner | Suspense | 404 College Not Found card | Public | Locked to college in URL |
| `/verify/[id]` | Dynamic Page | Yes | Yes | `prisma.student.findFirst` | `Student`, `StudentBadge`, `Badge`, `Institution` | N/A | N/A | 404 Not Found card | Prerendered | N/A | Public | 3-tier privacy redaction |
| `/login` | Client Component | Yes | Yes | NextAuth `signIn('credentials')` | `User` | Yes (Updates lastLoginAt, loginAttempts) | Yes | Red alert banner | Spinner | N/A | Auth | Session token generation |
| `/register` | Client Component | Yes | Yes | `/api/auth/register` (POST) | `User`, `VerificationToken` | Yes | Yes | Form errors | Spinner | N/A | Auth | New user account |

---

## Part 3: API Route Handlers (26 Routes)

| API Route | Methods | Enforces Auth? | Allowed Roles | Enforces Validation? | Service Layer Used | Atomic Transaction? | Audit Logged? | Tested In Vitest? | Tested In Playwright? | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | GET, POST | Edge Safe | All | `loginSchema` (Zod) | NextAuth v5 | No | Login failure count | Yes | Yes | `ACTIVE` |
| `/api/auth/register` | POST | Public | Any | `registerSchema` (Zod) | `auth-utils.ts` | No | No | No | No | `ACTIVE` |
| `/api/auth/verify-email` | POST | Public | Any | Zod token schema | `auth-utils.ts` | No | Yes | No | No | `ORPHANED` |
| `/api/auth/forgot-password` | POST | Public | Any | Zod email schema | `auth-utils.ts` | No | Yes | No | No | `ORPHANED` |
| `/api/auth/reset-password` | POST | Public | Any | Zod password schema | `auth-utils.ts` | No | Yes | No | No | `ORPHANED` |
| `/api/health` | GET | Public / Admin | None (2-tier probe) | None | DB ping check | No | No | Yes | Yes | `ACTIVE` |
| `/api/register/[code]` | GET | Public | None | Upper-case normalization | Prisma query | No | No | Yes | Yes | `ACTIVE` |
| `/api/institutions` | GET, POST | Yes (POST) | SUPER_ADMIN, OPERATIONS | `createInstitutionSchema` | Prisma query | No | Yes (POST) | Yes | Yes | `ACTIVE` |
| `/api/institutions/plans` | GET | Public / Auth | None | None | Prisma query | No | No | Yes | Yes | `ACTIVE` |
| `/api/institutions/[id]/evidence-export` | GET | Yes | SUPER_ADMIN, OPERATIONS, INSTITUTION_ADMIN | Tenant matching check | CSV / JSON generator | No | No | Yes | Yes | `ACTIVE` |
| `/api/institutions/[id]/qr` | GET | Public / Auth | None | `qrcode` buffer | QR generator | No | No | Yes | Yes | `ACTIVE` |
| `/api/roster/import` | POST | Yes | SUPER_ADMIN, OPERATIONS, INSTITUTION_ADMIN | `importRosterSchema` | Prisma upsert loop | No | No | Yes | No | `ACTIVE` |
| `/api/students` | GET, POST | Yes (GET) / Public (POST) | STUDENT, INSTITUTION_ADMIN, SUPER_ADMIN | `registerStudentSchema` | Prisma creates & roster matching | No | Yes (POST) | Yes | Yes | `ACTIVE` |
| `/api/jobs` | GET, POST | Yes | EMPLOYER, SUPER_ADMIN, OPERATIONS | `createJobSchema` | `matching.service.ts` | No | No | Yes | Yes | `ACTIVE` |
| `/api/offers` | POST | Yes | SUPER_ADMIN, OPERATIONS, EMPLOYER | `createOfferSchema` | Prisma updates | No | Yes | Yes | No | `ACTIVE` |
| `/api/opportunities` | GET, POST | Yes | SUPER_ADMIN, OPERATIONS, COUNSELLOR, EMPLOYER | `assignOpportunitySchema` | Prisma transaction | **YES** | Yes | Yes | No | `ACTIVE` |
| `/api/placements` | GET, POST, PATCH | Yes | SUPER_ADMIN, OPERATIONS | `confirmPlacementSchema`, `reversePlacementSchema` | Prisma updates | Remediated: **YES** | Yes | Yes | Yes | `ACTIVE` |
| `/api/documents` | GET, POST | Yes | All roles (tenant filtered) | `uploadDocumentSchema` | `storage.service.ts` | No | Yes | Yes | Yes | `ACTIVE` |
| `/api/documents/[id]/verify` | PATCH | Yes | SUPER_ADMIN, OPERATIONS | `verifyDocSchema` | `storage.service.ts` | No | Yes | Yes | Yes | `ACTIVE` |
| `/api/employer-fees` | GET | Yes | SUPER_ADMIN, OPERATIONS, EMPLOYER | Query parameters | Prisma query | No | No | Yes | Yes | `ACTIVE` |
| `/api/employer-fees/rules` | GET, POST | Yes | SUPER_ADMIN, OPERATIONS | `employerFeeRuleSchema` | Prisma query | No | Yes (POST) | Yes | No | `ACTIVE` |
| `/api/assessments/questions` | GET | Yes | All roles | None | Prisma query | No | No | Yes | Yes | `ACTIVE` |
| `/api/assessments/submit` | POST | Yes | STUDENT | `submitAssessmentSchema` | Scoring service | No | Yes | Yes | Yes | `ACTIVE` |
| `/api/payments/create-order` | POST | Yes | All roles | `createOrderSchema` | `payment.service.ts` | No | No | Yes | Yes | `ACTIVE` |
| `/api/payments/verify` | POST | Yes | All roles | `verifyPaymentSchema` | `payment.service.ts` | Remediated: **YES** | Yes | Yes | Yes | `ACTIVE` |
| `/api/webhooks/razorpay` | POST | Webhook Sig | Razorpay HMAC check | HMAC signature | `payment.service.ts` | Remediated: **YES** | Console log | Yes | Yes | `ACTIVE` |
