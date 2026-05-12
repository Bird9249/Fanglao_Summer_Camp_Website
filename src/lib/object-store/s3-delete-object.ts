import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { readObjectStoreEnv, isObjectStoreConfigured } from './env'
import { createS3Client } from './s3-client'

/** ลบ object ตาม key — no-op เมื่อไม่ได้ตั้งค่า store */
export async function deleteObjectFromS3(key: string): Promise<boolean> {
  const bucket = readObjectStoreEnv().S3_BUCKET
  if (!isObjectStoreConfigured() || !bucket) return true

  try {
    const client = createS3Client()
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
    return true
  } catch {
    return false
  }
}
