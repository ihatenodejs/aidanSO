/**
 * TypeDoc HTML parser for extracting and rendering individual documentation items.
 *
 * @remarks
 * This module parses TypeDoc-generated HTML files to extract the main content
 * section for individual items, allowing us to display them with our custom design
 * instead of using an iframe.
 *
 * @module lib/docs/html-parser
 * @category Docs
 * @public
 */

import { join } from 'path'
import type { DocItem, DocKind } from './types'
import { logger } from '@/lib/utils/logger'

/**
 * Maps a DocItem to its corresponding TypeDoc HTML file path.
 *
 * @param item - The documentation item to map
 * @returns The relative file path to the TypeDoc HTML file
 *
 * @remarks
 * TypeDoc generates HTML files in directories based on the item kind:
 * - functions → `functions/`
 * - classes → `classes/`
 * - interfaces → `interfaces/`
 * - types → `types/`
 * - variables → `variables/`
 *
 * File names are generated from the source file path and item name.
 *
 * @example
 * ```ts
 * const item = { kind: 'function', source: { file: 'lib/utils.ts' }, name: 'formatDate' }
 * const path = getTypeDocHTMLPath(item)
 * // Returns: 'functions/lib_utils.formatDate.html'
 * ```
 *
 * @category Docs
 * @public
 */
export function getTypeDocHTMLPath(item: DocItem): string {
  if (!item.source) {
    throw new Error(`Item ${item.name} does not have source information`)
  }

  const kindToDir: Record<DocKind, string> = {
    class: 'classes',
    interface: 'interfaces',
    type: 'types',
    function: 'functions',
    method: 'functions',
    variable: 'variables',
    property: 'variables',
    enum: 'enums'
  }

  const dir = kindToDir[item.kind] || 'functions'

  // example: lib/utils.ts -> lib_utils
  const fileBase = item.source.file
    .replace(/\.tsx?$/, '') // Remove .ts or .tsx extension
    .replace(/\//g, '_') // Replace slashes with underscores

  const filename = `${fileBase}.${item.name}.html`

  return `${dir}/${filename}`
}

/**
 * Extracts the main content section from a TypeDoc HTML file.
 *
 * @param htmlPath - Relative path to the TypeDoc HTML file
 * @returns The extracted HTML content string
 *
 * @remarks
 * This function reads the TypeDoc HTML file and extracts the main documentation
 * content (`<section class="tsd-panel">`), stripping out the full page structure
 * (header, sidebar, footer) so we can render it with our custom layout.
 *
 * The extracted HTML includes:
 * - Function/method signatures
 * - Parameter descriptions
 * - Return type documentation
 * - Examples and remarks
 * - JSDoc tags
 *
 * @throws Error if the HTML file cannot be read
 *
 * @example
 * ```ts
 * const html = await extractTypeDocContent('functions/lib_utils.formatDate.html')
 * // Returns: '<section class="tsd-panel">...</section>'
 * ```
 *
 * @category Docs
 * @public
 */
/**
 * Rewrites TypeDoc asset paths to use absolute paths.
 *
 * @param html - The HTML content with TypeDoc asset links
 * @returns HTML with rewritten asset paths
 *
 * @remarks
 * TypeDoc generates relative asset paths like `../assets/icons.svg#icon-anchor`
 * which don't work in our custom layout. This function rewrites them to
 * absolute paths like `/docs/html/assets/icons.svg#icon-anchor`.
 *
 * @category Docs
 * @public
 */
function rewriteTypeDocAssetPaths(html: string): string {
  return html.replace(/href="\.\.\/([^"]+)"/g, (match, assetPath) => {
    return `href="/docs/html/${assetPath}"`
  })
}

/**
 * Extracts the main content section from TypeDoc-generated HTML files.
 * @param htmlPath - The relative path to the HTML file within the docs/html directory.
 * @returns A Promise that resolves to the extracted HTML content with rewritten asset paths.
 * @throws Error if the content cannot be extracted or the file cannot be read.
 * @public
 */
export async function extractTypeDocContent(htmlPath: string): Promise<string> {
  try {
    const fullPath = join(process.cwd(), 'public/docs/html', htmlPath)
    const htmlContent = await Bun.file(fullPath).text()

    const contentMatch = htmlContent.match(
      /<section class="tsd-panel">[\s\S]*?<\/section>/
    )

    if (contentMatch) {
      return rewriteTypeDocAssetPaths(contentMatch[0])
    }

    const colContentMatch = htmlContent.match(
      /<div class="col-content">[\s\S]*?<\/div>/
    )

    if (colContentMatch) {
      return rewriteTypeDocAssetPaths(colContentMatch[0])
    }

    throw new Error(`Could not extract content from ${htmlPath}`)
  } catch (error) {
    logger.error(
      `Failed to extract TypeDoc content from ${htmlPath}`,
      'TypeDoc',
      error
    )
    throw error
  }
}

/**
 * Extracts the breadcrumb navigation from a TypeDoc HTML file.
 *
 * @param htmlPath - Relative path to the TypeDoc HTML file
 * @returns The breadcrumb HTML string or null if not found
 *
 * @remarks
 * TypeDoc generates breadcrumb navigation showing the module path to an item.
 *
 * @category Docs
 * @public
 */
export async function extractTypeDocBreadcrumb(
  htmlPath: string
): Promise<string | null> {
  try {
    const fullPath = join(process.cwd(), 'public/docs/html', htmlPath)
    const htmlContent = await Bun.file(fullPath).text()

    const breadcrumbMatch = htmlContent.match(
      /<ul class="tsd-breadcrumb"[\s\S]*?<\/ul>/
    )

    return breadcrumbMatch ? breadcrumbMatch[0] : null
  } catch (error) {
    logger.error(
      `Failed to extract TypeDoc breadcrumb from ${htmlPath}`,
      'TypeDoc',
      error
    )
    return null
  }
}
