import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const logo = 'https://raw.githubusercontent.com/dbwarden-org/dbwarden/refs/heads/main/assets/icon.png'

const backends = [
  { name: 'PostgreSQL', note: 'First-class round trips', code: 'PG' },
  { name: 'MySQL', note: 'Typed DDL and introspection', code: 'MY' },
  { name: 'MariaDB', note: 'Independent compatibility path', code: 'MA' },
  { name: 'ClickHouse', note: 'MergeTree-native metadata', code: 'CH' },
  { name: 'SQLite', note: 'Fast local development', code: 'SQ' },
]

const features = [
  {
    id: '01',
    title: 'Model-driven generation',
    body: 'Declare the schema in SQLAlchemy. dbwarden derives reviewable SQL migrations, snapshots, safety checks, and rollback sections from the state you actually want.',
    tag: 'source of truth',
  },
  {
    id: '02',
    title: 'Plain SQL output',
    body: 'Generated migrations are ordinary SQL files. Review them in a pull request, commit them to source control, and run them anywhere your database runs.',
    tag: 'auditable artifacts',
  },
  {
    id: '03',
    title: 'Convergence, not hope',
    body: 'Snapshots power deterministic diffs, rename detection, offline generation, and live schema checks before a migration reaches production.',
    tag: 'correctness gate',
  },
  {
    id: '04',
    title: 'Safety before speed',
    body: 'Classify destructive operations, inspect impact, require force for dangerous changes, and keep executable rollback beside every migration.',
    tag: 'deploy with context',
  },
]

