// Configuración centralizada de motores SQL compatibles
export interface Engine {
  id: string
  name: string
  color: string
  logo: string
}

export const ENGINES: Engine[] = [
  { id: 'snowflake', name: 'Snowflake', color: '#29B5E8', logo: '/playground-assets/snowflake.svg' },
  { id: 'sqlserver', name: 'SQL Server', color: '#A91D22', logo: '/playground-assets/microsoft-sql-server.svg' },
  { id: 'postgres', name: 'PostgreSQL', color: '#336791', logo: '/playground-assets/postgresql.svg' },
  { id: 'redshift', name: 'Redshift', color: '#1A73C8', logo: '/playground-assets/redshift.svg' },
  { id: 'bigquery', name: 'BigQuery', color: '#4285F4', logo: '/playground-assets/bigquery.svg' },
  { id: 'databricks', name: 'Databricks', color: '#FF3621', logo: '/playground-assets/databricks.svg' },
  { id: 'fabric', name: 'Fabric', color: '#00D8AA', logo: '/playground-assets/msfabric.svg' },
  { id: 'duckdb', name: 'DuckDB', color: '#E6B000', logo: '/playground-assets/duckDB.svg' },
]

export const ENGINE_MAP = new Map(ENGINES.map(e => [e.id, e]))
