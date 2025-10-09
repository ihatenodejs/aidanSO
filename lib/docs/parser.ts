/**
 * TypeDoc JSON parser that transforms TypeDoc's reflection model into a
 * simplified, searchable documentation structure.
 *
 * @remarks
 * This module parses TypeDoc JSON output (generated with `typedoc --json`)
 * and transforms it into a flattened, categorized structure optimized for:
 * - Fast client-side search
 * - Category-based navigation
 * - Rich documentation display
 *
 * **Processing pipeline:**
 * 1. Parse TypeDoc reflections recursively
 * 2. Extract JSDoc metadata (descriptions, examples, tags)
 * 3. Categorize items (Services, Utils, Types, Theme)
 * 4. Generate type signatures and function signatures
 * 5. Build navigation structure
 *
 * **Key features:**
 * - Preserves JSDoc @example blocks with language detection
 * - Filters out private/internal items
 * - Handles complex TypeScript types (unions, intersections, generics)
 * - Maintains source location references
 *
 * @module lib/docs/parser
 * @category Docs
 * @public
 */

import type {
  TypeDocRoot,
  TypeDocReflection,
  TypeDocSignature,
  TypeDocParameter,
  DocItem,
  DocSection,
  DocNavigation,
  DocCategory,
  DocKind,
} from './types'

/**
 * Maps TypeDoc's numeric kind identifiers to our simplified DocKind types.
 *
 * @remarks
 * TypeDoc uses numeric identifiers (based on TypeScript's SymbolKind enum)
 * to represent different declaration types. This map translates them to
 * our simplified string-based kind system for easier consumption.
 *
 * **Common mappings:**
 * - 1, 128: `'class'` (Class and Constructor)
 * - 2: `'interface'`
 * - 4, 16: `'enum'` (Enum and EnumMember)
 * - 64, 512, 2048: `'function'` / `'method'`
 * - 256, 1024, 2048: `'property'`
 * - 4096, 8192, 16384: `'type'` (TypeAlias, TypeParameter)
 *
 * @internal
 */
const KIND_MAP: Record<number, DocKind> = {
  1: 'class',
  2: 'interface',
  4: 'enum',
  16: 'enum', // EnumMember
  32: 'variable',
  64: 'function',
  128: 'class', // Constructor
  256: 'property',
  512: 'method',
  1024: 'property',
  2048: 'method',
  4096: 'type',
  8192: 'type',
  16384: 'type', // TypeAlias
  65536: 'method', // CallSignature
  131072: 'method', // IndexSignature
  262144: 'method', // ConstructorSignature
  524288: 'property', // Parameter
  1048576: 'type', // TypeParameter
  2097152: 'property', // Accessor
  4194304: 'property', // GetSignature
  8388608: 'property', // SetSignature
  16777216: 'type', // ObjectLiteral
  33554432: 'type', // TypeLiteral
}

/**
 * Parses TypeDoc JSON output into categorized documentation sections.
 *
 * @param json - TypeDoc JSON root object (generated with `typedoc --json`)
 * @returns Array of documentation sections grouped by category (Services, Utils, Types, Theme, Other)
 *
 * @remarks
 * This is the main entry point for the parser. It processes the entire TypeDoc
 * reflection tree and produces a flat, categorized structure optimized for:
 * - Client-side search and filtering
 * - Category-based navigation
 * - Alphabetically sorted items within categories
 *
 * **Processing steps:**
 * 1. Recursively parse all top-level reflections
 * 2. Filter out items without descriptions or in 'Other' category
 * 3. Deduplicate items by ID
 * 4. Group by category and sort items alphabetically
 * 5. Sort sections by predefined category order
 *
 * **Category ordering:**
 * Services → Utils → Types → Theme → Other
 *
 * @example
 * ```ts
 * import { parseTypeDocJSON } from '@/lib/docs/parser'
 * import typedocJson from '@/public/docs/api.json'
 *
 * const sections = parseTypeDocJSON(typedocJson)
 * // Returns: [
 * //   { title: 'Services', category: 'Services', items: [...] },
 * //   { title: 'Utils', category: 'Utils', items: [...] },
 * //   ...
 * // ]
 * ```
 *
 * @category Docs
 * @public
 */
