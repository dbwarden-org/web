import './page-styles.css'
import { PageFrame } from './pages.jsx'

export function NotFoundPage({ dark, toggleTheme }) {
  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="404" title={<>That page<br /><em>doesn't exist.</em></>} intro="The URL doesn't match anything on this site. It may have moved, or the link that brought you here may be stale.">
    <section className="fit-section"><div className="section-label">/ where to go</div><div className="fit-grid"><div><strong>Start here</strong><p>Read how dbwarden works, from model change to verified database.</p><a className="text-link" href="/">Home <span>↗</span></a></div><div><strong>The docs</strong><p>Setup, commands, and the full reference live on the documentation site.</p><a className="text-link" href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">docs.dbwarden.org <span>↗</span></a></div></div></section>
    <section className="article-links"><div className="section-label">/ keep reading</div><div><a href="/why">Why dbwarden <span>↗</span></a><a href="/compare">The comparisons <span>↗</span></a><a href="/tool-scope">Tool scope <span>↗</span></a></div></section>
  </PageFrame>
}
