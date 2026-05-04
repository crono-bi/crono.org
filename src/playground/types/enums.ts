export enum SqlDialect {
  SQLServer  = 'SQLServer',
  Snowflake  = 'Snowflake',
  Postgres   = 'Postgres',
  Redshift   = 'Redshift',
  BigQuery   = 'BigQuery',
  Databricks = 'Databricks',
  MSFabric   = 'MSFabric'
}

export enum Theme {
  Dark  = 'dark',
  Light = 'light'
}

export enum ToastType {
  Info    = 'info',
  Success = 'success',
  Error   = 'error'
}

export enum EngineId {
  SQLServer  = 'sqlserver',
  Snowflake  = 'snowflake',
  Postgres   = 'postgre',
  Redshift   = 'redshift',
  BigQuery   = 'bigquery',
  Databricks = 'databricks',
  MSFabric   = 'msfabric'
}

export enum ExampleGroupId {
  Select     = 'SELECT',
  Delete     = 'DELETE',
  Statements = 'Statements',
  ETL        = 'ETL',
  DML        = 'DML',
  Other      = 'Other'
}

export enum EtlColumnDefault {
  InsertedDate = 'INSERT_DATE',
  UpdatedDate  = 'UPDATE_DATE',
  DeletedDate  = 'DELETE_DATE',
  StartDate    = 'START_DATE',
  EndDate      = 'END_DATE',
  DefaultEndDate = '2100-01-01'
}

export enum AppPage {
  Playground = 'playground',
  Intro      = 'intro'
}