export function parseTypeDocJSON(json: TypeDocRoot): DocSection[] {
  const sections: DocSection[] = []
  const categoryMap = new Map<DocCategory, DocItem[]>()

  if (!json.children) return sections

  for (const child of json.children) {
    const items = parseReflection(child, undefined, true)
    for (const item of items) {
      if (item.description || item.category !== 'Other') {
        const existing = categoryMap.get(item.category) || []
        existing.push(item)
        categoryMap.set(item.category, existing)
      }
    }
  }

  for (const [category, items] of categoryMap.entries()) {
    const uniqueItems = Array.from(
      new Map(items.map(item => [item.id, item])).values()
    )

    sections.push({
      title: category,
      category,
      items: uniqueItems.sort((a, b) => a.name.localeCompare(b.name)),
    })
  }

  return sections.sort((a, b) => {
    const order = ['Services', 'Utils', 'Types', 'Theme', 'Devices', 'Domains', 'Docs', 'API', 'Other']
    return order.indexOf(a.category) - order.indexOf(b.category)
  })
}

/**
 * Recursively parses a TypeDoc reflection into one or more DocItem objects.
 *
 * @param reflection - TypeDoc reflection object to parse
 * @param parentCategory - Inherited category from parent reflection
 * @param topLevel - Whether this is a top-level reflection (controls child parsing)
 * @returns Array of parsed DocItem objects
 *
 * @remarks
 * This is a recursive parsing function that handles all TypeScript declaration types.
 * It intelligently processes different reflection kinds (functions, classes, types, etc.)
 * and extracts relevant metadata.
 *
 * **Filtering:**
 * - Skips private items (isPrivate flag)
 * - Skips external items (isExternal flag)
 *
 * **Parsing strategy:**
 * - Functions with signatures → Extract parameters, returns, examples
 * - Classes/Interfaces/Types/Enums → Create item with type signature
 * - Variables/Properties → Create simple item with type
 * - Top-level items → Parse children recursively
 *
 * @internal
 */
function parseReflection(
  reflection: TypeDocReflection,
  parentCategory?: DocCategory,
  topLevel = false
): DocItem[] {
  const items: DocItem[] = []

  // Skip private/internal items
  if (reflection.flags?.isPrivate || reflection.flags?.isExternal) {
    return items
  }

  const kind = reflection.kindString
    ? (reflection.kindString.toLowerCase() as DocKind)
    : KIND_MAP[reflection.kind] || 'variable'

  const category = parentCategory || inferCategory(reflection)
  const description = extractDescription(reflection.comment)

  if (reflection.signatures && reflection.signatures.length > 0) {
    for (const signature of reflection.signatures) {
      items.push(createDocItemFromSignature(signature, reflection, category))
    }
  }

  else if (
    kind === 'class' ||
    kind === 'interface' ||
    kind === 'type' ||
    kind === 'enum'
  ) {
    const item: DocItem = {
      id: createId(reflection),
      name: reflection.name,
      kind,
      category,
      description,
      remarks: extractRemarks(reflection.comment),
      see: extractSeeAlso(reflection.comment),
      source: extractSource(reflection),
      tags: extractTags(reflection.comment),
      deprecated: isDeprecated(reflection.comment),
    }

    if (kind === 'type' || kind === 'interface') {
      item.signature = formatTypeSignature(reflection)

      if (kind === 'interface' && reflection.children && reflection.children.length > 0) {
        item.parameters = reflection.children.map(child => ({
          name: child.name,
          type: child.type ? formatType(child.type) : 'any',
          description: extractDescription(child.comment),
          optional: child.flags?.isOptional || false,
          defaultValue: child.defaultValue
        }))
      }
    }

    items.push(item)

    if (topLevel && reflection.children) {
      for (const child of reflection.children) {
        items.push(...parseReflection(child, category, false))
      }
    }
  }

  else if (!parentCategory || topLevel) {
    items.push({
      id: createId(reflection),
      name: reflection.name,
      kind,
      category,
      description,
      signature: reflection.type ? formatType(reflection.type) : undefined,
      source: extractSource(reflection),
      tags: extractTags(reflection.comment),
      deprecated: isDeprecated(reflection.comment),
    })
  }

  return items
}

/**
 * Creates a complete DocItem from a function/method signature with metadata.
 *
 * @param signature - TypeDoc signature containing parameters, return type, and JSDoc
 * @param parent - Parent reflection (for source location and naming)
 * @param category - Documentation category for this item
 * @returns Fully populated DocItem for a function/method
 *
 * @remarks
 * This function extracts all relevant information from a function signature including:
 * - Parameter names, types, and descriptions
 * - Return type and description
 * - Example code blocks with language identifiers
 * - JSDoc tags and deprecation status
 *
 * @internal
 */
