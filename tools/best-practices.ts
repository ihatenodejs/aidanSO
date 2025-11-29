#!/usr/bin/env bun

import { readdir } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import type { CheckDefinition, CheckResult } from './best-practices/types'
import { terminalColors } from '../lib/utils/terminal-colors'
import { logger } from '../lib/utils/logger'

/**
 * @public
 * @category Tools
 */
export type CliFormat = 'human' | 'json'

/**
 * @public
 * @category Tools
 */
export interface CliOptions {
  format: CliFormat
  listOnly: boolean
  selectedChecks: Set<string>
  skippedChecks: Set<string>
}

/**
 * @public
 * @category Tools
 */
export interface CliParseResult {
  options: CliOptions
  errors: string[]
  helpRequested: boolean
}

const repoRoot = resolve(dirname(fileURLToPath(new URL(import.meta.url))), '..')
const modulesDir = resolve(repoRoot, 'tools/best-practices/modules')
const SUPPORTED_EXTENSIONS = new Set<string>([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.mjs',
  '.cjs'
])

const LOG_PREFIX = 'best-practices'

const log = {
  error: (message: string, details?: unknown) =>
    logger.error(message, LOG_PREFIX, details),
  warn: (message: string, details?: unknown) =>
    logger.warning(message, LOG_PREFIX, details),
  success: (message: string, details?: unknown) =>
    logger.success(message, LOG_PREFIX, details),
  info: (message: string, details?: unknown) =>
    logger.info(message, LOG_PREFIX, details),
  debug: (message: string, details?: unknown) =>
    logger.debug(message, LOG_PREFIX, details),
  raw: (message: string): void => logger.raw(message)
}

async function main() {
  const { options, errors, helpRequested } = parseCliArguments(
    process.argv.slice(2)
  )

  if (errors.length) {
    for (const message of errors) {
      log.error(message)
    }
    printHelp()
    process.exitCode = 1
    return
  }

  if (helpRequested) {
    printHelp()
    return
  }

  const registry = await loadRegistry()

  if (options.listOnly) {
    printRegistry(registry)
    return
  }

  if (!registry.length) {
    log.error('No best-practice checks found.')
    process.exitCode = 1
    return
  }

  const checksToRun = resolveChecksToRun(
    options.selectedChecks,
    options.skippedChecks,
    registry
  )
  if (!checksToRun.length) {
    if (options.selectedChecks.size) {
      log.error('No checks selected. Use --list to see available checks.')
    } else if (options.skippedChecks.size) {
      log.error('All checks were skipped. Nothing to run.')
    } else {
      log.error('No checks available to run.')
    }
    process.exitCode = 1
    return
  }

  const results = await runChecks(checksToRun)
  reportResults(results, options.format)
}

/**
 * Parses command line arguments for best-practices tool.
 *
 * @remarks
 * Processes CLI arguments to determine which checks to run,
 * output format, and other options. Returns structured
 * parse result with options and any validation errors.
 *
 * @param args - Array of command line arguments (excluding script name)
 * @returns Parsed CLI options and any errors encountered
 *
 * @example
 * ```ts
 * const result = parseCliArguments(['--only=jsdoc-validator', '--json'])
 * console.log(result.options.format) // 'json'
 * ```
 *
 * @category CLI Tools
 * @public
 */
export function parseCliArguments(args: readonly string[]): CliParseResult {
  const selectedChecks = new Set<string>()
  const skippedChecks = new Set<string>()
  let listOnly = false
  let format: CliFormat = 'human'
  let helpRequested = false
  const errors: string[] = []

  for (const arg of args) {
    if (arg === '--list') {
      listOnly = true
    } else if (arg === '--json') {
      format = 'json'
    } else if (arg.startsWith('--only=')) {
      const values = arg
        .slice('--only='.length)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      for (const value of values) {
        selectedChecks.add(value)
      }
    } else if (arg.startsWith('--skip=')) {
      const values = arg
        .slice('--skip='.length)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      for (const value of values) {
        skippedChecks.add(value)
      }
    } else if (arg === '--help' || arg === '-h') {
      helpRequested = true
    } else {
      errors.push(`Unknown argument: ${arg}`)
    }
  }

  return {
    options: { selectedChecks, skippedChecks, listOnly, format },
    errors,
    helpRequested
  }
}

