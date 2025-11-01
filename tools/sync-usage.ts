#!/usr/bin/env bun

/**
 * AI Usage Data Sync Tool
 *
 * Syncs AI usage data from agent-exporter to public/data/cc.json
 * Replaces the legacy ccombine tool with direct agent-exporter integration.
 *
 * @usage
 * bun tools/sync-usage.ts              # Sync all data
 * bun tools/sync-usage.ts --dry-run    # Preview without writing
 * bun tools/sync-usage.ts --period 1m  # Sync last month only
 */

import { $ } from 'bun'
import type { ExtendedCCData, Totals, DailyData } from '../lib/types/ai'

const VERSION = '1.0.0'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
}

const log = {
  error: (msg: string) =>
    console.error(`${colors.red}[sync-usage]${colors.reset} ${msg}`),
  warn: (msg: string) =>
    console.warn(`${colors.yellow}[sync-usage]${colors.reset} ${msg}`),
  success: (msg: string) =>
    console.log(`${colors.green}[sync-usage]${colors.reset} ${msg}`),
  info: (msg: string) =>
    console.log(`${colors.cyan}[sync-usage]${colors.reset} ${msg}`),
  dim: (msg: string) => console.log(`${colors.dim}${msg}${colors.reset}`)
}

const PROVIDER_MAP: Record<string, Exclude<keyof ExtendedCCData, 'totals'>> = {
  claudecode: 'claudeCode',
  anthropic: 'claudeCode', // alias
  ccusage: 'claudeCode', // alias
  codex: 'codex',
  'github-copilot': 'codex', // alias
  openai: 'codex', // alias
  opencode: 'opencode',
  lmstudio: 'opencode', // alias
  zai: 'opencode', // alias
  zhipuai: 'opencode', // alias
  'zai-coding-plan': 'opencode', // alias
  qwen: 'qwen',
  gemini: 'gemini',
  google: 'gemini' // alias
}

const VALID_PERIODS = ['daily', 'weekly', 'monthly', 'yearly'] as const

/**
 * Validates ISO date format (YYYY-MM-DD)
 */
function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date))
}

/**
 * Validates period value
 */
function isValidPeriod(period: string): boolean {
  return VALID_PERIODS.includes(period as (typeof VALID_PERIODS)[number])
}

/**
 * Validates date range order
 */
function isValidDateRange(start: string, end: string): boolean {
  return new Date(start) <= new Date(end)
}

interface AgentExporterOutput {
  [providerName: string]: {
    daily: DailyData[]
    totals: Totals
  }
}

interface SyncOptions {
  dryRun: boolean
  period?: string
  startDate?: string
  endDate?: string
  output: string
  syncFirst: boolean
}

function printUsage() {
  console.log(`${colors.bright}sync-usage v${VERSION}${colors.reset}`)
  console.log(
    `${colors.dim}Sync AI usage data from agent-exporter${colors.reset}\n`
  )

  console.log(`${colors.bright}Usage:${colors.reset}`)
  console.log('  bun tools/sync-usage.ts [options]\n')

  console.log(`${colors.bright}Options:${colors.reset}`)
  console.log(
    `  ${colors.cyan}--dry-run${colors.reset}           Preview changes without writing`
  )
  console.log(
    `  ${colors.cyan}--period <period>${colors.reset}   Time period (daily, weekly, monthly, yearly)`
  )
  console.log(
    `  ${colors.cyan}--start <date>${colors.reset}      Start date (YYYY-MM-DD)`
  )
  console.log(
    `  ${colors.cyan}--end <date>${colors.reset}        End date (YYYY-MM-DD)`
  )
  console.log(
    `  ${colors.cyan}--output <path>${colors.reset}     Output file (default: public/data/cc.json)`
  )
  console.log(
    `  ${colors.cyan}--no-sync${colors.reset}           Skip syncing from providers`
  )
  console.log(
    `  ${colors.cyan}--help${colors.reset}              Show this help message\n`
  )

  console.log(`${colors.bright}Examples:${colors.reset}`)
  console.log(`  bun tools/sync-usage.ts`)
  console.log(`  bun tools/sync-usage.ts --dry-run`)
  console.log(`  bun tools/sync-usage.ts --period monthly`)
  console.log(`  bun tools/sync-usage.ts --start 2025-01-01 --end 2025-12-31`)
}

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  const options: SyncOptions = {
    dryRun: false,
    output: 'public/data/cc.json',
    syncFirst: true
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--dry-run':
      case '--dry':
        options.dryRun = true
        break

      case '--no-sync':
        options.syncFirst = false
        break

      case '--period':
      case '-p':
        if (i + 1 >= args.length) {
          log.error('Missing value for --period')
          process.exit(1)
        }
        options.period = args[++i]
        break

      case '--start':
      case '-s':
        if (i + 1 >= args.length) {
          log.error('Missing value for --start')
          process.exit(1)
        }
        options.startDate = args[++i]
        break

      case '--end':
      case '-e':
        if (i + 1 >= args.length) {
          log.error('Missing value for --end')
          process.exit(1)
        }
        options.endDate = args[++i]
        break

      case '--output':
      case '-o':
        if (i + 1 >= args.length) {
          log.error('Missing value for --output')
          process.exit(1)
        }
        options.output = args[++i]
        break

      default:
        if (arg.startsWith('-')) {
          log.error(`Unknown option: ${arg}`)
          printUsage()
          process.exit(1)
        }
    }
  }

  if (options.period && !isValidPeriod(options.period)) {
    log.warn(
      `Invalid period '${options.period}'. Valid periods: ${VALID_PERIODS.join(', ')}`
    )
  }

  if (options.startDate && !isValidDate(options.startDate)) {
    log.error(`Invalid start date format: ${options.startDate}. Use YYYY-MM-DD`)
    process.exit(1)
  }

  if (options.endDate && !isValidDate(options.endDate)) {
    log.error(`Invalid end date format: ${options.endDate}. Use YYYY-MM-DD`)
    process.exit(1)
  }

  if (
    options.startDate &&
    options.endDate &&
    !isValidDateRange(options.startDate, options.endDate)
  ) {
    log.error(
      `Invalid date range: start date (${options.startDate}) must be before or equal to end date (${options.endDate})`
    )
    process.exit(1)
  }

  return options
}

