import { createFileRoute } from '@tanstack/react-router'
import { MultipartInitSchema } from '~/lib/object-store/contracts'
import { createMultipartUpload } from '~/lib/object-store/multipart-upload'
import { parseJsonBody } from '~/lib/object-store/parse-json-body'
import { requireAuthApi } from '~/lib/object-store/require-auth-api'

export const Route = createFileRoute('/api/upload/multipart/init')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const unauthorized = await requireAuthApi(request)
        if (unauthorized) return unauthorized

        const parsed = await parseJsonBody(request, MultipartInitSchema)
        if (!parsed.ok) return parsed.response

        const result = await createMultipartUpload(
          parsed.data.key,
          parsed.data.contentType,
        )
        if (!result) {
          return Response.json(
            { error: 'Object store (S3/MinIO) is not configured' },
            { status: 503 },
          )
        }
        return Response.json(result)
      },
    },
  },
})
