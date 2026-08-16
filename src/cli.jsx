import { PageFrame, PageSection, CodeBlock, renderInline } from './pages.jsx'

const groups = [
  { label: 'author', description: '`init`, `new`, `make-migrations`, `make-rollback`, `generate-models`, `export-models`', example: '$ dbwarden make-migrations "add bio" --rename users.name:full_name' },
  { label: 'operate', description: '`migrate`, `rollback`, `downgrade`, `snapshot`, and the `seed` command group', example: '$ dbwarden migrate --to-version 0010 --with-backup' },
  { label: 'inspect', description: '`status`, `history`, `diff`, `check`, `check-db`, `check-impact`', example: '$ dbwarden diff --out sql' },
  { label: 'lock and extend', description: '`lock-status`, `unlock`, and `plugin list` / `info` / `add` / `remove` / `trust` / `untrust`', example: '$ dbwarden plugin add dbwarden-fastapi' },
  { label: 'utility', description: '`config`, `version`, `settings show`, `database list`', example: '$ dbwarden version' },
]

const flags = [
  { label: '--dev', description: 'Point configured databases at `dev_database_url` (SQLite) with automatic SQL translation.' },
  { label: '--json', description: 'Machine-readable output for `status`, `history`, `diff`, `check`, and logs.' },
  { label: '--debug / --debug-level', description: 'Per-file scan logging; `trace` level logs every SQL statement as it executes.' },
  { label: '--perf', description: 'Per-statement timing breakdowns on `migrate`, `rollback`, `downgrade`, and `make-migrations`.' },
  { label: '--strict-translation', description: 'Fail instead of falling back when dev SQLite translation would lose detail.' },
]

export function CliPage({ dark, toggleTheme }) {
  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="cli reference" title={<>The whole command<br /><em>surface.</em></>} intro="Five command groups and a handful of global flags. The daily loop is a few commands; the rest of the surface is there when you need it.">
    <PageSection number="01" label="Command groups" title="Author, operate, inspect, lock, extend." doc="https://docs.dbwarden.org/cli-reference/"><div className="comparison-command-grid">{groups.map((group) => <div key={group.label}><span className="comparison-label">{group.label}</span><p>{renderInline(group.description)}</p><CodeBlock>{group.example}</CodeBlock></div>)}</div></PageSection>
    <PageSection number="02" label="Global flags" title="Structured output, diagnostics, and dev mode everywhere." doc="https://docs.dbwarden.org/cli-reference/"><div className="comparison-command-grid">{flags.map((flag) => <div key={flag.label}><span className="comparison-label">{flag.label}</span><p>{renderInline(flag.description)}</p></div>)}</div></PageSection>
    <section className="fit-section"><div className="section-label">/ reference</div><div className="fit-grid"><div><strong>The CLI reference</strong><p>Full syntax, options, and examples for every command live in the docs.</p></div><div><strong>JSON output</strong><p>Display commands accept the global `--json` flag for pipelines and dashboards.</p></div></div></section>
  </PageFrame>
}
