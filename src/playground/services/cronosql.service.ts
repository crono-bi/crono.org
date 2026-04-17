import httpClient from './http.client'
import { EngineId, SqlDialect } from '../types/enums'
import type { EtlOptions, CompileResult, TranspileRequest, TranspileResponse, ApiErrorResponse } from '../types/interfaces'

const DIALECT_MAP: Record<EngineId, SqlDialect> = {
  [EngineId.SQLServer]: SqlDialect.SQLServer,
  [EngineId.Snowflake]: SqlDialect.Snowflake,
  [EngineId.Postgres]:  SqlDialect.Postgres,
  [EngineId.Redshift]:  SqlDialect.Redshift,
  [EngineId.BigQuery]:  SqlDialect.BigQuery
}

export const CronoSqlService = {
  async compile(code: string, engine: EngineId = EngineId.SQLServer, etlOptions: EtlOptions = {} as EtlOptions): Promise<CompileResult> {
    try {
      const body: TranspileRequest = {
        CronoSql: code,
        ParseOptions: {
          SqlDialect: DIALECT_MAP[engine]
        },
        EtlOptions: etlOptions
      }
      const response = await httpClient.post<TranspileResponse>('/system/playground/transpile', body)

      const sql = response.data.Sql.join('\n\n')

      return {
        success: true,
        sql,
        warnings: response.data.Warnings || [],
        metadata: response.data.Metadata || {}
      }
    } catch (error: unknown) {
      console.error('Error compiling Crono SQL:', error)

      if (isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout: Compilation took too long')
        }
        if (error.response) {
          const data = error.response.data as ApiErrorResponse
          const errorMessage = data?.message || data?.Message || 'Unknown error'
          const err = new Error(errorMessage)
          ;(err as Error & { code?: string }).code = data?.code
          throw err
        }
        if (error.request) {
          throw new Error('Could not connect to the compilation server')
        }
      }

      throw new Error(error instanceof Error ? error.message : 'Error compiling the code')
    }
  }
}

function isAxiosError(error: unknown): error is { code?: string; response?: { data: unknown }; request?: unknown } {
  return typeof error === 'object' && error !== null && ('response' in error || 'request' in error || 'code' in error)
}
