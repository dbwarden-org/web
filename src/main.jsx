import { useEffect, useState } from 'preact/hooks'
import { render } from 'preact'
import { lazyLoad, registerRoute, useDeferredValue } from './react-shims.jsx'
import './styles.css'
import { AccessibilityMenu, Faq, NavLinks, PageHeader, SiteFooter, ThemeSwitch } from './pages.jsx'
import { I18nProvider, useI18n, LanguageSwitch } from './i18n.jsx'
import { Seo } from './seo.jsx'

// Route-level code splitting: only the home page (shell + pages.jsx) ships in the
// initial bundle. Everything else loads on navigation, so the big content pages
// never touch users who only visit the landing page. Each loader is exported so
// the SSR pass (src/ssr.jsx) and the client boot can register the resolved
// component under the same key and render it on first paint.
export const loadAlembicAlternative = () => import('./alembic-alternative.jsx').then((m) => ({ default: m.AlembicAlternativePage }))
export const loadWhy = () => import('./why.jsx').then((m) => ({ default: m.WhyPage }))
export const loadProductSurface = () => import('./surface.jsx').then((m) => ({ default: m.ProductSurfacePage }))
export const loadTimeline = () => import('./timeline.jsx').then((m) => ({ default: m.TimelinePage }))
export const loadCompare = () => import('./compare.jsx').then((m) => ({ default: m.ComparePage }))
export const loadAlembicComparison = () => import('./compare.jsx').then((m) => ({ default: m.AlembicComparisonPage }))
export const loadAtlasComparison = () => import('./compare.jsx').then((m) => ({ default: m.AtlasComparisonPage }))
export const loadDjangoComparison = () => import('./compare.jsx').then((m) => ({ default: m.DjangoComparisonPage }))
export const loadFastapi = () => import('./fastapi.jsx').then((m) => ({ default: m.FastapiPage }))
export const loadGeneration = () => import('./features.jsx').then((m) => ({ default: m.GenerationPage }))
export const loadSafety = () => import('./features.jsx').then((m) => ({ default: m.SafetyPage }))
export const loadState = () => import('./features.jsx').then((m) => ({ default: m.StatePage }))
export const loadRepeatableMigrations = () => import('./features.jsx').then((m) => ({ default: m.RepeatableMigrationsPage }))
export const loadSeeds = () => import('./features.jsx').then((m) => ({ default: m.SeedsPage }))
export const loadObservability = () => import('./features.jsx').then((m) => ({ default: m.ObservabilityPage }))
export const loadCorrectness = () => import('./correctness.jsx').then((m) => ({ default: m.CorrectnessPage }))
export const loadDatabases = () => import('./databases.jsx').then((m) => ({ default: m.DatabasesPage }))
export const loadMigrateFromAlembic = () => import('./migrate.jsx').then((m) => ({ default: m.MigrateFromAlembicPage }))
export const loadCli = () => import('./cli.jsx').then((m) => ({ default: m.CliPage }))
export const loadNotFound = () => import('./notfound.jsx').then((m) => ({ default: m.NotFoundPage }))

const AlembicAlternativePage = lazyLoad(loadAlembicAlternative)
const WhyPage = lazyLoad(loadWhy)
const ProductSurfacePage = lazyLoad(loadProductSurface)
const TimelinePage = lazyLoad(loadTimeline)
const ComparePage = lazyLoad(loadCompare)
const AlembicComparisonPage = lazyLoad(loadAlembicComparison)
const AtlasComparisonPage = lazyLoad(loadAtlasComparison)
const DjangoComparisonPage = lazyLoad(loadDjangoComparison)
const FastapiPage = lazyLoad(loadFastapi)
const GenerationPage = lazyLoad(loadGeneration)
const SafetyPage = lazyLoad(loadSafety)
const StatePage = lazyLoad(loadState)
const RepeatableMigrationsPage = lazyLoad(loadRepeatableMigrations)
const SeedsPage = lazyLoad(loadSeeds)
const ObservabilityPage = lazyLoad(loadObservability)
const CorrectnessPage = lazyLoad(loadCorrectness)
const DatabasesPage = lazyLoad(loadDatabases)
const MigrateFromAlembicPage = lazyLoad(loadMigrateFromAlembic)
const CliPage = lazyLoad(loadCli)
const NotFoundPage = lazyLoad(loadNotFound)

