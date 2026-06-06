import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { getDb } from '~/db/client'
import * as schema from '~/db/schema'

let _auth: ReturnType<typeof betterAuth> | undefined

function resolveSecret(): string {
  const s = process.env.BETTER_AUTH_SECRET?.trim()
  if (s && s.length >= 32) return s
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'BETTER_AUTH_SECRET is required in production (min 32 characters).',
    )
  }
  return 'dev-only-secret-min-32-chars!!!!!!!!'
}

function initAuth(): ReturnType<typeof betterAuth> {
  if (!_auth) {
    const baseURL =
      process.env.BETTER_AUTH_URL ??
      process.env.VITE_APP_URL ??
      'http://localhost:3001'

    _auth = betterAuth({
      secret: resolveSecret(),
      baseURL,
      basePath: '/api/auth',
      database: drizzleAdapter(getDb(), { provider: 'pg', schema }),
      emailAndPassword: {
        enabled: true,
      },
      trustedOrigins: [baseURL],
      // docs: tanstackStartCookies ต้องเป็นปลั๊กอินตัวสุดท้าย
      plugins: [tanstackStartCookies()],
    }) as unknown as ReturnType<typeof betterAuth>
  }
  return _auth
}

/**
 * เหมือนใน docs — `auth.handler`, `auth.api.getSession({ headers })`, ฯลฯ
 * https://better-auth.com/docs/integrations/tanstack
 */
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_target, prop, receiver) {
    const instance = initAuth()
    const value = Reflect.get(instance, prop, receiver)
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value
  },
})
