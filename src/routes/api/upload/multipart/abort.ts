import { createFileRoute } from '@tanstack/react-router'
import { MultipartAbortSchema } from '~/lib/object-store/contracts'
import { abortMultipartUpload } from '~/lib/object-store/multipart-upload'
import { parseJsonBody } from '~/lib/object-store/parse-json-body'
import { requireAuthApi } from '~/lib/object-store/require-auth-api'

export const Route = createFileRoute('/api/upload/multipart/abort')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const unauthorized = await requireAuthApi(request)
        if (unauthorized) return unauthorized

        const parsed = await parseJsonBody(request, MultipartAbortSchema)
        if (!parsed.ok) return parsed.response

        const ok = await abortMultipartUpload(
          parsed.data.key,
          parsed.data.uploadId,
        )
        if (!ok) {
          return Response.json(
            { error: 'Object store (S3/MinIO) is not configured' },
            { status: 503 },
          )
        }
        return Response.json({ ok: true })
      },
    },
  },
})
