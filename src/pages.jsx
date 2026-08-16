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
  return <div className={`site-shell content-page ${pageClass}`}><PageHeader dark={dark} toggleTheme={toggleTheme} /><main className="content-wrap page-main"><div className="page-hero"><div className="directory-kicker">/ {eyebrow}</div><div className="page-hero-grid"><h1>{title}</h1><div>{intro ? <p>{typeof intro === 'string' ? renderInline(intro) : intro}</p> : null}{install ? <button className="hero-install page-install" type="button" onClick={copyInstall} title="Copy install command" aria-label="Copy install command"><i>$</i> {install}{copied ? <span className="copy-pop">copied</span> : null}</button> : null}</div></div></div>{children}</main><footer className="footer content-wrap"><div className="brand footer-brand"><img src={logo} alt="" width="29" height="29" /><span>dbwarden</span></div><span>Fully open source. MIT licensed.</span><div className="footer-links"><a href="/">Home</a><a href="/fastapi">FastAPI</a><a href="/databases">Databases</a><a href="/correctness">Correctness</a><a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">Docs ↗</a></div></footer></div>
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
      <div className="nav-dropdown"><div className="nav-dropdown-inner"><span className="nav-dropdown-label">tool scope</span>{toolScopeLinks.map((link) => <a key={link.href} href={link.href} onClick={onNavigate}>{link.label}</a>)}</div></div>
    </div>
    <a href="/databases" onClick={onNavigate}>Databases</a>
    <a href="/fastapi" onClick={onNavigate}>FastAPI</a>
    <a href="/plugins" onClick={onNavigate}>Plugins</a>
    <div className={openGroup === 'compare' ? 'nav-item has-dropdown is-open' : 'nav-item has-dropdown'}>
      <a href="/compare" onClick={(e) => toggleGroup('compare', e)}>Compare <span className="nav-caret" aria-hidden="true">▾</span></a>
      <div className="nav-dropdown"><div className="nav-dropdown-inner"><span className="nav-dropdown-label">compare</span>{compareLinks.map((link) => <a key={link.href} href={link.href} onClick={onNavigate}>{link.label}</a>)}</div></div>
    </div>
    <a href="https://docs.dbwarden.org" target="_blank" rel="noreferrer" onClick={onNavigate}>Docs <span className="arrow">↗</span></a>
  </>
}

