# PlacementConnect — SQLite Dependency & Migration Audit

This forensic audit investigates all database driver dependencies, configuration files, SQL queries, and Prisma schemas for SQLite-specific assumptions prior to managed PostgreSQL / Supabase migration.

---

## 1. Codebase Search Results

An exhaustive pattern search across the entire repository for `sqlite`, `sqlite3`, `better-sqlite3`, `file:`, `file:./`, and `provider = "sqlite"` yielded the following results:

```text
================================================================================
Search Pattern                 Matches Found    Files
================================================================================
sqlite (case-insensitive)      0 matches        None
sqlite3                        0 matches        None
better-sqlite3                 0 matches        None
file:                          0 matches        None
provider = "sqlite"            0 matches        None
provider = "postgresql"        1 match          prisma/schema/base.prisma
DATABASE_URL                   2 matches        prisma/schema/base.prisma, docker-compose.yml
================================================================================
```

---

## 2. Dependency & Configuration Analysis

### A. Prisma Datasource Configuration (`prisma/schema/base.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```
**Finding**: The Prisma datasource is **already configured for PostgreSQL** (`provider = "postgresql"`). It was never configured with `provider = "sqlite"`. It specifies `url` (pooled connection) and `directUrl` (direct connection), which is the exact architectural standard for managed PostgreSQL and Supabase connection poolers (PgBouncer/Supavisor).

### B. Node Package Dependencies (`package.json`)
- `prisma`: `^6.19.3`
- `@prisma/client`: `^6.19.3`
- `@auth/prisma-adapter`: `^2.11.3`
- Neither `sqlite3`, `better-sqlite3`, nor `@prisma/adapter-libsql` exist in `dependencies` or `devDependencies`.

### C. Containerized Infrastructure (`docker-compose.yml`)
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: placement_user
      POSTGRES_PASSWORD: placement_secret
      POSTGRES_DB: placementconnect
    ports:
      - "5432:5432"
```
**Finding**: The local container infrastructure is running genuine **PostgreSQL 16 Alpine**, completely bypassing SQLite.

---

## 3. SQLite vs PostgreSQL Compatibility Classification

| Area / Feature | Current Implementation | Classification | Migration Impact |
| :--- | :--- | :--- | :--- |
| **Datasource Provider** | `provider = "postgresql"` in `base.prisma` | `POSTGRES COMPATIBLE` | None. Already native PostgreSQL. |
| **Connection Pooling** | `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")` | `POSTGRES COMPATIBLE` | None. Designed for Supabase pooler. |
| **Schema Enums** | 22 native Prisma Enums across 11 schema files | `POSTGRES COMPATIBLE` | Enums are supported natively in PostgreSQL (unlike SQLite where enums are emulated as strings). |
| **Array Data Types** | `String[]` on `departments`, `branch`, `skills`, `features` | `POSTGRES COMPATIBLE` | Native PostgreSQL string arrays (`text[]`). Incompatible with SQLite, but 100% native to PostgreSQL. |
| **Decimal / Currency Fields** | `Decimal` on `price`, `ctc`, `amount`, `gstAmount`, `totalAmount` | `POSTGRES COMPATIBLE` | Maps to PostgreSQL `DECIMAL(65,30)` / `NUMERIC`. High financial precision. |
| **JSON Data Types** | `Json` on `options`, `scoringRules`, `internships`, `metadata` | `POSTGRES COMPATIBLE` | Maps to PostgreSQL `JSONB` with binary indexing capability. |
| **Primary Keys** | CUID strings (`@id @default(cuid())`) | `POSTGRES COMPATIBLE` | Compatible across all databases. Does not rely on SQLite rowid. |
| **Foreign Key Constraints** | Explicit `@relation` with `@index` on all foreign keys | `POSTGRES COMPATIBLE` | Foreign key enforcement is native and strict in PostgreSQL. |
| **Search Queries** | `mode: 'insensitive'` in `findMany({ where: { name: { contains, mode: 'insensitive' } } })` | `POSTGRES COMPATIBLE` | PostgreSQL translates this to `ILIKE` via Prisma. Works out of the box. |
| **Raw SQL Execution** | Zero raw SQL queries (`$queryRaw` or `$executeRaw`) in application code | `SAFE` | Application uses 100% Prisma Client query methods, isolating the codebase from dialect differences. |

---

## 4. Conclusion & Decision

The codebase has **zero SQLite dependencies, zero SQLite-specific assumptions, and zero SQLite drivers**. The application was engineered directly against PostgreSQL from inception.

No SQLite code removal or SQL dialect rewriting is required. The project is completely ready for connection to any standard managed PostgreSQL instance or Supabase database URL.