/**
 * Loads and validates best-practice check modules.
 *
 * @remarks
 * Scans the modules directory for TypeScript files, imports them,
 * and validates that they export proper check definitions.
 * Handles import errors gracefully and logs warnings.
 *
 * @returns Array of validated check definitions
 *
 * @example
 * ```ts
 * const checks = await loadRegistry()
 * console.log(`Loaded ${checks.length} checks`)
 * ```
 *
 * @category CLI Tools
 * @public
 */
export async function loadRegistry(): Promise<CheckDefinition[]> {
  const registry: CheckDefinition[] = []
  let entries

  try {
    entries = await readdir(modulesDir, {
      withFileTypes: true
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.warn(
      `Unable to read best-practice modules at ${modulesDir}: ${message}`
    )
    return registry
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const entryName = entry.name
    if (!isSupportedModule(entryName)) continue

    const modulePath = resolve(modulesDir, entryName)
    let imported: unknown

    try {
      imported = await import(pathToFileURL(modulePath).href)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log.warn(`Failed to load module ${entry.name}: ${message}`)
      continue
    }

    const exported = resolveModuleChecks(imported)

    if (!Array.isArray(exported)) {
      log.warn(
        `Module ${entry.name} does not export a checks array. Expected ` +
          'export const checks: CheckDefinition[]'
      )
      continue
    }

    for (const check of exported) {
      if (isValidCheckDefinition(check)) {
        registry.push(check)
      } else {
        log.warn(`Skipping invalid check from ${entry.name}`)
      }
    }
  }

  return registry
}

function resolveModuleChecks(moduleExports: unknown): unknown[] | undefined {
  if (!moduleExports || typeof moduleExports !== 'object') {
    return undefined
  }

  const candidate = moduleExports as {
    checks?: unknown
    default?: unknown
  }

  if (Array.isArray(candidate.checks)) {
    return candidate.checks
  }

  if (Array.isArray(candidate.default)) {
    return candidate.default
  }

  return undefined
}

/**
 * Checks if a file has a supported module extension.
 *
 * @remarks
 * Validates that a file name has one of the supported TypeScript
 * or JavaScript extensions for module loading.
 *
 * @param fileName - Name of the file to check
 * @returns True if file has supported extension
 *
 * @example
 * ```ts
 * isSupportedModule('check.ts') // true
 * isSupportedModule('readme.md') // false
 * ```
 *
 * @category CLI Tools
 * @public
 */
export function isSupportedModule(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.has(extname(fileName))
}

/**
 * Type guard to validate check definition objects.
 *
 * @remarks
 * Ensures that an object has the required properties (id, description, run)
 * to be considered a valid check definition. Used for runtime validation
 * of loaded modules.
 *
 * @param value - Value to validate as check definition
 * @returns True if value is a valid CheckDefinition
 *
 * @example
 * ```ts
 * const obj = { id: 'test', description: 'Test check', run: async () => {} }
 * if (isValidCheckDefinition(obj)) {
 *   console.log('Valid check definition')
 * }
 * ```
 *
 * @category CLI Tools
 * @public
 */
export function isValidCheckDefinition(
  value: unknown
): value is CheckDefinition {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as {
    id?: unknown
    description?: unknown
    run?: unknown
  }

  return Boolean(
    typeof candidate.id === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.run === 'function'
  )
}

/**
 * Resolves which checks to run based on selection and skip sets.
 *
 * @remarks
 * Determines the final list of checks to execute by applying
 * inclusion and exclusion filters to the available registry.
 * Handles validation of unknown check IDs.
 *
 * @param selected - Set of check IDs to include (empty = all)
 * @param skipped - Set of check IDs to exclude
 * @param registry - Available check definitions
 * @returns Array of checks to run
 *
 * @example
 * ```ts
 * const checks = resolveChecksToRun(
 *   new Set(['jsdoc-validator']),
 *   new Set(['page-load-performance']),
 *   allChecks
 * )
 * ```
 *
 * @category CLI Tools
 * @public
 */
export function resolveChecksToRun(
  selected: Set<string>,
  skipped: Set<string>,
  registry: CheckDefinition[]
): CheckDefinition[] {
  const available = new Map(registry.map((check) => [check.id, check]))
  const resolved: CheckDefinition[] = []

  if (!selected.size) {
    for (const check of registry) {
      if (!skipped.has(check.id)) {
        resolved.push(check)
      }
    }
  } else {
    for (const id of selected) {
      const check = available.get(id)
      if (!check) {
        log.error(`Unknown check id: ${id}`)
        continue
      }
      if (skipped.has(id)) {
        continue
      }
      resolved.push(check)
    }
  }

  if (skipped.size) {
    for (const id of skipped) {
      if (!available.has(id)) {
        log.error(`Unknown check id to skip: ${id}`)
      }
    }
  }

  return resolved
}

/**
 * Executes an array of best-practice checks.
 *
 * @remarks
 * Runs each check with the repository root context and captures
 * results. Handles errors gracefully by converting them to failed
 * check results with error messages.
 *
 * @param checks - Array of check definitions to execute
 * @returns Array of check results
 *
 * @example
 * ```ts
 * const results = await runChecks(selectedChecks)
 * const failures = results.filter(r => !r.ok)
 * ```
 *
 * @category CLI Tools
 * @public
 */
export async function runChecks(
  checks: CheckDefinition[]
): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  for (const check of checks) {
    try {
      results.push(await check.run({ repoRoot }))
    } catch (error) {
      results.push({
        id: check.id,
        ok: false,
        messages: [
          error instanceof Error
            ? error.message
            : 'Unknown error encountered during check'
        ]
      })
    }
  }

  return results
}

function reportResults(results: CheckResult[], format: CliFormat) {
  const failed = results.filter((result) => !result.ok)

  if (format === 'json') {
    log.raw(JSON.stringify({ results, ok: failed.length === 0 }, null, 2))
  } else {
    for (const result of results) {
      const status = result.ok ? '✅' : '❌'
      const headline = `${status} ${result.id} ${result.ok ? 'passed' : 'failed'}`
      if (result.ok) {
        log.success(headline)
      } else {
        log.error(headline)
      }
      for (const message of result.messages) {
        const coloredMessage = result.ok
          ? terminalColors.dim(`   • ${message}`)
          : `   • ${message}`
        if (result.ok) {
          log.debug(coloredMessage)
        } else {
          log.warn(coloredMessage)
        }
      }
    }
  }

  process.exitCode = failed.length === 0 ? 0 : 1
}

function printRegistry(registry: CheckDefinition[]) {
  if (!registry.length) {
    log.info(terminalColors.dim('No best-practice checks registered.'))
    return
  }

  log.info(terminalColors.bright('Available best-practice checks:\n'))
  for (const check of registry) {
    log.info(
      `${terminalColors.info('•')} ${terminalColors.bright(check.id)}: ${check.description}`
    )
  }
}

function printHelp() {
  const lines = [
    `${terminalColors.bright('Usage:')} bunx tsx tools/best-practices.ts [options]`,
    '',
    terminalColors.bright('Options:'),
    `  ${terminalColors.info('--list')}           List available checks`,
    `  ${terminalColors.info('--only=<ids>')}     Only run specific checks (comma separated)`,
    `  ${terminalColors.info('--skip=<ids>')}     Skip specific checks (comma separated)`,
    `  ${terminalColors.info('--json')}           Output machine-readable JSON`,
    `  ${terminalColors.info('-h, --help')}       Show this help message`
  ]

  log.info(lines.join('\n'))
}

function isCliEntryPoint(moduleUrl: string): boolean {
  const entryPoint = process.argv?.[1]
  if (!entryPoint) {
    return false
  }

  try {
    return pathToFileURL(resolve(entryPoint)).href === moduleUrl
  } catch {
    return false
  }
}

if (isCliEntryPoint(import.meta.url)) {
  main().catch((error) => {
    const details = logger.shouldShowErrorDetails() ? error : undefined
    log.error(
      `Fatal error: ${error instanceof Error ? error.message : error}`,
      details
    )
    process.exitCode = 1
  })
}
