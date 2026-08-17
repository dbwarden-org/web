import { useEffect } from 'preact/hooks'
import { breadcrumbFor, canonicalFor, imageUrl, ogTypeFor, pages, schemaFor, siteUrl } from './seo-data.js'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function setJsonLd(id, data) {
  let script = document.getElementById(id)
  if (!data) {
    if (script) script.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function Seo() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/'
    const page = pages[path]
    if (!page) {
      document.title = 'Page not found | dbwarden'
      setMeta('name', 'description', 'The page you are looking for does not exist on dbwarden.org.')
      setMeta('name', 'robots', 'noindex')
      setLink('canonical', siteUrl)
      setJsonLd('dbwarden-jsonld', null)
      setJsonLd('dbwarden-breadcrumb-jsonld', null)
      return
    }
    const canonical = canonicalFor(path)

    document.title = page.title
    setMeta('name', 'description', page.description)
    setMeta('name', 'keywords', 'dbwarden, SQLAlchemy migrations, declarative database migrations, database schema management, plain SQL migrations, schema drift, database safety')
    setMeta('name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('property', 'og:type', ogTypeFor(page.type))
    setMeta('property', 'og:site_name', 'dbwarden')
    setMeta('property', 'og:title', page.title)
    setMeta('property', 'og:description', page.description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:width', '1376')
    setMeta('property', 'og:image:height', '768')
    setMeta('property', 'og:image:alt', 'dbwarden declarative database migration infrastructure')
    setMeta('property', 'og:locale', 'en_US')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', page.title)
    setMeta('name', 'twitter:description', page.description)
    setMeta('name', 'twitter:image', imageUrl)
    setMeta('name', 'twitter:image:alt', 'dbwarden declarative database migration infrastructure')
    setLink('canonical', canonical)
    setJsonLd('dbwarden-jsonld', schemaFor(path))
    setJsonLd('dbwarden-breadcrumb-jsonld', breadcrumbFor(path))
  }, [])

  return null
}
