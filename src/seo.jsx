import { useEffect } from 'react'

const siteUrl = 'https://dbwarden.org'
const imageUrl = `${siteUrl}/og-image.png`

const pages = {
  '/': {
    title: 'dbwarden | Declarative database migrations for SQLAlchemy',
    description: 'dbwarden turns SQLAlchemy models into deterministic, reviewable SQL migrations with explicit rollback paths, safety checks, and schema convergence.',
    type: 'WebSite',
  },
  '/why': {
    title: 'Why dbwarden | Model-native database migrations',
    description: 'Understand why dbwarden keeps SQLAlchemy models as the schema authority and treats generated SQL migrations as reviewable artifacts.',
    type: 'Article',
  },
  '/how-it-works': {
    title: 'How dbwarden works | Declare, derive, verify',
    description: 'Follow dbwarden from typed database configuration and SQLAlchemy models through deterministic generation, review, application, and convergence.',
    type: 'HowTo',
  },
  '/product-surface': {
    title: 'dbwarden product surface | Safety, state, backends, plugins',
    description: 'Explore dbwarden generation, safety classification, impact analysis, offline state, multi-database support, and plugin extensions.',
    type: 'Product',
  },
  '/plugins': {
    title: 'dbwarden plugins | Official and community extensions',
    description: 'Browse official dbwarden plugins and learn how to create compatible extensions with the dbwarden plugin template.',
    type: 'CollectionPage',
  },
  '/compare': {
    title: 'dbwarden comparisons | Choose the right migration tool',
    description: 'Compare dbwarden with Alembic, Atlas, and Django migrations by philosophy, artifacts, rollback guarantees, drift detection, and ecosystem fit.',
    type: 'CollectionPage',
  },
  '/compare/alembic': {
    title: 'dbwarden vs Alembic | Declarative SQLAlchemy migrations',
    description: 'An honest comparison of dbwarden and Alembic: source of truth, generated artifacts, rollback contracts, drift detection, offline CI, and when each tool fits best.',
    type: 'Article',
  },
  '/compare/atlas': {
    title: 'dbwarden vs Atlas | Declarative schema management compared',
    description: 'A detailed comparison of dbwarden and Atlas: schema location, runtime, declarative modes, versioned artifacts, rollback, drift, safety, CI, and ecosystem fit.',
    type: 'Article',
  },
  '/compare/django-migrations': {
    title: 'dbwarden vs Django migrations | Model-driven SQLAlchemy migrations',
    description: 'A detailed comparison of dbwarden and Django migrations: model-driven workflows, artifacts, rollback, renames, drift, coupling, offline state, and backend support.',
    type: 'Article',
  },
}

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

export function Seo() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/'
    const page = pages[path] || pages['/']
    const canonical = `${siteUrl}${path === '/' ? '/' : path}`

    document.title = page.title
    setMeta('name', 'description', page.description)
    setMeta('name', 'keywords', 'dbwarden, SQLAlchemy migrations, declarative database migrations, database schema management, plain SQL migrations, schema drift, database safety')
    setMeta('name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('property', 'og:type', page.type === 'Article' ? 'article' : 'website')
    setMeta('property', 'og:site_name', 'dbwarden')
    setMeta('property', 'og:title', page.title)
    setMeta('property', 'og:description', page.description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:image:alt', 'dbwarden declarative database migration infrastructure')
    setMeta('property', 'og:locale', 'en_US')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', page.title)
    setMeta('name', 'twitter:description', page.description)
    setMeta('name', 'twitter:image', imageUrl)
    setMeta('name', 'twitter:image:alt', 'dbwarden declarative database migration infrastructure')
    setLink('canonical', canonical)

    const existingSchema = document.getElementById('dbwarden-jsonld')
    if (existingSchema) existingSchema.remove()
    const schema = document.createElement('script')
    schema.id = 'dbwarden-jsonld'
    schema.type = 'application/ld+json'
    const schemaType = page.type === 'Article' ? 'Article' : page.type === 'CollectionPage' ? 'CollectionPage' : page.type === 'WebSite' ? 'WebSite' : 'WebPage'
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: page.title,
      description: page.description,
      url: canonical,
      image: imageUrl,
      license: 'https://opensource.org/license/mit/',
      isAccessibleForFree: true,
      codeRepository: 'https://github.com/dbwarden-org/dbwarden',
      publisher: { '@type': 'Organization', name: 'dbwarden', url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    })
    document.head.appendChild(schema)
  }, [])

  return null
}
