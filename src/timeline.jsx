import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './page-styles.css'
import { PageFrame } from './pages.jsx'
import { CodeBlock } from './code.jsx'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function inline(text) {
  const parts = String(text).split(/(`[^`]+`)/g)
  return parts.map((part, index) => part.startsWith('`') && part.endsWith('`')
    ? <code className="inline-code" key={index}>{part.slice(1, -1)}</code>
    : part)
}

const steps = [
  {
    number: '01', label: 'configure', title: 'Point dbwarden at your databases and models.',
    body: 'Run `dbwarden init` once: it creates the `migrations/` layout and a declarative `dbwarden.py`, and it is safe to run again later, since it never touches the database. Declare each database with four required parameters, `database_name`, `default`, `database_type`, and `database_url_sync`, then point `model_paths` at the package that holds your models. `dbwarden settings show` prints what was resolved, so the config can be checked before anything else runs.',
    doc: 'https://docs.dbwarden.org/configuration/quick-start/',
    blocks: [
      { label: 'dbwarden.py', lang: 'python', text: 'from dbwarden import DbwardenDatabase\n\nclass Primary(DbwardenDatabase):\n    database_name = "primary"\n    default = True\n    database_type = "sqlite"\n    database_url_sync = "sqlite:///./app.db"\n    model_paths = ["app.models"]' },
      { label: 'terminal', lang: 'shell', text: '$ dbwarden init\n$ dbwarden settings show' },
    ],
  },
  {
    number: '02', label: 'declare', title: 'The models are the schema.',
    body: 'SQLAlchemy models are the authority. Mapped columns carry nullability, defaults, and keys; a typed `class Meta` keeps indexes, engines, codecs, and backend-specific options beside the table they describe. Meta is validated when the module loads, so an unknown attribute raises instead of producing wrong DDL later. This is the whole schema: dbwarden reads it, and nothing else describes the database.',
    doc: 'https://docs.dbwarden.org/getting-started/modeling/',
    blocks: [
      { label: 'models.py', lang: 'python', text: 'class User(Base):\n    __tablename__ = "users"\n\n    id: Mapped[int] = mapped_column(Integer, primary_key=True)\n    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)\n    bio: Mapped[str | None] = mapped_column(Text, nullable=True)\n\n    class Meta(TableMeta):\n        comment = "Core user accounts"\n        indexes = [\n            IndexSpec(name="ix_users_email", columns=["email"]),\n        ]' },
    ],
  },
  {
    number: '03', label: 'derive', title: 'Generate the migration from the diff.',
    body: '`make-migrations` compares the model state with the latest schema snapshot and falls back to the live database when no snapshot exists. It writes one versioned SQL file with `-- upgrade` and `-- rollback` sections, plus a companion `.plan.json` that records the typed operations and their severity. The output is deterministic: the same models and state always produce the same SQL, so reviews only see real changes.',
    doc: 'https://docs.dbwarden.org/commands/make-migrations/',
    blocks: [
      { label: 'terminal', lang: 'shell', text: '$ dbwarden make-migrations "create core tables" --database primary\nCreated migration: migrations/primary/primary__0001_create_core_tables.sql' },
      { label: 'primary__0002_add_bio.sql', lang: 'sql', text: '-- upgrade\nALTER TABLE users ADD COLUMN bio TEXT;\n\n-- rollback\nALTER TABLE users DROP COLUMN bio;' },
    ],
  },
  {
    number: '04', label: 'inspect', title: 'Read the exact artifact before it ships.',
    body: 'Open the file and check both sections. `dbwarden check` reads the plan and classifies each change as INFO, WARNING, or ERROR, and `dbwarden diff` shows the structural difference read-only. Renames are emitted as `ALTER TABLE ... RENAME COLUMN` instead of a DROP plus ADD, so the review sees the exact statements that will run.',
    doc: 'https://docs.dbwarden.org/correctness/',
    blocks: [
      { label: 'terminal', lang: 'shell', text: '$ dbwarden check --database primary\nINFO  add_column  users.bio\n\n$ dbwarden diff --database primary' },
      { label: 'primary__0004_rename_name.sql', lang: 'sql', text: '-- upgrade\nALTER TABLE users RENAME COLUMN name TO full_name;\n\n-- rollback\nALTER TABLE users RENAME COLUMN full_name TO name;' },
    ],
  },
  {
    number: '05', label: 'apply', title: 'Apply the pending files, under lock.',
    body: '`migrate` resolves the config, acquires the migration lock, executes the pending SQL in order, records the migration with its checksum, and releases the lock. A schema snapshot is written for the next diff. For risky changes, `--sandbox` rehearses against a temporary database first, and `--with-backup` captures a pre-migration state before anything is applied.',
    doc: 'https://docs.dbwarden.org/getting-started/workflows/',
    blocks: [
      { label: 'terminal', lang: 'shell', text: '$ dbwarden migrate --database primary\nApplying migration: primary__0001_create_core_tables.sql\nMigration applied successfully\n\n$ dbwarden migrate --database primary --with-backup --backup-dir ./backups' },
    ],
  },
  {
    number: '06', label: 'verify', title: 'Confirm the database matches the models.',
    body: '`dbwarden status` shows applied and pending counts, `dbwarden history` shows execution order and timestamps, and `check-db` reads the live schema directly. Together they answer whether the migration queue is clean and what the database actually holds. The loop closes when the models, the migration files, and the database agree.',
    doc: 'https://docs.dbwarden.org/commands/status/',
    blocks: [
      { label: 'terminal', lang: 'shell', text: '$ dbwarden status --database primary\nDatabase: primary\nApplied migrations: 1\nPending migrations: 0\n\n$ dbwarden history --database primary\n1  primary__0001_create_core_tables.sql  applied' },
    ],
  },
  {
    number: '07', label: 'rollback', title: 'Reverse with the rollback that shipped with the file.',
    body: '`dbwarden rollback` runs applied migrations in reverse order, executing the `-- rollback` section of each file under the same lock discipline as migrate, with `--count` or `--to-version` for partial rollbacks. Recovery quality is decided when the migration is written, not during the incident: the rollback ships in the same file as the upgrade.',
    doc: 'https://docs.dbwarden.org/commands/rollback/',
    blocks: [
      { label: 'terminal', lang: 'shell', text: '$ dbwarden rollback --database primary --count 1\nRolling back migration: primary__0001_create_core_tables.sql' },
      { label: 'primary__0001_create_core_tables.sql', lang: 'sql', text: '-- rollback\nDROP INDEX IF EXISTS ix_posts_created_at;\nDROP TABLE posts;\nDROP TABLE users;' },
    ],
  },
]

export function TimelinePage({ dark, toggleTheme }) {
  const timelineRef = useRef(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.from('.timeline-intro > *', { opacity: 0, y: 24, duration: .75, stagger: .12, ease: 'power2.out' })
    gsap.from('.timeline-item', {
      opacity: 0,
      y: 34,
      duration: .7,
      stagger: .12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.timeline-track', start: 'top 78%', once: true },
    })
    gsap.to('.timeline-progress', {
      scaleY: 1,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: { trigger: '.timeline-track', start: 'top 68%', end: 'bottom 72%', scrub: 1 },
    })
  }, { scope: timelineRef })

  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="how it works" title={<>The same loop,<br /><em>every change.</em></>} intro="Configure the database once. After that, every change follows the same loop: declare the schema in the models, derive the SQL, review it, apply it, and confirm the database matches.">
    <div className="timeline-shell" ref={timelineRef}>
      <div className="timeline-intro"><span>the operating sequence</span><strong>Every step leaves something<br />you can inspect.</strong><p>No step happens invisibly: each one produces a file or a state you can open and check.</p></div>
      <div className="timeline-track"><div className="timeline-line"><div className="timeline-progress" /></div>{steps.map((step) => <article className="timeline-item" key={step.number}><div className="timeline-marker"><span>{step.number}</span></div><div className="timeline-copy"><div className="timeline-label">{step.label}</div><h2>{step.title}</h2><p>{inline(step.body)}</p><a href={step.doc} target="_blank" rel="noreferrer">Read the guide <span>↗</span></a></div><div className="timeline-code"><span>example / {step.number}</span>{step.blocks.map((block) => <CodeBlock key={block.label} label={block.label} lang={block.lang}>{block.text}</CodeBlock>)}</div></article>)}</div>
      <div className="timeline-end"><span>convergence</span><strong>model = database</strong><p>The loop is complete when the models, the migration files, and the live database all agree.</p></div>
    </div>
  </PageFrame>
}
