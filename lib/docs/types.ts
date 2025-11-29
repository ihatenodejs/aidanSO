/**
 * Type definitions for documentation system
 */

export interface TypeDocReflection {
  id: number
  name: string
  kind: number
  kindString?: string
  flags?: {
    isExported?: boolean
    isExternal?: boolean
    isOptional?: boolean
    isRest?: boolean
    isPrivate?: boolean
    isProtected?: boolean
    isPublic?: boolean
    isStatic?: boolean
    isReadonly?: boolean
    isAbstract?: boolean
  }
  comment?: {
    summary?: Array<{ kind: string; text: string }>
    blockTags?: Array<{
      tag: string
      content: Array<{ kind: string; text: string }>
    }>
  }
  children?: TypeDocReflection[]
  groups?: Array<{
    title: string
    children: number[]
  }>
  sources?: Array<{
    fileName: string
    line: number
    character: number
  }>
  signatures?: TypeDocSignature[]
  type?: TypeDocType
  defaultValue?: string
  parameters?: TypeDocParameter[]
}

export interface TypeDocSignature {
  id: number
  name: string
  kind: number
  kindString?: string
  comment?: {
    summary?: Array<{ kind: string; text: string }>
    blockTags?: Array<{
      tag: string
      content: Array<{ kind: string; text: string }>
    }>
  }
  parameters?: TypeDocParameter[]
  type?: TypeDocType
}

export interface TypeDocParameter {
  id: number
  name: string
  kind: number
  kindString?: string
  flags?: {
    isOptional?: boolean
    isRest?: boolean
  }
  comment?: {
    summary?: Array<{ kind: string; text: string }>
  }
  type?: TypeDocType
  defaultValue?: string
}

export interface TypeDocType {
  type: string
  name?: string
  value?: string | number | boolean | null
  types?: TypeDocType[]
  typeArguments?: TypeDocType[]
  elementType?: TypeDocType
  declaration?: TypeDocReflection
  target?: number
  package?: string
  qualifiedName?: string
}

export interface TypeDocRoot {
  id: number
  name: string
  kind: number
  kindString?: string
  children?: TypeDocReflection[]
  groups?: Array<{
    title: string
    children: number[]
  }>
  packageName?: string
  packageVersion?: string
}

/**
 * Processed documentation structure
 */
export interface DocItem {
  id: string
  name: string
  kind: DocKind
  category: DocCategory
  description: string
  remarks?: string
  signature?: string
  parameters?: DocParameter[]
  returns?: {
    type: string
    description: string
  }
  examples?: Array<{
    code: string
    language: string
  }>
  throws?: string[]
  see?: string[]
  source?: {
    file: string
    line: number
  }
  tags?: string[]
  deprecated?: boolean
}

export type DocKind =
  | 'function'
  | 'method'
  | 'class'
  | 'interface'
  | 'type'
  | 'variable'
  | 'property'
  | 'enum'

export type DocCategory =
  | 'Services'
  | 'Utils'
  | 'Types'
  | 'Theme'
  | 'Devices'
  | 'Domains'
  | 'Configuration'
  | 'Docs'
  | 'API'
  | 'Other'

export interface DocParameter {
  name: string
  type: string
  description: string
  optional: boolean
  defaultValue?: string
}

export interface DocSection {
  title: string
  items: DocItem[]
  category: DocCategory
}

/**
 * API endpoint documentation
 */
export interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  category: string
  auth?: {
    required: boolean
    type?: string
    description?: string
  }
  parameters?: {
    query?: DocParameter[]
    body?: DocParameter[]
    headers?: DocParameter[]
  }
  responses: Array<{
    status: number
    description: string
    schema?: Record<string, unknown>
    example?: Record<string, unknown>
  }>
  examples?: Array<{
    title: string
    request: string | Record<string, unknown>
    response: string | Record<string, unknown>
  }>
}

/**
 * Search result
 */
export interface SearchResult {
  item: DocItem | APIEndpoint
  matches: Array<{
    key: string
    value: string
    indices: Array<[number, number]>
  }>
  score: number
}

/**
 * Documentation filters
 */
export interface DocFilters {
  category?: DocCategory
  kind?: DocKind
  search?: string
  tags?: string[]
}