const plugins = [
  { name: 'FastAPI lifecycle', detail: 'Wire migrations into application startup and keep database readiness visible.' },
  { name: 'PostgreSQL types', detail: 'Keep enums, domains, and backend-specific types in the same declarative contract.' },
  { name: 'RBAC and grants', detail: 'Express roles and permissions as reviewable database metadata.' },
  { name: 'PostgreSQL extensions', detail: 'Manage extension dependencies alongside the schema that uses them.' },
  { name: 'ClickHouse RBAC', detail: 'Apply analytical database access rules without leaving the migration workflow.' },
  { name: 'Seeds', detail: 'Create deterministic baseline data for local, test, and sandbox environments.' },
  { name: 'Sandbox validation', detail: 'Exercise generated SQL before it reaches a production connection.' },
]

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('dbwarden-theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePlugin, setActivePlugin] = useState(0)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('dbwarden-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark((value) => !value)

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="dbwarden home">
          <img src={logo} alt="" />
          <span>dbwarden</span>
        </a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          <a href="#why" onClick={() => setMenuOpen(false)}>Why dbwarden</a>
          <a href="#flow" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#surface" onClick={() => setMenuOpen(false)}>Product surface</a>
          <a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">Docs <span className="arrow">↗</span></a>
        </nav>
        <div className="top-actions">
          <button className="theme-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
            <span className="theme-icon" aria-hidden="true">{dark ? '☀' : '☾'}</span>
          </button>
          <a className="github-link" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">GitHub <span className="arrow">↗</span></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">{menuOpen ? 'Close' : 'Menu'}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero content-wrap">
          <div className="eyebrow"><span className="pulse" /> declarative schema infrastructure <span className="eyebrow-year">for SQLAlchemy</span></div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>Your models are<br /><em>your migrations.</em></h1>
              <p className="hero-lede">dbwarden turns the schema you declare into plain SQL, explicit rollback paths, and a database state you can verify before it ships.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="https://docs.dbwarden.org/getting-started/setup/" target="_blank" rel="noreferrer">Get started <span>↗</span></a>
                <a className="button button-quiet" href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">View source <span>↗</span></a>
              </div>
            </div>
            <div className="hero-preview" aria-label="Generated migration preview">
              <div className="preview-header"><span>migration preview</span><span className="preview-state">ready</span></div>
              <div className="preview-file"><strong>0001_initial.sql</strong><span>generated from model delta</span></div>
              <div className="preview-code">
                <div><i>+</i><code>CREATE TABLE accounts (</code></div>
                <div><i>+</i><code>  id UUID PRIMARY KEY,</code></div>
                <div><i>+</i><code>  email VARCHAR NOT NULL</code></div>
                <div><i>+</i><code>);</code></div>
              </div>
              <div className="preview-footer"><span>upgrade + rollback</span><b>reviewable</b></div>
            </div>
          </div>
          <div className="hero-foot"><span>SQLAlchemy 2.0+</span><span>Python 3.12+</span><span>MIT licensed</span><span>open source</span></div>
        </section>

        <section className="signal-strip" aria-label="Product capabilities">
          <div className="content-wrap signal-grid">
            <div><b>01</b><span>plain SQL output</span></div>
            <div><b>02</b><span>explicit rollbacks</span></div>
            <div><b>03</b><span>offline capable</span></div>
            <div><b>04</b><span>multi-database</span></div>
          </div>
        </section>

        <section className="section content-wrap why-section" id="why">
          <div className="section-label">/ 01 <span>the premise</span></div>
          <div className="split-heading"><h2>Stop maintaining<br /><em>two schemas.</em></h2><p>Most migration workflows make you maintain application models and migration scripts as parallel truths. When they drift, production finds out first.<br /><br />dbwarden keeps the model as the contract and makes the migration artifact derived, reviewable, and disposable.</p></div>
          <div className="principle-grid">
            <div className="principle"><span>01</span><h3>Declare the state</h3><p>Use SQLAlchemy models and typed metadata to describe what the database should be.</p></div>
            <div className="principle"><span>02</span><h3>Review the delta</h3><p>Generate SQL migrations with upgrade and rollback sections ready for a pull request.</p></div>
            <div className="principle"><span>03</span><h3>Verify the result</h3><p>Compare snapshots and live state so “migration succeeded” means more than a zero exit code.</p></div>
          </div>
        </section>

        <section className="section flow-section" id="flow">
          <div className="content-wrap">
            <div className="section-label">/ 02 <span>the operating loop</span></div>
            <div className="split-heading"><h2>One source.<br /><em>Every artifact.</em></h2><p>From model declaration to production deploy, each step leaves a concrete artifact that can be reviewed, tested, and reproduced.</p></div>
            <div className="flow-map">
              <FlowStep number="01" title="models" detail="SQLAlchemy + class Meta" active />
              <FlowStep number="02" title="make-migrations" detail="plain SQL + rollback" />
              <FlowStep number="03" title="migrate" detail="apply + snapshot" />
              <FlowStep number="04" title="diff / check" detail="drift + impact" />
            </div>
          </div>
        </section>

        <section className="section content-wrap surface-section" id="surface">
          <div className="section-label">/ 03 <span>the product surface</span></div>
          <div className="split-heading"><h2>Everything around<br />the <em>migration.</em></h2><p>dbwarden is small at the command line and broad where production risk lives: generation, safety, inspection, operations, and extensibility.</p></div>
          <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.id}><div className="feature-top"><span>{feature.id}</span><span className="feature-tag">{feature.tag}</span></div><h3>{feature.title}</h3><p>{feature.body}</p><span className="card-arrow">↗</span></article>)}</div>
        </section>

        <section className="section database-section">
          <div className="content-wrap">
            <div className="section-label">/ 04 <span>database coverage</span></div>
            <div className="split-heading"><h2>Different engines.<br /><em>Same contract.</em></h2><p>Use one declarative workflow across relational databases and analytical storage. Backend-specific metadata stays available when it matters.</p></div>
            <div className="backend-list">{backends.map((backend) => <div className="backend-row" key={backend.name}><span className="backend-code">{backend.code}</span><strong>{backend.name}</strong><span>{backend.note}</span><span className="row-arrow">↗</span></div>)}</div>
          </div>
        </section>

        <section className="section content-wrap plugin-section">
          <div className="section-label">/ 05 <span>extend the contract</span></div>
           <div className="plugin-layout"><div><h2>Core stays<br /><em>composable.</em></h2><p>Plugins add typed metadata, database objects, seeds, RBAC, FastAPI lifecycle helpers, and sandbox validation without turning the migration surface into a black box.</p><a className="text-link" href="https://docs.dbwarden.org/plugins/" target="_blank" rel="noreferrer">Explore plugins <span>↗</span></a></div><div className="plugin-list">{plugins.map((plugin, index) => <div className={activePlugin === index ? 'plugin-item is-active' : 'plugin-item'} key={plugin.name}><button type="button" aria-expanded={activePlugin === index} onClick={() => setActivePlugin(index)}><span>0{index + 1}</span><strong>{plugin.name}</strong><span className="plugin-mark">{activePlugin === index ? '−' : '+'}</span></button>{activePlugin === index && <p>{plugin.detail}</p>}</div>)}</div></div>
        </section>

        <section className="section correctness-section">
          <div className="content-wrap correctness-layout"><div><div className="section-label">/ 06 <span>correctness by design</span></div><h2>Know what<br /><em>will happen.</em></h2><p>Snapshots, safety classifiers, impact analysis, offline mode, and rollback contracts make migration behavior visible before deployment.</p><a className="button button-light" href="https://docs.dbwarden.org/correctness/convergence-gate/" target="_blank" rel="noreferrer">Read the correctness guide <span>↗</span></a></div><div className="checklist"><Check text="schema snapshots" /><Check text="deterministic diffs" /><Check text="pre-deploy impact" /><Check text="rollback contract" /><Check text="offline generation" /></div></div>
        </section>

        <section className="section content-wrap cli-section">
          <div className="section-label">/ 07 <span>the interface</span></div>
          <div className="cli-layout">
            <div><h2>Small commands.<br /><em>Serious control.</em></h2><p>Keep the daily workflow legible. The generated artifacts carry the complexity, not a hidden runtime.</p></div>
            <div className="terminal">
              <div className="terminal-bar"><span /><span /><span /><b>dbwarden / primary</b></div>
              <pre><code><i>$</i> dbwarden init
<em>created</em> dbwarden.toml
<em>created</em> migrations/

<i>$</i> dbwarden make-migrations
<span className="terminal-good">✓ migration 0001_initial.sql generated</span>
<span className="terminal-good">✓ rollback section included</span>
<span className="terminal-good">✓ convergence check passed</span></code></pre>
            </div>
          </div>
        </section>

        <section className="cta-section"><div className="content-wrap cta-inner"><img src={logo} alt="" /><div><div className="section-label">/ start here</div><h2>Your schema already<br /><em>knows the way.</em></h2></div><a className="button button-primary" href="https://docs.dbwarden.org/getting-started/setup/" target="_blank" rel="noreferrer">Read the docs <span>↗</span></a></div></section>
      </main>

      <footer className="footer content-wrap"><div className="brand footer-brand"><img src={logo} alt="" /><span>dbwarden</span></div><span>Declarative database migration infrastructure.</span><div className="footer-links"><a href="https://github.com/dbwarden-org/dbwarden" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">Docs ↗</a></div></footer>
    </div>
  )
}

function FlowStep({ number, title, detail, active }) {
  return <div className={active ? 'flow-step active' : 'flow-step'}><div className="flow-number">{number}</div><div><strong>{title}</strong><span>{detail}</span></div></div>
}

function Check({ text }) {
  return <div className="check-item"><span>✓</span>{text}</div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
