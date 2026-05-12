import { z } from 'zod'

export const PresignUploadSchema = z.object({
  key: z.string().min(1, 'key is required'),
  contentType: z.string().optional(),
  expiresIn: z.coerce.number().min(60).max(86400).optional(),
})

export type PresignUploadInput = z.infer<typeof PresignUploadSchema>

export const MultipartInitSchema = z.object({
  key: z.string().min(1, 'key is required'),
  contentType: z.string().optional(),
})

export const MultipartPresignPartsSchema = z.object({
  key: z.string().min(1, 'key is required'),
  uploadId: z.string().min(1, 'uploadId is required'),
  partNumbers: z.array(z.coerce.number().min(1).max(10_000)),
  expiresIn: z.coerce.number().min(60).max(86400).optional(),
})

export const MultipartCompleteSchema = z.object({
  key: z.string().min(1, 'key is required'),
  uploadId: z.string().min(1, 'uploadId is required'),
  parts: z.array(
    z.object({
      partNumber: z.coerce.number().min(1).max(10_000),
      etag: z.string().min(1, 'etag is required'),
    }),
  ),
})

export const MultipartAbortSchema = z.object({
  key: z.string().min(1, 'key is required'),
  uploadId: z.string().min(1, 'uploadId is required'),
})
