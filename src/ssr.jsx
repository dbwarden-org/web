// Build-time server renderer. Vite builds this with build.ssr and the prerender
// pass imports the bundle, preloads every route, and renders each page to full
// HTML so content is visible before any JavaScript runs. The client bundle is
// untouched: it boots with the current route pre-registered and re-renders over
// the same markup.
import { renderToString } from 'preact-render-to-string'
import { registerRoute } from './react-shims.jsx'
import {
  App, loadAlembicAlternative, loadAlembicComparison, loadAtlasComparison,
  loadCli, loadCompare, loadCorrectness, loadDatabases, loadDjangoComparison,
  loadFastapi, loadGeneration, loadMigrateFromAlembic, loadNotFound,
  loadObservability, loadProductSurface, loadRepeatableMigrations, loadSafety,
  loadSeeds, loadState, loadTimeline, loadWhy,
} from './main.jsx'
import { AlembicAlternativePage } from './alembic-alternative.jsx'
import { WhyPage } from './why.jsx'
import { ProductSurfacePage } from './surface.jsx'
import { TimelinePage } from './timeline.jsx'
import { ComparePage, AlembicComparisonPage, AtlasComparisonPage, DjangoComparisonPage } from './compare.jsx'
import { FastapiPage } from './fastapi.jsx'
import { GenerationPage, SafetyPage, StatePage, RepeatableMigrationsPage, SeedsPage, ObservabilityPage } from './features.jsx'
import { CorrectnessPage } from './correctness.jsx'
import { DatabasesPage } from './databases.jsx'
import { MigrateFromAlembicPage } from './migrate.jsx'
import { CliPage } from './cli.jsx'
import { NotFoundPage } from './notfound.jsx'

registerRoute(loadAlembicAlternative, AlembicAlternativePage)
registerRoute(loadWhy, WhyPage)
registerRoute(loadProductSurface, ProductSurfacePage)
registerRoute(loadTimeline, TimelinePage)
registerRoute(loadCompare, ComparePage)
registerRoute(loadAlembicComparison, AlembicComparisonPage)
registerRoute(loadAtlasComparison, AtlasComparisonPage)
registerRoute(loadDjangoComparison, DjangoComparisonPage)
registerRoute(loadFastapi, FastapiPage)
registerRoute(loadGeneration, GenerationPage)
registerRoute(loadSafety, SafetyPage)
registerRoute(loadState, StatePage)
registerRoute(loadRepeatableMigrations, RepeatableMigrationsPage)
registerRoute(loadSeeds, SeedsPage)
registerRoute(loadObservability, ObservabilityPage)
registerRoute(loadCorrectness, CorrectnessPage)
registerRoute(loadDatabases, DatabasesPage)
registerRoute(loadMigrateFromAlembic, MigrateFromAlembicPage)
registerRoute(loadCli, CliPage)
registerRoute(loadNotFound, NotFoundPage)

export function renderRoute(path) {
  const route = path.replace(/\/$/, '') || '/'
  return renderToString(<App path={route} />)
}
