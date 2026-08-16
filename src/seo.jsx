import { useEffect } from 'react'

const siteUrl = 'https://dbwarden.org'
const imageUrl = `${siteUrl}/og-image.png`

const pages = {
  '/': {
    title: 'dbwarden | Declarative database migrations for SQLAlchemy',
    description: 'dbwarden is a declarative migration tool for SQLAlchemy: models define the schema, and dbwarden derives reviewable plain-SQL migrations with rollback, safety checks, and schema convergence.',
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
  '/tool-scope': {
    title: 'dbwarden tool scope | Generation, safety, state, backends',
    description: 'What dbwarden covers around the generated migration: generation from models, safety classification, impact analysis, state and operations, multi-database support, and plugins.',
    type: 'Product',
  },
  '/tool-scope/generation': {
    title: 'Generation | How dbwarden derives migrations from models',
    description: 'How dbwarden generates versioned SQL migrations from SQLAlchemy models: the derived artifact, backend-specific typed metadata, and offline generation from committed state.',
    type: 'Article',
  },
  '/tool-scope/safety': {
    title: 'Safety | Classification, impact, and rollback in dbwarden',
    description: 'How dbwarden keeps schema changes safe: operation classification, application-aware impact analysis, safe type changes, and a strict rollback contract.',
    type: 'Article',
  },
  '/tool-scope/state': {
    title: 'State and operations | Inspect dbwarden migrations',
    description: 'Inspect dbwarden state: status and history, checksummed snapshots, deterministic diffs, and reverse engineering an existing database into SQLAlchemy models.',
    type: 'Article',
  },
  '/tool-scope/repeatable-migrations': {
    title: 'Repeatable migrations | Runs-always and runs-on-change',
    description: 'dbwarden migration classes: versioned, runs-always (RA__) for views and grants, and runs-on-change (ROC__) for functions, triggers, and policies.',
    type: 'Article',
  },
  '/tool-scope/seeds': {
    title: 'Seeds | Reference data tracked like migrations',
    description: 'dbwarden seeds: code seeds with a Seed base class, file seeds, seed apply and rollback, checksum drift detection, and stateless seed export for production.',
    type: 'Article',
  },
  '/tool-scope/observability': {
    title: 'Observability | Metrics and logs for dbwarden',
    description: 'dbwarden observability: Prometheus counters, gauges, and histograms from migrate and seed commands, JSON logs, and trace-level SQL output.',
    type: 'Article',
  },
  '/plugins': {
    title: 'dbwarden plugins | Official and community extensions',
    description: 'Browse official dbwarden plugins and learn how to create compatible extensions with the dbwarden plugin template.',
    type: 'CollectionPage',
  },
  '/fastapi': {
    title: 'dbwarden for FastAPI | Sessions, health, migrations',
    description: 'Wire dbwarden into FastAPI: startup schema validation, async session dependencies, health endpoints, on-demand migrations, auto-generated Pydantic schemas, and metrics.',
    type: 'Article',
  },
  '/correctness': {
    title: 'dbwarden correctness | Convergence, rollback, verification',
    description: 'How dbwarden verifies migrations: checksummed snapshots, deterministic diffs, a strict rollback contract, round-trip verification, and a convergence gate that replays your history.',
    type: 'Article',
  },
  '/databases': {
    title: 'dbwarden databases | PostgreSQL, MySQL, ClickHouse, SQLite',
    description: 'One model-driven workflow across PostgreSQL, MySQL, MariaDB, SQLite, and ClickHouse, with backend-specific metadata, dev-mode SQL translation, and multi-database support.',
    type: 'Article',
  },
  '/migrate-from-alembic': {
    title: 'Migrate from Alembic to dbwarden | Step by step',
    description: 'Switch from Alembic to dbwarden: map Alembic concepts to dbwarden equivalents, baseline an existing database, verify convergence, and retire revision scripts without losing history.',
    type: 'HowTo',
  },
  '/cli': {
    title: 'dbwarden CLI reference | Commands and flags',
    description: 'The full dbwarden command surface: authoring, execution, inspection, seeds, locking, and plugin management, with global flags for JSON output, dev mode, and diagnostics.',
    type: 'WebPage',
  },
  '/compare': {
    title: 'Which migration tool should I use? | dbwarden vs Alembic, Atlas, Django',
    description: 'Which migration tool should you use? Compare dbwarden with Alembic, Atlas, and Django migrations: where schema truth lives, what gets reviewed, rollback guarantees, drift detection, and ecosystem fit.',
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
    const page = pages[path]
    if (!page) {
      document.title = 'Page not found | dbwarden'
      setMeta('name', 'description', 'The page you are looking for does not exist on dbwarden.org.')
      setMeta('name', 'robots', 'noindex')
      setLink('canonical', siteUrl)
      return
    }
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
