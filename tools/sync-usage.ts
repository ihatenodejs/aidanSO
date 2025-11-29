#!/usr/bin/env bun

/**
 * AI Usage Data Sync Tool
 *
 * Syncs AI usage data from agent-exporter to public/data/cc.json
 * Replaces the legacy ccombine tool with direct agent-exporter integration.
 *
 * @example
 * ```bash
 * bun tools/sync-usage.ts              # Sync all data
 * bun tools/sync-usage.ts --dry-run    # Preview without writing
 * bun tools/sync-usage.ts --period 1m  # Sync last month only
 * ```
 */

import { $ } from 'bun'
import type { ExtendedCCData, Totals, DailyData } from '../lib/types/ai'
import { terminalColors } from '../lib/utils/terminal-colors'
import { logger } from '../lib/utils/logger'

const VERSION = '1.0.1'

const LOG_PREFIX = 'sync-usage'

const log = {
  error: (msg: string, details?: unknown) =>
    logger.error(msg, LOG_PREFIX, details),
  warn: (msg: string, details?: unknown) =>
    logger.warning(msg, LOG_PREFIX, details),
  success: (msg: string, details?: unknown) =>
    logger.success(msg, LOG_PREFIX, details),
  info: (msg: string, details?: unknown) =>
    logger.info(msg, LOG_PREFIX, details),
  dim: (msg: string, details?: unknown) =>
    logger.debug(msg, LOG_PREFIX, details)
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
function isValidPeriod(
  period: string
): period is (typeof VALID_PERIODS)[number] {
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
  period?: (typeof VALID_PERIODS)[number]
  startDate?: string
  endDate?: string
  output: string
  syncFirst: boolean
}

function printUsage() {
  const lines = [
    terminalColors.bright(`sync-usage v${VERSION}`),
    terminalColors.dim('Sync AI usage data from agent-exporter'),
    '',
    terminalColors.bright('Usage:'),
    '  bun tools/sync-usage.ts [options]',
    '',
    terminalColors.bright('Options:'),
    `  ${terminalColors.info('--dry-run')}           Preview changes without writing`,
    `  ${terminalColors.info('--period <period>')}   Time period (daily, weekly, monthly, yearly) (default: yearly)`,
    `  ${terminalColors.info('--start <date>')}      Start date (YYYY-MM-DD)`,
    `  ${terminalColors.info('--end <date>')}        End date (YYYY-MM-DD)`,
    `  ${terminalColors.info('--output <path>')}     Output file (default: public/data/cc.json)`,
    `  ${terminalColors.info('--no-sync')}           Skip syncing from providers`,
    `  ${terminalColors.info('--help')}              Show this help message`,
    '',
    terminalColors.bright('Examples:'),
    '  bun tools/sync-usage.ts',
    '  bun tools/sync-usage.ts --dry-run',
    '  bun tools/sync-usage.ts --period monthly',
    '  bun tools/sync-usage.ts --start 2025-01-01 --end 2025-12-31'
  ]

  log.info(lines.join('\n'))
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
  let requestedPeriod: string | undefined

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
        requestedPeriod = args[++i]
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

  if (requestedPeriod) {
    if (isValidPeriod(requestedPeriod)) {
      options.period = requestedPeriod
    } else {
      log.warn(
        `Invalid period '${requestedPeriod}'. Valid periods: ${VALID_PERIODS.join(', ')}`
      )
    }
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

  options.period = options.period ?? 'yearly'

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
    log.error('Failed to sync providers', error)
    throw error
  }
}

async function exportData(options: SyncOptions): Promise<AgentExporterOutput> {
  log.info('Exporting data from agent-exporter...')

  try {
    const period = options.period ?? 'yearly'
    const startDate = options.startDate ?? '2020-01-01'
    const extraArgs: string[] = []

    if (options.endDate) {
      extraArgs.push('-e', options.endDate)
    }

    const result =
      await $`agent-exporter json -p ${period} -s ${startDate} ${extraArgs}`.text()

    const data = JSON.parse(result) as AgentExporterOutput
    log.success('Data export completed')
    return data
  } catch (error) {
    log.error('Failed to export data', error)
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
    log.info(
      `\n${terminalColors.dim('Run without --dry-run to apply changes')}`
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

  log.info(`\n${terminalColors.bright('Summary:')}`)
  for (const provider of providers) {
    const providerData = data[provider]
    if (providerData) {
      log.info(
        `  ${terminalColors.info(String(provider))}: ${providerData.daily.length} days, ${terminalColors.success(`$${providerData.totals.totalCost.toFixed(2)}`)}`
      )
    }
  }

  if (data.totals) {
    log.info(
      `  ${terminalColors.bright('Total')}: ${terminalColors.success(`$${data.totals.totalCost.toFixed(2)}`)} (${data.totals.totalTokens.toLocaleString()} tokens)`
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
    const details = logger.shouldShowErrorDetails() ? error : undefined
    log.error(
      `Fatal error: ${error instanceof Error ? error.message : error}`,
      details
    )
    process.exit(1)
  }
}

main()
