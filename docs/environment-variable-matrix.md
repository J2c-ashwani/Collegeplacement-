# PlacementConnect — Environment Variable Matrix

This report audits every environment variable referenced in the application codebase, configuration files, and `.env` template.

---

## Environment Variable Reference Matrix

| Variable Name | Used By | Required in Dev? | Required in Test? | Required in Prod? | Is Secret? | Default / Fallback | Failure Behavior if Missing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Prisma Client, Base Schema | **Yes** | **Yes** | **Yes** | **YES** | None | PrismaClientInitializationError; crashes DB queries |
| `DIRECT_URL` | Prisma Migrations (PgBouncer bypass) | No | No | **Yes** | **YES** | None | Migrations fail if PgBouncer transaction mode active |
| `AUTH_SECRET` | NextAuth.js v5 | **Yes** | **Yes** | **Yes** | **YES** | None | NextAuth throws runtime error on JWT signing |
| `AUTH_URL` | NextAuth.js v5 | No | No | **Yes** | No | `http://localhost:3000` | Auth redirect fails in multi-domain/reverse-proxy setup |
| `NEXT_PUBLIC_APP_URL` | Public Links, QR Studio, Constants | No | No | **Yes** | No | `http://localhost:3000` | Uses fallback localhost; links in QR code wrong in prod |
| `NEXT_PUBLIC_APP_NAME` | SEO Metadata, Layouts, Constants | No | No | No | No | `'PlacementConnect'` | Uses `'PlacementConnect'` default |
| `NODE_ENV` | Next.js, Prisma, Security Probes | No | No | **Yes** | No | `'development'` | Enables development logging; disables strict prod checks |
| `RAZORPAY_KEY_ID` | Payment Gateway Service | No (Sandbox) | No | **Yes** | **YES** | None | Razorpay initialization throws error if payment invoked |
| `RAZORPAY_KEY_SECRET` | Payment Gateway Service | No (Sandbox) | No | **Yes** | **YES** | None | Signature verification throws error if payment invoked |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Route | No (Sandbox) | No | **Yes** | **YES** | None | Webhook signature check fails in production |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client Checkout Modal | No (Sandbox) | No | **Yes** | No | `''` | Razorpay checkout form fails to load in browser |
| `STORAGE_PROVIDER` | Document Storage Service | No | No | **Yes** | No | `'local'` | Defaults to local filesystem storage |
| `STORAGE_BUCKET` | S3 Storage Service | No (if local) | No | **Yes** (if S3) | No | `'placementconnect-documents'` | Upload fails if bucket does not exist |
| `STORAGE_REGION` | S3 Storage Service | No (if local) | No | **Yes** (if S3) | No | `'us-east-1'` | S3 client defaults to `us-east-1` |
| `STORAGE_ENDPOINT` | MinIO / Cloudflare R2 | No (if AWS S3) | No | No | No | `undefined` | Uses default AWS S3 regional endpoint |
| `STORAGE_ACCESS_KEY` | S3 Storage Service | No (if local) | No | **Yes** (if S3) | **YES** | `''` | AWS SDK throws InvalidAccessKeyId on upload |
| `STORAGE_SECRET_KEY` | S3 Storage Service | No (if local) | No | **Yes** (if S3) | **YES** | `''` | AWS SDK throws SignatureDoesNotMatch on upload |
| `RESEND_API_KEY` | Transactional Email Service | No (Dev uses console) | No | **Yes** | **YES** | None | Email dispatch logs to server console |
| `EMAIL_FROM` | Transactional Email Service | No | No | **Yes** | No | `'PlacementConnect <noreply@domain>'` | Uses generic sender address |
| `EMAIL_PROVIDER` | Email Service | No | No | **Yes** | No | `'console'` | Defaults to console logger in dev/staging |
| `HEALTH_CHECK_SECRET` | Detailed Health Probe (`/api/health`) | No | No | **Yes** | **YES** | `'dev-health-secret'` | Restricts detailed DB latency telemetry to authorized probes |
| `SUPER_ADMIN_EMAIL` | Database Seed (`prisma/seed.ts`) | No | No | No | No | `'admin@placementconnect.com'` | Uses default seed email |
| `SUPER_ADMIN_PASSWORD` | Database Seed (`prisma/seed.ts`) | No | No | No | **YES** | `'AdminPassword123!'` | Uses default seed credentials in local dev |

---

## Secret Scanning Summary

An audit of all committed source files confirmed:
- Zero real secrets, live API keys, or production passwords are committed to source.
- All credential references are bound to `process.env` or mock sandbox test tokens (`rzp_test_xxxxxxxxxxxx`).
