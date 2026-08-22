import { useEffect, useRef, useState } from 'preact/hooks'
import { LanguageSwitch, useI18n } from './i18n.jsx'

const logo = '/icon.webp'

export function PageFrame({ dark, toggleTheme, eyebrow, title, intro, install, children }) {
  const { t } = useI18n()
  const pageClass = `page-${eyebrow.replaceAll(' ', '-')}`
  const [copied, setCopied] = useState(false)
  const copyInstall = () => {
    const done = () => { setCopied(true); window.setTimeout(() => setCopied(false), 2000) }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(install).then(done).catch(() => {
        const el = document.createElement('textarea')
        el.value = install
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        done()
      })
    } else { done() }
  }
  return <div className={`site-shell content-page ${pageClass}`}><PageHeader dark={dark} toggleTheme={toggleTheme} /><main className="content-wrap page-main"><div className="page-hero"><div className="directory-kicker">/ {eyebrow}</div><div className="page-hero-grid"><h1>{title}</h1><div>{intro ? <p>{typeof intro === 'string' ? renderInline(intro) : intro}</p> : null}{install ? <button className="hero-install page-install" type="button" onClick={copyInstall} title={t('pageFrame.copyLabel')} aria-label={t('pageFrame.copyLabel')}><i>$</i> {install}{copied ? <span className="copy-pop">{t('pageFrame.copied')}</span> : null}</button> : null}</div></div></div>{children}</main><SiteFooter /></div>
}

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="footer content-wrap">
      <div className="footer-brand-row"><div className="brand footer-brand"><img src={logo} alt="" width="29" height="29" /><span>dbwarden</span></div><span className="footer-tagline">{t('footer.tagline')}</span></div>
      <div className="footer-grid">
        <div className="footer-col"><h4>{t('footer.toolScope')}</h4><a href="/why">{t('nav.why')}</a><a href="/how-it-works">{t('nav.howItWorks')}</a><a href="/tool-scope">{t('nav.toolScope')}</a><a href="/cli">{t('nav.cliReference')}</a></div>
        <div className="footer-col"><h4>{t('footer.databasesAndApps')}</h4><a href="/databases">{t('nav.databases')}</a><a href="/fastapi">{t('nav.fastapi')}</a><a href="/correctness">{t('nav.correctness')}</a><a href="/plugins">{t('nav.plugins')}</a></div>
        <div className="footer-col"><h4>{t('footer.compare')}</h4><a href="/compare/alembic">{t('nav.vsAlembic')}</a><a href="/compare/atlas">{t('nav.vsAtlas')}</a><a href="/compare/django-migrations">{t('nav.vsDjango')}</a><a href="/migrate-from-alembic">{t('nav.migrateFromAlembic')}</a></div>
        <div className="footer-col"><h4>{t('footer.community')}</h4><a href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">{t('footer.github')} ↗</a><a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">{t('footer.docs')} ↗</a><a href="https://harness.dbwarden.org" target="_blank" rel="noreferrer">{t('footer.harness')} ↗</a><a href="https://github.com/dbwarden-org/dbwarden/issues" target="_blank" rel="noreferrer">{t('footer.issues')} ↗</a></div>
      </div>
      <div className="footer-bottom"><span>{t('footer.openSource')}</span></div>
    </footer>
  )
}

export function ThemeSwitch({ dark, toggleTheme }) {
  const { t } = useI18n()
  return <button className={dark ? 'theme-switch is-dark' : 'theme-switch'} type="button" onClick={toggleTheme} role="switch" aria-checked={dark} aria-label={t('theme.label')}><span className={dark ? 'theme-option theme-sun' : 'theme-option theme-sun is-active'} aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg></span><span className={dark ? 'theme-option theme-moon is-active' : 'theme-option theme-moon'} aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg></span></button>
}

