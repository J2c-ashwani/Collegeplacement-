# PlacementConnect — Network Traffic & Request Audit

This forensic audit analyzes network calls dispatched by client components and server-rendered pages during end-to-end browser journeys and programmatic test runs.

---

## 1. Network Traffic Profile

| Source View / Component | Dispatched URL | HTTP Method | Target Handler | Expected Payload / Response | Network Status Observed | Audit Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Login Form (`(auth)/login`) | `/api/auth/callback/credentials` | POST | NextAuth credentials | Form data -> Session cookie | 200 / 302 Redirect | Clean authentication flow |
| Login Form (`(auth)/login`) | `/api/auth/session` | GET | NextAuth session route | None -> Session JSON | 200 OK | Fetches active session post-login |
| Register Form (`(auth)/register`) | `/api/auth/register` | POST | `/api/auth/register` | User credentials -> User record | 201 Created | Input validated with Zod |
| Student Enrolment (`/register/[code]`) | `/api/students` | POST | `/api/students` | Student academic & personal payload | 201 Created | Creates User, Student, Profile, and AuditLog |
| TPO Placement Evidence (`/institution/placements`) | `/api/institutions/[id]/evidence-export` | GET | `evidence-export/route.ts` | None -> CSV stream / JSON | 200 OK (`text/csv`) | Direct attachment download |
| TPO Registration Studio (`/institution/registration`) | `/api/institutions/[id]/qr` | GET | `qr/route.ts` | None -> PNG stream | 200 OK (`image/png`) | Inline image render & download |
| Assessment Runner (`/student/assessment`) | `/api/assessments/submit` | POST | `/api/assessments/submit` | 9-dimension answers array | 200 OK (Scores & Badges) | Scored deterministically |
| Public Credential Verification (`/verify/[id]`) | Direct Page Navigation | GET | `/verify/[id]/page.tsx` | SSR HTML | 200 OK (Public attributes only) | Zero private subscore or contact leak |
| Health Diagnostic Probe | `/api/health` | GET | `/api/health/route.ts` | None -> Diagnostic JSON | 200 OK | Safe public response |

---

## 2. Identified Network Gaps & Disconnected Frontend Mutations

During browser and source analysis, several frontend forms were observed mutating local React state without dispatching network requests to the backend:

1. **Job Requisition Creation (`JobPostingManager`)**:
   - Dispatches NO network request.
   - Form submission previously executed `setJobs([newJob, ...jobs])` entirely in-memory.
   - **Remediation**: Dispatch `POST /api/jobs` with `title, department, workMode, location, ctc, minCgpa, minEmployabilityScore, openings, description`.

2. **Assurance Interview Slot Dispatch (`CandidatePipelineTable`)**:
   - Dispatches NO network request.
   - Form submission previously executed `setScheduledIds((prev) => [...prev, selectedCandidate.id])` and showed a fake success toast.
   - **Remediation**: Dispatch `POST /api/opportunities` with `studentId, jobId, roundName, mode`.

3. **Student Document Vault Upload (`StudentDocumentsVault`)**:
   - Dispatches NO network request.
   - Form submission previously executed `handleUploadSimulate` adding an in-memory document with fake size and timestamp.
   - **Remediation**: Dispatch `POST /api/documents` with `type, filename, mimeType, size, base64Content`.

4. **Corporate Profile Form (`EmployerProfileForm`)**:
   - Dispatches NO network request.
   - Form submission previously executed `setTimeout(() => setSaved(false), 3000)`.
   - **Remediation**: Dispatch `PATCH /api/employer-profile` to persist updated corporate details.

5. **Admin Platform Settings Form (`AdminSettingsForm`)**:
   - Dispatches NO network request.
   - Form submission previously executed `setTimeout(() => setSavedSuccess(false), 3000)`.
   - **Remediation**: Dispatch `POST /api/admin/settings` to persist global configuration into the `Setting` model.

6. **Notification Drawer (`notification-drawer.tsx`)**:
   - Dispatched NO network request to retrieve user notifications.
   - Operated on static in-memory array `INITIAL_NOTIFICATIONS`.
   - **Remediation**: Dispatch `GET /api/notifications` and `PATCH /api/notifications` to synchronize read states.

---

## 3. Duplicate and Redundant Request Checks

- **Duplicate Payment Webhook Retries**: Tested with duplicate delivery of `payment.captured` event. Handled idempotently.
- **Polling & Re-renders**: No unbounded intervals or runaway `useEffect` re-fetching cycles detected.
- **Client-Side Asset Delivery**: Static assets (`SVG`, `CSS`, fonts) served with proper caching headers from `/public` and `_next/static`.
