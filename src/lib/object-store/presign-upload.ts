import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { readObjectStoreEnv, isObjectStoreConfigured } from './env'
import { createS3Client } from './s3-client'

export type PresignUploadOptions = {
  key: string
  contentType?: string
  expiresIn?: number
}

/** Presigned PUT URL — เหมือน Admin_Web `getPresignedUploadUrl` */
export async function getPresignedUploadUrl(
  options: PresignUploadOptions,
): Promise<{ uploadUrl: string; key: string } | null> {
  if (!isObjectStoreConfigured()) return null

  const { S3_BUCKET } = readObjectStoreEnv()
  if (!S3_BUCKET) return null

  const client = createS3Client()
  const expiresIn = options.expiresIn ?? 900
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: options.key,
    ...(options.contentType && { ContentType: options.contentType }),
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn })
  return { uploadUrl, key: options.key }
}
