import { PageFrame, PageSection, CodeBlock, Faq } from './pages.jsx'

export function FastapiPage({ dark, toggleTheme }) {
  return <PageFrame dark={dark} toggleTheme={toggleTheme} eyebrow="fastapi" title={<>Sessions, health, migrations,<br /><em>and request models.</em></>} intro={<>dbwarden-fastapi provides the FastAPI pieces from the same <code className="inline-code">dbwarden.py</code> file that generates your migrations: startup schema validation, session dependencies, health and migration routers, and <code className="inline-code">@auto_schema</code> for request and response models.</>} install="dbwarden plugin add dbwarden-fastapi">
    <PageSection number="01" label="One config" title="The database object is the integration point." doc="https://docs.dbwarden.org/getting-started/setup/">
      <div className="why-split"><div><p>The plugin reads the same <code className="inline-code">DbwardenDatabase</code> objects you already configure for migrations, so FastAPI never needs a second source of truth for connection settings. <code className="inline-code">Primary.handle</code> is a <code className="inline-code">DatabaseHandle</code>: it carries the sync engine used by <code className="inline-code">migrate</code> and the async engine used by your routes, and it exposes both as dependency annotations. The <code className="inline-code">database_config(...)</code> function API returns the same handle, so existing function-style configs get the same integration without a rewrite.</p><p>Both URLs are declared on the same object: <code className="inline-code">database_url_sync</code> for the migration tooling and <code className="inline-code">database_url_async</code> for FastAPI. The async URL conventionally uses <code className="inline-code">postgresql+asyncpg://</code>; the plugin builds the pool from that engine when the app starts.</p></div><div><span className="comparison-label">the config</span><CodeBlock label="dbwarden.py">{`from dbwarden import DbwardenDatabase

class Primary(DbwardenDatabase):
    database_name = "primary"
    default = True
    database_type = "postgresql"
    database_url_sync = "postgresql://user:pass@localhost:5432/myapp"
    database_url_async = "postgresql+asyncpg://user:pass@localhost:5432/myapp"
    model_paths = ["app.models"]`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="02" label="Startup" title="Startup checks the schema, or applies pending migrations." doc="https://docs.dbwarden.org/cookbook/09-fastapi-integration/">
      <div className="why-split"><div><p><code className="inline-code">dbwarden_lifespan</code> runs on every startup and does four things: it validates the schema, it acts as a readiness gate so the app does not accept traffic until validation passes, it warms up the connection pool, and on shutdown it disposes every engine pool and ClickHouse client. The lifespan is entered as an async context manager, so the cleanup runs even when the app exits abnormally.</p><p>The mode decides what validation means. <code className="inline-code">check</code> verifies that no pending migrations exist and fails startup otherwise, which is the production recommendation: an out-of-date database never takes traffic. <code className="inline-code">migrate</code> applies pending migrations automatically before the app serves, for environments that should self-apply. <code className="inline-code">skip</code> runs no startup checks at all, for local debugging or when migrations are managed elsewhere.</p></div><div><span className="comparison-label">the lifespan</span><CodeBlock label="lifespan.py">{`from contextlib import asynccontextmanager
from fastapi import FastAPI
from dbwarden_fastapi import dbwarden_lifespan

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with dbwarden_lifespan(app, mode="check"):
        yield

app = FastAPI(lifespan=lifespan)`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="03" label="Sessions" title="A session dependency from the config." doc="https://docs.dbwarden.org/cookbook/09-fastapi-integration/">
      <div className="why-split"><div><p><code className="inline-code">primary.async_session</code> is a type alias for <code className="inline-code">Annotated[AsyncSession, Depends(...)]</code>, generated from the config. FastAPI resolves it to a real session backed by the engine configured on <code className="inline-code">Primary</code>, so route handlers never construct sessions or pick an engine themselves.</p><p>The session lifecycle is handled for you: it is opened when the handler starts, committed when the handler returns, rolled back if the handler raises, and closed and returned to the pool either way. Because the dependency resolves through the request, the same annotation works for sync handlers via <code className="inline-code">sync_session</code>, and ClickHouse clients get their own session factories from the plugin's ClickHouse extra.</p></div><div><span className="comparison-label">the route</span><CodeBlock label="routes.py">{`from config import primary

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, session: primary.async_session):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="04" label="API schemas" title="Request and response models from the models." doc="https://docs.dbwarden.org/getting-started/modeling/">
      <div className="why-split"><div><p><code className="inline-code">@auto_schema</code> turns a model into four schema classes: <code className="inline-code">CreateSchema</code> for POST bodies, <code className="inline-code">UpdateSchema</code> for PATCH, <code className="inline-code">PublicSchema</code> for responses, and <code className="inline-code">Schema</code> for internal use. Field definitions and validation come from the model columns, so a schema change and a migration change land in the same commit.</p><p>Fields marked <code className="inline-code">public = False</code> in the model's <code className="inline-code">Meta</code> are excluded from <code className="inline-code">PublicSchema</code>, which is where password hashes and internal flags belong. The generated schemas are Pydantic models, so they work with FastAPI's validation, OpenAPI generation, and <code className="inline-code">model_validate</code> for turning ORM instances into responses.</p><p>The four classes differ in what they require: <code className="inline-code">CreateSchema</code> expects the fields needed to create a row, <code className="inline-code">UpdateSchema</code> makes them optional for partial updates, and <code className="inline-code">Schema</code> is the internal representation used between layers. Validation failures surface as FastAPI's standard 422 responses, and every schema appears in the generated OpenAPI docs, so the API contract is derived from the models rather than maintained by hand.</p></div><div><span className="comparison-label">the schemas</span><CodeBlock label="models.py">{`@auto_schema
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    class Meta(TableMeta):
        class password_hash:
            public = False  # excluded from PublicSchema

