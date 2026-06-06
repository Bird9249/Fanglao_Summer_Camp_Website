/** แปลง object key → URL สำหรับดึงผ่าน Marketplace API — เทียบกับ Admin `resolveImageSrc` (non-key paths) */

export function marketplaceApiOrigin(): string {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.BETTER_AUTH_URL ?? 'http://localhost:3001'
}

/** พรีวิวไฟล์ใน bucket ผ่าน GET `/api/files/<key>` */
export function marketplaceFilesUrl(key: string): string {
  const segments = key.split('/').map((s) => encodeURIComponent(s))
  return `${marketplaceApiOrigin()}/api/files/${segments.join('/')}`
}
