import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const bakedSiteUrl = (
    env.SITE_URL ||
    env.BETTER_AUTH_URL ||
    ''
  ).replace(/\/$/, '')
  const bakedGaMeasurementId = (env.GA_MEASUREMENT_ID || '').trim()

  return {
    server: {
      port: 3001,
    },
    envPrefix: ['VITE_', 'SITE_', 'BETTER_AUTH_', 'GA_'],
    define: {
      __BAKED_SITE_URL__: JSON.stringify(bakedSiteUrl),
      __BAKED_GA_MEASUREMENT_ID__: JSON.stringify(bakedGaMeasurementId),
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        srcDirectory: 'src',
      }),
      viteReact(),
      nitro({ preset: 'bun' }),
    ],
  }
})
