import { useEffect } from 'react'
import { absoluteUrl } from '../../lib/siteConfig'

interface SEOProps {
  /** Full page title (browser tab, OG, Twitter). */
  title: string
  /** Meta description for the page. */
  description: string
  /** Route path used to build the canonical URL, e.g. "/about". */
  path?: string
  /** Social sharing image path (absolute on the site). */
  image?: string
  /** Open Graph type. */
  type?: 'website' | 'article'
  /** Set true on pages search engines should not index (e.g. 404). */
  noindex?: boolean
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, key)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Per-route SEO metadata.
 *
 * The static defaults in index.html cover the no-JS/first-paint case; this
 * component keeps title, description, canonical, Open Graph and Twitter
 * metadata in sync whenever the route changes.
 */
export default function SEO({
  title,
  description,
  path = '/',
  image = '/images/og-image.jpg',
  type = 'website',
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const url = absoluteUrl(path)
    const imageUrl = absoluteUrl(image)

    document.title = title
    upsertMeta('name', 'description', description)
    upsertCanonical(url)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:site_name', 'Sakthi Dental Clinic')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)
  }, [title, description, path, image, type, noindex])

  return null
}
