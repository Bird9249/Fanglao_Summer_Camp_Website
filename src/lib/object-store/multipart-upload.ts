import {
  AbortMultipartUploadCommand,
  type CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { readObjectStoreEnv, isObjectStoreConfigured } from './env'
import { createS3Client } from './s3-client'

const DEFAULT_EXPIRES_IN = 900

export type MultipartInitResult = {
  uploadId: string
  key: string
}

export async function createMultipartUpload(
  key: string,
  contentType?: string,
): Promise<MultipartInitResult | null> {
  const bucket = readObjectStoreEnv().S3_BUCKET
  if (!isObjectStoreConfigured() || !bucket) return null

  const client = createS3Client()
  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ...(contentType && { ContentType: contentType }),
  })

  const response = await client.send(command)
  if (!response.UploadId) return null

  return { uploadId: response.UploadId, key }
}

export type PartPresignItem = { partNumber: number; uploadUrl: string }

export async function getPresignedPartUrls(
  key: string,
  uploadId: string,
  partNumbers: number[],
  expiresIn = DEFAULT_EXPIRES_IN,
): Promise<PartPresignItem[] | null> {
  const bucket = readObjectStoreEnv().S3_BUCKET
  if (!isObjectStoreConfigured() || !bucket) return null

  const client = createS3Client()
  const urls: PartPresignItem[] = []

  for (const partNumber of partNumbers) {
    const command = new UploadPartCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    })
    const uploadUrl = await getSignedUrl(client, command, { expiresIn })
    urls.push({ partNumber, uploadUrl })
  }

  return urls
}

export type CompletedPartInput = { partNumber: number; etag: string }

export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: CompletedPartInput[],
): Promise<{ key: string } | null> {
  const bucket = readObjectStoreEnv().S3_BUCKET
  if (!isObjectStoreConfigured() || !bucket) return null

  const client = createS3Client()
  const completedParts: CompletedPart[] = parts
    .sort((a, b) => a.partNumber - b.partNumber)
    .map((p) => ({ ETag: p.etag, PartNumber: p.partNumber }))

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: completedParts },
  })

  await client.send(command)
  return { key }
}

export async function abortMultipartUpload(
  key: string,
  uploadId: string,
): Promise<boolean> {
  const bucket = readObjectStoreEnv().S3_BUCKET
  if (!isObjectStoreConfigured() || !bucket) return false

  const client = createS3Client()
  const command = new AbortMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
  })

  await client.send(command)
  return true
}