function createDocItemFromSignature(
  signature: TypeDocSignature,
  parent: TypeDocReflection,
  category: DocCategory
): DocItem {
  const description = extractDescription(signature.comment)
  const parameters = signature.parameters?.map(parseParameter) || []
  const returns = signature.type
    ? {
        type: formatType(signature.type),
        description: extractReturnDescription(signature.comment),
      }
    : undefined

  return {
    id: createId(parent),
    name: parent.name,
    kind: 'function',
    category,
    description,
    remarks: extractRemarks(signature.comment),
    signature: formatFunctionSignature(parent.name, parameters, returns?.type),
    parameters,
    returns,
    examples: extractExamples(signature.comment),
    throws: extractThrows(signature.comment),
    see: extractSeeAlso(signature.comment),
    source: extractSource(parent),
    tags: extractTags(signature.comment),
    deprecated: isDeprecated(signature.comment),
  }
}

/**
 * Parses a TypeDoc parameter into a simplified parameter object.
 * @internal
 */
function parseParameter(param: TypeDocParameter) {
  return {
    name: param.name,
    type: param.type ? formatType(param.type) : 'any',
    description: extractDescription(param.comment),
    optional: param.flags?.isOptional || false,
    defaultValue: param.defaultValue,
  }
}

/**
 * Extract category from JSDoc @category tag
 */
function extractCategory(comment?: TypeDocReflection['comment']): DocCategory | undefined {
  const categoryTag = comment?.blockTags?.find((tag) => tag.tag === '@category')
  if (!categoryTag) return undefined

  const categoryName = categoryTag.content.map((c) => c.text).join('').trim()

  const categoryMap: Record<string, DocCategory> = {
    'Services': 'Services',
    'Utils': 'Utils',
    'Types': 'Types',
    'Theme': 'Theme',
    'Devices': 'Devices',
    'Domains': 'Domains',
    'Docs': 'Docs',
    'API': 'API',
  }

  return categoryMap[categoryName] || undefined
}

/**
 * Infer category from reflection name and structure
 */
function inferCategory(reflection: TypeDocReflection): DocCategory {
  const categoryFromTag = extractCategory(reflection.comment)
  if (categoryFromTag) return categoryFromTag

  const name = reflection.name.toLowerCase()

  if (name.includes('service')) return 'Services'
  if (name.includes('formatter') || name.includes('util')) return 'Utils'
  if (name.includes('color') || name.includes('surface') || name.includes('theme'))
    return 'Theme'
  if (name.includes('device')) return 'Devices'
  if (name.includes('domain')) return 'Domains'
  if (reflection.kindString === 'Interface' || reflection.kindString === 'Type alias')
    return 'Types'

  // Check source file path
  const source = reflection.sources?.[0]?.fileName
  if (source) {
    if (source.includes('/services/')) return 'Services'
    if (source.includes('/utils/')) return 'Utils'
    if (source.includes('/theme/')) return 'Theme'
    if (source.includes('/types/')) return 'Types'
    if (source.includes('/devices/')) return 'Devices'
    if (source.includes('/domains/')) return 'Domains'
    if (source.includes('/docs/')) return 'Docs'
  }

  return 'Other'
}

/**
 * Extract description from TypeDoc comment
 */
function extractDescription(comment?: TypeDocReflection['comment']): string {
  if (!comment?.summary) return ''
  return comment.summary.map((s) => s.text).join('')
}

/**
 * Extract return description from comment
 */
function extractReturnDescription(comment?: TypeDocSignature['comment']): string {
  const returnTag = comment?.blockTags?.find((tag) => tag.tag === '@returns')
  if (!returnTag) return ''
  return returnTag.content.map((c) => c.text).join('')
}

/**
 * Extract remarks (extended description) from comment
 * @internal
 */
function extractRemarks(comment?: TypeDocReflection['comment']): string | undefined {
  const remarksTag = comment?.blockTags?.find((tag) => tag.tag === '@remarks')
  if (!remarksTag) return undefined
  return remarksTag.content.map((c) => c.text).join('').trim()
}

/**
 * Extract exception documentation from comment
 * @internal
 */
function extractThrows(comment?: TypeDocReflection['comment']): string[] {
  const throwsTags = comment?.blockTags?.filter((tag) => tag.tag === '@throws') || []
  return throwsTags.map((tag) => tag.content.map((c) => c.text).join('').trim())
}

/**
 * Extract see-also references from comment
 * @internal
 */
function extractSeeAlso(comment?: TypeDocReflection['comment']): string[] {
  const seeTags = comment?.blockTags?.filter((tag) => tag.tag === '@see') || []
  return seeTags.map((tag) => tag.content.map((c) => c.text).join('').trim())
}

/**
 * Extracts language identifier from markdown code fences and removes fence markers.
 * @internal
 */
