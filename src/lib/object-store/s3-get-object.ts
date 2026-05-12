import { GetObjectCommand } from '@aws-sdk/client-s3'
import { readObjectStoreEnv, isObjectStoreConfigured } from './env'
import { createS3Client } from './s3-client'

export type S3GetObjectResult = {
  body: ReadableStream<Uint8Array>
  contentType?: string
  contentLength?: number
}

/** Stream object จาก bucket — เหมือน Admin_Web `getObjectFromS3` */
export async function getObjectFromS3(
  key: string,
): Promise<S3GetObjectResult | null> {
  const { S3_BUCKET } = readObjectStoreEnv()
  if (!S3_BUCKET || !isObjectStoreConfigured()) return null

  try {
    const client = createS3Client()
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })

    const response = await client.send(command)
    const body = response.Body
    if (!body) return null

    const stream =
      typeof (body as { transformToWebStream?: () => ReadableStream })
        .transformToWebStream === 'function'
        ? (
            body as { transformToWebStream: () => ReadableStream }
          ).transformToWebStream()
        : (body as ReadableStream<Uint8Array>)

    return {
      body: stream as ReadableStream<Uint8Array>,
      contentType: response.ContentType ?? undefined,
      contentLength: response.ContentLength ?? undefined,
    }
  } catch {
    return null
  }
}
