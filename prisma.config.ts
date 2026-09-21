import { defineConfig } from '@prisma/config'
import 'dotenv/config'

// Fallback DIRECT_URL to DATABASE_URL if not set (e.g. in CI or single-connection Postgres environments)
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL
}

export default defineConfig({
  schema: 'prisma/schema',
})