create = User.CreateSchema(email="alice@example.com", password_hash="secret")
public = User.PublicSchema.model_validate(user)`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="05" label="Health and operations" title="Health and migration endpoints over HTTP." doc="https://github.com/dbwarden-org/dbwarden-fastapi">
      <div className="why-split"><div><p>Two routers expose the operational surface. The health router reports per-database status: connectivity, applied and pending migrations, and whether the migration lock is active. <code className="inline-code">GET /health/readiness</code> checks the database before traffic is routed to the instance, which is what makes it useful as a Kubernetes readiness probe, and <code className="inline-code">GET /health/liveness</code> stays lightweight for the liveness probe.</p><p>The migration router exposes <code className="inline-code">GET /db/status</code>, a JSON representation of <code className="inline-code">dbwarden status</code>, and <code className="inline-code">POST /db/migrate</code>, which applies pending migrations at runtime. Those endpoints are for management UIs and automated deployment tooling. Both routers can be protected: <code className="inline-code">DBWARDEN_MIGRATE_AUTH</code> requires an <code className="inline-code">X-API-Key</code> header on the migrate endpoint, and <code className="inline-code">DBWARDEN_HEALTH_AUTH</code> does the same for health.</p></div><div><span className="comparison-label">the routers</span><CodeBlock label="app.py">{`from dbwarden_fastapi import DBWardenHealthRouter, DBWardenRouter

app.include_router(DBWardenHealthRouter(), prefix="/health")
app.include_router(DBWardenRouter(), prefix="/db")`}</CodeBlock></div></div>
    </PageSection>
    <PageSection number="06" label="Metrics and logs" title="Prometheus metrics and JSON logs." doc="https://docs.dbwarden.org/observability/">
      <div className="why-split"><div><p>With <code className="inline-code">DBWARDEN_METRICS=true</code>, migrate and seed commands record counters, gauges, and histograms: migrations applied, migration errors, schema and seed version, pending migrations, durations, and errors, all labeled by database. The plugin exposes them at <code className="inline-code">/metrics</code> through the <code className="inline-code">MetricsRouter</code> and <code className="inline-code">MetricsMiddleware</code>, so a single scrape target covers both the app and the migration commands it runs.</p><p><code className="inline-code">DBWARDEN_LOG_JSON</code> switches all logs to newline-delimited JSON for ELK, Loki, or Datadog. When you need to see exactly what ran against the database, <code className="inline-code">--debug-level trace</code> logs every SQL statement as it executes, and <code className="inline-code">--perf</code> adds per-statement timing. The metrics dependency is optional: <code className="inline-code">uv add "dbwarden[metrics]"</code>, and without it every metric function is a safe no-op.</p></div><div><span className="comparison-label">metrics and json</span><CodeBlock>{'$ DBWARDEN_METRICS=true dbwarden migrate\n$ DBWARDEN_LOG_JSON=true dbwarden migrate --debug-level trace'}</CodeBlock></div></div>
    </PageSection>
    <Faq items={[
      { q: 'Does FastAPI support require the plugin?', a: 'Yes. FastAPI integration ships as the official `dbwarden-fastapi` plugin, installed with `dbwarden plugin add dbwarden-fastapi`. Core stays framework-independent.' },
      { q: 'Is there a sync session dependency too?', a: 'Yes: `Primary.handle` exposes both `async_session` and `sync_session` as FastAPI-compatible dependency annotations. ClickHouse clients get their own session factories.' },
      { q: 'Which lifespan mode should production use?', a: '`check`. The app validates the schema and fails startup on pending migrations, so an out-of-date database never takes traffic. Use `migrate` for environments that should self-apply.' },
      { q: 'Can the migrate endpoint be protected?', a: 'Yes. `DBWARDEN_MIGRATE_AUTH` requires an `X-API-Key` header on `POST /db/migrate`, and `DBWARDEN_HEALTH_AUTH` does the same for the health endpoints.' },
      { q: 'Do the metrics require an extra install?', a: 'The plugin ships optional extras: `[metrics]` for Prometheus recording, `[redis]` for the distributed migration lock, and `[clickhouse]` for ClickHouse sessions.' },
    ]} />
    <section className="fit-section"><div className="section-label">/ where it lives</div><div className="fit-grid"><div><strong>An official plugin</strong><p>FastAPI support ships as dbwarden-fastapi, installed with <code>dbwarden plugin add dbwarden-fastapi</code>. Core stays framework-independent.</p></div><div><strong>The full reference</strong><p>Session dependencies, health routes, metrics, and <code>@auto_schema</code> live in the plugin repository and its docs.</p><a className="text-link" href="https://github.com/dbwarden-org/dbwarden-fastapi" target="_blank" rel="noreferrer">dbwarden-fastapi on GitHub <span>↗</span></a></div></div></section>
  </PageFrame>
}
