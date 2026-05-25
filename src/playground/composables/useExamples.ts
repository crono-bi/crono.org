import { ref } from 'vue'
import type { Ref } from 'vue'
import { ExampleGroupId } from '../types/enums'
import type { ExampleGroupData, ExampleItem } from '../types/interfaces'

const exampleModules = import.meta.glob('/src/playground/examples/*.sql', { query: '?raw', import: 'default' })

const GROUP_ORDER: ExampleGroupId[] = [
  ExampleGroupId.Select, 
  ExampleGroupId.Statements,
  ExampleGroupId.DML, 
  ExampleGroupId.Other
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
  'merge-history': ExampleGroupId.Statements,
  'merge-clone': ExampleGroupId.Statements,
  'merge-soft-delete': ExampleGroupId.Statements,
  'merge-upsert': ExampleGroupId.Statements,
  'insert-overwrite': ExampleGroupId.Statements,
  'insert-if-new': ExampleGroupId.Statements,
  'insert': ExampleGroupId.Statements,
  'update': ExampleGroupId.Statements,
  'delete': ExampleGroupId.Statements,
  'create-table': ExampleGroupId.DML, 
  'alter-table': ExampleGroupId.DML, 
  'create-view': ExampleGroupId.DML,
  'create-or-replace-view': ExampleGroupId.DML, 
  'create-procedure': ExampleGroupId.DML
}

const ITEM_ORDER: string[] = Object.keys(GROUP_MAP)

// Crono SQL instructions that should be displayed in uppercase
const CRONO_SQL_INSTRUCTIONS = new Set([
  'merge-history', 'merge-clone', 'merge-soft-delete', 'merge-upsert',
  'insert-overwrite', 'insert-if-new', 'insert', 'update', 'delete',
  'select', 'filter', 'materialize',
  'check-snowflake', 'assert', 'calculate', 'semi-join', 'anti-join',
  'nested-selects', 'string-interpolation', 'pseudo-views'
])

function fileNameToLabel(fileName: string): string {
  // Crono SQL instructions in uppercase
  if (CRONO_SQL_INSTRUCTIONS.has(fileName)) {
    return fileName.replace(/-/g, ' ').toUpperCase()
  }
  // Standard SQL in Title Case
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
