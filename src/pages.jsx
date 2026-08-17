import { useEffect, useRef, useState } from 'react'

const logo = '/icon.webp'

export function PageFrame({ dark, toggleTheme, eyebrow, title, intro, install, children }) {
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
  return <div className={`site-shell content-page ${pageClass}`}><PageHeader dark={dark} toggleTheme={toggleTheme} /><main className="content-wrap page-main"><div className="page-hero"><div className="directory-kicker">/ {eyebrow}</div><div className="page-hero-grid"><h1>{title}</h1><div>{intro ? <p>{typeof intro === 'string' ? renderInline(intro) : intro}</p> : null}{install ? <button className="hero-install page-install" type="button" onClick={copyInstall} title="Copy install command" aria-label="Copy install command"><i>$</i> {install}{copied ? <span className="copy-pop">copied</span> : null}</button> : null}</div></div></div>{children}</main><SiteFooter /></div>
}

export function SiteFooter() {
  return (
    <footer className="footer content-wrap">
      <div className="footer-brand-row"><div className="brand footer-brand"><img src={logo} alt="" width="29" height="29" /><span>dbwarden</span></div><span className="footer-tagline">Declarative database migration infrastructure for SQLAlchemy.</span></div>
      <div className="footer-grid">
        <div className="footer-col"><h4>Tool scope</h4><a href="/why">Why dbwarden</a><a href="/how-it-works">How it works</a><a href="/tool-scope">Tool scope</a><a href="/cli">CLI reference</a></div>
        <div className="footer-col"><h4>Databases & apps</h4><a href="/databases">Databases</a><a href="/fastapi">FastAPI</a><a href="/correctness">Correctness</a><a href="/plugins">Plugins</a></div>
        <div className="footer-col"><h4>Compare</h4><a href="/compare/alembic">vs Alembic</a><a href="/compare/atlas">vs Atlas</a><a href="/compare/django-migrations">vs Django migrations</a><a href="/migrate-from-alembic">Migrate from Alembic</a></div>
        <div className="footer-col"><h4>Community</h4><a href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">Docs ↗</a><a href="https://harness.dbwarden.org" target="_blank" rel="noreferrer">Harness ↗</a><a href="https://github.com/dbwarden-org/dbwarden/issues" target="_blank" rel="noreferrer">Issues ↗</a></div>
      </div>
      <div className="footer-bottom"><span>Fully open source. MIT licensed.</span></div>
    </footer>
  )
}

export function ThemeSwitch({ dark, toggleTheme }) {
  return <button className={dark ? 'theme-switch is-dark' : 'theme-switch'} type="button" onClick={toggleTheme} role="switch" aria-checked={dark} aria-label="Toggle color theme"><span className={dark ? 'theme-option theme-sun' : 'theme-option theme-sun is-active'} aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg></span><span className={dark ? 'theme-option theme-moon is-active' : 'theme-option theme-moon'} aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg></span></button>
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('dbwarden-font-size') === 'large' ? 'large' : 'normal')
  const [contrast, setContrast] = useState(() => localStorage.getItem('dbwarden-contrast') === 'high')
  const wrapRef = useRef(null)
  useEffect(() => { document.documentElement.dataset.fontSize = fontSize; localStorage.setItem('dbwarden-font-size', fontSize) }, [fontSize])
  useEffect(() => { document.documentElement.dataset.contrast = contrast ? 'high' : 'normal'; localStorage.setItem('dbwarden-contrast', contrast ? 'high' : 'normal') }, [contrast])
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  return <div className="a11y-wrap" ref={wrapRef}><button className={open ? 'a11y-button is-open' : 'a11y-button'} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="dialog" aria-label="Accessibility settings"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="1.6" /><path d="M12 9.8v4.4" /><path d="M12 11.5 7.8 8.5" /><path d="M12 11.5l4.2-3" /><path d="M12 14.2 9.2 18.2" /><path d="M12 14.2l2.8 4" /></svg></button>{open ? <div className="a11y-panel" role="dialog" aria-label="Accessibility settings"><div className="a11y-row"><span className="a11y-label">Font size</span><div className="a11y-seg" role="group" aria-label="Font size"><button type="button" className={fontSize === 'normal' ? 'is-on' : ''} onClick={() => setFontSize('normal')} aria-pressed={fontSize === 'normal'}>A</button><button type="button" className={fontSize === 'large' ? 'is-on' : ''} onClick={() => setFontSize('large')} aria-pressed={fontSize === 'large'}><span className="a11y-big">A</span></button></div></div><div className="a11y-row"><span className="a11y-label">High contrast</span><div className="a11y-seg" role="group" aria-label="High contrast"><button type="button" className={!contrast ? 'is-on' : ''} onClick={() => setContrast(false)} aria-pressed={!contrast}>Off</button><button type="button" className={contrast ? 'is-on' : ''} onClick={() => setContrast(true)} aria-pressed={contrast}>On</button></div></div></div> : null}</div>
}

