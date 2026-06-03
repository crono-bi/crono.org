// ─────────────────────────────────────────────────────────────────────────
// FUENTE ÚNICA DE VERDAD para todos los motores SQL compatibles.
//
// Para añadir un motor nuevo:
//   1. Añade su valor a `EngineId` y `SqlDialect` en playground/types/enums.ts
//   2. Añade una entrada a `ENGINES` aquí (id, dialect, name, color, logo)
//   3. Coloca el SVG del logo en /public/playground-assets/
// Eso es todo: selector, modal, chips, footer, landing y el servicio de
// compilación derivan automáticamente de este registro.
// ─────────────────────────────────────────────────────────────────────────
import { EngineId, SqlDialect } from '../playground/types/enums'

export interface Engine {
  /** ID interno (URL params, localStorage, estado de UI) */
  id: EngineId
  /** Dialecto que espera la API de compilación */
  dialect: SqlDialect
  /** Nombre visible para el usuario (único en toda la app) */
  name: string
  /** Color de marca */
  color: string
  /** Ruta al logo SVG en /public */
  logo: string
}

// El orden define cómo aparecen en el selector y en los chips.
export const ENGINES: Engine[] = [
  { id: EngineId.Snowflake,  dialect: SqlDialect.Snowflake,  name: 'Snowflake',  color: '#29B5E8', logo: '/playground-assets/snowflake.svg' },
  { id: EngineId.Redshift,   dialect: SqlDialect.Redshift,   name: 'Redshift',   color: '#1A73C8', logo: '/playground-assets/redshift.svg' },
  { id: EngineId.BigQuery,   dialect: SqlDialect.BigQuery,   name: 'BigQuery',   color: '#4285F4', logo: '/playground-assets/bigquery.svg' },
  { id: EngineId.SQLServer,  dialect: SqlDialect.SQLServer,  name: 'SQL Server', color: '#A91D22', logo: '/playground-assets/microsoft-sql-server.svg' },
  { id: EngineId.Postgres,   dialect: SqlDialect.Postgres,   name: 'PostgreSQL', color: '#336791', logo: '/playground-assets/postgresql.svg' },
  { id: EngineId.Databricks, dialect: SqlDialect.Databricks, name: 'Databricks', color: '#FF3621', logo: '/playground-assets/databricks.svg' },
  { id: EngineId.MSFabric,   dialect: SqlDialect.MSFabric,   name: 'MS Fabric',  color: '#00D8AA', logo: '/playground-assets/msfabric.svg' },
  { id: EngineId.DuckDB,     dialect: SqlDialect.DuckDB,     name: 'DuckDB',     color: '#E6B000', logo: '/playground-assets/duckDB.svg' },
]

/** Lookup O(1) por EngineId */
export const ENGINE_MAP = new Map<EngineId, Engine>(ENGINES.map(e => [e.id, e]))

/** Lookup O(1) por nombre visible (para componentes que reciben nombres) */
export const ENGINE_BY_NAME = new Map<string, Engine>(ENGINES.map(e => [e.name, e]))

/** Nombres visibles en orden, para listas/chips */
export const ENGINE_NAMES: string[] = ENGINES.map(e => e.name)

/** Default global cuando no hay selección previa */
export const DEFAULT_ENGINE: EngineId = EngineId.Snowflake
