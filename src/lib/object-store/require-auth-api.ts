import { auth } from '~/lib/auth'

/** ป้องกัน route เหมือน Admin — ต้องล็อกอินผ่าน Better Auth cookie */
export async function requireAuthApi(request: Request): Promise<Response | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