export function AccessibilityMenu() {
  const { t } = useI18n()
  const isBrowser = typeof window !== 'undefined'
  const [open, setOpen] = useState(false)
  // localStorage is guarded so renderToString can run these initializers in Node.
  const [fontSize, setFontSize] = useState(() => {
    if (!isBrowser) return 'normal'
    try { return localStorage.getItem('dbwarden-font-size') === 'large' ? 'large' : 'normal' } catch {}
    return 'normal'
  })
  const [contrast, setContrast] = useState(() => {
    if (!isBrowser) return false
    try { return localStorage.getItem('dbwarden-contrast') === 'high' } catch {}
    return false
  })
  const wrapRef = useRef(null)
  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize
    if (isBrowser) {
      try { localStorage.setItem('dbwarden-font-size', fontSize) } catch {}
    }
  }, [fontSize])
  useEffect(() => {
    document.documentElement.dataset.contrast = contrast ? 'high' : 'normal'
    if (isBrowser) {
      try { localStorage.setItem('dbwarden-contrast', contrast ? 'high' : 'normal') } catch {}
    }
  }, [contrast])
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  return <div className="a11y-wrap" ref={wrapRef}><button className={open ? 'a11y-button is-open' : 'a11y-button'} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="dialog" aria-label={t('accessibility.label')}><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="1.6" /><path d="M12 9.8v4.4" /><path d="M12 11.5 7.8 8.5" /><path d="M12 11.5l4.2-3" /><path d="M12 14.2 9.2 18.2" /><path d="M12 14.2l2.8 4" /></svg></button>{open ? <div className="a11y-panel" role="dialog" aria-label={t('accessibility.title')}><div className="a11y-row"><span className="a11y-label">{t('accessibility.fontSize')}</span><div className="a11y-seg" role="group" aria-label={t('accessibility.fontSize')}><button type="button" className={fontSize === 'normal' ? 'is-on' : ''} onClick={() => setFontSize('normal')} aria-pressed={fontSize === 'normal'}>{t('accessibility.normal')}</button><button type="button" className={fontSize === 'large' ? 'is-on' : ''} onClick={() => setFontSize('large')} aria-pressed={fontSize === 'large'}><span className="a11y-big">{t('accessibility.large')}</span></button></div></div><div className="a11y-row"><span className="a11y-label">{t('accessibility.highContrast')}</span><div className="a11y-seg" role="group" aria-label={t('accessibility.highContrast')}><button type="button" className={!contrast ? 'is-on' : ''} onClick={() => setContrast(false)} aria-pressed={!contrast}>{t('accessibility.off')}</button><button type="button" className={contrast ? 'is-on' : ''} onClick={() => setContrast(true)} aria-pressed={contrast}>{t('accessibility.on')}</button></div></div></div> : null}</div>
}

export function PageHeader({ dark, toggleTheme }) {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menuOpen])
  const closeMenu = () => setMenuOpen(false)
  return <>
    <header className="topbar"><a className="brand" href="/" aria-label="dbwarden home"><img src={logo} alt="" width="29" height="29" /><span>dbwarden</span></a><nav className="directory-nav" aria-label="Page navigation"><NavLinks onNavigate={closeMenu} /></nav><div className="top-actions"><AccessibilityMenu /><LanguageSwitch /><ThemeSwitch dark={dark} toggleTheme={toggleTheme} /><a className="github-link" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>GitHub <span className="arrow">↗</span></a><button className={menuOpen ? 'menu-button is-open' : 'menu-button'} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? t('nav.closeNavigation') : t('nav.openNavigation')}><span /><span /><span /></button></div></header>
    <nav className={menuOpen ? 'mobile-menu is-open' : 'mobile-menu'} aria-label="Page navigation"><NavLinks onNavigate={closeMenu} /></nav>
  </>
}

function useToolScopeLinks() {
  const { t } = useI18n()
  return [
    { label: t('nav.generation'), href: '/tool-scope/generation' },
    { label: t('nav.safety'), href: '/tool-scope/safety' },
    { label: t('nav.stateAndOperations'), href: '/tool-scope/state' },
    { label: t('nav.repeatableMigrations'), href: '/tool-scope/repeatable-migrations' },
    { label: t('nav.seeds'), href: '/tool-scope/seeds' },
    { label: t('nav.observability'), href: '/tool-scope/observability' },
  ]
}

