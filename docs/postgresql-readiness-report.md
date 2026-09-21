# PlacementConnect — PostgreSQL Readiness Audit Report

This report provides a forensic evaluation of the Prisma database architecture across all 45+ models and 11 domain schema files for strict PostgreSQL / Supabase enterprise compatibility.

---

## 1. Schema Architectural Integrity Matrix

| Dimension | Standard / Specification | Codebase Implementation | Evaluation |
| :--- | :--- | :--- | :--- |
| **Primary Key Strategy** | Collision-resistant unique IDs | `@id @default(cuid())` across all models | **PASS**: Safe for distributed inserts; avoids PostgreSQL sequence locking bottlenecks. |
| **Timestamps** | Automated audit tracking | `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt` on all operational entities | **PASS**: Handled cleanly by PostgreSQL `TIMESTAMPTZ`. |
| **Native Enums** | 22 Domain Enums (`Role`, `StudentStatus`, `InstitutionStatus`, `JobStatus`, etc.) | Defined in Prisma and mapped to native PostgreSQL `CREATE TYPE ... AS ENUM` | **PASS**: Strongly typed in DB; strict type enforcement. |
| **Array Data Types** | Vector/List properties (`departments`, `branch`, `skills`, `features`, `signatories`) | Defined as `String[]` across models | **PASS**: Native PostgreSQL array support (`TEXT[]`). Highly efficient storage without requiring join tables for simple tags. |
| **Monetary & Financial Fields** | Exact decimal precision for currency amounts | `Decimal` type on `price`, `ctc`, `amount`, `gstAmount`, `totalAmount`, `salaryMin`, `salaryMax` | **PASS**: Prevents IEEE 754 floating-point rounding errors in currency and GST accounting. |
| **Semi-Structured Data** | Dynamic questions, scoring rules, candidate portfolios, audit diffs | `Json` type on `options`, `scoringRules`, `internships`, `projects`, `previousValue`, `newValue` | **PASS**: Compiles to PostgreSQL `JSONB`, supporting deep indexing and JSON containment operators. |
| **Index Coverage** | Fast lookup & query performance | Explicit `@@index` on every foreign key and filterable status column across all 11 schema files | **PASS**: Prevents sequential table scans during join operations. |
| **Unique Constraints** | Uniqueness guarantees | `@unique` on `code`, `registrationCode`, `verificationId`, `invoiceNumber`, `placementCode`, `gatewayOrderId`, `storageKey` | **PASS**: Backed by PostgreSQL unique B-Tree indexes. |
| **Cascading Deletions** | Data integrity on user deletion | `onDelete: Cascade` on `InstitutionUser` and `EmployerUser` relations to `User` | **PASS**: Cleans up user memberships safely without orphaned relation records. |
| **Multi-Tenancy** | Tenant data isolation | Strict foreign keys `institutionId` and `employerId` indexed across child tables | **PASS**: Enables robust row-level security or programmatic query filtering. |
| **Case-Insensitive Search** | Search by name, code, city | Uses Prisma's `{ contains: query, mode: 'insensitive' }` | **PASS**: Handled via PostgreSQL `ILIKE` or `LOWER()`. |
| **Transaction Safety** | Multi-table mutations | `prisma.$transaction([...])` | **PASS**: Standard PostgreSQL `BEGIN ... COMMIT / ROLLBACK` isolation. |

---

## 2. Domain Schema Files Breakdown

The schema is partitioned into 11 domain files under `prisma/schema/` using Prisma's multi-file schema feature:

1. `base.prisma`: Datasource provider (`postgresql`), connection pooler URLs (`url`, `directUrl`), and client generator.
2. `auth.prisma`: User identity, authentication credentials, RBAC roles (`Role`), and verification tokens.
3. `institution.prisma`: Partner colleges (`Institution`), plans, memberships, rosters (`InstitutionRoster`, `RosterStudent`), MOUs, and campaigns.
4. `student.prisma`: Student identity, detailed profile (`StudentProfile`), programmes (`StudentProgramme`), 9-dimension assessments, questions, answers, results, and badges.
5. `employer.prisma`: Corporate recruiter entities (`Employer`, `EmployerUser`), job requisitions (`Job`), fee rules (`EmployerFeeRule`), and invoices (`EmployerFee`).
6. `placement.prisma`: Job applications (`Application`), contractual assurance opportunities (`AssuranceOpportunity`), interview rounds (`Interview`), offer letters (`Offer`), and confirmed placements (`Placement`).
7. `document.prisma`: Digital document repository (`Document`) and immutable access audit trail (`DocumentAccessLog`).
8. `payment.prisma`: Financial orders (`Order`), payment gateway captures (`Payment`), GST invoices (`Invoice`), refunds, and coupons.
9. `operations.prisma`: Campus hiring drives, workshops, industry visits, and institutional activities.
10. `notification.prisma`: Notification queue (`Notification`), notification templates, and support tickets.
11. `audit.prisma`: Immutable compliance ledger (`AuditLog`), CRM notes, and platform configuration settings (`Setting`).

---

## 3. Migration Readiness Verdict

**Verdict**: **READY FOR POSTGRESQL / SUPABASE CONNECTION**.
- Zero schema modifications are required for PostgreSQL compatibility.
- The schema is fully compliant with PostgreSQL enterprise standards and Supabase database pooling.
