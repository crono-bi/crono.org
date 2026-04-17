import { ref } from 'vue'
import type { Ref } from 'vue'
import { ExampleGroupId } from '../types/enums'
import type { ExampleGroupData, ExampleItem } from '../types/interfaces'

const exampleModules = import.meta.glob('/src/playground/examples/*.sql', { query: '?raw', import: 'default' })

const GROUP_ORDER: ExampleGroupId[] = [
  ExampleGroupId.Select, ExampleGroupId.Statements, ExampleGroupId.Delete,
  ExampleGroupId.ETL, ExampleGroupId.DML, ExampleGroupId.Other
]

const GROUP_MAP: Record<string, ExampleGroupId> = {
  'select': ExampleGroupId.Select,
  'filter': ExampleGroupId.Select,
  'materialize': ExampleGroupId.Select,
  'check-snowflake': ExampleGroupId.Select,
  'assert': ExampleGroupId.Select,
  'calculate': ExampleGroupId.Select,
  'semi-join': ExampleGroupId.Select,
  'anti-join': ExampleGroupId.Select,
  'nested-selects': ExampleGroupId.Select,
  'string-interpolation': ExampleGroupId.Select,
  'date-functions': ExampleGroupId.Select,
  'identifier-delimiters': ExampleGroupId.Select,
  'functions': ExampleGroupId.Select, 
  'pseudo-views': ExampleGroupId.Select,
  'delete': ExampleGroupId.Delete,
  'delete-and-insert': ExampleGroupId.Delete,
  'insert': ExampleGroupId.Delete,
  'insert-all': ExampleGroupId.Delete,
  'delete-ansi': ExampleGroupId.Delete, 
  'update-ansi': ExampleGroupId.Statements,
  'merge-clone': ExampleGroupId.Statements,
  'merge-history': ExampleGroupId.Statements, 
  'merge-soft-delete': ExampleGroupId.Statements,
  'merge-update': ExampleGroupId.Statements, 
  'merge-upsert': ExampleGroupId.Statements,
  'truncate-and-insert': ExampleGroupId.Statements, 
  'update': ExampleGroupId.Statements,
  'merge-all': ExampleGroupId.Statements,
  'partition': ExampleGroupId.ETL, 
  'update-all': ExampleGroupId.ETL,
  'create-table': ExampleGroupId.DML, 
  'alter-table': ExampleGroupId.DML, 
  'create-view': ExampleGroupId.DML,
  'create-or-replace-view': ExampleGroupId.DML, 
  'create-procedure': ExampleGroupId.DML
}

const ITEM_ORDER: string[] = Object.keys(GROUP_MAP)

function fileNameToLabel(fileName: string): string {
  return fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function useExamples() {
  const examples: Ref<ExampleGroupData[]> = ref([])
  const activeExample: Ref<string> = ref('')

  async function loadExamples(): Promise<void> {
    const groups: ExampleGroupData[] = []

    for (const [path, loadContent] of Object.entries(exampleModules)) {
      const fileName = path.replace('/src/playground/examples/', '').replace('.sql', '')
      const content = await loadContent() as string
      const group: ExampleGroupId = GROUP_MAP[fileName] || ExampleGroupId.Other

      let groupObj = groups.find(g => g.group === group)
      if (!groupObj) {
        groupObj = { group, items: [] }
        groups.push(groupObj)
      }

      groupObj.items.push({ name: fileNameToLabel(fileName), code: content })
    }

    groups.sort((a, b) => GROUP_ORDER.indexOf(a.group as ExampleGroupId) - GROUP_ORDER.indexOf(b.group as ExampleGroupId))
    groups.forEach(g => g.items.sort((a: ExampleItem, b: ExampleItem) => {
      const aKey = ITEM_ORDER.findIndex(k => fileNameToLabel(k) === a.name)
      const bKey = ITEM_ORDER.findIndex(k => fileNameToLabel(k) === b.name)
      return aKey - bKey
    }))

    examples.value = groups
  }

  return { examples, activeExample, loadExamples }
}
