# PlacementConnect — Dormant Feature Audit Report

This report catalogs features and capabilities that are dormant, unexposed, partially implemented, or present in the UI without functioning backend connectivity.

---

## Dormant Features Classification

| Feature Description | Location in Codebase | Current State | Classification | Action Plan |
| :--- | :--- | :--- | :--- | :--- |
| **Recruiter Job Vacancy Creation** | `employer/jobs/job-posting-manager.tsx` & `/api/jobs` | UI modal simulates job creation in React state without calling `/api/jobs`. | `COMPLETE` | Wire `JobPostingManager.handleCreateJob` to `POST /api/jobs` and refresh server state. |
| **Recruiter Candidate Sourcing & Scheduling** | `employer/candidates/candidate-pipeline-table.tsx` & `/api/opportunities` | UI schedules interview in local array without calling `/api/opportunities`. | `COMPLETE` | Wire `CandidatePipelineTable.confirmSchedule` to `POST /api/opportunities`. |
| **Student Digital Document Vault Upload** | `student/documents/student-documents-vault.tsx` & `/api/documents` | UI simulates file upload via `handleUploadSimulate` instead of posting to `/api/documents`. | `COMPLETE` | Wire `StudentDocumentsVault` to `POST /api/documents` with base64 payload. |
| **Student 1-Click Job Application** | `student/jobs/page.tsx` & Missing `/api/applications` | Students can browse jobs but have no action to submit an application; button only links to `/student/interviews`. | `COMPLETE` | Build `/api/applications` endpoint and wire 1-click apply button on `/student/jobs`. |
| **Recruiter Corporate Profile Studio** | `employer/profile/employer-profile-form.tsx` | Form submission triggers `setTimeout` with no API or DB persistence. | `COMPLETE` | Build `/api/employer-profile` endpoint and wire form submission. |
| **Admin Platform Settings Console** | `admin/settings/admin-settings-form.tsx` | Form submission triggers `setTimeout` with no DB persistence to `Setting` model. | `COMPLETE` | Build `/api/admin/settings` endpoint and wire form submission. |
| **Slide-Over Notification Center Synchronisation** | `src/components/layout/notification-drawer.tsx` | Drawer renders hardcoded static notifications in memory; unread state does not persist to database. | `COMPLETE` | Build `/api/notifications` route and wire drawer fetching and mark-as-read. |
| **TPO Roster CSV Import Dropzone** | `src/app/api/roster/import/route.ts` | Backend endpoint exists and is tested, but `/institution/students` has no CSV upload modal. | `DEFER` | Retain API for automated batch uploads; schedule CSV drag-and-drop modal for Sprint 8. |
| **Recruiter Offer Issuance Modal** | `src/app/api/offers/route.ts` | Backend endpoint exists and is tested, but recruiter candidates page lacks issuance trigger. | `DEFER` | Retain API; schedule UI offer dialog for Sprint 8. |
| **Probation Placement Reversal Flow** | `src/app/api/placements/route.ts` (PATCH) | Backend reversal logic with fee waiver exists and is tested, but admin placements view has no reversal button. | `DEFER` | Retain API for compliance; add admin action button in future sprint. |
| **Password Reset & Recovery UI** | `src/app/api/auth/forgot-password` & `reset-password` | Backend token dispatchers exist, but `/forgot-password` and `/reset-password` UI routes are missing. | `DEFER` | Keep APIs active; implement password reset views alongside SMTP/Resend production onboarding. |
| **S3 Presigned URL File Storage** | `src/services/storage.service.ts` | Code has S3/R2 presigned URL generators ready, but system currently runs in local filesystem storage mode. | `KEEP` | Keep intact; automatically activates when `STORAGE_PROVIDER="s3"` is configured in production. |
| **Legacy Data Table Component** | `src/components/dashboard/data-table.tsx` | Early dashboard table component superseded by `enterprise-data-table.tsx`. | `REMOVE` | Deprecate or remove to avoid confusing future developers. |
