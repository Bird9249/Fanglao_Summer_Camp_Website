import { createFileRoute } from '@tanstack/react-router'
import { PresignUploadSchema } from '~/lib/object-store/contracts'
import { parseJsonBody } from '~/lib/object-store/parse-json-body'
import { getPresignedUploadUrl } from '~/lib/object-store/presign-upload'
import { requireAuthApi } from '~/lib/object-store/require-auth-api'

export const Route = createFileRoute('/api/upload/presign')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const unauthorized = await requireAuthApi(request)
        if (unauthorized) return unauthorized

        const parsed = await parseJsonBody(request, PresignUploadSchema)
        if (!parsed.ok) return parsed.response

        const result = await getPresignedUploadUrl(parsed.data)
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