export function WhyPage({ dark, toggleTheme }) {
  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="why dbwarden" title={<>Models define the schema.<br /><em>SQL is derived.</em></>} intro="dbwarden derives SQL migrations from SQLAlchemy models. The models define the schema; make-migrations writes versioned SQL with upgrade and rollback sections, reviewed in the pull request and verified against the database.">
    <PageSection number="01" label="The split" title="The models are the schema. The SQL follows." doc="https://docs.dbwarden.org/index/">
      <div className="why-split"><div><p>In most migration workflows, the schema is described twice: once in the models, once in the migration scripts, and nothing checks the two stay in agreement. The disagreement usually turns up in production, at the moment the database is asked to change. dbwarden keeps one definition: the SQLAlchemy models your application already imports.</p><p>Everything the database needs to look like is expressed there, including backend-specific options. The <code className="inline-code">class Meta</code> inner class holds comments, indexes, engines, and codecs beside the table they describe, and column-level <code className="inline-code">Meta</code> classes carry comments and visibility flags. All of it is validated when the module loads: an unknown attribute raises <code className="inline-code">DBWardenConfigError</code> instead of producing wrong DDL later.</p><p><code className="inline-code">make-migrations</code> diffs that model state against the latest schema snapshot, falling back to the live database when no snapshot exists yet, and writes one versioned SQL file with an <code className="inline-code">-- upgrade</code> section and a <code className="inline-code">-- rollback</code> section.</p><p>The diff is canonicalized before comparison. A model says <code className="inline-code">String(255)</code> while PostgreSQL reports <code className="inline-code">character varying(255)</code>; a <code className="inline-code">Boolean</code> default can render as <code className="inline-code">false</code> or <code className="inline-code">FALSE</code>; an identifier may be quoted in SQL and bare in model metadata; ClickHouse engine parameters can come back in a different order than they were declared. Handlers normalize both sides to the same representation first, so equivalent states produce no fake diffs, and a review never churns on whitespace or spelling that the database treats as identical.</p><p>Because generation starts from committed state, it is deterministic: the same model state and snapshot produce the same SQL every run. The migration file is derived output. Old migrations stay useful for review and deployment, but they no longer define the schema.</p><span className="comparison-label">what one command derives</span><CodeBlock label="primary__0001_create_core_tables.sql">{`-- upgrade
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_posts_created_at ON posts (created_at);

-- rollback
DROP INDEX IF EXISTS ix_posts_created_at;
DROP TABLE posts;
DROP TABLE users;`}</CodeBlock></div><div><span className="comparison-label">the models, with typed metadata</span><CodeBlock label="app/models.py">{`from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from dbwarden.databases import IndexSpec, TableMeta

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    class Meta(TableMeta):
        comment = "Core user accounts"

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    class Meta(TableMeta):
        indexes = [
            IndexSpec(name="ix_posts_created_at", columns=["created_at"]),
        ]`}</CodeBlock><span className="comparison-label">backend options on the model</span><CodeBlock label="pgsql_meta.py">{`from dbwarden.databases.pgsql import PGTableMeta, PGColumnMeta, pg

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    bio: Mapped[str] = mapped_column(Text)

    class Meta(PGTableMeta):
        pg_fillfactor = 80

        class id(PGColumnMeta):
            pg = pg.field(identity="always", identity_start=100)`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="02" label="One definition" title="Change the model, generate the migration." doc="https://docs.dbwarden.org/getting-started/modeling/">
      <div className="why-split"><div><p>In a conventional workflow, a model change means hand-editing a migration script to match, and nothing checks the two stay in sync. dbwarden keeps the schema definition in the models your application already imports.</p><p>Change the model, run <code className="inline-code">make-migrations</code>, and the SQL is written beside the model change. The command prints the created file, which is what gets reviewed in the pull request and committed:</p><CodeBlock label="terminal">{`$ dbwarden make-migrations "create core tables" --database primary
Created migration: migrations/primary/primary__0001_create_core_tables.sql`}</CodeBlock><p>The generated SQL is committed, reviewed, and deployed, but it is an output of the models, not a second schema maintained forever.</p><ul><li>Schema review happens beside application code.</li><li>Generated SQL is readable by any DBA.</li><li>Old migrations are receipts, not structure.</li></ul><p>Renames are where a naive diff turns destructive: a column disappears and a new one appears, and the tool guesses. dbwarden refuses to guess. When it detects a likely rename it emits <code className="inline-code">ALTER TABLE ... RENAME COLUMN</code> in both directions, and ambiguous cases are declared with <code className="inline-code">--rename table.old:new</code> or <code className="inline-code">--rename-table old:new</code>, which leaves a trace in the command history and the plan.</p></div><div><span className="comparison-label">renames stay explicit</span><CodeBlock label="terminal">{`$ dbwarden make-migrations "rename name to full_name" \
    --rename users.name:full_name

# same shape, one command: add a column
$ dbwarden make-migrations "add bio"`}</CodeBlock><span className="comparison-label">a rename, not a drop</span><CodeBlock label="primary__0004_rename_name.sql">{`-- upgrade
ALTER TABLE users RENAME COLUMN name TO full_name;

-- rollback
ALTER TABLE users RENAME COLUMN full_name TO name;`}</CodeBlock><span className="comparison-label">the companion plan</span><CodeBlock label="primary__0003_rename_column_users_username.plan.json">{`{
  "migration_id": "primary__0003_rename_column_users_username",
  "operations": [
    {
      "type": "rename_column",
      "table": "users",
      "new_name": "email",
      "severity": "INFO",
      "resolved_from": "rename_flag"
    }
  ],
  "required_flags": [],
  "checksum": "sha256..."
}`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="03" label="Verified" title="Rollback and drift, checked at generation time." doc="https://docs.dbwarden.org/correctness/rollback-generation/">
      <div className="why-split"><div><p>Generated migrations carry an <code className="inline-code">-- upgrade</code> section and a <code className="inline-code">-- rollback</code> section in the same file, and both are computed from the same diff. The handler that emits a <code className="inline-code">CREATE TABLE</code> also knows what a <code className="inline-code">DROP TABLE</code> needs; the reverse operation is generated at the same time as the forward one, so the two can't drift apart.</p><p>dbwarden classifies the rollback before the file is accepted: real, conditional, irreversible, or placeholder. Placeholder rollback is refused by default; a change that cannot be reversed must declare that fact explicitly, so the irreversible case is visible in review rather than discovered during an incident.</p><CodeBlock label="terminal">{`$ dbwarden migrate --database primary
Applying migration: primary__0001_create_core_tables.sql
Migration applied successfully

$ dbwarden status --database primary
Database: primary
Applied migrations: 1
Pending migrations: 0

$ dbwarden history --database primary
1  primary__0001_create_core_tables.sql  applied`}</CodeBlock><p>Version tables record which scripts ran; they don't prove the database still has the intended shape. Comparing models against live state, checksummed snapshots, or exported model state is what surfaces drift, and it happens at generation time, before the next migration is written.</p><p>Before anything applies, <code className="inline-code">check</code> reads the plan next to the pending migrations and classifies every operation: <code className="inline-code">INFO</code> for expected-safe additions, <code className="inline-code">WARNING</code> for changes that need review, <code className="inline-code">ERROR</code> for destructive or ambiguous ones. A destructive change does not fail silently in production; it stops in CI, where the acknowledgement is a deliberate act.</p></div><div><span className="comparison-label">the safety check</span><CodeBlock>{`$ dbwarden check --database primary

# drop_column on users.ssn: ERROR
# ack with the force flag after reviewing the plan
$ dbwarden check --database primary --force`}</CodeBlock><span className="comparison-label">a change that cannot be reversed</span><CodeBlock label="primary__0003_drop_pii.sql">{`-- upgrade
ALTER TABLE users DROP COLUMN ssn;

-- rollback
-- dbwarden: irreversible`}</CodeBlock><span className="comparison-label">offline, from committed state</span><CodeBlock label="terminal">{`$ dbwarden export-models --database primary
$ git add .dbwarden/model_state.json

# in CI, with no database service:
$ dbwarden make-migrations "add bio" --offline
$ dbwarden check --database primary`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="04" label="Safety" title="Destructive changes are classified before they ship." doc="https://docs.dbwarden.org/correctness/safety-classifier/">
      <div className="why-split"><div><p>Every operation in a generated plan is classified: <code className="inline-code">INFO</code> for expected-safe additions, <code className="inline-code">WARNING</code> for changes that need review, <code className="inline-code">ERROR</code> for destructive or ambiguous ones. A destructive change fails the check until an operator acknowledges it with the force flag, which is an explicit record that a human reviewed the plan, not a bypass. A migration that drops a column can't merge silently; it stops in CI where the risk is visible.</p><p>The same command that classifies the SQL also looks at your application code. <code className="inline-code">check-impact</code> scans Python files and templates for references to the objects a destructive change would remove, using AST analysis with a grep fallback, and reports each hit with the file and line number. Schema safety and application safety come from the same step, so there is no separate review to forget.</p><p>Type changes get the same treatment. <code className="inline-code">--safe-type-change</code> expands a column type change into the multi-step sequence a careful engineer would write by hand: add the new column, backfill it, swap, drop, generated as reviewable SQL with the rollback beside it.</p><a className="text-link" href="/tool-scope/safety">The safety page <span>↗</span></a></div><div><span className="comparison-label">code that would break</span><CodeBlock>{`$ dbwarden check-impact 0002 --database primary

Migration: 0002_drop_username
Impact detected: 1 operation(s) affect code

drop_column on users.username
  References: 2
    app/routes/users.py:34  attribute_access
      .username
    app/templates/profile.jinja2:12  grep
      user.username`}</CodeBlock><span className="comparison-label">a type change, expanded</span><CodeBlock>{`$ dbwarden make-migrations "widen bio" --safe-type-change

-- upgrade
ALTER TABLE users ADD COLUMN bio_new TEXT;
-- (backfill from bio, swap, then drop bio)

-- rollback
-- (restores the original column)`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="05" label="State and operations" title="What is applied, and whether the database agrees." doc="https://docs.dbwarden.org/commands/status/">
      <div className="why-split"><div><p><code className="inline-code">status</code> shows the applied and pending counts for a database; <code className="inline-code">history</code> lists the full versioned sequence with each migration's state. After every applied migration, dbwarden writes a checksummed JSON snapshot of the schema to <code className="inline-code">.dbwarden/schemas/</code>, so the next generation diffs against committed state instead of trusting a version table.</p><p><code className="inline-code">diff</code> compares models against the database or a snapshot and shows structural differences without writing anything; generation is the step that produces files. That separation keeps inspection read-only until you ask for output.</p><p>For an existing database, <code className="inline-code">generate-models</code> reads the live schema and writes SQLAlchemy models, so a legacy system can be adopted instead of rebuilt from scratch. <code className="inline-code">--base</code> plugs the output into your existing declarative base, and <code className="inline-code">--tables</code> / <code className="inline-code">--exclude-tables</code> scope a large adoption incrementally.</p><a className="text-link" href="/tool-scope/state">The state and operations page <span>↗</span></a></div><div><span className="comparison-label">what is applied</span><CodeBlock>{`$ dbwarden status --database primary
Database: primary
Applied migrations: 12
Pending migrations: 1

$ dbwarden history --database primary
1  primary__0001_create_core_tables.sql  applied
2  primary__0002_add_bio.sql              applied
...`}</CodeBlock><span className="comparison-label">diff, without writing</span><CodeBlock>{`$ dbwarden diff --database primary

          Schema Diff
┏━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━┳━━━━━━━━━┓
┃ Operation    ┃ Table ┃ Target ┃ Severity ┃
┡━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━╇━━━━━━━━━┩
│ add_column   │ users │ email  │ INFO     │
│ drop_column  │ users │ ssn    │ WARNING  │
└──────────────┴───────┴────────┴─────────┘`}</CodeBlock><span className="comparison-label">an existing database, adopted</span><CodeBlock>{`$ dbwarden generate-models --base app.models.Base \
    --tables users,posts --database primary`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="06" label="Repeatable migrations" title="Views, grants, and routines in the same workflow." doc="https://docs.dbwarden.org/migration-files/">
      <div className="why-split"><div><p>Not every database object is a one-time schema evolution. Views, grants, functions, and triggers outlive a single deploy, and re-creating them by hand drifts from the repository. dbwarden supports three migration classes: versioned files, runs-always (<code className="inline-code">RA__</code>) for objects re-created on every migrate, and runs-on-change (<code className="inline-code">ROC__</code>) for routines reapplied only when their content changes.</p><p>A runs-always view is re-created on every <code className="inline-code">migrate</code>, so its definition is always whatever is in the repository, with no drift. Because the plan applies pending versioned files before runs-always files, a view that references a column added in the same deploy picks it up in the same run. The files carry the same upgrade and rollback contract as versioned migrations, so nothing lives outside the reviewable workflow.</p><a className="text-link" href="/tool-scope/repeatable-migrations">The repeatable migrations page <span>↗</span></a></div><div><span className="comparison-label">a runs-always view</span><CodeBlock>{`-- primary__RA__refresh_active_users_view.sql
-- upgrade
CREATE OR REPLACE VIEW active_users AS
SELECT id, email FROM users WHERE is_active = TRUE;

-- rollback
DROP VIEW IF EXISTS active_users;`}</CodeBlock><span className="comparison-label">generated like any migration</span><CodeBlock>{`$ dbwarden make-migrations "refresh active users" \
    --type ra --database primary`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="07" label="Seeds" title="Reference data, tracked like migrations." doc="https://docs.dbwarden.org/seeds/">
      <div className="why-split"><div><p>Baseline data for local, test, and sandbox environments is usually a script somewhere, applied once, and never reconciled with the code that needs it. dbwarden tracks seeds in a seed table independent of the migration history, so reference data gets the same versioned discipline as schema changes.</p><p>Code seeds live next to your models and are auto-versioned in the <code className="inline-code">C</code> namespace (<code className="inline-code">C0001</code>, <code className="inline-code">C0002</code>, ...) from deterministic ordering, so there is no manual version parameter to keep in sync. File seeds are plain SQL or Python in a seeds directory. Each seed row stores a SHA-256 checksum of its source, so a warning appears when the seed was modified since the last apply.</p><p>For environments that don't run your application code, <code className="inline-code">seed export</code> renders code seeds to stateless runs-on-change SQL, and <code className="inline-code">seed rollback --count N</code> removes the tracking records for a partial rollback.</p><a className="text-link" href="/tool-scope/seeds">The seeds page <span>↗</span></a></div><div><span className="comparison-label">tracked, like migrations</span><CodeBlock>{`$ dbwarden seed list --database primary
Seeds for database 'primary':
  V0001  seed_initial_users   applied  2025-06-01 10:00:00
  C0001  initial countries    pending   (code seed)

$ dbwarden seed apply --database primary
$ dbwarden seed rollback --count 1 --database primary`}</CodeBlock><span className="comparison-label">code seed, next to the model</span><CodeBlock>{`from dbwarden.seed import Seed

class AdminUserSeed(Seed):
    __seed_description__ = "initial administrator"
    __seed_on_conflict__ = "update"
    __seed_conflict_columns__ = ["email"]

    model = User
    rows = [User(email="admin@example.com")]`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="08" label="Observability" title="Metrics, JSON logs, and trace-level SQL." doc="https://docs.dbwarden.org/observability/">
      <div className="why-split"><div><p>Migrations are operational work, and dbwarden makes them observable. With <code className="inline-code">DBWARDEN_METRICS=true</code>, <code className="inline-code">migrate</code> and <code className="inline-code">seed apply</code> record counters, gauges, and histograms: migrations applied, migration errors, schema and seed version, pending migrations, and durations, all labeled by database. The FastAPI plugin exposes them at <code className="inline-code">/metrics</code>, so one scrape target covers both the app and the commands it runs.</p><p><code className="inline-code">DBWARDEN_LOG_JSON</code> switches all log output to newline-delimited JSON for ELK, Loki, or Datadog. When you need to see exactly what ran against the database, <code className="inline-code">--debug-level trace</code> logs every SQL statement as it executes, and <code className="inline-code">--perf</code> adds per-statement timing.</p><a className="text-link" href="/tool-scope/observability">The observability page <span>↗</span></a></div><div><span className="comparison-label">metrics and json</span><CodeBlock>{`$ DBWARDEN_METRICS=true dbwarden migrate
$ DBWARDEN_LOG_JSON=true dbwarden migrate \
    --debug-level trace --perf`}</CodeBlock></div></div>
    </PageSection>
    <Faq items={[
      { q: 'Why do the models define the schema instead of the migration files?', a: 'Two representations of the same schema drift apart, and the disagreement usually shows up in production. dbwarden keeps one definition, the models, and treats migration files as derived output: committed for review and deployment, but not a second schema to maintain.' },
      { q: 'What is class Meta for?', a: 'Backend-specific options that have no SQLAlchemy-native spelling live beside the table they describe: comments, indexes, engines, codecs, identity, fill factor. Meta is validated when the module loads, so a typo raises DBWardenConfigError instead of producing wrong DDL later.' },
      { q: 'How does dbwarden detect renames?', a: 'When a column disappears and a new one appears, dbwarden emits `ALTER TABLE ... RENAME COLUMN` instead of a drop-and-create. Ambiguous cases are declared with `--rename table.old:new` or `--rename-table old:new`, which leaves a trace in the command history and the plan.' },
      { q: 'What is in the .plan.json file?', a: 'The typed operations that produced the SQL, with severity and required flags, plus a checksum. `check` reads it before anything applies, and `migrate` never executes it: the plan is metadata for review and CI, not an execution path.' },
      { q: 'Why is deterministic output important?', a: 'If two machines generate different SQL for the same models, review churns on fake changes and CI can\u2019t be trusted. dbwarden canonicalizes both sides of the diff before comparing, so the same model state and snapshot produce the same SQL every run.' },
    ]} />
    <section className="fit-section"><div className="section-label">/ honest fit</div><div className="fit-grid"><div><strong>Choose dbwarden when</strong><p>You use SQLAlchemy and want the models to be the schema, with the SQL you approve, frozen in the repo.</p></div><div><strong>Choose something else when</strong><p>You need one platform across several languages, or you're building with Django and should use its own migrations.</p></div></div></section>
    <section className="article-links"><div className="section-label">/ keep reading</div><div><a href="/tool-scope">Tool scope overview <span>↗</span></a><a href="/compare/alembic">dbwarden vs Alembic <span>↗</span></a><a href="/compare/atlas">dbwarden vs Atlas <span>↗</span></a><a href="/compare/django-migrations">dbwarden vs Django migrations <span>↗</span></a></div></section>
  </PageFrame>
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

// Guards run against the full string at position i, so patterns can't rely on
// \b or lookbehind behaving correctly at the start of a sliced substring.
const boundary = (i, code) => !code[i - 1] || !/\w/.test(code[i - 1])
const shellCommand = (i, code) => { const prev = code.slice(Math.max(0, i - 2), i); return prev === '$ ' || prev === '&& ' || prev === '; ' }
const shellFlag = (i, code) => !code[i - 1] || !/[\w-]/.test(code[i - 1])

const GRAMMARS = {
  python: [
    ['comment', /#[^\n]*/, boundary],
    ['string', /(?:[frbu]{0,2})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/, boundary],
    ['decorator', /@[A-Za-z_][A-Za-z0-9_.]*/],
    ['keyword', /(?:class|def|return|import|from|as|pass|if|elif|else|for|while|in|not|and|or|is|None|True|False|with|raise|try|except|finally|lambda|yield|async|await|global|nonlocal|del|assert|break|continue|self)\b/, boundary],
    ['builtin', /(?:str|int|float|bool|dict|list|tuple|set|bytes|object|type|datetime|date|time|cls)\b/, boundary],
    ['type', /[A-Z][A-Za-z0-9_]*\b/, boundary],
    ['number', /\d+(?:\.\d+)?\b/, boundary],
    ['function', /[a-z_][A-Za-z0-9_]*(?=\()/, boundary],
  ],
  sql: [
    ['comment', /--[^\n]*/],
    ['string', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
    ['keyword', /(?:SELECT|FROM|WHERE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|IF|NOT|EXISTS|ADD|COLUMN|RENAME|TO|TYPE|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|NULL|DEFAULT|AND|OR|IN|IS|AS|WITH|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|USING|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|ASC|DESC|DISTINCT|CASE|WHEN|THEN|ELSE|END|CONSTRAINT|CHECK|GENERATED|ALWAYS|IDENTITY|SERIAL|BIGINT|SMALLINT|INTEGER|INT|TINYINT|MEDIUMINT|VARCHAR|CHAR|TEXT|BOOLEAN|BOOL|TIMESTAMP|DATETIME|DATETIME64|DATE|TIME|NUMERIC|DECIMAL|REAL|DOUBLE|PRECISION|BLOB|JSON|JSONB|UUID|ENUM|AUTO_INCREMENT|ENGINE|COLLATE|CHARSET|COMMENT|PARTITION|STORAGE|CODEC|TRUE|FALSE|RETURNING|CASCADE|RESTRICT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|TRUNCATE|GRANT|REVOKE|ROLE|POLICY|TRIGGER|FUNCTION|PROCEDURE|REPLACE|UNSIGNED|LowCardinality|Nullable|UInt8|UInt16|UInt32|UInt64|Int8|Int16|Int32|Int64|Float32|Float64|Array|Map|Tuple|String|FixedString|Decimal32|Decimal64)\b/i, boundary],
    ['number', /\d+(?:\.\d+)?\b/, boundary],
    ['function', /[A-Za-z_][A-Za-z0-9_]*(?=\()/, boundary],
  ],
  shell: [
    ['comment', /#[^\n]*/],
    ['string', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
    ['command', /[A-Za-z_][A-Za-z0-9_.-]*/, shellCommand],
    ['flag', /--?[A-Za-z][A-Za-z0-9_-]*/, shellFlag],
  ],
}

export function highlightCode(code, language) {
  if (language === 'plain') return [{ type: 'text', value: code }]
  const grammar = GRAMMARS[language] || GRAMMARS.python
  const parts = []
  let last = 0
  let i = 0
  while (i < code.length) {
    const rest = code.slice(i)
    let matched = null
    for (const [type, re, guard] of grammar) {
      re.lastIndex = 0
      const m = re.exec(rest)
      if (m && m.index === 0 && (!guard || guard(i, code))) { matched = [type, m[0]]; break }
    }
    if (!matched) { i += 1; continue }
    if (i > last) parts.push({ type: 'text', value: code.slice(last, i) })
    parts.push({ type: matched[0], value: matched[1] })
    i += matched[1].length
    last = i
  }
  if (last < code.length) parts.push({ type: 'text', value: code.slice(last) })
  return parts
}

export function renderCodeParts(parts, keyPrefix = '') {
  return parts.map((part, index) => part.type === 'text' ? part.value : <span key={`${keyPrefix}${index}`} className={`code-${part.type}`}>{part.value}</span>)
}

// Mixed blocks (model + artifact) switch from Python to SQL at the first '--' line.
export function highlightBlock(text) {
  const lines = text.split('\n')
  let mode = 'python'
  const parts = []
  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li]
    if (line.trimStart().startsWith('--')) mode = 'sql'
    parts.push(...highlightCode(line, mode))
    if (li < lines.length - 1) parts.push({ type: 'text', value: '\n' })
  }
  const merged = []
  for (const part of parts) {
    const prev = merged[merged.length - 1]
    if (prev && prev.type === 'text' && part.type === 'text') prev.value += part.value
    else merged.push({ ...part })
  }
  return merged
}

export function CodeBlock({ children, label, lang }) {
  const content = typeof children === 'string' && children.includes('database_config')
    ? 'from dbwarden import DbwardenDatabase\n\nclass Primary(DbwardenDatabase):\n    database_name = "primary"\n    default = True\n    database_type = "postgresql"\n    database_url_sync = "postgresql://user:password@localhost:5432/primary"\n    model_paths = ["app"]'
    : children
  const trimmed = String(content).trimStart()
  const detected = lang || (trimmed.startsWith('--') ? 'sql' : trimmed.startsWith('$') ? 'shell' : 'python')
  const labelText = label || detected
  const parts = highlightCode(String(content), detected)
  return <div className="code-block"><div className="code-block-bar" aria-hidden="true"><span /><span /><span /><b>{labelText}</b></div><pre className="article-code"><code>{renderCodeParts(parts)}</code></pre></div>
}
