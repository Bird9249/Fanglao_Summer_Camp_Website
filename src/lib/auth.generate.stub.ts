/**
 * ไฟล์นี้ใช้กับคำสั่ง `bun run auth:generate-schema` เท่านั้น
 * (Better Auth CLI ต้องการ export ชื่อ `auth`) — ไม่ใช้ใน runtime
 */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'

export const auth = betterAuth({
  database: drizzleAdapter({} as never, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
})