export function PageHeader({ dark, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menuOpen])
  const closeMenu = () => setMenuOpen(false)
  return <>
    <header className="topbar"><a className="brand" href="/" aria-label="dbwarden home"><img src={logo} alt="" width="29" height="29" /><span>dbwarden</span></a><nav className="directory-nav" aria-label="Page navigation"><NavLinks onNavigate={closeMenu} /></nav><div className="top-actions"><AccessibilityMenu /><ThemeSwitch dark={dark} toggleTheme={toggleTheme} /><a className="github-link" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>GitHub <span className="arrow">↗</span></a><button className={menuOpen ? 'menu-button is-open' : 'menu-button'} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><span /><span /><span /></button></div></header>
    <nav className={menuOpen ? 'mobile-menu is-open' : 'mobile-menu'} aria-label="Page navigation"><NavLinks onNavigate={closeMenu} /></nav>
  </>
}

const toolScopeLinks = [
  { label: 'Generation', href: '/tool-scope/generation' },
  { label: 'Safety', href: '/tool-scope/safety' },
  { label: 'State and operations', href: '/tool-scope/state' },
  { label: 'Repeatable migrations', href: '/tool-scope/repeatable-migrations' },
  { label: 'Seeds', href: '/tool-scope/seeds' },
  { label: 'Observability', href: '/tool-scope/observability' },
]

const compareLinks = [
  { label: 'vs Alembic', href: '/compare/alembic' },
  { label: 'vs Atlas', href: '/compare/atlas' },
  { label: 'vs Django migrations', href: '/compare/django-migrations' },
]

export function NavLinks({ onNavigate }) {
  const [openGroup, setOpenGroup] = useState(null)
  const toggleGroup = (key, event) => {
    if (window.matchMedia('(max-width: 850px)').matches) {
      event.preventDefault()
      setOpenGroup((current) => (current === key ? null : key))
    }
  }
  return <>
    <a href="/why" onClick={onNavigate}>Why dbwarden</a>
    <a href="/how-it-works" onClick={onNavigate}>How it works</a>
    <div className={openGroup === 'tool-scope' ? 'nav-item has-dropdown is-open' : 'nav-item has-dropdown'}>
      <a href="/tool-scope" onClick={(e) => toggleGroup('tool-scope', e)}>Tool scope <span className="nav-caret" aria-hidden="true">▾</span></a>
      <div className="nav-dropdown"><div className="nav-dropdown-inner">{toolScopeLinks.map((link) => <a key={link.href} href={link.href} onClick={onNavigate}>{link.label}</a>)}</div></div>
    </div>
    <a href="/databases" onClick={onNavigate}>Databases</a>
    <a href="/fastapi" onClick={onNavigate}>FastAPI</a>
    <a href="/plugins" onClick={onNavigate}>Plugins</a>
    <div className={openGroup === 'compare' ? 'nav-item has-dropdown is-open' : 'nav-item has-dropdown'}>
      <a href="/compare" onClick={(e) => toggleGroup('compare', e)}>Compare <span className="nav-caret" aria-hidden="true">▾</span></a>
      <div className="nav-dropdown"><div className="nav-dropdown-inner">{compareLinks.map((link) => <a key={link.href} href={link.href} onClick={onNavigate}>{link.label}</a>)}</div></div>
    </div>
    <a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer" onClick={onNavigate}>Docs <span className="arrow">↗</span></a>
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
