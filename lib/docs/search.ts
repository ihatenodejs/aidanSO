/**
 * Documentation search engine with weighted scoring algorithm.
 *
 * @remarks
 * This module provides fast, client-side search functionality for documentation items
 * with a sophisticated scoring system that prioritizes different types of matches.
 *
 * **Features:**
 * - Multi-term search with space-separated queries
 * - Weighted scoring (exact matches > prefix matches > contains matches)
 * - Category and kind filtering
 * - Tag-based filtering
 * - Search suggestions based on partial queries
 * - Results grouping by category
 *
 * **Scoring system:**
 * - Exact name match: 100 points
 * - Name starts with term: 50 points
 * - Name contains term: 30 points
 * - Description contains term: 20 points
 * - Signature contains term: 15 points
 * - Tag contains term: 10 points
 * - Parameter name contains term: 5 points
 *
 * @module lib/docs/search
 * @category Docs
 * @public
 */

import type { DocItem, DocFilters, APIEndpoint } from './types'

/**
 * Searches through documentation items with filtering and scoring.
 *
 * @param items - Array of documentation items to search
 * @param query - Search query string (space-separated terms)
 * @param filters - Optional filters for category, kind, and tags
 * @returns Filtered and scored array of documentation items, sorted by relevance
 *
 * @remarks
 * This function implements a two-phase search:
 * 1. **Filter phase**: Apply category, kind, and tag filters
 * 2. **Search phase**: Score items based on query term matches
 *
 * **Empty query handling:**
 * If query is empty or only whitespace, returns filtered items without scoring.
 *
 * **Multi-term queries:**
 * Space-separated terms are searched independently and scores are accumulated.
 * Example: "format date" searches for both "format" AND "date".
 *
 * @example
 * ```ts
 * import { searchDocs } from '@/lib/docs/search'
 * import { getAllItems } from '@/lib/docs/parser'
 *
 * const allItems = getAllItems(sections)
 *
 * // Simple search
 * const results = searchDocs(allItems, 'formatter')
 *
 * // Search with filters
 * const serviceResults = searchDocs(allItems, 'get domain', {
 *   category: 'Services',
 *   kind: 'function'
 * })
 * ```
 *
 * @category Docs
 * @public
 */
export function searchDocs(
  items: DocItem[],
  query: string,
  filters?: DocFilters
): DocItem[] {
  let results = items

  // Apply filters
  if (filters) {
    if (filters.category) {
      results = results.filter((item) => item.category === filters.category)
    }
    if (filters.kind) {
      results = results.filter((item) => item.kind === filters.kind)
    }
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((item) =>
        filters.tags!.some((tag) => item.tags?.includes(tag))
      )
    }
  }

  // Apply search query
  if (!query || query.trim() === '') {
    return results
  }

  const searchTerms = query.toLowerCase().split(/\s+/)

  return results
    .map((item) => ({
      item,
      score: calculateSearchScore(item, searchTerms),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

/**
 * Calculates weighted search score for a documentation item.
 * @internal
 */
function calculateSearchScore(item: DocItem, searchTerms: string[]): number {
  let score = 0
  const name = item.name.toLowerCase()
  const description = item.description.toLowerCase()
  const signature = item.signature?.toLowerCase() || ''
  const tags = (item.tags || []).join(' ').toLowerCase()

  for (const term of searchTerms) {
    // Exact name match (highest score)
    if (name === term) {
      score += 100
      continue
    }

    // Name starts with term
    if (name.startsWith(term)) {
      score += 50
      continue
    }

    // Name contains term
    if (name.includes(term)) {
      score += 30
      continue
    }

    // Description contains term
    if (description.includes(term)) {
      score += 20
    }

    // Signature contains term
    if (signature.includes(term)) {
      score += 15
    }

    // Tags contain term
    if (tags.includes(term)) {
      score += 10
    }

    // Parameter names contain term
    if (item.parameters) {
      for (const param of item.parameters) {
        if (param.name.toLowerCase().includes(term)) {
          score += 5
        }
      }
    }
  }

  return score
}

/**
 * Searches through API endpoints with weighted scoring.
 *
 * @param endpoints - Array of API endpoints to search
 * @param query - Search query string (space-separated terms)
 * @returns Filtered and scored array of API endpoints, sorted by relevance
 *
 * @remarks
 * Similar to searchDocs but optimized for API endpoint structure.
 * Searches path, method, and description fields.
 *
 * @category Docs
 * @public
 */
export function searchAPIs(
  endpoints: APIEndpoint[],
  query: string
): APIEndpoint[] {
  if (!query || query.trim() === '') {
    return endpoints
  }

  const searchTerms = query.toLowerCase().split(/\s+/)

  return endpoints
    .map((endpoint) => ({
      endpoint,
      score: calculateAPIScore(endpoint, searchTerms),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ endpoint }) => endpoint)
}

/**
 * Calculate search score for API endpoint
 */
function calculateAPIScore(endpoint: APIEndpoint, searchTerms: string[]): number {
  let score = 0
  const path = endpoint.path.toLowerCase()
  const description = endpoint.description.toLowerCase()
  const method = endpoint.method.toLowerCase()

  for (const term of searchTerms) {
    // Path exact match
    if (path === term) {
      score += 100
      continue
    }

    // Path contains term
    if (path.includes(term)) {
      score += 50
    }

    // Method matches
    if (method === term) {
      score += 40
    }

    // Description contains term
    if (description.includes(term)) {
      score += 20
    }
  }

  return score
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(
  items: DocItem[],
  query: string,
  limit = 5
): string[] {
  if (!query || query.trim() === '') {
    return []
  }

  const queryLower = query.toLowerCase()
  const suggestions = new Set<string>()

  for (const item of items) {
    // Suggest item names
    if (item.name.toLowerCase().includes(queryLower)) {
      suggestions.add(item.name)
    }

    // Suggest tags
    if (item.tags) {
      for (const tag of item.tags) {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag)
        }
      }
    }

    if (suggestions.size >= limit) break
  }

  return Array.from(suggestions).slice(0, limit)
}

/**
 * Group search results by category
 */
export function groupByCategory(items: DocItem[]): Map<string, DocItem[]> {
  const grouped = new Map<string, DocItem[]>()

  for (const item of items) {
    const category = item.category
    const existing = grouped.get(category) || []
    existing.push(item)
    grouped.set(category, existing)
  }

  return grouped
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(
  text: string,
  searchTerms: string[]
): string {
  let highlighted = text

  for (const term of searchTerms) {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
    highlighted = highlighted.replace(regex, '<mark>$1</mark>')
  }

  return highlighted
}

/**
 * Escape special regex characters
 */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Create search index for faster lookups
 */
export function createSearchIndex(items: DocItem[]): Map<string, DocItem[]> {
  const index = new Map<string, DocItem[]>()

  for (const item of items) {
    // Index by name tokens
    const nameTokens = item.name.toLowerCase().split(/[_\-\s]+/)
    for (const token of nameTokens) {
      const existing = index.get(token) || []
      if (!existing.includes(item)) {
        existing.push(item)
        index.set(token, existing)
      }
    }

    // Index by tags
    if (item.tags) {
      for (const tag of item.tags) {
        const existing = index.get(tag.toLowerCase()) || []
        if (!existing.includes(item)) {
          existing.push(item)
          index.set(tag.toLowerCase(), existing)
        }
      }
    }
  }

  return index
}