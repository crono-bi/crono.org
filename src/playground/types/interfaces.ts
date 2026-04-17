import type { EngineId, SqlDialect } from './enums'

export interface Engine {
  id: EngineId
  label: string
  icon: string
  disabled?: boolean
}

export interface ExampleItem {
  name: string
  code: string
}

export interface ExampleGroupData {
  group: string
  items: ExampleItem[]
}

export interface EtlOptions {
  InsertedDateColumnName: string
  UpdatedDateColumnName: string
  DeletedDateColumnName: string
  StartDateColumnName: string
  EndDateColumnName: string
  DefaultEndDate: string
}

export interface CompileResult {
  success: boolean
  sql: string
  warnings: string[]
  metadata: Record<string, unknown>
}

export interface TranspileResponse {
  Sql: string[]
  Warnings?: string[]
  Metadata?: Record<string, unknown>
  Message?: string
}

export interface EtlField {
  key: keyof EtlOptions
  label: string
  placeholder: string
}

export interface ParseOptions {
  SqlDialect: SqlDialect
}

export interface TranspileRequest {
  CronoSql: string
  ParseOptions: ParseOptions
  EtlOptions: EtlOptions
}

export interface ApiErrorResponse {
  type?: string
  statusCode?: string
  code?: string
  message?: string
  Message?: string
  stackTrace?: string
}
