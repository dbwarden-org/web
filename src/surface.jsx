import { useEffect, useState } from 'react'
import { PageFrame } from './pages.jsx'

const safetyCards = [
  { title: 'Safety classifier', icon: 'shield', body: 'Classifies operations as SAFE, INFO, WARN, or CRITICAL before generation or apply.', detail: 'Destructive intent is visible before the file reaches review.', doc: 'https://docs.dbwarden.org/correctness/safety-classifier/' },
  { title: 'Impact analysis', icon: 'search', body: 'Scans Python code and templates for references to objects a destructive change would remove.', detail: 'Schema safety and application safety are checked together.', doc: 'https://docs.dbwarden.org/cookbook/06-safety-impact/' },
  { title: 'Safe type changes', icon: 'ouroboros', body: 'Expands risky type changes into an add, backfill, swap, and drop sequence when requested.', detail: 'The boring multi-step path is generated instead of improvised.', doc: 'https://docs.dbwarden.org/correctness/safety-classifier/' },
]

const backends = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'ClickHouse']
const backendPairs = [
  { lead: 'same models', result: 'one tool' },
  { lead: 'two databases', result: 'one source' },
  { lead: 'five engines', result: 'one contract' },
]

export function ProductSurfacePage({ dark, toggleTheme }) {
  const [activeSafety, setActiveSafety] = useState(0)
  const [activePair, setActivePair] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActivePair((value) => (value + 1) % backendPairs.length), 3000)
    return () => window.clearInterval(timer)
  }, [])

  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="product surface" title={<>The migration is<br /><em>only the center.</em></>} intro="dbwarden surrounds generated SQL with the controls needed to understand, verify, and operate schema change across real Python systems.">
    <SurfaceSection number="01" label="Generation" title="From model metadata to plain SQL." doc="https://docs.dbwarden.org/features/"><p>Model-driven generation covers ordinary columns and relationships, then extends into PostgreSQL indexes and policies, MySQL engines and charsets, and ClickHouse engines, codecs, projections, views, and TTLs. The metadata stays close to the model it describes.</p></SurfaceSection>
    <SurfaceSection number="02" label="Safety" title="Know what a change means before it ships." doc="https://docs.dbwarden.org/correctness/safety-classifier/"><div className="safety-accordion">{safetyCards.map((card, index) => <article className={activeSafety === index ? 'safety-card is-active' : 'safety-card'} onClick={() => setActiveSafety(index)} key={card.title}><button type="button" aria-expanded={activeSafety === index} onClick={() => setActiveSafety(index)}><span>0{index + 1}</span><strong>{card.title}</strong>{activeSafety !== index && <b>+</b>}</button>{activeSafety === index ? <div className="safety-detail"><p>{card.body}</p><span>{card.detail}</span><a href={card.doc} target="_blank" rel="noreferrer">Read the documentation ↗</a></div> : <div className="safety-closed-icon"><SafetyIcon type={card.icon} /></div>}</article>)}</div></SurfaceSection>
    <SurfaceSection number="03" label="State and operations" title="See the system at a glance." doc="https://docs.dbwarden.org/commands/status/"><div className="operations-surface"><div className="operations-copy"><p>Status, history, diff, snapshot, and check-db turn the workflow into an observable system. Generate-models can reverse-engineer an existing database into SQLAlchemy models.</p><p className="operations-note">The companion <a href="https://github.com/dbwarden-org/dbwarden-harness" target="_blank" rel="noreferrer">dbwarden test harness</a> exercises migration convergence across real database backends.</p><a className="text-link" href="https://docs.dbwarden.org/commands/status/" target="_blank" rel="noreferrer">Explore the command surface <span>↗</span></a></div><div className="operations-board"><div><span>primary</span><strong>converged</strong><b>100%</b></div><div><span>analytics</span><strong>snapshot ready</strong><b>04</b></div><div><span>pending delta</span><strong>add bio</strong><b>01</b></div><div><span>generation mode</span><strong>offline capable</strong><b>CI</b></div></div></div></SurfaceSection>
    <SurfaceSection number="04" label="Backends" title="One contract. Different engines." doc="https://docs.dbwarden.org/databases/"><div className="backend-surface"><div className="backend-orbit"><div className="backend-orbit-copy" key={activePair}><span>{backendPairs[activePair].lead}</span><strong>{backendPairs[activePair].result}</strong></div><i>automatically in sync</i></div><div className="backend-stack">{backends.map((backend, index) => <div key={backend}><span>0{index + 1}</span><strong>{backend}</strong><em>{index === 4 ? 'analytical' : 'relational'}</em></div>)}</div></div></SurfaceSection>
    <section className="surface-plugin-callout"><div className="section-label">/ 05 <span>plugins</span><a className="section-doc" href="/plugins">Browse directory ↗</a></div><div><h2>Keep the core focused.<br /><em>Extend the contract.</em></h2><div><p>Official plugins add FastAPI lifecycle helpers, PostgreSQL types and extensions, RBAC, ClickHouse RBAC, seeds, and sandbox validation. The whole project is fully open source under the MIT license.</p><a className="surface-doc-link" href="https://docs.dbwarden.org/plugins/developing/overview/" target="_blank" rel="noreferrer">Want to create plugins? See the docs <span>↗</span></a></div><a className="button button-primary" href="/plugins">Browse the plugin directory <span>↗</span></a></div></section>
  </PageFrame>
}

function SurfaceSection({ number, label, title, doc, children }) {
  return <section className={`article-section surface-section surface-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="section-label">/ {number} <span>{label}</span><a className="section-doc" href={doc} target="_blank" rel="noreferrer">Read the docs ↗</a></div><h2>{title}</h2><div className="article-body">{children}</div></section>
}

function SafetyIcon({ type }) {
  if (type === 'shield') return <span className="safety-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.7-2.9 8.1-7 10-4.1-1.9-7-5.3-7-10V6l7-3Z" /></svg></span>
  if (type === 'search') return <span className="safety-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5" /></svg></span>
  return <span className="safety-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M17.5 7.5A7 7 0 1 0 19 14" /><path d="m17 4 1 4-4-1M6.5 16.5A7 7 0 0 0 5 10" /><path d="m7 20-1-4 4 1" /></svg></span>
}
