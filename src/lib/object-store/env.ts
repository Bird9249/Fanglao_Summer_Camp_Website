/** อ่านค่าจาก process.env — สไตล์เดียวกับ Admin_Web `server/platform/config` (S3-compatible / MinIO) */
export type ObjectStoreEnv = {
  S3_ENDPOINT: string | undefined
  S3_BUCKET: string | undefined
  S3_ACCESS_KEY: string | undefined
  S3_SECRET_KEY: string | undefined
  S3_REGION: string
}

export function readObjectStoreEnv(): ObjectStoreEnv {
  return {
    S3_ENDPOINT: process.env.S3_ENDPOINT?.trim(),
    S3_BUCKET: process.env.S3_BUCKET?.trim(),
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY?.trim(),
    S3_SECRET_KEY: process.env.S3_SECRET_KEY?.trim(),
    S3_REGION: process.env.S3_REGION?.trim() || 'us-east-1',
  }
}

export function isObjectStoreConfigured(): boolean {
  const e = readObjectStoreEnv()
  return !!(e.S3_ENDPOINT && e.S3_BUCKET && e.S3_ACCESS_KEY && e.S3_SECRET_KEY)
}
