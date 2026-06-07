/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string
  readonly BETTER_AUTH_URL?: string
  readonly GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BAKED_SITE_URL__: string
declare const __BAKED_GA_MEASUREMENT_ID__: string
