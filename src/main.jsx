import { lazy, StrictMode, Suspense, useDeferredValue, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './styles.css'
import { AccessibilityMenu, NavLinks, PageHeader, ThemeSwitch, WhyPage } from './pages.jsx'
import { Seo } from './seo.jsx'

// Route-level code splitting: only the home page (shell + pages.jsx) ships in the
// initial bundle. Everything else loads on navigation, so gsap (~200 kB gzip) and
// the big content pages never touch users who only visit the landing page.
const ProductSurfacePage = lazy(() => import('./surface.jsx').then((m) => ({ default: m.ProductSurfacePage })))
const TimelinePage = lazy(() => import('./timeline.jsx').then((m) => ({ default: m.TimelinePage })))
const ComparePage = lazy(() => import('./compare.jsx').then((m) => ({ default: m.ComparePage })))
const AlembicComparisonPage = lazy(() => import('./compare.jsx').then((m) => ({ default: m.AlembicComparisonPage })))
const AtlasComparisonPage = lazy(() => import('./compare.jsx').then((m) => ({ default: m.AtlasComparisonPage })))
const DjangoComparisonPage = lazy(() => import('./compare.jsx').then((m) => ({ default: m.DjangoComparisonPage })))
const FastapiPage = lazy(() => import('./fastapi.jsx').then((m) => ({ default: m.FastapiPage })))
const GenerationPage = lazy(() => import('./features.jsx').then((m) => ({ default: m.GenerationPage })))
const SafetyPage = lazy(() => import('./features.jsx').then((m) => ({ default: m.SafetyPage })))
const StatePage = lazy(() => import('./features.jsx').then((m) => ({ default: m.StatePage })))
const RepeatableMigrationsPage = lazy(() => import('./features.jsx').then((m) => ({ default: m.RepeatableMigrationsPage })))
const SeedsPage = lazy(() => import('./features.jsx').then((m) => ({ default: m.SeedsPage })))
const ObservabilityPage = lazy(() => import('./features.jsx').then((m) => ({ default: m.ObservabilityPage })))
const CorrectnessPage = lazy(() => import('./correctness.jsx').then((m) => ({ default: m.CorrectnessPage })))
const DatabasesPage = lazy(() => import('./databases.jsx').then((m) => ({ default: m.DatabasesPage })))
const MigrateFromAlembicPage = lazy(() => import('./migrate.jsx').then((m) => ({ default: m.MigrateFromAlembicPage })))
const CliPage = lazy(() => import('./cli.jsx').then((m) => ({ default: m.CliPage })))
const NotFoundPage = lazy(() => import('./notfound.jsx').then((m) => ({ default: m.NotFoundPage })))

const logo = '/icon.webp'

const docsLinks = [
  { title: 'Getting started', description: 'Install, configure, and write the first migration.', href: 'https://docs.dbwarden.org/getting-started/setup/' },
  { title: 'Features guide', description: 'What dbwarden does, end to end.', href: 'https://docs.dbwarden.org/features/' },
  { title: 'Migration files', description: 'Upgrade and rollback layout, and the migration classes.', href: 'https://docs.dbwarden.org/migration-files/' },
  { title: 'Correctness', description: 'Convergence gate, deterministic diff, rollback contract.', href: 'https://docs.dbwarden.org/correctness/' },
  { title: 'Databases', description: 'PostgreSQL, MySQL, ClickHouse, SQLite, and dev mode.', href: 'https://docs.dbwarden.org/databases/' },
  { title: 'Plugins', description: 'Official plugins, and how to write your own.', href: 'https://docs.dbwarden.org/plugins/' },
  { title: 'CLI reference', description: 'Every command and global flag.', href: 'https://docs.dbwarden.org/cli-reference/' },
  { title: 'Migrating from Alembic', description: 'The step-by-step conversion guide.', href: 'https://docs.dbwarden.org/getting-started/migrating-from-alembic/' },
  { title: 'FastAPI integration', description: 'Lifespan hooks, sessions, and health routes.', href: 'https://docs.dbwarden.org/cookbook/09-fastapi-integration/' },
]

const pluginDirectory = [
  { name: 'dbwarden-fastapi', tier: 'official', description: 'FastAPI lifecycle helpers, session dependencies, and health routes.', repository: 'https://github.com/dbwarden-org/dbwarden-fastapi' },
  { name: 'dbwarden-pgsql-types', tier: 'official', description: 'PostgreSQL enum, domain, and custom type support.', repository: 'https://github.com/dbwarden-org/dbwarden-pgsql-types' },
  { name: 'dbwarden-pgsql-rbac', tier: 'official', description: 'Roles, grants, and privilege metadata for PostgreSQL.', repository: 'https://github.com/dbwarden-org/dbwarden-pgsql-rbac' },
  { name: 'dbwarden-pgsql-extensions', tier: 'official', description: 'PostgreSQL extensions and database object handlers.', repository: 'https://github.com/dbwarden-org/dbwarden-pgsql-extensions' },
  { name: 'dbwarden-ch-rbac', tier: 'official', description: 'ClickHouse access control and RBAC metadata.', repository: 'https://github.com/dbwarden-org/dbwarden-ch-rbac' },
  { name: 'dbwarden-seeds', tier: 'official', description: 'Deterministic seed data with migration-aware rollback.', repository: 'https://github.com/dbwarden-org/dbwarden-seeds' },
  { name: 'dbwarden-sandbox', tier: 'official', description: 'Validate generated SQL in an isolated sandbox before deploy.', repository: 'https://github.com/dbwarden-org/dbwarden-sandbox' },
]

function RouteFallback() {
  return <div className="route-fallback" aria-hidden="true" />
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('dbwarden-theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyInstall = () => {
    const command = 'uv add dbwarden'
    const done = () => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(command).then(done).catch(() => {
        const el = document.createElement('textarea')
        el.value = command
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        done()
      })
    } else {
      done()
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('dbwarden-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = () => setDark((value) => !value)

  const route = (node) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>

  if (window.location.pathname.replace(/\/$/, '') === '/plugins') {
    return <PluginDirectory dark={dark} toggleTheme={toggleTheme} />
  }
  if (window.location.pathname.replace(/\/$/, '') === '/compare') {
    return route(<ComparePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/compare/alembic') {
    return route(<AlembicComparisonPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/compare/atlas') {
    return route(<AtlasComparisonPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/compare/django-migrations') {
    return route(<DjangoComparisonPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/fastapi') {
    return route(<FastapiPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/correctness') {
    return route(<CorrectnessPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/databases') {
    return route(<DatabasesPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/migrate-from-alembic') {
    return route(<MigrateFromAlembicPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/cli') {
    return route(<CliPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/why') {
    return route(<WhyPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/how-it-works') {
    return route(<TimelinePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope/generation') {
    return route(<GenerationPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope/safety') {
    return route(<SafetyPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope/state') {
    return route(<StatePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope/repeatable-migrations') {
    return route(<RepeatableMigrationsPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope/seeds') {
    return route(<SeedsPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope/observability') {
    return route(<ObservabilityPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') === '/tool-scope') {
    return route(<ProductSurfacePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (window.location.pathname.replace(/\/$/, '') !== '') {
    return route(<NotFoundPage dark={dark} toggleTheme={toggleTheme} />)
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="dbwarden home">
          <img src={logo} alt="" width="29" height="29" />
          <span>dbwarden</span>
        </a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="top-actions">
          <AccessibilityMenu />
          <ThemeSwitch dark={dark} toggleTheme={toggleTheme} />
          <a className="github-link" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>GitHub <span className="arrow">↗</span></a>
          <button className={menuOpen ? 'menu-button is-open' : 'menu-button'} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><span /><span /><span /></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="content-wrap">
            <div className="hero-grid">
              <div className="hero-copy">
                <h1>Your models are<br /><em>your migrations.</em></h1>
                <div className="hero-title-kicker">declarative schema infrastructure <span>for SQLAlchemy</span></div>
                <p className="hero-lede">Declare the schema once, in SQLAlchemy models. dbwarden derives plain SQL migrations with upgrade and rollback in the same file, and checks the result against the database. Fully open source.</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="https://docs.dbwarden.org/getting-started/setup/" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 3.5A2.5 2.5 0 0 1 4.5 1H14v12H4.5A2.5 2.5 0 0 0 2 15.5V3.5Z" /><path d="M2 15.5A2.5 2.5 0 0 1 4.5 13H14" /></svg>Read the docs <span>↗</span></a>
                  <a className="button button-quiet" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>Source on GitHub <span>↗</span></a>
                  <button className="hero-install" type="button" onClick={copyInstall} title="Copy install command" aria-label="Copy install command"><i>$</i> uv add dbwarden{copied ? <span className="copy-pop">copied</span> : null}</button>
                </div>
              </div>
              <div className="hero-demo" aria-label="Example: a model change and the migration dbwarden generates from it">
                <div className="proof-header"><span>the loop</span><span>model change → generated SQL</span></div>
                <div className="hero-panels">
                  <div className="hero-panel">
                    <span className="hero-panel-label">the model change</span>
                    <pre className="hero-code"><code>
                      <span>class User(Base):</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;id = Column(Integer, primary_key=True)</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;email = Column(String, unique=True)</span>
                      <span className="diff-remove">-&nbsp;&nbsp;&nbsp;username = Column(String(50))</span>
                      <span className="diff-mod">~&nbsp;&nbsp;&nbsp;bio = Column(Text)</span>
                    </code></pre>
                  </div>
                  <div className="hero-panel hero-panel-accent">
                    <span className="hero-panel-label">the generated migration</span>
                    <pre className="hero-code"><code>
                      <span className="sql-comment">-- upgrade</span>
                      <span>ALTER TABLE users DROP COLUMN username;</span>
                      <span>ALTER TABLE users ALTER COLUMN bio TYPE TEXT;</span>
                      <span className="sql-gap" />
                      <span className="sql-comment">-- rollback</span>
                      <span>ALTER TABLE users ADD COLUMN username VARCHAR(50);</span>
                      <span>ALTER TABLE users ALTER COLUMN bio TYPE VARCHAR;</span>
                    </code></pre>
                  </div>
                </div>
                <div className="proof-footer"><span>make-migrations "drop username, widen bio"</span><b>upgrade + rollback in one file</b></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section content-wrap why-section" id="why">
           <div className="section-label">/ 01 <span>how it works</span><a className="section-doc" href="https://docs.dbwarden.org/features/" target="_blank" rel="noreferrer">Read the guide ↗</a></div>
          <div className="split-heading"><h2>The schema lives<br /><em>in the models.</em></h2><p>Most migration workflows describe the schema twice (once in the models, once in the migration scripts), and nothing checks the two stay in agreement. The disagreement usually turns up in production.<br /><br />dbwarden derives the scripts from the models. There's one definition to maintain, and the generated SQL is easy to review and safe to delete.</p></div>
          <div className="declarative-split"><div><span className="comparison-label">declarative</span><strong>You declare the state.</strong><p>SQLAlchemy models describe what the schema should be. dbwarden generates the migration SQL, the rollback, and the checks from that one definition.</p></div><div><span className="comparison-label muted">imperative</span><strong>You write every step.</strong><p>Revision scripts describe how to get from one schema version to the next. The script chain becomes the schema's effective definition.</p></div></div>
          <div className="principle-grid"><div className="principle"><span>01</span><h3>Models, not migration scripts</h3><p>Describe the database with SQLAlchemy models and typed metadata. That's the whole schema.</p></div><div className="principle"><span>02</span><h3>Review the SQL</h3><p><code className="inline-code">make-migrations</code> produces a versioned SQL file with upgrade and rollback, ready for the pull request.</p></div><div className="principle"><span>03</span><h3>Check the database</h3><p>Snapshots and live comparisons tell you whether “migration succeeded” actually means the schema matches.</p></div>
          </div>
        </section>

        <section className="section content-wrap verified-section">
          <div className="section-label">/ 02 <span>verified</span><a className="section-doc" href="https://docs.dbwarden.org/correctness/" target="_blank" rel="noreferrer">The correctness docs ↗</a></div>
          <div className="split-heading"><h2>How the loop<br /><em>is verified.</em></h2><p>The checks on this page run in CI and in a <a className="prose-link" href="https://harness.dbwarden.org/" target="_blank" rel="noreferrer">harness</a> against real databases. Each one has a page or a repository you can read.</p></div>
          <div className="fit-grid">
            <div><strong>Convergence gate</strong><p>CI replays the full migration history on an empty database and fails the build if the resulting schema differs from the models.</p><a className="text-link" href="/correctness">How it works <span>↗</span></a></div>
            <div><strong>Round-trip verification</strong><p>A <a className="prose-link" href="https://harness.dbwarden.org/correctness/round-trips/" target="_blank" rel="noreferrer">harness</a> applies each migration and its rollback in sequence, and confirms the schema ends up where it started. Rollbacks actually run in CI, instead of existing only on paper.</p><a className="text-link" href="https://docs.dbwarden.org/correctness/round-trip-verification/" target="_blank" rel="noreferrer">Read the docs <span>↗</span></a></div>
            <div><strong>Tested on real backends</strong><p>The <a className="prose-link" href="https://harness.dbwarden.org/providers/" target="_blank" rel="noreferrer">harness</a> runs against live PostgreSQL, MySQL, and ClickHouse instances, the same engines the generated SQL targets.</p><a className="text-link" href="https://github.com/dbwarden-org/dbwarden-harness" target="_blank" rel="noreferrer">dbwarden-harness <span>↗</span></a></div>
            <div><strong>Comparisons with the honest parts</strong><p>The comparison pages state where each tool fits, including the cases where dbwarden isn't the right answer.</p><a className="text-link" href="/compare">The comparisons <span>↗</span></a></div>
          </div>
        </section>

        <section className="section content-wrap docs-section" id="docs">
          <div className="section-label">/ 03 <span>choosing a tool</span><a className="section-doc" href="/compare">All comparisons <span>↗</span></a></div>
          <div className="split-heading"><h2>Which migration tool<br /><em>should you use?</em></h2><p>Deciding between migration tools? The comparisons live on this site: where schema truth lives, what gets reviewed, and where each tool fits. The docs are for people who already chose.</p></div>
          <div className="docs-grid">
            <a className="docs-link" href="/compare"><strong>Why dbwarden</strong><p>Models as authority, plain SQL as the artifact, and where it doesn't fit.</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/compare/alembic"><strong>dbwarden vs Alembic</strong><p>Revision scripts versus derived SQL.</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/compare/atlas"><strong>dbwarden vs Atlas</strong><p>A declarative platform versus model-native schema management.</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/compare/django-migrations"><strong>dbwarden vs Django migrations</strong><p>The model-driven workflow, for non-Django SQLAlchemy stacks.</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/migrate-from-alembic"><strong>Migrate from Alembic</strong><p>Six steps, none destructive, from revision chain to models.</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/how-it-works"><strong>How dbwarden works</strong><p>The whole loop on one page, from model change to verified database.</p><span className="card-arrow">↗</span></a>
          </div>
          <div className="docs-more"><span>already using dbwarden?</span>{docsLinks.map((link) => <a key={link.title} href={link.href} target="_blank" rel="noreferrer">{link.title} <span>↗</span></a>)}<a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">All docs <span>↗</span></a></div>
        </section>

        <section className="cta-section community-section"><div className="content-wrap community-inner"><div><div className="section-label">/ 04 <span>open source</span></div><h2>Open source,<br /><em>MIT licensed.</em></h2><p>The code lives on GitHub. Read it, report a bug, or build a plugin with the template.</p></div><div className="community-actions"><a className="button button-primary" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">Source on GitHub <span>↗</span></a><div className="community-links"><a href="https://github.com/dbwarden-org/dbwarden/issues" target="_blank" rel="noreferrer">Issues ↗</a><a href="https://github.com/dbwarden-org/dbwarden/releases" target="_blank" rel="noreferrer">Releases ↗</a><a href="https://github.com/dbwarden-org/dbwarden-plugin-template" target="_blank" rel="noreferrer">Plugin template ↗</a></div></div></div></section>
      </main>

      <footer className="footer content-wrap"><div className="brand footer-brand"><img src={logo} alt="" /><span>dbwarden</span></div><span>Declarative database migration infrastructure.</span><div className="footer-links"><a href="/fastapi">FastAPI</a><a href="/databases">Databases</a><a href="/correctness">Correctness</a><a href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">Docs ↗</a></div></footer>
    </div>
  )
}

function PluginDirectory({ dark, toggleTheme }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const visiblePlugins = pluginDirectory.filter((plugin) => {
    const matchesTier = filter === 'all' || plugin.tier === filter
    const haystack = `${plugin.name} ${plugin.description}`.toLowerCase()
    return matchesTier && haystack.includes(deferredSearch.toLowerCase())
  })

  return <div className="site-shell plugin-directory-page">
    <PageHeader dark={dark} toggleTheme={toggleTheme} />
    <main className="directory-main content-wrap">
      <div className="directory-kicker">/ plugin directory</div>
       <div className="directory-intro"><div><h1>Plugins that<br /><em>leave the core alone.</em></h1></div><p>Official plugins add database objects, lifecycle hooks, seeds, and sandbox validation. Anyone can write more with the plugin template. Everything is open source and MIT licensed.</p></div>
      <section className="directory-trust"><div className="section-label">/ how trust works</div><div className="trust-split"><div className="trust-copy"><p>dbwarden classifies every plugin before loading it. Official plugins are built and provenance-verified by the dbwarden organization. Community plugins are never imported until you consent to that exact version in .dbwarden/consent.toml.</p></div><div className="trust-grid"><div className="trust-card"><span className="trust-card-label">Official</span><p>Built by the dbwarden org. Provenance verified at install time; installs fail closed when verification is unavailable.</p></div><div className="trust-card"><span className="trust-card-label">Verified</span><p>Community plugins that passed the dbwarden plugin test standard and manual review.</p></div><div className="trust-card"><span className="trust-card-label">Community</span><p>Any other entry point. Loaded only with explicit, version-specific consent.</p></div></div></div></section>
       <div className="directory-template-note">All plugins follow the <a href="https://github.com/dbwarden-org/dbwarden-plugin-template" target="_blank" rel="noreferrer">dbwarden plugin template <span>↗</span></a>.</div>
       <div className="directory-create-note">Want to create plugins? <a href="https://docs.dbwarden.org/plugins/developing/overview/" target="_blank" rel="noreferrer">See the docs <span>↗</span></a>.</div>
      <div className="directory-toolbar"><div className="filter-group" aria-label="Filter plugins">{['all', 'official', 'community'].map((option) => <button type="button" className={filter === option ? 'filter-button is-active' : 'filter-button'} key={option} onClick={() => setFilter(option)}>{option}</button>)}</div><label className="plugin-search"><span>⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plugins" aria-label="Search plugins" /></label></div>
      <div className="directory-count">{visiblePlugins.length} {visiblePlugins.length === 1 ? 'plugin' : 'plugins'} found</div>
       {filter === 'community' && !deferredSearch ? <div className="community-empty">There are no community plugins yet. Want to <a href="https://github.com/dbwarden-org/dbwarden-plugin-template" target="_blank" rel="noreferrer">create the first one? <span>↗</span></a></div> : <div className="directory-grid">{visiblePlugins.map((plugin, index) => <article className="directory-card" key={plugin.name}><div className="directory-card-top"><span>0{index + 1}</span><span className={`tier-badge ${plugin.tier}`}>{plugin.tier}</span></div><h2><span className="plugin-name">{plugin.name}</span></h2><p>{plugin.description}</p><a className="text-link" href={plugin.repository} target="_blank" rel="noreferrer">View repository <span>↗</span></a></article>)}</div>}
    </main>
    <footer className="footer content-wrap"><div className="brand footer-brand"><img src={logo} alt="" /><span>dbwarden</span></div><span>Declarative database migration infrastructure.</span><div className="footer-links"><a href="/">Home</a><a href="https://docs.dbwarden.org/plugins/" target="_blank" rel="noreferrer">Docs ↗</a></div></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<StrictMode><><Seo /><App /></></StrictMode>)
