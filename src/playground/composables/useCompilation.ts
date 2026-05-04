import { ref, computed, watch, onMounted } from 'vue'
import type { Ref } from 'vue'
import { CronoSqlService } from '../services/cronosql.service'
import { EngineId, EtlColumnDefault } from '../types/enums'
import type { EtlOptions } from '../types/interfaces'
import { playgroundBus } from '../event-bus'

const ENGINE_LABELS: Record<EngineId, string> = {
  [EngineId.SQLServer]:  'SQL Server',
  [EngineId.Snowflake]:  'Snowflake',
  [EngineId.Postgres]:   'PostgreSQL',
  [EngineId.Redshift]:   'Redshift',
  [EngineId.BigQuery]:   'BigQuery',
  [EngineId.Databricks]: 'Databricks',
  [EngineId.MSFabric]:   'MS Fabric DWH'
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
    : EngineId.Snowflake

  const selectedEngine: Ref<EngineId> = ref(validEngine)
  const isCompiling: Ref<boolean> = ref(false)
  const compilationError: Ref<string> = ref('')
  const cronoCode: Ref<string> = ref(initialCode)

  // ETL options: load from URL params, fallback to defaults
  const defaultEtlOptions: EtlOptions = {
    InsertedDateColumnName: EtlColumnDefault.InsertedDate,
    UpdatedDateColumnName:  EtlColumnDefault.UpdatedDate,
    DeletedDateColumnName:  EtlColumnDefault.DeletedDate,
    StartDateColumnName:    EtlColumnDefault.StartDate,
    EndDateColumnName:      EtlColumnDefault.EndDate,
    DefaultEndDate:         EtlColumnDefault.DefaultEndDate
  }

  function etlFromUrl(params: URLSearchParams | null): EtlOptions {
    if (!params) return { ...defaultEtlOptions }
    return {
      InsertedDateColumnName: params.get('etl_ins')  ?? defaultEtlOptions.InsertedDateColumnName,
      UpdatedDateColumnName:  params.get('etl_upd')  ?? defaultEtlOptions.UpdatedDateColumnName,
      DeletedDateColumnName:  params.get('etl_del')  ?? defaultEtlOptions.DeletedDateColumnName,
      StartDateColumnName:    params.get('etl_start') ?? defaultEtlOptions.StartDateColumnName,
      EndDateColumnName:      params.get('etl_end')  ?? defaultEtlOptions.EndDateColumnName,
      DefaultEndDate:         params.get('etl_dend') ?? defaultEtlOptions.DefaultEndDate,
    }
  }

  const etlOptions: Ref<EtlOptions> = ref(etlFromUrl(urlParams))

  const hasCodeInUrl = !!(urlParams?.get('code'))

  // Store code in localStorage so sidebar can select matching example
  onMounted(() => {
    if (hasCodeInUrl && cronoCode.value !== defaultCode) {
      localStorage.setItem('pg-url-code', cronoCode.value)
      playgroundBus.emit('url-code-loaded', cronoCode.value)
    } else {
      localStorage.removeItem('pg-url-code')
    }
  })

  // Update URL when code, engine, or ETL options change
  function updateUrl() {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams()
    if (cronoCode.value !== defaultCode) {
      params.set('code', btoa(encodeURIComponent(cronoCode.value)))
    }
    if (selectedEngine.value !== EngineId.Snowflake) {
      params.set('engine', selectedEngine.value)
    }
    // Only serialize ETL fields that differ from defaults
    const etl = etlOptions.value
    if (etl.InsertedDateColumnName !== defaultEtlOptions.InsertedDateColumnName) params.set('etl_ins',   etl.InsertedDateColumnName)
    if (etl.UpdatedDateColumnName  !== defaultEtlOptions.UpdatedDateColumnName)  params.set('etl_upd',   etl.UpdatedDateColumnName)
    if (etl.DeletedDateColumnName  !== defaultEtlOptions.DeletedDateColumnName)  params.set('etl_del',   etl.DeletedDateColumnName)
    if (etl.StartDateColumnName    !== defaultEtlOptions.StartDateColumnName)    params.set('etl_start', etl.StartDateColumnName)
    if (etl.EndDateColumnName      !== defaultEtlOptions.EndDateColumnName)      params.set('etl_end',   etl.EndDateColumnName)
    if (etl.DefaultEndDate         !== defaultEtlOptions.DefaultEndDate)         params.set('etl_dend',  etl.DefaultEndDate)
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}` 
      : window.location.pathname
    
    window.history.replaceState({}, '', newUrl)
  }

  watch(cronoCode, updateUrl)
  watch(selectedEngine, updateUrl)
  watch(etlOptions, updateUrl, { deep: true })

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

  // Auto-run when playground loads with ?code= in URL
  onMounted(() => {
    if (hasCodeInUrl) {
      handleRun().then(() => { hasCompiledOnce.value = true })
    }
  })

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
