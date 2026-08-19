import './page-styles.css'
import { PageFrame, PageSection, Faq } from './pages.jsx'
import { CodeBlock } from './code.jsx'

const features = [
  { href: '/tool-scope/generation', title: 'Generation', description: 'Models to versioned SQL with upgrade and rollback, and offline generation from committed state.' },
  { href: '/tool-scope/safety', title: 'Safety', description: 'Safety classification, impact analysis, and safe type changes.' },
  { href: '/tool-scope/state', title: 'State and operations', description: 'Status, history, snapshots, diffs, and reverse engineering an existing database.' },
  { href: '/tool-scope/repeatable-migrations', title: 'Repeatable migrations', description: 'Runs-always and runs-on-change classes for views, grants, functions, and triggers.' },
  { href: '/tool-scope/seeds', title: 'Seeds', description: 'Deterministic reference data, tracked like migrations.' },
  { href: '/tool-scope/observability', title: 'Observability', description: 'Prometheus metrics, JSON logs, and trace-level SQL.' },
]

export function ProductSurfacePage({ dark, toggleTheme }) {
  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="tool scope" title={<>Database Migration<br /><em>Capabilities.</em></>} intro="dbwarden derives migrations, rollbacks, snapshots, and safety checks from one definition: the SQLAlchemy models. This page maps the architecture, and each area of the tool gets its own page below.">
    <PageSection number="01" label="Architecture" title="Layers, from CLI to SQL execution." doc="https://docs.dbwarden.org/architecture-deep-dive/">
      <div className="why-split"><div><p>dbwarden is a layered tool: the CLI parses arguments and global flags, the commands layer orchestrates workflows (<code className="inline-code">migrate</code>, <code className="inline-code">rollback</code>, <code className="inline-code">make-migrations</code>, <code className="inline-code">status</code>, <code className="inline-code">check</code>, and the rest), and the engine below it handles the actual work: model discovery, snapshot extraction, diffing, versioning, checksums, and safety classification. Repositories persist migration and lock metadata, and the database layer executes SQL through backend-aware connections.</p><p>The metadata layer is kept deliberately database-agnostic. <code className="inline-code">schema/</code> holds dialect-agnostic constructs (<code className="inline-code">TableMeta</code>, <code className="inline-code">IndexSpec</code>, the runtime metadata container attached to each model), while <code className="inline-code">databases/</code> holds the concrete backend specs for ClickHouse, MySQL, PostgreSQL, MariaDB, and SQLite. The import rule is one-way: <code className="inline-code">schema/</code> never imports backends at module load (backend metas are resolved lazily, inside functions), so the metadata layer stays portable and each backend plugs into the same pipeline.</p><p>Each backend exposes a small handler contract: <code className="inline-code">extract</code>, <code className="inline-code">model_spec_from_tables</code>, <code className="inline-code">canonicalize</code>, <code className="inline-code">diff</code>, and <code className="inline-code">emit</code>. A registry driver runs that contract in order for every object type: extract the snapshot state, derive the model state, canonicalize both sides, diff into typed operations, and emit backend SQL. That is why one workflow covers PostgreSQL tables, ClickHouse engines, and MySQL row formats alike.</p></div><div><span className="comparison-label">the layers</span><CodeBlock lang="plain">{`CLI (Typer)
  -> Commands layer
    -> Engine layer (planning, parsing,
       version, checksum, model discovery)
      -> Repository layer (migration
         + lock records)
        -> Database layer (SQLAlchemy
           connection + SQL execution)`}</CodeBlock><span className="comparison-label">per-backend handler contract</span><CodeBlock lang="plain">{`extract(snapshot)          raw backend state
model_spec_from_tables()  model state
canonicalize(spec)        normalized form
diff(a, b)                typed operations
emit(op)                  backend SQL`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="02" label="One config" title="One typed source, many databases." doc="https://docs.dbwarden.org/configuration/quick-start/">
      <div className="why-split"><div><p>Configuration is a single <code className="inline-code">dbwarden.py</code> at the project root. Each database is a <code className="inline-code">DbwardenDatabase</code> subclass declaring its name, type, sync URL, and which model paths it owns; the <code className="inline-code">database_config(...)</code> function form is equivalent and supported for plugins and integrations. Ambiguous sources fail fast: duplicate database names, unknown tables in <code className="inline-code">model_tables</code>, or model paths that resolve to nothing are rejected at load time.</p><p>When the config is requested, dbwarden discovers the source, imports it, registers every database, validates uniqueness and model-path rules, and resolves the selected database. The <code className="inline-code">--dev</code> flag swaps a configured database to its <code className="inline-code">dev_database_url</code> (usually SQLite) for local work, with type translation where the dev backend can't represent the production type.</p><p>Each database keeps its own migration directory, its own versioned sequence, and its own lock and history records. <code className="inline-code">--database</code> targets one of them; <code className="inline-code">--all</code> operates every database in the config in one run.</p></div><div><span className="comparison-label">two databases, one config</span><CodeBlock label="dbwarden.py">{`from dbwarden import DbwardenDatabase

class Primary(DbwardenDatabase):
    database_name = "primary"
    default = True
    database_type = "postgresql"
    database_url_sync = "postgresql://localhost/main"
    model_paths = ["app.models"]

class Analytics(DbwardenDatabase):
    database_name = "analytics"
    database_type = "clickhouse"
    database_url_sync = "clickhouse://localhost:8123/analytics"
    model_paths = ["app.analytics_models"]`}</CodeBlock><span className="comparison-label">operate one or all</span><CodeBlock>{`$ dbwarden migrate --database primary
$ dbwarden migrate --database analytics
$ dbwarden status --all`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="03" label="The loop" title="Model to SQL to verified database." doc="https://docs.dbwarden.org/getting-started/first-migration/">
      <div className="why-split"><div><p><code className="inline-code">make-migrations</code> runs the model-to-SQL pipeline: discover the model paths, import the modules, extract table and column metadata, and load the latest schema snapshot from <code className="inline-code">.dbwarden/schemas/</code>. When a snapshot exists, generation diffs against it; without one, dbwarden takes a full snapshot from the live database and runs the same diff pipeline, minus rename detection. The diff produces typed operations, which are ordered and assembled into upgrade and rollback SQL, then written as the migration file with a companion <code className="inline-code">.plan.json</code>.</p><p><code className="inline-code">migrate</code> executes the result: ensure the metadata and lock tables exist, acquire the lock, build the pending execution plan, run the SQL statements, record migration metadata and checksums, and release the lock. Rollback uses the same lock discipline, selecting rollback SQL from applied files in reverse order. <code className="inline-code">check</code> inspects the plan next to pending migrations before anything runs, classifying every operation as INFO, WARNING, or ERROR.</p><p>Each step leaves something inspectable: the config, the models, the generated SQL file, the plan, the applied state, and the live schema. The per-feature pages below cover each stage in detail.</p></div><div><span className="comparison-label">generate</span><CodeBlock>{`$ dbwarden make-migrations "add bio" --database primary
Created migration: migrations/primary/primary__0002_add_bio.sql`}</CodeBlock><span className="comparison-label">apply</span><CodeBlock>{`$ dbwarden migrate --database primary
Applying migration: primary__0002_add_bio.sql
Migration applied successfully`}</CodeBlock><span className="comparison-label">verify</span><CodeBlock>{`$ dbwarden status --database primary
Database: primary
Applied migrations: 2
Pending migrations: 0`}</CodeBlock></div></div>
    </PageSection>
    <section className="fit-section"><div className="section-label">/ the pages</div><div className="surface-index">{features.map((feature) => <FeatureCard key={feature.href} feature={feature} />)}</div></section>
    <Faq items={[
      { q: 'How is dbwarden structured?', a: 'CLI, commands, engine, repositories, and database layers. The engine handles model discovery, snapshot extraction, diffing, versioning, checksums, and safety; the database layer executes SQL through backend-aware connections.' },
      { q: 'Can several databases share one config?', a: 'Yes. Each `DbwardenDatabase` subclass gets its own migration directory, versioned sequence, and lock records. `--database` targets one; `--all` operates every database in the config.' },
      { q: 'What is the difference between schema/ and databases/?', a: '`schema/` is the dialect-agnostic metadata layer (`TableMeta`, `IndexSpec`). `databases/` holds the concrete backend specs. The import rule is one-way, so the metadata layer stays portable across backends.' },
    ]} />
  </PageFrame>
}

function FeatureCard({ feature }) {
  return <a className="surface-index-card" href={feature.href}><span>↗</span><h3>{feature.title}</h3><p>{feature.description}</p></a>
}
