import { useEffect, useState } from 'react'
import { PageFrame } from './pages.jsx'

const safetyCards = [
  { title: 'Safety classifier', body: 'Classifies operations as SAFE, INFO, WARN, or CRITICAL before generation or apply.', detail: 'Destructive intent is visible before the file reaches review.' },
  { title: 'Impact analysis', body: 'Scans Python code and templates for references to objects a destructive change would remove.', detail: 'Schema safety and application safety are checked together.' },
  { title: 'Safe type changes', body: 'Expands risky type changes into an add, backfill, swap, and drop sequence when requested.', detail: 'The boring multi-step path is generated instead of improvised.' },
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
    <SurfaceSection number="02" label="Safety" title="Know what a change means before it ships." doc="https://docs.dbwarden.org/correctness/safety-classifier/"><div className="safety-accordion">{safetyCards.map((card, index) => <article className={activeSafety === index ? 'safety-card is-active' : 'safety-card'} key={card.title}><button type="button" aria-expanded={activeSafety === index} onClick={() => setActiveSafety(index)}><span>0{index + 1}</span><strong>{card.title}</strong><b>{activeSafety === index ? '−' : '+'}</b></button>{activeSafety === index && <div className="safety-detail"><p>{card.body}</p><span>{card.detail}</span></div>}</article>)}</div></SurfaceSection>
    <SurfaceSection number="03" label="State and operations" title="See the system at a glance." doc="https://docs.dbwarden.org/commands/status/"><div className="operations-surface"><div className="operations-copy"><p>Status, history, diff, snapshot, and check-db turn the workflow into an observable system. Generate-models can reverse-engineer an existing database into SQLAlchemy models.</p><a className="text-link" href="https://docs.dbwarden.org/commands/status/" target="_blank" rel="noreferrer">Explore the command surface <span>↗</span></a></div><div className="operations-board"><div><span>primary</span><strong>converged</strong><b>100%</b></div><div><span>analytics</span><strong>snapshot ready</strong><b>04</b></div><div><span>pending delta</span><strong>add bio</strong><b>01</b></div><div><span>generation mode</span><strong>offline capable</strong><b>CI</b></div></div></div></SurfaceSection>
    <SurfaceSection number="04" label="Backends" title="One contract. Different engines." doc="https://docs.dbwarden.org/databases/"><div className="backend-surface"><div className="backend-orbit"><div className="backend-orbit-copy" key={activePair}><span>{backendPairs[activePair].lead}</span><strong>{backendPairs[activePair].result}</strong></div><i>automatically in sync</i></div><div className="backend-stack">{backends.map((backend, index) => <div key={backend}><span>0{index + 1}</span><strong>{backend}</strong><em>{index === 4 ? 'analytical' : 'relational'}</em></div>)}</div></div><a className="text-link" href="https://blog.emiliano-go.com/works/clickhouse-schema-management-in-python" target="_blank" rel="noreferrer">Read the ClickHouse deep dive <span>↗</span></a></SurfaceSection>
    <section className="surface-plugin-callout"><div className="section-label">/ 05 <span>plugins</span><a className="section-doc" href="/plugins">Browse directory ↗</a></div><div><h2>Keep the core focused.<br /><em>Extend the contract.</em></h2><div><p>Official plugins add FastAPI lifecycle helpers, PostgreSQL types and extensions, RBAC, ClickHouse RBAC, seeds, and sandbox validation.</p><a className="surface-doc-link" href="https://docs.dbwarden.org/plugins/developing/overview/" target="_blank" rel="noreferrer">Want to create plugins? See the docs <span>↗</span></a></div><a className="button button-primary" href="/plugins">Browse the plugin directory <span>↗</span></a></div></section>
  </PageFrame>
}

function SurfaceSection({ number, label, title, doc, children }) {
  return <section className={`article-section surface-section surface-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="section-label">/ {number} <span>{label}</span><a className="section-doc" href={doc} target="_blank" rel="noreferrer">Read the docs ↗</a></div><h2>{title}</h2><div className="article-body">{children}</div></section>
}
