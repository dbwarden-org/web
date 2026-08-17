// Shared SEO data used by both the client (src/seo.jsx) and the build-time
// prerenderer (vite.config.js). Pure data and functions, no React, so the
// Vite config can import it without pulling React into the build.
export const siteUrl = 'https://dbwarden.org'
export const imageUrl = `${siteUrl}/og-image.jpg`

export const pages = {
  '/': {
    title: 'dbwarden | Declarative database migrations for SQLAlchemy',
    description: 'dbwarden is a declarative migration tool for SQLAlchemy: models define the schema, and it derives reviewable plain-SQL migrations with rollback and convergence.',
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
    description: 'What dbwarden covers around the generated migration: generation from models, safety classification, impact analysis, state, multi-database support, and plugins.',
    type: 'Product',
    label: 'Tool scope',
    crumb: [],
  },
  '/tool-scope/generation': {
    title: 'Generation | How dbwarden derives migrations from models',
    description: 'How dbwarden generates versioned SQL migrations from SQLAlchemy models: the derived artifact, typed metadata, and offline generation from committed state.',
    type: 'Article',
    label: 'Generation',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/safety': {
    title: 'Safety | Classification, impact, and rollback in dbwarden',
    description: 'How dbwarden keeps schema changes safe: operation classification, application-aware impact analysis, safe type changes, and a strict rollback contract.',
    type: 'Article',
    label: 'Safety',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/state': {
    title: 'State and operations | Inspect dbwarden migrations',
    description: 'Inspect dbwarden state: status and history, checksummed snapshots, deterministic diffs, and reverse engineering an existing database into SQLAlchemy models.',
    type: 'Article',
    label: 'State and operations',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/repeatable-migrations': {
    title: 'Repeatable migrations | Runs-always and runs-on-change',
    description: 'dbwarden migration classes: versioned, runs-always (RA__) for views and grants, and runs-on-change (ROC__) for functions, triggers, and policies.',
    type: 'Article',
    label: 'Repeatable migrations',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/seeds': {
    title: 'Seeds | Reference data tracked like migrations',
    description: 'dbwarden seeds: code seeds with a Seed base class, file seeds, seed apply and rollback, checksum drift detection, and stateless seed export for production.',
    type: 'Article',
    label: 'Seeds',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/observability': {
    title: 'Observability | Metrics and logs for dbwarden',
    description: 'dbwarden observability: Prometheus counters, gauges, and histograms from migrate and seed commands, JSON logs, and trace-level SQL output.',
    type: 'Article',
    label: 'Observability',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/plugins': {
    title: 'dbwarden plugins | Official and community extensions',
    description: 'Browse official dbwarden plugins and learn how to create compatible extensions with the dbwarden plugin template.',
    type: 'CollectionPage',
  },
  '/fastapi': {
    title: 'dbwarden for FastAPI | Sessions, health, migrations',
    description: 'Wire dbwarden into FastAPI: startup schema validation, async session dependencies, health endpoints, on-demand migrations, and auto-generated Pydantic schemas.',
    type: 'Article',
  },
  '/correctness': {
    title: 'dbwarden correctness | Convergence, rollback, verification',
    description: 'How dbwarden verifies migrations: checksummed snapshots, deterministic diffs, a strict rollback contract, round-trip verification, and a convergence gate.',
    type: 'Article',
  },
  '/databases': {
    title: 'dbwarden databases | PostgreSQL, MySQL, ClickHouse, SQLite',
    description: 'One model-driven workflow across PostgreSQL, MySQL, MariaDB, SQLite, and ClickHouse, with backend-specific metadata and dev-mode SQL translation.',
    type: 'Article',
  },
  '/migrate-from-alembic': {
    title: 'Migrate from Alembic to dbwarden | Step by step',
    description: 'Switch from Alembic to dbwarden: map concepts to equivalents, baseline an existing database, verify convergence, and retire revision scripts.',
    type: 'HowTo',
  },
  '/cli': {
    title: 'dbwarden CLI reference | Commands and flags',
    description: 'The full dbwarden command surface: authoring, execution, inspection, seeds, locking, and plugin management, with global flags for JSON output and dev mode.',
    type: 'WebPage',
  },
  '/compare': {
    title: 'Which migration tool should I use? | dbwarden vs Alembic, Atlas, Django',
    description: 'Which migration tool should you use? Compare dbwarden with Alembic, Atlas, and Django: schema truth, review artifacts, rollback guarantees, and ecosystem fit.',
    type: 'CollectionPage',
    label: 'Compare',
    crumb: [],
  },
  '/compare/alembic': {
    title: 'dbwarden vs Alembic | Declarative SQLAlchemy migrations',
    description: 'An honest comparison of dbwarden and Alembic: source of truth, generated artifacts, rollback contracts, drift detection, and offline CI.',
    type: 'Article',
    label: 'vs Alembic',
    crumb: [{ name: 'Compare', path: '/compare' }],
  },
  '/compare/atlas': {
    title: 'dbwarden vs Atlas | Declarative schema management compared',
    description: 'A detailed comparison of dbwarden and Atlas: schema location, runtime, declarative modes, versioned artifacts, rollback, drift, safety, CI, and ecosystem fit.',
    type: 'Article',
    label: 'vs Atlas',
    crumb: [{ name: 'Compare', path: '/compare' }],
  },
  '/compare/django-migrations': {
    title: 'dbwarden vs Django migrations | Model-driven SQLAlchemy migrations',
    description: 'A detailed comparison of dbwarden and Django migrations: model-driven workflows, artifacts, rollback, renames, drift, coupling, and backend support.',
    type: 'Article',
    label: 'vs Django migrations',
    crumb: [{ name: 'Compare', path: '/compare' }],
  },
}

export function canonicalFor(path) {
  return `${siteUrl}${path === '/' ? '/' : path}`
}

export function ogTypeFor(type) {
  return type === 'Article' ? 'article' : 'website'
}

export function schemaTypeFor(type) {
  return type === 'Article' ? 'Article' : type === 'CollectionPage' ? 'CollectionPage' : type === 'WebSite' ? 'WebSite' : 'WebPage'
}

export function schemaFor(path) {
  const page = pages[path]
  const canonical = canonicalFor(path)
  return {
    '@context': 'https://schema.org',
    '@type': schemaTypeFor(page.type),
    name: page.title,
    description: page.description,
    url: canonical,
    image: imageUrl,
    license: 'https://opensource.org/license/mit/',
    isAccessibleForFree: true,
    codeRepository: 'https://github.com/dbwarden-org/dbwarden',
    publisher: { '@type': 'Organization', name: 'dbwarden', url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  }
}

// BreadcrumbList for hierarchically nested pages (tool scope, compare).
// Returns null for flat pages, which get no breadcrumb markup.
export function breadcrumbFor(path) {
  const page = pages[path]
  if (!page || !('crumb' in page)) return null
  const list = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
    ...page.crumb.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.name, item: `${siteUrl}${c.path}` })),
    { '@type': 'ListItem', position: page.crumb.length + 2, name: page.label, item: canonicalFor(path) },
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  }
}
