import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ffmpeg = createRequire(import.meta.url)('ffmpeg-static')
const input = path.join(root, 'public/videos/RecapVerticalLaoHiphop3.mp4')
const output = path.join(root, 'public/images/hero-poster.jpg')

execFileSync(
  ffmpeg,
  ['-y', '-ss', '00:00:00.5', '-i', input, '-vf', 'scale=1280:-2', '-frames:v', '1', '-q:v', '3', output],
  { stdio: 'inherit' },
)

console.log(`Wrote ${output}`)
