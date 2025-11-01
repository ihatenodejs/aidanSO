#!/usr/bin/env bun

import { readdir } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import type { CheckDefinition, CheckResult } from './best-practices/types'

type CliFormat = 'human' | 'json'

interface CliOptions {
  format: CliFormat
  listOnly: boolean
  selectedChecks: Set<string>
  skippedChecks: Set<string>
}

interface CliParseResult {
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

async function main() {
  const { options, errors, helpRequested } = parseCliArguments(
    process.argv.slice(2)
  )

  if (errors.length) {
    for (const message of errors) {
      console.error(message)
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
    console.error('No best-practice checks found.')
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
      console.error('No checks selected. Use --list to see available checks.')
    } else if (options.skippedChecks.size) {
      console.error('All checks were skipped. Nothing to run.')
    } else {
      console.error('No checks available to run.')
    }
    process.exitCode = 1
    return
  }

  const results = await runChecks(checksToRun)
  reportResults(results, options.format)
}

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

export async function loadRegistry(): Promise<CheckDefinition[]> {
  const registry: CheckDefinition[] = []
  let entries

  try {
    entries = await readdir(modulesDir, {
      withFileTypes: true
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(
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
      console.warn(`Failed to load module ${entry.name}: ${message}`)
      continue
    }

    const exported = resolveModuleChecks(imported)

    if (!Array.isArray(exported)) {
      console.warn(
        `Module ${entry.name} does not export a checks array. Expected ` +
          'export const checks: CheckDefinition[]'
      )
      continue
    }

    for (const check of exported) {
      if (isValidCheckDefinition(check)) {
        registry.push(check)
      } else {
        console.warn(`Skipping invalid check from ${entry.name}`)
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

export function isSupportedModule(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.has(extname(fileName))
}

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
        console.error(`Unknown check id: ${id}`)
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
        console.error(`Unknown check id to skip: ${id}`)
      }
    }
  }

  return resolved
}

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
    console.log(JSON.stringify({ results, ok: failed.length === 0 }, null, 2))
  } else {
    for (const result of results) {
      const status = result.ok ? '✅' : '❌'
      const headline = result.ok ? `${result.id} passed` : `${result.id} failed`
      console.log(`${status} ${headline}`)
      for (const message of result.messages) {
        console.log(`   • ${message}`)
      }
    }
  }

  process.exitCode = failed.length === 0 ? 0 : 1
}

function printRegistry(registry: CheckDefinition[]) {
  if (!registry.length) {
    console.log('No best-practice checks registered.')
    return
  }

  console.log('Available best-practice checks:\n')
  for (const check of registry) {
    console.log(`- ${check.id}: ${check.description}`)
  }
}

function printHelp() {
  console.log(`Usage: bunx tsx tools/best-practices.ts [options]

Options:
  --list           List available checks
  --only=<ids>     Only run specific checks (comma separated)
  --skip=<ids>     Skip specific checks (comma separated)
  --json           Output machine-readable JSON
  -h, --help       Show this help message
`)
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
    console.error(error)
    process.exitCode = 1
  })
}