async function syncProviders(options: SyncOptions): Promise<void> {
  if (!options.syncFirst) {
    log.info('Skipping provider sync (--no-sync)')
    return
  }

  log.info('Syncing data from all providers...')

  try {
    const result = await $`agent-exporter sync`.text()
    log.dim(result)
    log.success('Provider sync completed')
  } catch (error) {
    log.error(`Failed to sync providers: ${error}`)
    throw error
  }
}

async function exportData(options: SyncOptions): Promise<AgentExporterOutput> {
  log.info('Exporting data from agent-exporter...')

  try {
    let result: string

    const effectiveStartDate = options.startDate || '2020-01-01'

    if (options.period && options.startDate && options.endDate) {
      result =
        await $`agent-exporter json -p ${options.period} -s ${options.startDate} -e ${options.endDate}`.text()
    } else if (options.period && options.startDate) {
      result =
        await $`agent-exporter json -p ${options.period} -s ${options.startDate}`.text()
    } else if (options.period && options.endDate) {
      result =
        await $`agent-exporter json -p ${options.period} -e ${options.endDate}`.text()
    } else if (options.startDate && options.endDate) {
      result =
        await $`agent-exporter json -s ${options.startDate} -e ${options.endDate}`.text()
    } else if (options.period) {
      result = await $`agent-exporter json -p ${options.period}`.text()
    } else if (options.startDate) {
      result = await $`agent-exporter json -s ${options.startDate}`.text()
    } else if (options.endDate) {
      result =
        await $`agent-exporter json -s ${effectiveStartDate} -e ${options.endDate}`.text()
    } else {
      // Default: export ALL data from 2020 to now
      result = await $`agent-exporter json -s ${effectiveStartDate}`.text()
    }

    const data = JSON.parse(result) as AgentExporterOutput
    log.success('Data export completed')
    return data
  } catch (error) {
    log.error(`Failed to export data: ${error}`)
    throw error
  }
}

function computeGrandTotals(data: ExtendedCCData): Totals {
  const totals: Totals = {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
    totalTokens: 0,
    totalCost: 0
  }

  const providers: Array<Exclude<keyof ExtendedCCData, 'totals'>> = [
    'claudeCode',
    'codex',
    'opencode',
    'qwen',
    'gemini'
  ]

  for (const provider of providers) {
    const providerData = data[provider]
    if (providerData) {
      totals.inputTokens += providerData.totals.inputTokens
      totals.outputTokens += providerData.totals.outputTokens
      totals.cacheCreationTokens += providerData.totals.cacheCreationTokens
      totals.cacheReadTokens += providerData.totals.cacheReadTokens
      totals.totalTokens += providerData.totals.totalTokens
      totals.totalCost += providerData.totals.totalCost
    }
  }

  return totals
}

