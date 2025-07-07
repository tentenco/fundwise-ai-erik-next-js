import { drizzle } from 'drizzle-orm/neon-serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const db = drizzle(process.env.DATABASE_URL)