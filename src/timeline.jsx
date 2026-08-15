import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PageFrame } from './pages.jsx'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const steps = [
  { number: '01', label: 'configure', title: 'Name the system you mean to change.', body: 'Start with dbwarden.py. Declare each database, its backend, and the models that belong to it. One repository can carry isolated primary and analytics workflows.', artifact: 'dbwarden.py', code: 'class Primary(DbwardenDatabase):', doc: 'https://docs.dbwarden.org/configuration/quick-start/' },
  { number: '02', label: 'declare', title: 'Put the desired state in the models.', body: 'SQLAlchemy models are the authority. Typed Meta declarations keep indexes, engines, codecs, and backend-specific details beside the table they describe.', artifact: 'models/', code: 'User.email = mapped_column(String)', doc: 'https://docs.dbwarden.org/getting-started/modeling/' },
  { number: '03', label: 'derive', title: 'Turn state into a deterministic delta.', body: 'make-migrations compares the model state with the live schema or a committed snapshot. Same models plus same state means the same SQL on every machine.', artifact: '0002_add_bio.sql', code: 'dbwarden make-migrations "add bio"', doc: 'https://docs.dbwarden.org/commands/make-migrations/' },
  { number: '04', label: 'inspect', title: 'Read the exact artifact before it ships.', body: 'The migration is plain SQL with upgrade and rollback together. Run checks, inspect impact, name renames explicitly, and use a sandbox when the change deserves a rehearsal.', artifact: 'upgrade + rollback', code: 'dbwarden check && dbwarden diff', doc: 'https://docs.dbwarden.org/correctness/' },
  { number: '05', label: 'apply', title: 'Deploy the file. Verify convergence.', body: 'migrate applies pending artifacts in order, while snapshots and status make the resulting state observable. The runner is useful, but the SQL remains portable.', artifact: 'live schema', code: 'dbwarden migrate --database primary', doc: 'https://docs.dbwarden.org/getting-started/workflows/' },
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

  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="how it works" title={<>Declare once.<br /><em>Derive deterministically.</em></>} intro="One continuous operating loop: configure the source, describe the state, derive the artifact, inspect it, and apply what was approved.">
    <div className="timeline-shell" ref={timelineRef}>
      <div className="timeline-intro"><span>the operating sequence</span><strong>Every step leaves something<br />you can inspect.</strong><p>dbwarden keeps the workflow small at the command line and explicit at the artifact boundary.</p></div>
      <div className="timeline-track"><div className="timeline-line"><div className="timeline-progress" /></div>{steps.map((step) => <article className="timeline-item" key={step.number}><div className="timeline-marker"><span>{step.number}</span></div><div className="timeline-copy"><div className="timeline-label">{step.label}</div><h2>{step.title}</h2><p>{step.body}</p><a href={step.doc} target="_blank" rel="noreferrer">Read the guide <span>↗</span></a></div><div className="timeline-artifact"><span>artifact / {step.number}</span><strong>{step.artifact}</strong><code>{step.code}</code></div></article>)}</div>
      <div className="timeline-end"><span>convergence</span><strong>model = database</strong><p>The loop is complete when the declared state, generated artifact, and live schema agree.</p></div>
    </div>
  </PageFrame>
}