function transformData(raw: AgentExporterOutput): ExtendedCCData {
  const result: ExtendedCCData = {}

  const mergeDailyData = (
    existing: DailyData[],
    incoming: DailyData[]
  ): DailyData[] => {
    const dateMap = new Map<string, DailyData>()

    for (const day of existing) {
      dateMap.set(day.date, { ...day })
    }

    for (const day of incoming) {
      const existingDay = dateMap.get(day.date)
      if (existingDay) {
        existingDay.inputTokens += day.inputTokens
        existingDay.outputTokens += day.outputTokens
        existingDay.cacheCreationTokens += day.cacheCreationTokens
        existingDay.cacheReadTokens += day.cacheReadTokens
        existingDay.totalTokens += day.totalTokens
        existingDay.totalCost += day.totalCost

        const modelsSet = new Set([
          ...existingDay.modelsUsed,
          ...day.modelsUsed
        ])
        existingDay.modelsUsed = Array.from(modelsSet)

        const breakdownMap = new Map(
          existingDay.modelBreakdowns.map((m) => [m.modelName, { ...m }])
        )

        for (const breakdown of day.modelBreakdowns) {
          const existing = breakdownMap.get(breakdown.modelName)
          if (existing) {
            existing.inputTokens += breakdown.inputTokens
            existing.outputTokens += breakdown.outputTokens
            existing.cacheCreationTokens += breakdown.cacheCreationTokens
            existing.cacheReadTokens += breakdown.cacheReadTokens
            existing.cost += breakdown.cost
          } else {
            breakdownMap.set(breakdown.modelName, { ...breakdown })
          }
        }

        existingDay.modelBreakdowns = Array.from(breakdownMap.values())
      } else {
        dateMap.set(day.date, { ...day })
      }
    }

    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    )
  }

  const mergeTotals = (existing: Totals, incoming: Totals): Totals => {
    return {
      inputTokens: existing.inputTokens + incoming.inputTokens,
      outputTokens: existing.outputTokens + incoming.outputTokens,
      cacheCreationTokens:
        existing.cacheCreationTokens + incoming.cacheCreationTokens,
      cacheReadTokens: existing.cacheReadTokens + incoming.cacheReadTokens,
      totalTokens: existing.totalTokens + incoming.totalTokens,
      totalCost: existing.totalCost + incoming.totalCost
    }
  }

  for (const [providerName, providerData] of Object.entries(raw)) {
    const mappedName = PROVIDER_MAP[providerName.toLowerCase()]

    if (mappedName) {
      const existing = result[mappedName]
      if (existing) {
        result[mappedName] = {
          daily: mergeDailyData(existing.daily, providerData.daily),
          totals: mergeTotals(existing.totals, providerData.totals)
        }
      } else {
        result[mappedName] = {
          daily: providerData.daily,
          totals: providerData.totals
        }
      }
    } else {
      log.warn(`Unknown provider: ${providerName} (skipping)`)
    }
  }

  result.totals = computeGrandTotals(result)

  return result
}

async function writeOutput(
  data: ExtendedCCData,
  options: SyncOptions
): Promise<void> {
  const serialized = JSON.stringify(data, null, 2) + '\n'

  if (options.dryRun) {
    log.dim('[DRY RUN] Would write to: ' + options.output)
    log.dim('[DRY RUN] Providers found:')

    const providers: Array<Exclude<keyof ExtendedCCData, 'totals'>> = [
      'claudeCode',
      'codex',
      'opencode',
      'qwen',
      'gemini'
    ]

    for (const provider of providers) {
      const providerData = data[provider]
      if (providerData) {
        log.dim(
          `  - ${String(provider)}: ${providerData.daily.length} days, $${providerData.totals.totalCost.toFixed(2)}`
        )
      }
    }

    if (data.totals) {
      log.dim(
        `  - Grand Total: $${data.totals.totalCost.toFixed(2)} (${data.totals.totalTokens.toLocaleString()} tokens)`
      )
    }
    log.dim('[DRY RUN] No files were written')
    console.log(
      `\n${colors.dim}Run without --dry-run to apply changes${colors.reset}`
    )

    return
  }

  const dir = options.output.split('/').slice(0, -1).join('/')
  if (dir) {
    await $`mkdir -p ${dir}`
  }

  const outputFile = Bun.file(options.output)
  const exists = await outputFile.exists()

  if (exists) {
    const existing = await outputFile.text()
    if (existing === serialized) {
      log.dim('No changes detected')
      return
    }
  }

  await Bun.write(options.output, serialized)
  log.success(`Successfully wrote data to ${options.output}`)

  const providers: Array<Exclude<keyof ExtendedCCData, 'totals'>> = [
    'claudeCode',
    'codex',
    'opencode',
    'qwen',
    'gemini'
  ]

  console.log(`\n${colors.bright}Summary:${colors.reset}`)
  for (const provider of providers) {
    const providerData = data[provider]
    if (providerData) {
      console.log(
        `  ${colors.cyan}${String(provider)}${colors.reset}: ${providerData.daily.length} days, ${colors.green}$${providerData.totals.totalCost.toFixed(2)}${colors.reset}`
      )
    }
  }

  if (data.totals) {
    console.log(
      `  ${colors.bright}Total${colors.reset}: ${colors.green}$${data.totals.totalCost.toFixed(2)}${colors.reset} (${data.totals.totalTokens.toLocaleString()} tokens)`
    )
  }
}

async function main() {
  try {
    const options = parseArgs()

    log.info(`Starting sync process...`)

    await syncProviders(options)

    const rawData = await exportData(options)

    const transformedData = transformData(rawData)

    await writeOutput(transformedData, options)

    log.success('Sync completed successfully')
  } catch (error) {
    log.error(`Fatal error: ${error instanceof Error ? error.message : error}`)
    if (process.env.DEBUG) {
      console.error(error)
    }
    process.exit(1)
  }
}

main()
