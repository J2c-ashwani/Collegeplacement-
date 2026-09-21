# PlacementConnect — Dead Code & Redundancy Audit

This report documents dead code, unused symbols, orphaned APIs, and duplicated services identified during static analysis of the repository.

---

## 1. Dead Code & Unused Symbols Inventory

| File Path | Symbol | Type | Reason | Current References | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/lib/audit-logger.ts` | `logAuditEvent` | Function | Redundant audit logging function. `src/services/audit.service.ts:createAuditLog` is the active implementation used across 11 files. | 1 (Definition only) | Consolidate: re-export `createAuditLog` or alias `logAuditEvent` to `createAuditLog`. |
| `src/lib/audit-logger.ts` | `getAuditLogs` | Function | Standalone read helper; `/admin/audit-logs/page.tsx` directly queries `prisma.auditLog.findMany`. | 1 (Definition only) | Retain as domain read helper or update page to call `getAuditLogs`. |
| `src/app/api/auth/verify-email/route.ts` | `POST` | Route Handler | No client view or UI form dispatches email verification token requests. | 0 client callers | Retain as `FUTURE` API for production email verification workflow. |
| `src/app/api/auth/forgot-password/route.ts` | `POST` | Route Handler | Forgot password UI form has not been built yet. | 0 client callers | Retain as `FUTURE` API for production password recovery. |
| `src/app/api/auth/reset-password/route.ts` | `POST` | Route Handler | Password reset UI form has not been built yet. | 0 client callers | Retain as `FUTURE` API for production password recovery. |
| `src/app/api/roster/import/route.ts` | `POST` | Route Handler | Fully implemented & tested backend endpoint for CSV roster import, but no TPO file dropzone UI invokes it. | Tests only | Retain; wire to an import modal on `/institution/students`. |
| `src/app/api/offers/route.ts` | `POST` | Route Handler | Fully implemented offer creation API, but recruiter UI currently lacks offer issuance modal. | Tests only | Retain; wire to an offer issuance button on `/employer/candidates`. |
| `src/app/api/placements/route.ts` | `PATCH` | Route Handler | Implements probation placement reversal logic and fee waiver, but no admin UI button triggers it. | Tests only | Retain; useful for operations compliance workflows. |
| `src/app/api/employer-fees/rules/route.ts` | `GET, POST`| Route Handlers | Implements employer fee rule configuration, but currently only tested in Vitest. | Tests only | Retain for future admin billing configuration console. |
| `src/components/dashboard/data-table.tsx` | `DataTable` | Component | Superseded by `enterprise-data-table.tsx` which includes debouncing, sorting, and CSV export. | 0 callers | Safe to keep or deprecate in favor of `enterprise-data-table.tsx`. |
| `src/services/storage.service.ts` | `createPresignedUploadUrl`, `createPresignedDownloadUrl` | Functions | Presigned S3 URLs prepared for AWS S3/MinIO, but development mode uses local filesystem/base64 storage. | Definition only | Keep for production S3/R2 storage integration. |
| `src/services/payment.service.ts` | `createRefund` | Function | Razorpay refund API wrapper implemented on gateway interface, but refund API handler not yet built. | Definition only | Keep for future refund management workflows. |

---

## 2. Duplicate Implementations

### Audit Logging Duplication:
- **`src/services/audit.service.ts`**: Contains `createAuditLog` and `AuditActions` constant. Used in 11 files across `api/documents`, `api/students`, `api/payments/verify`, `api/placements`, `api/offers`, `api/opportunities`, `api/assessments/submit`, and `api/institutions`.
- **`src/lib/audit-logger.ts`**: Contains `logAuditEvent` and `getAuditLogs`. Created in Sprint 7 as an enterprise utility but never connected to the endpoints.
- **Resolution**: Unify both files by having `src/lib/audit-logger.ts` export the authoritative `createAuditLog`, `logAuditEvent` (alias), `getAuditLogs`, and `AuditActions`.

---

## 3. Safe Cleanup vs Retain Plan

1. **Keep (Future Production Integration)**:
   - Presigned S3 URLs (`storage.service.ts`)
   - Razorpay refund interface (`payment.service.ts`)
   - Email verification & password reset handlers (`api/auth/*`)
   - Roster CSV import handler (`api/roster/import`)
2. **Consolidate (Active Cleanup)**:
   - Unify `audit.service.ts` and `audit-logger.ts`.
   - Wire `POST /api/jobs`, `POST /api/opportunities`, and `POST /api/documents` to their respective UI components to eliminate dormant backend code.
