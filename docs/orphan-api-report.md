# PlacementConnect — Orphan API Report

This forensic report audits every backend API endpoint in the repository to determine caller connectivity, reachability, test coverage, and lifecycle status.

---

## Endpoint Consumer Matrix

| Endpoint | HTTP Method | Consumer in Codebase | UI Component / Page | Reachable? | Tested? | Lifecycle Status | Architectural Justification / Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth Client / Browser | `/login` form, session hooks | Yes | Yes (Playwright) | `ACTIVE` | Core session and credentials provider. |
| `/api/auth/register` | POST | Fetch call | `(auth)/register/page.tsx` | Yes | Yes | `ACTIVE` | Self-serve public user registration. |
| `/api/auth/verify-email` | POST | None | None | Yes | No | `ORPHANED` | Email verification token handler. Keep for production email verification loop. |
| `/api/auth/forgot-password` | POST | None | None | Yes | No | `ORPHANED` | Password reset token dispatcher. Keep for production password recovery. |
| `/api/auth/reset-password` | POST | None | None | Yes | No | `ORPHANED` | Password reset fulfillment handler. Keep for production password recovery. |
| `/api/health` | GET | Monitoring probes / Tests | None | Yes | Yes (Vitest, Playwright) | `ACTIVE` | Container liveness & readiness check. |
| `/api/register/[code]` | GET | Server fetch | `/register/[code]/page.tsx` | Yes | Yes (Vitest, Playwright) | `ACTIVE` | Validates registration link code and membership expiry. |
| `/api/institutions` | GET | None (Admin reads Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | REST endpoint for external CRM or future API integrations. |
| `/api/institutions` | POST | None (Admin reads Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Institution onboarding API. Keep for B2B portal. |
| `/api/institutions/plans` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Public pricing endpoint for plans. Keep for pricing widget. |
| `/api/institutions/[id]/evidence-export` | GET | Direct link `<a href>` | `/institution/placements/page.tsx` | Yes | Yes (Playwright) | `ACTIVE` | Generates downloadable CSV evidence ledger for TPO. |
| `/api/institutions/[id]/qr` | GET | Image tag `<img src>` | `qr-code-studio.tsx`, `overview/page.tsx` | Yes | Yes (Playwright) | `ACTIVE` | Generates downloadable PNG QR code for college noticeboard. |
| `/api/roster/import` | POST | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Bulk student roster CSV import. Built & tested, needs TPO upload button. |
| `/api/students` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Student directory REST query. |
| `/api/students` | POST | Fetch call | `student-register-form.tsx` | Yes | Yes (Playwright) | `ACTIVE` | Primary student registration handler. |
| `/api/jobs` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Returns match-scored jobs for students. Now wired to `/student/jobs`. |
| `/api/jobs` | POST | None (Simulated in UI) | `job-posting-manager.tsx` | Yes | Yes (Vitest) | `DISCONNECTED` | Job requisition creation. Remediated: wired to `JobPostingManager`. |
| `/api/offers` | POST | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Offer letter issuance. Built & tested, needs recruiter offer issuance modal. |
| `/api/opportunities` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Fetches student opportunities. |
| `/api/opportunities` | POST | None (Simulated in UI) | `candidate-pipeline-table.tsx` | Yes | Yes (Vitest) | `DISCONNECTED` | Allocates assurance interview slot. Remediated: wired to candidate pipeline. |
| `/api/placements` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Queries verified placements. |
| `/api/placements` | POST | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Confirms placement & triggers employer fee. Built & tested. |
| `/api/placements` | PATCH | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Placement reversal logic (probation exit). Built & tested. |
| `/api/documents` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Role-filtered document query. |
| `/api/documents` | POST | None (Simulated in UI) | `student-documents-vault.tsx` | Yes | Yes (Vitest) | `DISCONNECTED` | File upload & access trail. Remediated: wired to `StudentDocumentsVault`. |
| `/api/documents/[id]/verify` | PATCH | None | None | Yes | Yes (Vitest, Playwright) | `ORPHANED_IN_UI` | Document verification status toggle. Built & tested. |
| `/api/employer-fees` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Billing ledger query. |
| `/api/employer-fees/rules` | GET, POST | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Fee rule configuration. Built & tested. |
| `/api/assessments/questions` | GET | None (Pages read Prisma) | None | Yes | Yes (Vitest) | `PARTIALLY_ORPHANED` | Fetches active 9-dimension questions. |
| `/api/assessments/submit` | POST | Fetch call | `assessment-runner.tsx` | Yes | Yes (Vitest, Playwright) | `ACTIVE` | 9-dimension scoring and result persistence. |
| `/api/payments/create-order` | POST | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Server-side Razorpay order generation. |
| `/api/payments/verify` | POST | None | None | Yes | Yes (Vitest) | `ORPHANED_IN_UI` | Payment signature verification & service activation. |
| `/api/webhooks/razorpay` | POST | Razorpay servers | None (Webhook receiver) | Yes | Yes (Vitest, Playwright) | `ACTIVE` | Automated payment reconciliation webhook. |

---

## Summary of Findings

1. **Disconnected APIs (Mutations Simulated in UI)**:
   - `/api/jobs` (POST) was fully implemented in backend, but `job-posting-manager.tsx` simulated vacancy creation in React state.
   - `/api/opportunities` (POST) was fully implemented in backend, but `candidate-pipeline-table.tsx` simulated interview scheduling.
   - `/api/documents` (POST) was fully implemented in backend, but `student-documents-vault.tsx` simulated uploads via `handleUploadSimulate`.
   - **Remediation**: Wire these UI components directly to their corresponding API routes.

2. **Missing Essential APIs**:
   - There was NO `/api/applications` endpoint allowing students to apply for jobs.
   - There was NO `/api/notifications` endpoint allowing the notification center to fetch unread notifications or mark them as read.
   - There was NO `/api/employer-profile` or `/api/admin/settings` endpoint, causing profile and settings forms to simulate saves with `setTimeout`.
   - **Remediation**: Implement these 4 missing API routes and wire them to the UI.

3. **Orphaned Auth Utility Routes**:
   - `/api/auth/verify-email`, `/api/auth/forgot-password`, and `/api/auth/reset-password` have complete backend handlers and Zod validation, but no front-facing recovery UI.
   - **Recommendation**: Retain in repository as `FUTURE` capabilities for production email verification and password reset.
