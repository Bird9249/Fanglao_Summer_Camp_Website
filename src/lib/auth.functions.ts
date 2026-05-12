import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '~/lib/auth'

/** ดึง session จากคำขอปัจจุบัน — ใช้ใน `beforeLoad` ตาม [Better Auth + TanStack Start](https://better-auth.com/docs/integrations/tanstack) */
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  return session
})

/** ถ้าไม่มี session จะ throw — ใช้ป้องกัน server functions */
export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return session
  },
)
