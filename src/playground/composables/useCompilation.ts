import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { CronoSqlService } from '../services/cronosql.service'
import { EngineId, EtlColumnDefault } from '../types/enums'
import type { EtlOptions } from '../types/interfaces'

const ENGINE_LABELS: Record<EngineId, string> = {
  [EngineId.SQLServer]: 'SQL Server',
  [EngineId.Snowflake]: 'Snowflake',
  [EngineId.Postgres]:  'PostgreSQL',
  [EngineId.Redshift]:  'Redshift',
  [EngineId.BigQuery]:  'BigQuery'
}

const defaultCode = `/*
  Welcome to Crono Playground!
  Write your Crono SQL code here or select an example
  from the sidebar. Click the ▶ Run button to compile.
*/

SELECT
  Product.Name Product,
  ProductCategory.name ProductCategory,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)`

export function useCompilation() {
  // Load from URL query params or use defaults (base64 encoded for compatibility)
  const urlParams = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search) 
    : null
  
  let initialCode = defaultCode
  try {
    const encodedCode = urlParams?.get('code')
    if (encodedCode) {
      initialCode = decodeURIComponent(atob(encodedCode))
    }
  } catch {
    // Invalid encoding, use default
    initialCode = defaultCode
  }
    
  const initialEngine = urlParams?.get('engine') as EngineId
  const validEngine = Object.values(EngineId).includes(initialEngine) 
    ? initialEngine 
    : EngineId.SQLServer

  const selectedEngine: Ref<EngineId> = ref(validEngine)
  const isCompiling: Ref<boolean> = ref(false)
  const compilationError: Ref<string> = ref('')
  const cronoCode: Ref<string> = ref(initialCode)

  const etlOptions: Ref<EtlOptions> = ref({
    InsertedDateColumnName: EtlColumnDefault.InsertedDate,
    UpdatedDateColumnName:  EtlColumnDefault.UpdatedDate,
    DeletedDateColumnName:  EtlColumnDefault.DeletedDate,
    StartDateColumnName:    EtlColumnDefault.StartDate,
    EndDateColumnName:      EtlColumnDefault.EndDate,
    DefaultEndDate:         EtlColumnDefault.DefaultEndDate
  })

  // Update URL when code or engine changes (base64 encoded)
  function updateUrl() {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams()
    if (cronoCode.value !== defaultCode) {
      params.set('code', btoa(encodeURIComponent(cronoCode.value)))
    }
    if (selectedEngine.value !== EngineId.SQLServer) {
      params.set('engine', selectedEngine.value)
    }
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}` 
      : window.location.pathname
    
    window.history.replaceState({}, '', newUrl)
  }

  watch(cronoCode, updateUrl)
  watch(selectedEngine, updateUrl)

  const sqlOutput: Ref<string> = ref('')
  const engineLabel = computed(() => ENGINE_LABELS[selectedEngine.value] || selectedEngine.value)

  let runId = 0

  async function handleRun(): Promise<void> {
    if (!cronoCode.value.trim()) {
      sqlOutput.value = '-- No code to compile'
      return
    }

    // Guard: increment runId so stale responses are discarded
    const currentRunId = ++runId

    isCompiling.value = true
    compilationError.value = ''
    sqlOutput.value = `-- Compiling for ${engineLabel.value}...`

    try {
      const result = await CronoSqlService.compile(cronoCode.value, selectedEngine.value, etlOptions.value)

      // Discard result if a newer run was triggered while waiting
      if (currentRunId !== runId) return

      let output = `-- Generated SQL for ${engineLabel.value}\n`

      if (result.warnings.length > 0) {
        output += `-- Warnings:\n`
        result.warnings.forEach(warning => { output += `--   ${warning}\n` })
        output += `\n`
      }

      output += result.sql
      sqlOutput.value = output.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    } catch (error: unknown) {
      if (currentRunId !== runId) return

      const msg = error instanceof Error ? error.message : 'Unknown error'
      const code = (error as Error & { code?: string }).code
      compilationError.value = msg
      if (code === 'SyntaxErrorException') {
        sqlOutput.value = `-- Syntax error in your Crono SQL:\n-- ${msg}`
      } else {
        sqlOutput.value = `-- Compilation error:\n-- ${msg}`
      }
    } finally {
      if (currentRunId === runId) {
        isCompiling.value = false
      }
    }
  }

  const hasCompiledOnce: Ref<boolean> = ref(false)

  watch(selectedEngine, () => {
    if (hasCompiledOnce.value && !isCompiling.value) {
      handleRun()
    }
  })

  async function handleRunTracked(): Promise<void> {
    await handleRun()
    if (!compilationError.value) {
      hasCompiledOnce.value = true
    }
  }

  return {
    selectedEngine,
    isCompiling,
    compilationError,
    etlOptions,
    cronoCode,
    sqlOutput,
    engineLabel,
    handleRun: handleRunTracked
  }
}