function useCompareLinks() {
  const { t } = useI18n()
  return [
    { label: t('nav.vsAlembic'), href: '/compare/alembic' },
    { label: t('nav.vsAtlas'), href: '/compare/atlas' },
    { label: t('nav.vsDjango'), href: '/compare/django-migrations' },
  ]
}

export function NavLinks({ onNavigate }) {
  const { t } = useI18n()
  const [openGroup, setOpenGroup] = useState(null)
  const toggleGroup = (key, event) => {
    if (window.matchMedia('(max-width: 850px)').matches) {
      event.preventDefault()
      setOpenGroup((current) => (current === key ? null : key))
    }
  }
  const toolScopeLinks = useToolScopeLinks()
  const compareLinks = useCompareLinks()
  return <>
    <a href="/why" onClick={onNavigate}>{t('nav.why')}</a>
    <a href="/how-it-works" onClick={onNavigate}>{t('nav.howItWorks')}</a>
    <div className={openGroup === 'tool-scope' ? 'nav-item has-dropdown is-open' : 'nav-item has-dropdown'}>
      <a href="/tool-scope" onClick={(e) => toggleGroup('tool-scope', e)}>{t('nav.toolScope')} <span className="nav-caret" aria-hidden="true">▾</span></a>
      <div className="nav-dropdown"><div className="nav-dropdown-inner">{toolScopeLinks.map((link) => <a key={link.href} href={link.href} onClick={onNavigate}>{link.label}</a>)}</div></div>
    </div>
    <a href="/databases" onClick={onNavigate}>{t('nav.databases')}</a>
    <a href="/fastapi" onClick={onNavigate}>{t('nav.fastapi')}</a>
    <a href="/plugins" onClick={onNavigate}>{t('nav.plugins')}</a>
    <div className={openGroup === 'compare' ? 'nav-item has-dropdown is-open' : 'nav-item has-dropdown'}>
      <a href="/compare" onClick={(e) => toggleGroup('compare', e)}>{t('nav.compare')} <span className="nav-caret" aria-hidden="true">▾</span></a>
      <div className="nav-dropdown"><div className="nav-dropdown-inner">{compareLinks.map((link) => <a key={link.href} href={link.href} onClick={onNavigate}>{link.label}</a>)}</div></div>
    </div>
    <a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer" onClick={onNavigate}>{t('nav.docs')} <span className="arrow">↗</span></a>
  </>
}

export function PageSection({ number, label, title, doc, children }) {
  const external = doc.startsWith('http')
  const sectionClass = label.toLowerCase().replaceAll(' ', '-')
  return <section className={`article-section section-${sectionClass}`}><div className="section-label">/ {number} <span>{label}</span><a className="section-doc" href={doc} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>Read the docs ↗</a></div><h2>{title}</h2><div className="article-body">{children}</div></section>
}

export function Aside({ title, children }) {
  return <aside className="page-aside"><strong>{title}</strong>{children}</aside>
}

// Backticks in FAQ strings become inline code, matching the <code className="inline-code">
// used in prose paragraphs elsewhere on the site.
export function renderInline(text) {
  if (!text.includes('`')) return text
  return text.split('`').map((part, index) =>
    index % 2 === 1 ? <code className="inline-code" key={index}>{part}</code> : part
  )
}

export function Faq({ items, label = 'faq', variant }) {
  const [open, setOpen] = useState(-1)
  return <section className={variant ? `faq-section faq-${variant}` : 'faq-section'}><div className="section-label">/ {label}</div><div className="faq-list">{items.map((item, index) => <details className={open === index ? 'faq-item is-open' : 'faq-item'} key={item.q} open><summary onClick={(event) => { event.preventDefault(); setOpen(open === index ? -1 : index) }}>{renderInline(item.q)}</summary><div className="faq-answer"><div className="faq-answer-inner"><p>{renderInline(item.a)}</p></div></div></details>)}</div></section>
}
