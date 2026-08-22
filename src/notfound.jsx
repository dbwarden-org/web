import './page-styles.css'
import { PageFrame } from './pages.jsx'
import { useI18n } from './i18n.jsx'

export function NotFoundPage({ dark, toggleTheme }) {
  const { t } = useI18n()
  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow={t('notFound.eyebrow')} title={<>{t('notFound.titleLine1')}<br /><em>{t('notFound.titleLine2')}</em></>} intro={t('notFound.intro')}>
    <section className="fit-section"><div className="section-label">/ {t('notFound.whereToGo')}</div><div className="fit-grid"><div><strong>{t('notFound.startHere')}</strong><p>{t('notFound.startHereText')}</p><a className="text-link" href="/">{t('notFound.home')} <span>↗</span></a></div><div><strong>{t('notFound.theDocs')}</strong><p>{t('notFound.theDocsText')}</p><a className="text-link" href="https://docs.dbwarden.org" target="_blank" rel="noreferrer">{t('notFound.docsUrl')} <span>↗</span></a></div></div></section>
    <section className="article-links"><div className="section-label">/ {t('notFound.keepReading')}</div><div><a href="/why">{t('nav.why')} <span>↗</span></a><a href="/compare">{t('nav.compare')} <span>↗</span></a><a href="/tool-scope">{t('nav.toolScope')} <span>↗</span></a></div></section>
  </PageFrame>
}
