import './page-styles.css'
import { AlembicComparison } from './compare.jsx'

export function AlembicAlternativePage({ dark, toggleTheme }) {
  return <AlembicComparison dark={dark} toggleTheme={toggleTheme} eyebrow="alembic alternative" title={<>A Modern Alembic Alternative<br /><em>for SQLAlchemy.</em></>} intro={<>Looking for an Alembic alternative for SQLAlchemy? dbwarden is a declarative database migration tool where your SQLAlchemy models remain the source of truth and migrations are derived from schema changes. What reaches the pull request is plain SQL: readable by any DBA, executable without the Python runtime, and verified against the database before it ships.</>} />
}