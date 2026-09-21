# PlacementConnect — API Forensic Audit Report

This report evaluates all 26 backend API routes for authentication enforcement, role-based authorization (RBAC), input validation schemas, database transaction integrity, audit trail emission, error handling contracts, and tenant isolation.

---

## 1. Security & Validation Standards Evaluation

Every API endpoint was audited against 8 security dimensions:
1. **Unauthenticated Access (401)**: Verified via `requireApiAuth()` in `src/lib/auth-utils.ts`.
2. **Unauthorized Role Access (403)**: Verified via role whitelist argument in `requireApiAuth(['ROLE_A', 'ROLE_B'])`.
3. **Zod Input Validation (400)**: Verified via `.safeParse()` returning standard `validationError()`.
4. **Tenant Isolation**: Verified through programmatic query scoping against `session.user.institutionId` or `session.user.employerId`.
5. **Database Transactions**: Evaluated for atomic rollback on multi-table mutations (`prisma.$transaction`).
6. **Audit Trail Logging**: Verified for compliance emission via `createAuditLog()`.
7. **Safe Error Masking**: Verified via `handleApiError()` ensuring zero internal stack traces leak to clients.
8. **HTTP Response Contract**: Standard envelope `{ success: boolean, data?: any, error?: { code: string, message: string, details?: any } }`.

---

## 2. API Forensic Audit Matrix

