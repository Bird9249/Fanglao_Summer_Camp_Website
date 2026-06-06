import montserrat400 from '@fontsource/montserrat/files/montserrat-latin-400-normal.woff2?url'
import montserrat600 from '@fontsource/montserrat/files/montserrat-latin-600-normal.woff2?url'
import montserrat700 from '@fontsource/montserrat/files/montserrat-latin-700-normal.woff2?url'
import notoLao400 from '@fontsource/noto-sans-lao/files/noto-sans-lao-lao-400-normal.woff2?url'
import notoLao700 from '@fontsource/noto-sans-lao/files/noto-sans-lao-lao-700-normal.woff2?url'

/** Preload above-the-fold fonts in parallel with CSS (breaks HTML → CSS → font chain). */
export const criticalFontPreloadLinks = [
  { rel: 'preload', as: 'font', type: 'font/woff2', href: notoLao400, crossOrigin: 'anonymous' },
  { rel: 'preload', as: 'font', type: 'font/woff2', href: notoLao700, crossOrigin: 'anonymous' },
  { rel: 'preload', as: 'font', type: 'font/woff2', href: montserrat700, crossOrigin: 'anonymous' },
  { rel: 'preload', as: 'font', type: 'font/woff2', href: montserrat600, crossOrigin: 'anonymous' },
  { rel: 'preload', as: 'font', type: 'font/woff2', href: montserrat400, crossOrigin: 'anonymous' },
] as const
