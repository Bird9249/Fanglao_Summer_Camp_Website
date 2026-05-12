import { createFileRoute } from '@tanstack/react-router'
import { getObjectFromS3 } from '~/lib/object-store/s3-get-object'
import { requireAuthApi } from '~/lib/object-store/require-auth-api'

/** GET /api/files/* → stream จาก object store (คีย์คือ path หลัง /api/files/) — เหมือน Admin_Web */
export const Route = createFileRoute('/api/files/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const unauthorized = await requireAuthApi(request)
        if (unauthorized) return unauthorized

        const pathname = new URL(request.url).pathname
        const key = pathname.replace(/^\/api\/files\/?/, '').replace(/^\//, '')

        if (!key) {
          return Response.json({ error: 'Missing key' }, { status: 400 })
        }

        const result = await getObjectFromS3(key)
        if (!result) {
          return Response.json({ error: 'Not found' }, { status: 404 })
        }

        const headers = new Headers()
        if (result.contentType) headers.set('Content-Type', result.contentType)
        if (result.contentLength != null) {
          headers.set('Content-Length', String(result.contentLength))
        }

        return new Response(result.body, { status: 200, headers })
      },
    },
  },
})
