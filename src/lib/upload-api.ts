import type {
  PresignUploadInput,
} from '~/lib/object-store/contracts'

export type PresignUploadResponse = {
  uploadUrl: string
  key: string
}

export type MultipartInitResponse = { uploadId: string; key: string }
export type MultipartPresignPartsResponse = {
  parts: { partNumber: number; uploadUrl: string }[]
}
export type MultipartCompleteResponse = { key: string }

const baseUrl =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/upload`
    : `${process.env.BETTER_AUTH_URL ?? 'http://localhost:3001'}/api/upload`

async function postJson<TBody extends object, TRes>(
  path: string,
  body: TBody,
): Promise<TRes> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: string }).error)
        : `Request failed (${res.status})`,
    )
  }
  return data as TRes
}

/** เทียบกับ Admin_Web `uploadApi` — path เป็น `/api/upload/...` */
export const marketplaceUploadApi = {
  getPresignUrl: (input: PresignUploadInput) =>
    postJson<PresignUploadInput, PresignUploadResponse>('/presign', input),

  multipartInit: (input: { key: string; contentType?: string }) =>
    postJson<{ key: string; contentType?: string }, MultipartInitResponse>(
      '/multipart/init',
      input,
    ),

  multipartPresignParts: (input: {
    key: string
    uploadId: string
    partNumbers: number[]
    expiresIn?: number
  }) =>
    postJson<
      typeof input,
      MultipartPresignPartsResponse
    >('/multipart/presign-parts', input),

  multipartComplete: (input: {
    key: string
    uploadId: string
    parts: { partNumber: number; etag: string }[]
  }) =>
    postJson<typeof input, MultipartCompleteResponse>(
      '/multipart/complete',
      input,
    ),

  multipartAbort: (input: { key: string; uploadId: string }) =>
    postJson<typeof input, { ok: true }>('/multipart/abort', input),
}