// Current-route loaders, used by the boot to preload before first render (so
// the SSR'd content is never blanked by a null placeholder) and by the SSR pass.
export const routeLoaders = {
  '/alembic-alternative': loadAlembicAlternative,
  '/why': loadWhy,
  '/tool-scope': loadProductSurface,
  '/how-it-works': loadTimeline,
  '/compare': loadCompare,
  '/compare/alembic': loadAlembicComparison,
  '/compare/atlas': loadAtlasComparison,
  '/compare/django-migrations': loadDjangoComparison,
  '/fastapi': loadFastapi,
  '/tool-scope/generation': loadGeneration,
  '/tool-scope/safety': loadSafety,
  '/tool-scope/state': loadState,
  '/tool-scope/repeatable-migrations': loadRepeatableMigrations,
  '/tool-scope/seeds': loadSeeds,
  '/tool-scope/observability': loadObservability,
  '/correctness': loadCorrectness,
  '/databases': loadDatabases,
  '/migrate-from-alembic': loadMigrateFromAlembic,
  '/cli': loadCli,
}

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

export function App({ path: pathProp }) {
  const { t } = useI18n()
  // SSR renders with a path prop; the client reads it from the URL. The
  // localStorage initializer is guarded so renderToString can run in Node.
  const isBrowser = typeof window !== 'undefined'
  const path = pathProp ?? (isBrowser ? window.location.pathname.replace(/\/$/, '') : '') || '/'
  const [dark, setDark] = useState(() => {
    if (!isBrowser) return true
    try { return localStorage.getItem('dbwarden-theme') !== 'light' } catch {}
    return true
  })
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
    if (isBrowser) {
      try { localStorage.setItem('dbwarden-theme', dark ? 'dark' : 'light') } catch {}
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = dark ? '#20242b' : '#f7f9fc'
  }, [dark])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = () => setDark((value) => !value)

  const route = (node) => node

  if (path === '/alembic-alternative') {
    return route(<AlembicAlternativePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/plugins') {
    return <PluginDirectory dark={dark} toggleTheme={toggleTheme} />
  }
  if (path === '/compare') {
    return route(<ComparePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/compare/alembic') {
    return route(<AlembicComparisonPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/compare/atlas') {
    return route(<AtlasComparisonPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/compare/django-migrations') {
    return route(<DjangoComparisonPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/fastapi') {
    return route(<FastapiPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/correctness') {
    return route(<CorrectnessPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/databases') {
    return route(<DatabasesPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/migrate-from-alembic') {
    return route(<MigrateFromAlembicPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/cli') {
    return route(<CliPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/why') {
    return route(<WhyPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/how-it-works') {
    return route(<TimelinePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope/generation') {
    return route(<GenerationPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope/safety') {
    return route(<SafetyPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope/state') {
    return route(<StatePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope/repeatable-migrations') {
    return route(<RepeatableMigrationsPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope/seeds') {
    return route(<SeedsPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope/observability') {
    return route(<ObservabilityPage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path === '/tool-scope') {
    return route(<ProductSurfacePage dark={dark} toggleTheme={toggleTheme} />)
  }
  if (path !== '/') {
    return route(<NotFoundPage dark={dark} toggleTheme={toggleTheme} />)
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="dbwarden home">
          <img src={logo} alt="" width="29" height="29" />
          <span>dbwarden</span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="top-actions">
          <AccessibilityMenu />
          <LanguageSwitch />
          <ThemeSwitch dark={dark} toggleTheme={toggleTheme} />
          <a className="github-link" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>GitHub <span className="arrow">↗</span></a>
          <button className={menuOpen ? 'menu-button is-open' : 'menu-button'} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? t('nav.closeNavigation') : t('nav.openNavigation')}><span /><span /><span /></button>
        </div>
      </header>
      <nav className={menuOpen ? 'mobile-menu is-open' : 'mobile-menu'} aria-label="Primary navigation">
        <NavLinks onNavigate={() => setMenuOpen(false)} />
      </nav>

      <main id="top" className="home-main">
        <section className="hero">
          <div className="content-wrap">
            <div className="hero-grid">
              <div className="hero-copy">
                <h1>{t('home.hero.titleLine1')}<br /><em>{t('home.hero.titleLine2')}</em></h1>
                <div className="hero-subtitle">{t('home.hero.subtitle')}</div>
                <div className="hero-title-kicker">{t('home.hero.kicker')} <span>{t('home.hero.kickerSpan')}</span></div>
                <p className="hero-lede">{t('home.hero.lede')}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="https://docs.dbwarden.org/getting-started/setup/" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 3.5A2.5 2.5 0 0 1 4.5 1H14v12H4.5A2.5 2.5 0 0 0 2 15.5V3.5Z" /><path d="M2 15.5A2.5 2.5 0 0 1 4.5 13H14" /></svg>{t('home.hero.readDocs')} <span>↗</span></a>
                  <a className="button button-quiet" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>{t('home.hero.sourceGitHub')} <span>↗</span></a>
                  <button className="hero-install" type="button" onClick={copyInstall} title={t('home.hero.copyLabel')} aria-label={t('home.hero.copyLabel')}><i>$</i> {t('home.hero.install')}{copied ? <span className="copy-pop">{t('home.hero.copied')}</span> : null}</button>
                </div>
              </div>
              <div className="hero-demo" aria-label="Example: a model change and the migration dbwarden generates from it">
                <div className="hero-command"><i>$</i> {t('home.demo.command')}</div>
                <div className="hero-files">
                  <div className="hero-file">
                    <div className="hero-file-bar"><span className="hero-file-bar-dots"><i /><i /><i /></span><span className="hero-file-bar-name">{t('home.demo.modelFile')}</span><b className="muted">{t('home.demo.modelLabel')}</b></div>
                    <pre className="hero-code"><code>
                      <span>class User(Base):</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;id = Column(Integer, primary_key=True)</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;email = Column(String, unique=True)</span>
                      <span className="diff-remove">-&nbsp;&nbsp;&nbsp;username = Column(String(50))</span>
                      <span className="diff-remove">-&nbsp;&nbsp;&nbsp;bio = Column(String)</span>
                      <span className="diff-add">+&nbsp;&nbsp;&nbsp;bio = Column(Text)</span>
                    </code></pre>
                  </div>
                  <div className="hero-flow-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v10M5 9l3 3 3-3" /></svg></div>
                  <div className="hero-file">
                    <div className="hero-file-bar"><span className="hero-file-bar-dots"><i /><i /><i /></span><span className="hero-file-bar-name">{t('home.demo.migrationFile')}</span><b>{t('home.demo.migrationLabel')}</b></div>
                    <pre className="hero-code"><code>
                      <span className="sql-comment">{t('home.demo.upgrade')}</span>
                      <span>ALTER TABLE users DROP COLUMN username;</span>
                      <span>ALTER TABLE users ALTER COLUMN bio TYPE TEXT;</span>
                      <span className="sql-gap" />
                      <span className="sql-comment">{t('home.demo.rollback')}</span>
                      <span>ALTER TABLE users ADD COLUMN username VARCHAR(50);</span>
                      <span>ALTER TABLE users ALTER COLUMN bio TYPE VARCHAR;</span>
                    </code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section content-wrap why-section" id="why">
           <div className="section-label">/ 01 <span>{t('home.why.eyebrow')}</span><a className="section-doc" href="https://docs.dbwarden.org/features/" target="_blank" rel="noreferrer">{t('home.why.readGuide')} ↗</a></div>
          <div className="split-heading"><h2>{t('home.why.titleLine1')}<br /><em>{t('home.why.titleLine2')}</em></h2><p>{t('home.why.intro')}</p></div>
          <div className="declarative-split"><div><span className="comparison-label">{t('home.why.declarativeLabel')}</span><strong>{t('home.why.declarativeStrong')}</strong><p>{t('home.why.declarativeText')}</p></div><div><span className="comparison-label muted">{t('home.why.imperativeLabel')}</span><strong>{t('home.why.imperativeStrong')}</strong><p>{t('home.why.imperativeText')}</p></div></div>
          <div className="principle-grid"><div className="principle"><span>{t('home.why.principle1Number')}</span><h3>{t('home.why.principle1Title')}</h3><p>{t('home.why.principle1Text')}</p></div><div className="principle"><span>{t('home.why.principle2Number')}</span><h3>{t('home.why.principle2Title')}</h3><p>{t('home.why.principle2Text')}</p></div><div className="principle"><span>{t('home.why.principle3Number')}</span><h3>{t('home.why.principle3Title')}</h3><p>{t('home.why.principle3Text')}</p></div>
          </div>
        </section>

        <section className="section content-wrap verified-section">
          <div className="section-label">/ 02 <span>{t('home.verified.eyebrow')}</span><a className="section-doc" href="https://docs.dbwarden.org/correctness/" target="_blank" rel="noreferrer">{t('home.verified.docs')} ↗</a></div>
          <div className="split-heading"><h2>{t('home.verified.titleLine1')}<br /><em>{t('home.verified.titleLine2')}</em></h2><p>{t('home.verified.intro')}</p></div>
          <div className="fit-grid">
            <div><strong>{t('home.verified.convergence')}</strong><p>{t('home.verified.convergenceText')}</p><a className="text-link" href="/correctness">{t('home.verified.convergenceLink')} <span>↗</span></a></div>
            <div><strong>{t('home.verified.roundTrip')}</strong><p>{t('home.verified.roundTripText')}</p><a className="text-link" href="https://docs.dbwarden.org/correctness/round-trip-verification/" target="_blank" rel="noreferrer">{t('home.verified.roundTripLink')} <span>↗</span></a></div>
            <div><strong>{t('home.verified.realBackends')}</strong><p>{t('home.verified.realBackendsText')}</p><a className="text-link" href="https://github.com/dbwarden-org/dbwarden-harness" target="_blank" rel="noreferrer">{t('home.verified.realBackendsLink')} <span>↗</span></a></div>
            <div><strong>{t('home.verified.honestComparisons')}</strong><p>{t('home.verified.honestComparisonsText')}</p><a className="text-link" href="/compare">{t('home.verified.honestComparisonsLink')} <span>↗</span></a></div>
          </div>
        </section>

        <section className="section content-wrap docs-section" id="docs">
          <div className="section-label">/ 03 <span>{t('home.docs.eyebrow')}</span><a className="section-doc" href="/compare">{t('home.docs.allComparisons')} <span>↗</span></a></div>
          <div className="split-heading"><h2>{t('home.docs.titleLine1')}<br /><em>{t('home.docs.titleLine2')}</em></h2><p>{t('home.docs.intro')}</p></div>
          <div className="docs-grid">
            <a className="docs-link" href="/compare/alembic"><strong>{t('home.docs.vsAlembic')}</strong><p>{t('home.docs.vsAlembicText')}</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/compare/atlas"><strong>{t('home.docs.vsAtlas')}</strong><p>{t('home.docs.vsAtlasText')}</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/compare"><strong>{t('home.docs.compare')}</strong><p>{t('home.docs.compareText')}</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/fastapi"><strong>{t('home.docs.fastapi')}</strong><p>{t('home.docs.fastapiText')}</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/migrate-from-alembic"><strong>{t('home.docs.migrate')}</strong><p>{t('home.docs.migrateText')}</p><span className="card-arrow">↗</span></a>
            <a className="docs-link" href="/correctness"><strong>{t('home.docs.correctness')}</strong><p>{t('home.docs.correctnessText')}</p><span className="card-arrow">↗</span></a>
          </div>
          <div className="docs-more"><span>{t('home.docs.alreadyUsing')}</span>{docsLinks.map((link) => <a key={link.title} href={link.href} target="_blank" rel="noreferrer">{link.title} <span>↗</span></a>)}<a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">{t('home.docs.allDocs')} <span>↗</span></a></div>
        </section>

        <div className="content-wrap home-faq"><Faq items={[
          { q: t('home.faq.existing.q'), a: t('home.faq.existing.a') },
          { q: t('home.faq.supported.q'), a: t('home.faq.supported.a') },
          { q: t('home.faq.different.q'), a: t('home.faq.different.a') },
          { q: t('home.faq.withoutDb.q'), a: t('home.faq.withoutDb.a') },
          { q: t('home.faq.verified.q'), a: t('home.faq.verified.a') },
          { q: t('home.faq.framework.q'), a: t('home.faq.framework.a') },
        ]} /></div>

        <section className="cta-section community-section"><div className="content-wrap community-inner"><div><div className="section-label">/ 04 <span>{t('home.community.eyebrow')}</span></div><h2>{t('home.community.titleLine1')}<br /><em>{t('home.community.titleLine2')}</em></h2><p>{t('home.community.text')}</p></div><div className="community-actions"><a className="button button-primary" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">{t('home.community.source')} <span>↗</span></a><div className="community-links"><a href="https://github.com/dbwarden-org/dbwarden/issues" target="_blank" rel="noreferrer">{t('home.community.issues')} ↗</a><a href="https://github.com/dbwarden-org/dbwarden/releases" target="_blank" rel="noreferrer">{t('home.community.releases')} ↗</a><a href="https://github.com/dbwarden-org/dbwarden-plugin-template" target="_blank" rel="noreferrer">{t('home.community.pluginTemplate')} ↗</a></div></div></div></section>
      </main>

      <SiteFooter />
    </div>
  )
}

function PluginDirectory({ dark, toggleTheme }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [activeTier, setActiveTier] = useState(null)
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
       <div className="directory-intro"><div><h1>dbwarden Plugins<br /><em>and Extensions.</em></h1></div><p>Official plugins add database objects, lifecycle hooks, seeds, and sandbox validation. Anyone can write more with the plugin template. Everything is open source and MIT licensed.</p></div>
      <section className="directory-trust"><div className="section-label">/ how trust works</div><div className="trust-split"><div className="trust-copy"><p>dbwarden classifies every plugin before loading it. Official plugins are built and provenance-verified by the dbwarden organization. Community plugins are never imported until you consent to that exact version in .dbwarden/consent.toml.</p></div><div className="trust-grid">{[{ label: 'Official', text: 'Built by the dbwarden org. Provenance verified at install time; installs fail closed when verification is unavailable.' }, { label: 'Verified', text: 'Community plugins that passed the dbwarden plugin test standard and manual review.' }, { label: 'Community', text: 'Any other entry point. Loaded only with explicit, version-specific consent.' }].map((tier, index) => <button key={tier.label} type="button" className={activeTier === index ? 'trust-card is-active' : 'trust-card'} onClick={() => setActiveTier(activeTier === index ? null : index)} aria-expanded={activeTier === index}><span className="trust-card-label">{tier.label}</span><span className="trust-card-body"><span className="trust-card-body-inner"><p>{tier.text}</p></span></span></button>)}</div></div></section>
       <div className="directory-template-note">All plugins follow the <a href="https://github.com/dbwarden-org/dbwarden-plugin-template" target="_blank" rel="noreferrer">dbwarden plugin template <span>↗</span></a>.</div>
       <div className="directory-create-note">Want to create plugins? <a href="https://docs.dbwarden.org/plugins/developing/overview/" target="_blank" rel="noreferrer">See the docs <span>↗</span></a>.</div>
      <div className="directory-toolbar"><div className="filter-group" aria-label="Filter plugins">{['all', 'official', 'community'].map((option) => <button type="button" className={filter === option ? 'filter-button is-active' : 'filter-button'} key={option} onClick={() => setFilter(option)}>{option}</button>)}</div><label className="plugin-search"><span>⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plugins" aria-label="Search plugins" /></label></div>
      <div className="directory-count">{visiblePlugins.length} {visiblePlugins.length === 1 ? 'plugin' : 'plugins'} found</div>
       {filter === 'community' && !deferredSearch ? <div className="community-empty">There are no community plugins yet. Want to <a href="https://github.com/dbwarden-org/dbwarden-plugin-template" target="_blank" rel="noreferrer">create the first one? <span>↗</span></a></div> : <div className="directory-grid">{visiblePlugins.map((plugin, index) => <article className="directory-card" key={plugin.name}><div className="directory-card-top"><span>0{index + 1}</span><span className={`tier-badge ${plugin.tier}`}>{plugin.tier}</span></div><h2><span className="plugin-name">{plugin.name}</span></h2><p>{plugin.description}</p><a className="text-link" href={plugin.repository} target="_blank" rel="noreferrer">View repository <span>↗</span></a></article>)}</div>}
    </main>
    <SiteFooter />
  </div>
}

function Root() {
  return (
    <I18nProvider>
      <Seo />
      <App />
    </I18nProvider>
  )
}

if (typeof document !== 'undefined') {
  ;(async () => {
    // Preload the current route so the SSR'd content is not blanked by a null
    // placeholder while its chunk resolves.
    const current = window.location.pathname.replace(/\/$/, '') || '/'
    const loader = routeLoaders[current]
    if (loader) {
      const mod = await loader()
      registerRoute(loader, mod.default)
    }
    render(<Root />, document.getElementById('root'))
  })()
}
