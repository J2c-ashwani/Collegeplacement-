# PlacementConnect 🎓💼
### Enterprise College Placement & Placement Assurance Operating System

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_17%2F17_Green-45ba4b?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-30%2F30_Green-729B1B?style=flat-square&logo=vitest)](https://vitest.dev/)

---

## 📌 Overview

**PlacementConnect** is a full-featured, enterprise-grade B2B2C university placement management platform and placement assurance engine. Built with Next.js 16 App Router, Prisma ORM, PostgreSQL, and Auth.js v5, it bridges higher education institutions, corporate recruiters, and graduating students into an accountable, audit-ready ecosystem.

Unlike fragmented job boards, PlacementConnect manages the entire placement lifecycle: institutional roster intake, multi-tier diagnostic assessments, AI-driven job matching, campus mega-drives, verifiable offer documentation, NAAC/NIRF regulatory audit evidence, and dynamic recruiter success fees.

---

## 🏛️ Core Architectural Pillars

### 1. 🎯 Placement Assurance Engine ($3N$ Quota Model)
* **Mathematical Quota Model**: Guarantees $\text{Required Opportunities} = \text{Active Students } (N) \times 3$ qualified interview opportunities.
* **Capacity Control Tower**: Real-time tracking of confirmed corporate interview capacity vs active student commitments across regional corridors (Delhi NCR, Bangalore, Pune, Gurgaon).
* **Safe Batch Onboarding Simulator**: Automated guardrail that blocks college onboarding if the employer liquidity ratio drops below $1.20\times$.
* **Quota Conservation**: Employer-side cancellations restore candidate slots; unexcused candidate no-shows consume assurance quota.

### 2. 📊 4 Distinct Institutional Placement Denominators
Complies with official accreditation standards (NAAC Criterion 5.2.1 & NIRF Parameter 3):
1. **Cohort Placement Rate**: Placed Students / Total Graduating Roster (600 baseline)
2. **Registered Placement Rate**: Placed Students / Registered Students
3. **Paid Programme Placement Rate**: Placed Students / Enrolled Programme Students
4. **Eligible Programme Placement Rate**: Placed Students / Assessment-Cleared Assurance Students

### 3. 🧠 9-Dimension Diagnostic Assessment Engine
* 40-question comprehensive diagnostic covering Technical Readiness, Core Communication, Work Ethics, Learning Agility, Team Orientation, Problem Solving, Professional Conduct, and Interview Readiness.
* Automated generation of verifiable Employability Badges (`BADGE-2026-XXXX`) with cryptographic verification links.

### 4. 🗄️ Placement Evidence Center & NAAC/NIRF Audit Exporter
* Automated documentation gap tracker flagging uncollected offer letters, unconfirmed joining reports, and missing salary slips.
* Pre-formatted 1-click regulatory evidence export complying with NAAC Peer Review Team requirements.

### 5. 🛡️ Multi-Tenant Persona Workspaces (Zero Dead-End Navigation)
Four isolated, role-based dashboards connected through an unified navigation layer:
* **Student Portal** (`/student/*`): Profile, diagnostic scorecard, digital document vault, verified badges, job search with 1-click apply, interview calendar, offer acceptance.
* **Institution Portal** (`/institution/*`): TPO control center, batch roster manager, campus hiring drives, MoU tracker, QR registration studio, placement analytics.
* **Employer Portal** (`/employer/*`): Job postings manager, candidate pipeline with assessment benchmarks, mega-drive slot coordinator, verified hire ledger, agreement-based invoice generator.
* **Platform Operations / Admin** (`/admin/*`): Executive control tower, institutional membership reviews, cross-entity 360 search, platform configuration console, immutable audit logs.

### 6. 🔒 Enterprise Security & Compliance
* **Append-Only Audit Ledger**: Strictly immutable (`INSERT`-only) audit log with visual state-diff inspector.
* **Document Isolation**: Multi-tenant authorization barrier preventing unauthorized cross-tenant file inspection.
* **Public Verifiable Credentials**: `/verify/[id]` with 3-tier privacy controls (Public vs Employer-Visible with consent vs Strictly Redacted).
* **Atomic Financial Transactions**: Razorpay order creation, idempotent webhooks, and payment-to-entitlement activations executed in atomic `prisma.$transaction` boundaries.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3.5 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript 5.x (Strict Mode, Zero Any Leaks) |
| **Database & ORM** | PostgreSQL 16+ via Prisma ORM (multi-file schema folder) |
| **Authentication** | Auth.js v5 (NextAuth) with JWT callbacks & multi-role session context |
| **Styling & UI** | Tailwind CSS v4, Shadcn UI, Radix UI Primitives, Lucide Icons |
| **Charts & Telemetry** | Recharts & custom SVG visual gauges |
| **Payment Gateway** | Razorpay (Orders API, Signature Verification, Idempotent Webhooks) |
| **Testing** | Vitest (Unit & Integration) + Playwright Chromium (Real Browser E2E) |
| **Containerization** | Multi-stage Dockerfile & Docker Compose |

---

## 📁 Repository Structure

```text
├── prisma/
│   └── schema/              # Multi-file Prisma Schema (11 domain files, 45+ models)
│       ├── base.prisma      # DataSource & Client Configuration
│       ├── auth.prisma      # Users, Sessions, Verification Tokens, RBAC Roles
│       ├── institution.prisma # Institutions, Memberships, Plans, Rosters, MoUs
│       ├── student.prisma   # Students, Profiles, Programmes, Assessments, Badges
│       ├── employer.prisma  # Employers, Job Openings, Candidate Pipeline
│       ├── placement.prisma # Assurance Opportunities, Offers, Placements
│       ├── billing.prisma   # Orders, Invoices, Payments, Employer Fee Rules
│       ├── document.prisma  # Digital Document Vault & Verification Records
│       ├── audit.prisma     # Append-Only Immutable Audit Trail
│       ├── support.prisma   # Tickets, Notifications & Helpdesk
│       └── system.prisma    # Platform Settings & System Telemetry
├── src/
│   ├── app/                 # Next.js App Router (75 static & dynamic routes)
│   │   ├── (auth)/          # Login, Registration, Password Recovery
│   │   ├── (dashboard)/     # 4 Role-Isolated Persona Dashboards
│   │   │   ├── admin/       # Super Admin & Operations Control Tower
│   │   │   ├── employer/    # Corporate Recruiter Workspace
│   │   │   ├── institution/ # College TPO Portal
│   │   │   └── student/     # Graduating Student Portal
│   │   ├── (marketing)/     # High-Converting Public Marketing Pages
│   │   ├── api/             # 23 REST Endpoints (Auth, Payments, Documents, Webhooks)
│   │   └── verify/          # Public Verifiable Credential Lookup
│   ├── components/          # Reusable UI & Dashboard Components
│   │   ├── dashboard/       # Enterprise Data Table, Growth Control Tower
│   │   ├── layout/          # Command Palette (Cmd+K), Notification Slide-Over
│   │   └── ui/              # Radix UI + Tailwind Primitives
│   ├── lib/                 # Core Utilities, Auth Config, Prisma Client, Errors
│   ├── services/            # Business Domain Services (Matching, Capacity, Billing)
│   └── types/               # TypeScript Definitions & NextAuth Augmentations
├── docs/                    # 13 Forensic Audit & Architectural Reports
├── tests/                   # Comprehensive Automated Test Suites
│   ├── browser/             # 17 Playwright Real-Browser E2E Tests
│   ├── e2e/                 # Complete Business Journey Integration Tests
│   ├── integration/         # Security Isolation & Prisma Workflow Tests
│   └── unit/                # Business Rules & Quota Formula Unit Tests
├── Dockerfile               # Multi-Stage Production Container Build
├── docker-compose.yml       # Production/Staging Orchestration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **PostgreSQL**: `v15+` (local or managed instance e.g. Supabase, Neon, AWS RDS)

### 1. Clone the Repository
```bash
git clone https://github.com/J2c-ashwani/Collegeplacement-.git
cd Collegeplacement-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and populate your credentials:
```bash
cp .env.example .env.local
```

Key environment settings:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/placementconnect?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/placementconnect?schema=public"

# Auth.js Secret (generate with `openssl rand -base64 32`)
AUTH_SECRET="your-32-byte-base64-secret"
AUTH_URL="http://localhost:3000"

# Razorpay Sandbox Credentials
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
```

### 4. Initialize Database Schema & Seed Data
```bash
# Push Prisma schema to PostgreSQL
npx prisma db push

# Seed baseline institutions, employers, assessments, and test accounts
npm run db:seed
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

PlacementConnect is tested with 100% pass rates across unit, integration, security, and browser E2E suites:

### Run Vitest Programmatic Suite (Unit & Integration)
```bash
npx vitest run
```
* **30 of 30 tests passing**: Validates $3N$ capacity formulas, safe onboarding thresholds, 4-way placement rates, multi-tenant document isolation, and idempotent webhook processing.

### Run Playwright Browser Acceptance Suite (Chromium)
```bash
npx playwright test
```
* **17 of 17 browser journeys passing**: Validates end-to-end browser workflows across public navigation, locked institutional registration, student dashboards, recruiter pipelines, and admin command palette.

### Run Production Build & Typecheck
```bash
# Verify 0 TypeScript errors
npx tsc --noEmit

# Compile production Next.js build (75 routes)
npm run build
```

---

## 🐳 Docker Deployment

To build and run using Docker Compose:

```bash
# Build and launch application and PostgreSQL container
docker-compose up --build -d

# View application logs
docker-compose logs -f app
```

---

## 👥 Persona Login Credentials (Development Seed)

| Persona | Email | Password | Primary Route |
|---|---|---|---|
| **Super Admin** | `admin@placementconnect.internal` | `Admin@12345` | `/admin/overview` |
| **College TPO** | `tpo@apextech.ac.in` | `Tpo@12345` | `/institution/overview` |
| **Student** | `aarav.sharma@apextech.ac.in` | `Student@12345` | `/student/dashboard` |
| **Corporate Recruiter** | `recruiter@techcorp.example.com` | `Recruiter@12345` | `/employer/overview` |

---

## 📄 License & Attribution

Designed and engineered for university placement offices, training & placement officers (TPOs), corporate campus recruiters, and graduating students.

**PlacementConnect** — Empowering Transparent Higher Education Placement Ecosystems.
