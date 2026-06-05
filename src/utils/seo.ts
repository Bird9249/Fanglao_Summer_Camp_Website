import {
  getSiteUrl,
  siteSeoConfig,
  toAbsoluteUrl,
} from '~/lib/site-seo'

type PageSeoOptions = {
  title: string
  description?: string
  path?: string
  keywords?: string
  image?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}

export function pageSeo({
  title,
  description = siteSeoConfig.defaultDescription,
  path = '/',
  keywords = siteSeoConfig.defaultKeywords,
  image = siteSeoConfig.defaultOgImagePath,
  noIndex = false,
  type = 'website',
}: PageSeoOptions) {
  const siteUrl = getSiteUrl()
  const canonical = toAbsoluteUrl(path, siteUrl)
  const ogImage = toAbsoluteUrl(image, siteUrl)

  const meta = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: siteSeoConfig.siteName },
    {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteSeoConfig.siteName },
    { property: 'og:locale', content: siteSeoConfig.locale },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: title },
  ]

  return {
    meta,
    links: [{ rel: 'canonical', href: canonical }],
  }
}

/** @deprecated Use pageSeo() for full tags + canonical */
export const seo = ({
  title,
  description,
  keywords,
  image,
  path = '/',
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
  path?: string
}) => pageSeo({ title, description, keywords, image, path }).meta