function extractCodeAndLanguage(code: string): { code: string; language: string } {
  // Extract language from opening fence (e.g., ```ts, ```tsx, ```javascript)
  const languageMatch = code.match(/^```(\w+)\n/)
  const language = languageMatch?.[1] || 'typescript'

  // Remove opening code fence with optional language identifier
  let cleaned = code.replace(/^```(?:\w+)?\n/gm, '')

  // Remove closing code fence
  cleaned = cleaned.replace(/\n?```$/gm, '')

  // Trim leading/trailing whitespace
  return {
    code: cleaned.trim(),
    language,
  }
}

/**
 * Extracts example code blocks with language identifiers from TypeDoc comment tags.
 * @internal
 */
function extractExamples(comment?: TypeDocSignature['comment']): Array<{ code: string; language: string }> {
  const exampleTags = comment?.blockTags?.filter((tag) => tag.tag === '@example') || []
  return exampleTags.map((tag) => {
    const rawExample = tag.content.map((c) => c.text).join('')
    return extractCodeAndLanguage(rawExample)
  })
}

/**
 * Extract tags from comment
 */
function extractTags(comment?: TypeDocReflection['comment']): string[] {
  if (!comment?.blockTags) return []
  return comment.blockTags
    .map((tag) => tag.tag.replace('@', ''))
    .filter((tag) => !['returns', 'param', 'example', 'remarks', 'throws', 'see', 'category'].includes(tag))
}

/**
 * Check if item is deprecated
 */
function isDeprecated(comment?: TypeDocReflection['comment']): boolean {
  return comment?.blockTags?.some((tag) => tag.tag === '@deprecated') || false
}

/**
 * Extract source location
 */
function extractSource(reflection: TypeDocReflection) {
  const source = reflection.sources?.[0]
  if (!source) return undefined
  return {
    file: source.fileName,
    line: source.line,
  }
}

/**
 * Format a type to string
 */
function formatType(type: TypeDocReflection['type']): string {
  if (!type) return 'any'

  switch (type.type) {
    case 'intrinsic':
      return type.name || 'any'
    case 'reference':
      return type.name || 'any'
    case 'array':
      return type.elementType ? `${formatType(type.elementType)}[]` : 'any[]'
    case 'union':
      return type.types ? type.types.map(formatType).join(' | ') : 'any'
    case 'intersection':
      return type.types ? type.types.map(formatType).join(' & ') : 'any'
    case 'literal':
      return JSON.stringify(type.value)
    case 'reflection':
      return 'object'
    default:
      return 'any'
  }
}

/**
 * Format function signature
 */
function formatFunctionSignature(
  name: string,
  parameters: Array<{
    name: string
    type: string
    optional: boolean
    defaultValue?: string
  }>,
  returnType?: string
): string {
  const params = parameters
    .map((p) => {
      const opt = p.optional ? '?' : ''
      const def = p.defaultValue ? ` = ${p.defaultValue}` : ''
      return `${p.name}${opt}: ${p.type}${def}`
    })
    .join(', ')

  return `${name}(${params})${returnType ? `: ${returnType}` : ''}`
}

/**
 * Format type signature for interfaces/types
 */
function formatTypeSignature(reflection: TypeDocReflection): string {
  if (!reflection.type) return ''

  const type = reflection.type
  if (type.type === 'reflection' && type.declaration?.children) {
    const props = type.declaration.children
      .map((child) => {
        const opt = child.flags?.isOptional ? '?' : ''
        const childType = child.type ? formatType(child.type) : 'any'
        return `  ${child.name}${opt}: ${childType}`
      })
      .join('\n')
    return `{\n${props}\n}`
  }

  return formatType(type)
}

/**
 * Create a unique ID for a doc item
 */
function createId(reflection: TypeDocReflection): string {
  const source = reflection.sources?.[0]
  if (source) {
    const file = source.fileName.replace(/^.*\/(lib|components)\//, '')
    return `${file}-${reflection.name}-${reflection.id}`
  }
  return `${reflection.name}-${reflection.id}`
}

/**
 * Build navigation structure from doc sections
 */
export function buildNavigation(sections: DocSection[]): DocNavigation {
  return {
    sections: sections.map((section) => ({
      title: section.title,
      category: section.category,
      items: section.items.map((item) => ({
        id: item.id,
        name: item.name,
        kind: item.kind,
      })),
    })),
  }
}

/**
 * Get all doc items flattened
 */
export function getAllItems(sections: DocSection[]): DocItem[] {
  return sections.flatMap((section) => section.items)
}

/**
 * Find a doc item by ID
 */
export function findItemById(sections: DocSection[], id: string): DocItem | undefined {
  for (const section of sections) {
    const item = section.items.find((i) => i.id === id)
    if (item) return item
  }
  return undefined
}