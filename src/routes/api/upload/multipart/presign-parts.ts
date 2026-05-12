import { createFileRoute } from '@tanstack/react-router'
import { MultipartPresignPartsSchema } from '~/lib/object-store/contracts'
import { getPresignedPartUrls } from '~/lib/object-store/multipart-upload'
import { parseJsonBody } from '~/lib/object-store/parse-json-body'
import { requireAuthApi } from '~/lib/object-store/require-auth-api'

export const Route = createFileRoute('/api/upload/multipart/presign-parts')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const unauthorized = await requireAuthApi(request)
        if (unauthorized) return unauthorized

        const parsed = await parseJsonBody(request, MultipartPresignPartsSchema)
        if (!parsed.ok) return parsed.response

        const parts = await getPresignedPartUrls(
          parsed.data.key,
          parsed.data.uploadId,
          parsed.data.partNumbers,
          parsed.data.expiresIn,
        )
        if (!parts) {
          return Response.json(
            { error: 'Object store (S3/MinIO) is not configured' },
            { status: 503 },
          )
        }
        return Response.json({ parts })
      },
    },
  },
})
