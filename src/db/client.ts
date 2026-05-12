import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let cached: ReturnType<typeof drizzle<typeof schema>> | undefined

export function getDb() {
  if (!cached) {
    const url = process.env.DATABASE_URL?.trim()
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set. Required for Drizzle and Better Auth.',
      )
    }
    const client = postgres(url)
    cached = drizzle(client, { schema })
  }
  return cached
}

export type DbClient = ReturnType<typeof getDb>
