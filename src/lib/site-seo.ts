import { createIsomorphicFn } from '@tanstack/react-start'

declare const __BAKED_SITE_URL__: string

export const siteSeoConfig = {
  siteName: 'Fanglao Studio',
  defaultTitle: 'Fanglao Summer Dance Camp & Jam 2026',
  defaultDescription:
    'ຮຽນເຕັ້ນພັກແລ້ງ ຮຽນວັດທະນະທຳ ສະແດງອອກ — Summer Dance Camp 29 ມິ.ຖ.–17 ກ.ກ. 2026 ແລະ Fanglao Jam 18 ກ.ກ. 2026 ທີ່ວຽງຈັນ',
  defaultKeywords:
    'Fanglao, dance camp, hip hop, breaking, k-pop, street dance, Laos, Vientiane, summer camp, battle',
  locale: 'lo_LA',
  themeColor: '#2a1f45',
  defaultOgImagePath: '/summer-camp-logo.png',
} as const

export const publicSiteRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/register/camp', changefreq: 'weekly', priority: '0.9' },
  { path: '/register/jam', changefreq: 'monthly', priority: '0.7' },
] as const

const resolveRequestOrigin = createIsomorphicFn()
  .server(() => {
    const { getRequestUrl } = require('@tanstack/react-start/server') as typeof import('@tanstack/react-start/server')
    const url = new URL(getRequestUrl())
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return undefined
    }
    return url.origin
  })
  .client(() => undefined)

function readEnvSiteUrl() {
  const baked =
    typeof __BAKED_SITE_URL__ === 'string' && __BAKED_SITE_URL__
      ? __BAKED_SITE_URL__
      : undefined

  return (
    baked ||
    import.meta.env.SITE_URL ||
    import.meta.env.BETTER_AUTH_URL ||
    process.env.SITE_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.VITE_APP_URL
  )
}

export function getSiteUrl() {
  const fromEnv = readEnvSiteUrl()
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const fromRequest = resolveRequestOrigin()
  if (fromRequest) return fromRequest

  return 'http://localhost:3001'
}

export function toAbsoluteUrl(path: string, siteUrl = getSiteUrl()) {
  if (/^https?:\/\//i.test(path)) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildSitemapXml(siteUrl = getSiteUrl()) {
  const urls = publicSiteRoutes
    .map(
      (route) => `  <url>
    <loc>${toAbsoluteUrl(route.path, siteUrl)}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function buildRobotsTxt(siteUrl = getSiteUrl()) {
  return `User-agent: *
Allow: /

Disallow: /api/

Sitemap: ${toAbsoluteUrl('/sitemap.xml', siteUrl)}
`
}

export function campJamJsonLd(siteUrl = getSiteUrl()) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteSeoConfig.siteName,
        url: siteUrl,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteSeoConfig.defaultTitle,
        description: siteSeoConfig.defaultDescription,
        inLanguage: 'lo',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'Event',
        name: 'Fanglao Summer Dance Camp 2026',
        startDate: '2026-06-29',
        endDate: '2026-07-17',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: 'Fanglao Studio, Vientiane Center 4F',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Vientiane',
            addressCountry: 'LA',
          },
        },
        organizer: { '@id': `${siteUrl}/#organization` },
        url: toAbsoluteUrl('/register/camp', siteUrl),
      },
      {
        '@type': 'Event',
        name: 'Fanglao Jam 2026',
        startDate: '2026-07-18',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: 'Lao National Circus',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Vientiane',
            addressCountry: 'LA',
          },
        },
        organizer: { '@id': `${siteUrl}/#organization` },
        url: toAbsoluteUrl('/register/jam', siteUrl),
      },
    ],
  }
}