| Endpoint | Method | 401 on Unauth? | 403 on Wrong Role? | Validation Schema | Tenant Isolation Enforced? | Atomic Transaction? | Audit Log Emitted? | Initial Vulnerability / Finding | Remediated Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | * | N/A (Auth entry) | Handled by NextAuth | `loginSchema` (Zod) | N/A | No | Yes (login attempts) | `employerId` not attached to session token. | Remediated |
| `/api/auth/register` | POST | N/A (Public) | Public self-serve | `registerSchema` (Zod) | N/A | No | No | Password strength checked; duplicates checked. | PASS |
| `/api/auth/verify-email` | POST | N/A (Public) | Public | Token schema | N/A | No | Yes | Token expiry validated; consumes token. | PASS |
| `/api/auth/forgot-password`| POST | N/A (Public) | Public | Email schema | N/A | No | Yes | Sanitizes email; generates crypto token. | PASS |
| `/api/auth/reset-password` | POST | N/A (Public) | Public | Token + password | N/A | No | Yes | Validates token before updating password. | PASS |
| `/api/health` | GET | Public / Admin | 2-tier probe | None | N/A | No | No | Public view shows zero infrastructure telemetry. | PASS |
| `/api/register/[code]` | GET | Public | None | Code format check | Scoped by code | No | No | Blocks registration if institution membership expired. | PASS |
| `/api/institutions` | GET | Yes | SUPER_ADMIN, OPERATIONS | Query parser | Platform wide | No | No | Supports pagination and case-insensitive search. | PASS |
| `/api/institutions` | POST | Yes | SUPER_ADMIN, OPERATIONS | `createInstitutionSchema` | Platform wide | No | Yes | Validates registrationCode uppercase alphanumeric. | PASS |
| `/api/institutions/plans` | GET | Public / Auth | None | None | Active plans | No | No | Returns active configurable institution plans. | PASS |
| `/api/institutions/[id]/evidence-export` | GET | Yes | SUPER_ADMIN, OPERATIONS, INSTITUTION_ADMIN | ID param | **Enforced**: 403 if accessing other college | No | No | Validates tenant match; exports sanitised CSV/JSON. | PASS |
| `/api/institutions/[id]/qr` | GET | Public / Auth | None | ID param | Verified against DB | No | No | Generates standard PNG stream with error correction. | PASS |
| `/api/roster/import` | POST | Yes | SUPER_ADMIN, OPERATIONS, INSTITUTION_ADMIN | `importRosterSchema` | **Enforced**: 403 if institutionId mismatch | No | No | Batch upserts students & cohort denominator. | PASS |
| `/api/students` | GET | Yes | All roles | Query parser | Tenant scoped by role | No | No | Institution users only see their own students. | PASS |
| `/api/students` | POST | N/A (Enrolment)| College locked | `registerStudentSchema` | Enforces college ID | No | Yes | Matches roster; generates unique verification ID. | PASS |
| `/api/jobs` | GET | Yes | All roles | Query parser | Status ACTIVE only | No | No | Computes real-time match scores for students. | PASS |
| `/api/jobs` | POST | Yes | EMPLOYER, SUPER_ADMIN, OPERATIONS | `createJobSchema` | Scoped to employer | No | No | Employer-created jobs default to PENDING_APPROVAL. | PASS |
| `/api/offers` | POST | Yes | SUPER_ADMIN, OPERATIONS, EMPLOYER | `createOfferSchema` | Scoped to opportunity | No | Yes | Transitions opportunity status to SELECTED. | PASS |
| `/api/opportunities` | GET | Yes | All roles | Query parser | Scoped by studentId | No | No | Students only see their own opportunities. | PASS |
| `/api/opportunities` | POST | Yes | SUPER_ADMIN, OPERATIONS, COUNSELLOR, EMPLOYER | `assignOpportunitySchema` | Validates student programme | **YES** | Yes | Checks `opportunitiesRemaining > 0` atomically. | PASS |
| `/api/placements` | GET | Yes | All roles | Query parser | Scoped by role | No | No | Institution Admin only views own placements. | PASS |
| `/api/placements` | POST | Yes | SUPER_ADMIN, OPERATIONS | `confirmPlacementSchema` | Platform admin only | **REMEDIATED** | Yes | Non-transactional & fee rule foreign key crash. | Remediated to `$transaction` |
| `/api/placements` | PATCH | Yes | SUPER_ADMIN, OPERATIONS | `reversePlacementSchema` | Platform admin only | **REMEDIATED** | Yes | Reverses placement & marks fee WAIVED. | Remediated to `$transaction` |
| `/api/documents` | GET | Yes | All roles | Query parser | Scoped by role | No | No | Students only see own docs; colleges see own docs. | PASS |
| `/api/documents` | POST | Yes | All roles | `uploadDocumentSchema` | Scoped by uploader | No | Yes | Stores in private storage, creates access log. | PASS |
| `/api/documents/[id]/verify` | PATCH | Yes | SUPER_ADMIN, OPERATIONS | `verifyDocSchema` | Platform admin only | No | Yes | Updates verification status with comment & audit. | PASS |
| `/api/employer-fees` | GET | Yes | SUPER_ADMIN, OPERATIONS, EMPLOYER | Query parser | Scoped to employerUser | No | No | Employers only see their own fee invoices. | PASS |
| `/api/employer-fees/rules` | GET, POST | Yes | SUPER_ADMIN, OPERATIONS | `employerFeeRuleSchema` | Platform admin only | No | Yes | Manages fixed or percentage fee rules. | PASS |
| `/api/assessments/questions` | GET | Yes | All roles | None | Active questions | No | No | Returns questions without correctAnswer to students. | PASS |
| `/api/assessments/submit` | POST | Yes | STUDENT | `submitAssessmentSchema` | Student isolated | No | Yes | Computes 9-dim scores, persists result & badges. | PASS |
| `/api/payments/create-order` | POST | Yes | All roles | `createOrderSchema` | User isolated | No | No | Resolves price server-side; ignores client amount. | PASS |
| `/api/payments/verify` | POST | Yes | All roles | `verifyPaymentSchema` | User isolated | **REMEDIATED** | Yes | Non-transactional activation risk. | Remediated to `$transaction` |
| `/api/webhooks/razorpay` | POST | Signature | Webhook secret | HMAC signature | Event payload | **REMEDIATED** | Yes | Did not activate programmes on payment.captured. | Remediated with shared activation service |

---

## 3. High-Priority Remediations Identified

1. **Transaction Wrapping for Placements (`POST /api/placements`)**:
   - `prisma.placement.create`, `prisma.offer.update`, `prisma.student.update`, and `prisma.employerFee.create` must execute within a single atomic `prisma.$transaction`.
   - If no specific `EmployerFeeRule` exists, query the platform default rule (`where: { employerId: null, isActive: true }`) or upsert a fallback rule rather than passing a raw unseeded ID that triggers foreign key violations.

2. **Unified Payment Activation Service (`src/services/payment.service.ts`)**:
   - Both `/api/payments/verify` and `/api/webhooks/razorpay` must invoke the same idempotent atomic activation method wrapped in `prisma.$transaction`.
   - Prevents orphaned paid orders when students close checkout before redirecting.

3. **Session Enrichment for Multi-Tenant Employers**:
   - Attach `employerId` to session token on login to prevent fallbacks to `prisma.employer.findFirst()`.
