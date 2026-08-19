// Shared SEO data used by both the client (src/seo.jsx) and the build-time
// prerenderer (vite.config.js). Pure data and functions, no React, so the
// Vite config can import it without pulling React into the build.
export const siteUrl = 'https://dbwarden.org'
export const imageUrl = `${siteUrl}/og-image.png`

export const pages = {
  '/': {
    title: 'dbwarden | The Modern Alembic Alternative for SQLAlchemy',
    description: 'Declarative database migrations for SQLAlchemy. dbwarden derives reviewable SQL migrations, rollbacks, schema checks, and safety analysis from your models.',
    type: 'WebSite',
  },
  '/alembic-alternative': {
    title: 'Alembic Alternative for SQLAlchemy | dbwarden',
    description: 'Looking for an Alembic alternative? dbwarden takes a declarative, model-native approach to SQLAlchemy migrations. Compare workflows, artifacts, and rollback guarantees.',
    type: 'Article',
    label: 'Alembic alternative',
    crumb: [],
  },
  '/why': {
    title: 'Why dbwarden? Declarative Database Migrations for SQLAlchemy',
    description: 'Understand why dbwarden keeps SQLAlchemy models as the schema authority and treats generated SQL migrations as reviewable artifacts.',
    type: 'Article',
    label: 'Why dbwarden',
    crumb: [],
  },
  '/how-it-works': {
    title: 'How Declarative Database Migrations Work | dbwarden',
    description: 'Follow dbwarden from typed database configuration and SQLAlchemy models through deterministic generation, review, application, and convergence.',
    type: 'HowTo',
    label: 'How it works',
    crumb: [],
  },
  '/tool-scope': {
    title: 'dbwarden Database Migration Features | SQLAlchemy',
    description: 'What dbwarden covers around the generated migration: generation from models, safety classification, impact analysis, state, multi-database support, and plugins.',
    type: 'Product',
    label: 'Tool scope',
    crumb: [],
  },
  '/tool-scope/generation': {
    title: 'SQLAlchemy Migration Generation: Generate SQL from Models | dbwarden',
    description: 'How dbwarden generates versioned SQL migrations from SQLAlchemy models: the derived artifact, typed metadata, and offline generation from committed state.',
    type: 'Article',
    label: 'Generation',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/safety': {
    title: 'Database Migration Safety & Impact Analysis | dbwarden',
    description: 'How dbwarden keeps schema changes safe: operation classification, application-aware impact analysis, safe type changes, and a strict rollback contract.',
    type: 'Article',
    label: 'Safety',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/state': {
    title: 'Database Schema State & Drift Detection | dbwarden',
    description: 'Inspect dbwarden state: status and history, checksummed snapshots, deterministic diffs, schema drift detection, and reverse engineering an existing database into SQLAlchemy models.',
    type: 'Article',
    label: 'State and operations',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/repeatable-migrations': {
    title: 'Repeatable Database Migrations | dbwarden',
    description: 'dbwarden migration classes: versioned, runs-always (RA__) for views and grants, and runs-on-change (ROC__) for functions, triggers, and policies.',
    type: 'Article',
    label: 'Repeatable migrations',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/seeds': {
    title: 'Database Seeds & Reference Data Migrations | dbwarden',
    description: 'dbwarden seeds: code seeds with a Seed base class, file seeds, seed apply and rollback, checksum drift detection, and stateless seed export for production.',
    type: 'Article',
    label: 'Seeds',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/tool-scope/observability': {
    title: 'Database Migration Observability: Metrics & Logs | dbwarden',
    description: 'dbwarden observability: Prometheus counters, gauges, and histograms from migrate and seed commands, JSON logs, and trace-level SQL output.',
    type: 'Article',
    label: 'Observability',
    crumb: [{ name: 'Tool scope', path: '/tool-scope' }],
  },
  '/plugins': {
    title: 'dbwarden Plugins & Extensions | SQLAlchemy',
    description: 'Browse official dbwarden plugins and learn how to create compatible extensions with the dbwarden plugin template.',
    type: 'CollectionPage',
    label: 'Plugins',
    crumb: [],
  },
  '/fastapi': {
    title: 'FastAPI Database Migrations with SQLAlchemy | dbwarden',
    description: 'Wire dbwarden into FastAPI: startup schema validation, async session dependencies, health endpoints, on-demand migrations, and auto-generated Pydantic schemas.',
    type: 'Article',
    label: 'FastAPI',
    crumb: [],
  },
  '/correctness': {
    title: 'Database Migration Correctness & Verification | dbwarden',
    description: 'How dbwarden verifies migrations: checksummed snapshots, deterministic diffs, a strict rollback contract, round-trip verification, and a convergence gate.',
    type: 'Article',
    label: 'Correctness',
    crumb: [],
  },
  '/databases': {
    title: 'SQLAlchemy Database Migrations | PostgreSQL, MySQL, SQLite & ClickHouse',
    description: 'One model-driven workflow across PostgreSQL, MySQL, MariaDB, SQLite, and ClickHouse, with backend-specific metadata and dev-mode SQL translation.',
    type: 'Article',
    label: 'Databases',
    crumb: [],
  },
  '/migrate-from-alembic': {
    title: 'Migrate from Alembic to dbwarden | SQLAlchemy Migration Guide',
    description: 'Switch from Alembic to dbwarden: map concepts to equivalents, baseline an existing database, verify convergence, and retire revision scripts.',
    type: 'HowTo',
    label: 'Migrate from Alembic',
    crumb: [],
  },
  '/cli': {
    title: 'dbwarden CLI Reference | SQLAlchemy Migration Commands',
    description: 'The full dbwarden command surface: authoring, execution, inspection, seeds, locking, and plugin management, with global flags for JSON output and dev mode.',
    type: 'WebPage',
    label: 'CLI reference',
    crumb: [],
  },
  '/compare': {
    title: 'Database Migration Tools for SQLAlchemy | Compare dbwarden, Alembic & Atlas',
    description: 'Which migration tool should you use? Compare dbwarden with Alembic, Atlas, and Django: schema truth, review artifacts, rollback guarantees, and ecosystem fit.',
    type: 'CollectionPage',
    label: 'Compare',
    crumb: [],
  },
  '/compare/alembic': {
    title: 'dbwarden vs Alembic | A Declarative SQLAlchemy Migration Alternative',
    description: 'An honest comparison of dbwarden and Alembic: source of truth, generated artifacts, rollback contracts, drift detection, offline CI, and a six-step migration path.',
    type: 'Article',
    label: 'vs Alembic',
    crumb: [{ name: 'Compare', path: '/compare' }],
  },
  '/compare/atlas': {
    title: 'dbwarden vs Atlas | SQLAlchemy Schema Management Compared',
    description: 'A detailed comparison of dbwarden and Atlas: schema location, runtime, declarative modes, versioned artifacts, rollback, drift, safety, CI, and ecosystem fit.',
    type: 'Article',
    label: 'vs Atlas',
    crumb: [{ name: 'Compare', path: '/compare' }],
  },
  '/compare/django-migrations': {
    title: 'dbwarden vs Django Migrations | Model-Driven SQLAlchemy Migrations',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'dbwarden',
  url: siteUrl,
  logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.png` },
  sameAs: ['https://github.com/dbwarden-org/dbwarden'],
  description: 'Open-source declarative database migration infrastructure for SQLAlchemy.',
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'dbwarden',
  applicationCategory: 'DeveloperApplication',
  url: siteUrl,
  description: 'Declarative database migrations for SQLAlchemy. Derives reviewable SQL migrations, rollbacks, schema checks, and safety analysis from your models.',
  license: 'https://opensource.org/license/mit/',
  isAccessibleForFree: true,
  operatingSystem: 'Linux, macOS, Windows',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  softwareVersion: 'latest',
  applicationSuite: 'dbwarden',
  screenshot: imageUrl,
  featureList: 'Model-driven migration generation, rollback contracts, safety classifier, impact analysis, schema drift detection, offline generation, FastAPI integration',
  codeRepository: 'https://github.com/dbwarden-org/dbwarden',
  programmingLanguage: 'Python',
  runtimePlatform: 'Python 3.12+',
  provider: organizationSchema,
}

export function schemaFor(path) {
  const page = pages[path]
  const canonical = canonicalFor(path)
  const base = {
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
  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [softwareApplicationSchema, organizationSchema, base],
    }
  }
  return base
}

export { organizationSchema, softwareApplicationSchema }

// BreadcrumbList for every non-home page.
// Pages with crumb: [] get Home > [Page].
// Pages with crumb entries get Home > ...parents > [Page].
// The homepage never gets breadcrumbs.
export function breadcrumbFor(path) {
  if (path === '/') return null
  const page = pages[path]
  if (!page || !page.label) return null
  const crumbs = 'crumb' in page ? page.crumb : []
  const list = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
    ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.name, item: `${siteUrl}${c.path}` })),
    { '@type': 'ListItem', position: crumbs.length + 2, name: page.label, item: canonicalFor(path) },
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  }
}
