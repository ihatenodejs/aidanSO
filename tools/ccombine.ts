import { $ } from 'bun'

type NumberLike = number | undefined | null

interface ModelBreakdown {
  modelName: string
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  cost: number
}

interface DailyEntry {
  date: string // YYYY-MM-DD
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  totalTokens: number
  totalCost: number
  modelsUsed?: string[]
  modelBreakdowns?: ModelBreakdown[]
}

interface Totals {
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  totalTokens: number
  totalCost: number
}

interface CcFile {
  daily: DailyEntry[]
  totals?: Totals
}

interface ExtendedCcFile {
  totals?: Totals
  claudeCode?: {
    daily: DailyEntry[]
    totals: Totals
  }
  codex?: {
    daily: DailyEntry[]
    totals: Totals
  }
  opencode?: {
    daily: DailyEntry[]
    totals: Totals
  }
  qwen?: {
    daily: DailyEntry[]
    totals: Totals
  }
  gemini?: {
    daily: DailyEntry[]
    totals: Totals
  }
}

interface CodexModelData {
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
  isFallback: boolean
}

interface CodexDailyEntry {
  date: string
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
  costUSD: number
  models: Record<string, CodexModelData>
}

interface CodexFile {
  daily: CodexDailyEntry[]
  totals: {
    inputTokens: number
    cachedInputTokens: number
    outputTokens: number
    reasoningOutputTokens: number
    totalTokens: number
    costUSD: number
  }
}

type ProviderType = 'claude' | 'codex'

const VERSION = '1.0.0'
const numberFormatter = new Intl.NumberFormat('en-US')
const YES_PATTERN = /^(y|yes)$/i

// ANSI color codes for better CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

const log = {
  error: (msg: string) =>
    console.error(`${colors.red}[ccombine]${colors.reset} ${msg}`),
  warn: (msg: string) =>
    console.warn(`${colors.yellow}[ccombine]${colors.reset} ${msg}`),
  success: (msg: string) =>
    console.log(`${colors.green}[ccombine]${colors.reset} ${msg}`),
  info: (msg: string) =>
    console.log(`${colors.cyan}[ccombine]${colors.reset} ${msg}`),
  dim: (msg: string) => console.log(`${colors.dim}${msg}${colors.reset}`)
}

interface ReconciliationRecord {
  context: string
  date: string
  field: 'totalCost'
  before: number
  after: number
  delta: number
}

const reconciliationRecords: ReconciliationRecord[] = []

interface MergeConflict {
  date: string
  existing: DailyEntry
  incoming: DailyEntry
}

interface MergeStats {
  added: string[]
  replaced: string[]
  unchanged: string[]
  conflicts: MergeConflict[]
}

interface TotalsDecision {
  totals: Totals
  source: 'computed' | 'stored'
  changed: boolean
}

interface CommandInfo {
  name: string
  description: string
  usage: string
  options: Array<{ flag: string; description: string; required?: boolean }>
  examples: string[]
}

const commands: Record<string, CommandInfo> = {
  auto: {
    name: 'auto',
    description:
      'Automatically fetch and merge usage data from ccusage and cousage CLIs',
    usage: 'ccombine auto [options]',
    options: [
      {
        flag: '--base <path>',
        description:
          'Base cc.json file to merge with (default: public/data/cc.json)'
      },
      {
        flag: '--out <path>',
        description: 'Output file path (default: same as base)'
      },
      {
        flag: '--ccusage-cmd <cmd>',
        description:
          'Custom ccusage command (default: bunx ccusage@latest --json)'
      },
      {
        flag: '--cousage-cmd <cmd>',
        description:
          'Custom cousage command (default: bunx @ccusage/codex@latest --json)'
      },
      {
        flag: '--accept-lower',
        description:
          'Automatically replace entries even if token count decreases'
      },
      {
        flag: '--dry',
        description: 'Dry run - preview changes without writing files'
      },
      { flag: '--help', description: 'Show this help message' }
    ],
    examples: [
      'bun tools/ccombine.ts auto',
      'bun tools/ccombine.ts auto --out data/usage.json',
      'bun tools/ccombine.ts auto --dry --accept-lower',
      "bun tools/ccombine.ts auto --ccusage-cmd 'ccusage --json --days 30'"
    ]
  },
  sync: {
    name: 'sync',
    description: 'Merge usage data from a JSON file into cc.json',
    usage: 'ccombine sync <file> <provider> [options]',
    options: [
      {
        flag: '<file>',
        description: 'JSON file containing usage data to merge',
        required: true
      },
      {
        flag: '<provider>',
        description: "Provider type: 'claude' or 'codex'",
        required: true
      },
      {
        flag: '--base <path>',
        description:
          'Base cc.json file to merge with (default: public/data/cc.json)'
      },
      {
        flag: '--out <path>',
        description: 'Output file path (default: same as base)'
      },
      {
        flag: '--accept-lower',
        description:
          'Automatically replace entries even if token count decreases'
      },
      {
        flag: '--dry',
        description: 'Dry run - preview changes without writing files'
      },
      { flag: '--help', description: 'Show this help message' }
    ],
    examples: [
      'bun tools/ccombine.ts sync usage.json claude',
      'bun tools/ccombine.ts sync ./data/codex.json codex --out merged.json',
      'bun tools/ccombine.ts sync backup.json claude --dry'
    ]
  },
  init: {
    name: 'init',
    description: 'Create an empty cc.json file',
    usage: 'ccombine init [target] [options]',
    options: [
      {
        flag: '[target]',
        description:
          'Target directory or file path (default: public/data/cc.json)'
      },
      {
        flag: '--out <path>',
        description: 'Explicit output file path (overrides target)'
      },
      { flag: '--force', description: 'Overwrite existing file' },
      { flag: '--help', description: 'Show this help message' }
    ],
    examples: [
      'bun tools/ccombine.ts init',
      'bun tools/ccombine.ts init ./data',
      'bun tools/ccombine.ts init --out custom/path/usage.json',
      'bun tools/ccombine.ts init --force'
    ]
  }
}

/**
 * Safely converts a value to a number, defaulting to 0 for invalid values
 * @param n - The value to convert (number, undefined, or null)
 * @returns A valid number or 0 if the input is invalid
 */
function toNumber(n: NumberLike): number {
  return typeof n === 'number' && Number.isFinite(n) ? n : 0
}

function reconcileDailyEntry(
  entry: DailyEntry,
  context: string,
  options: { log?: boolean } = {}
): DailyEntry {
  const shouldLog =
    options.log !== undefined ? options.log : !context.startsWith('import')
  if (entry.modelBreakdowns && entry.modelBreakdowns.length > 0) {
    const costSum = entry.modelBreakdowns.reduce(
      (acc, breakdown) => acc + toNumber(breakdown.cost),
      0
    )
    const normalizedSum = Number(costSum.toFixed(8))
    const currentCost = toNumber(entry.totalCost)
    if (Math.abs(normalizedSum - currentCost) > 1e-4) {
      if (shouldLog) {
        reconciliationRecords.push({
          context,
          date: entry.date,
          field: 'totalCost',
          before: currentCost,
          after: normalizedSum,
          delta: normalizedSum - currentCost
        })
      }
      entry.totalCost = normalizedSum
    }
  }
  return entry
}

function validateReconciled(
  label: string,
  entries: DailyEntry[],
  tolerance = 1e-4
): void {
  const mismatches = entries
    .map((entry) => {
      const sum = (entry.modelBreakdowns || []).reduce(
        (acc, breakdown) => acc + toNumber(breakdown.cost),
        0
      )
      const total = toNumber(entry.totalCost)
      return {
        entry,
        sum,
        total,
        delta: sum - total
      }
    })
    .filter(({ delta }) => Math.abs(delta) > tolerance)

  if (mismatches.length === 0) {
    return
  }

  log.error(
    `${label}: Detected ${mismatches.length} unreconciled daily total(s). Aborting write.`
  )
  mismatches.slice(0, 10).forEach(({ entry, sum, total, delta }) => {
    log.error(
      `  ${entry.date}: totalCost=${total.toFixed(6)} vs model sum=${sum.toFixed(
        6
      )} (Δ=${delta.toFixed(6)})`
    )
  })
  if (mismatches.length > 10) {
    log.error(`  ...and ${mismatches.length - 10} more.`)
  }

  throw new Error('Cost reconciliation failed')
}

/**
 * Computes aggregate totals from an array of daily usage entries
 * @param daily - Array of daily usage entries to sum
 * @returns Totals object containing summed token counts and costs
 */
function computeTotals(daily: DailyEntry[]): Totals {
  const totals: Totals = {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
    totalTokens: 0,
    totalCost: 0
  }
  for (const d of daily) {
    totals.inputTokens += toNumber(d.inputTokens)
    totals.outputTokens += toNumber(d.outputTokens)
    totals.cacheCreationTokens += toNumber(d.cacheCreationTokens)
    totals.cacheReadTokens += toNumber(d.cacheReadTokens)
    totals.totalTokens += toNumber(d.totalTokens)
    totals.totalCost += toNumber(d.totalCost)
  }
  return totals
}

/**
 * Determines if entry b should replace entry a based on data completeness
 * @param a - Existing entry in the dataset
 * @param b - New entry to potentially replace the existing one
 * @returns true if b has more tokens, higher cost, or more model breakdowns
 */
function isReplacementBetter(a: DailyEntry, b: DailyEntry): boolean {
  const aTokens = toNumber(a.totalTokens)
  const bTokens = toNumber(b.totalTokens)
  if (bTokens !== aTokens) return bTokens > aTokens
  const aCost = toNumber(a.totalCost)
  const bCost = toNumber(b.totalCost)
  if (bCost !== aCost) return bCost > aCost

  const aBreakdowns = a.modelBreakdowns?.length ?? 0
  const bBreakdowns = b.modelBreakdowns?.length ?? 0
  if (bBreakdowns !== aBreakdowns) return bBreakdowns > aBreakdowns

  return false
}

/**
 * Reads and parses a JSON file using Bun's file API
 * @param filePath - Absolute or relative path to the JSON file
 * @returns Parsed JSON content with the specified type
 * @throws Error if file cannot be read or parsed
 */
async function readJson<T = unknown>(filePath: string): Promise<T> {
  const file = Bun.file(filePath)
  return (await file.json()) as T
}

/**
 * Checks if a file exists at the given path
 * @param filePath - Path to check for file existence
 * @returns true if file exists, false otherwise
 */
async function fileExists(filePath: string): Promise<boolean> {
  return await Bun.file(filePath).exists()
}

/**
 * Type guard to check if a value is a non-null object
 * @param value - Value to type check
 * @returns true if value is an object (not null), false otherwise
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCodexFile(value: unknown): value is CodexFile {
  if (!isObject(value)) return false
  if (!Array.isArray(value['daily'])) return false
  if (!isObject(value['totals'])) return false
  return (value['daily'] as unknown[]).every((entry) => {
    if (!isObject(entry)) return false
    const models = entry['models']
    return typeof entry['date'] === 'string' && isObject(models)
  })
}

function extractProviderEntries(
  section: unknown,
  context: string
): DailyEntry[] {
  if (!isObject(section)) return []
  const rawDaily = Array.isArray(section['daily'])
    ? (section['daily'] as unknown[])
    : []
  return rawDaily.map((item) => coerceDailyEntry(item, context))
}

function normalizeSlashes(input: string): string {
  return input.replaceAll('\\', '/')
}

function trimTrailingSlash(pathname: string): string {
  return pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname
}

function stripDrivePrefix(pathname: string): string {
  return pathname.startsWith('/') && /^[A-Za-z]:/.test(pathname.slice(1))
    ? pathname.slice(1)
    : pathname
}

function resolvePath(...segments: Array<string | undefined>): string {
  const cwdUrl = Bun.pathToFileURL(`${normalizeSlashes(process.cwd())}/`)
  let base = cwdUrl
  segments.forEach((segment, index) => {
    if (segment == null) return
    let normalized = normalizeSlashes(String(segment))
    if (/^[A-Za-z]:\//.test(normalized)) {
      normalized = `/${normalized}`
    }
    if (!normalized) return
    const next = new URL(normalized, base)
    const isLast = index === segments.length - 1
    if (isLast || normalized.endsWith('/')) {
      base = next
    } else {
      base = new URL(next.href.endsWith('/') ? next.href : `${next.href}/`)
    }
  })
  return stripDrivePrefix(trimTrailingSlash(Bun.fileURLToPath(base)))
}

function dirnamePath(filePath: string): string {
  let normalized = normalizeSlashes(filePath)
  if (/^[A-Za-z]:\//.test(normalized)) {
    normalized = `/${normalized}`
  }
  const dirUrl = new URL('./', Bun.pathToFileURL(normalized))
  return stripDrivePrefix(trimTrailingSlash(Bun.fileURLToPath(dirUrl)))
}

async function ensureDirectoryFor(filePath: string): Promise<void> {
  const dir = dirnamePath(filePath)
  if (!dir) return
  await $`mkdir -p ${dir}`
}

function printUsage(): void {
  console.log(`${colors.bright}ccombine v${VERSION}${colors.reset}`)
  console.log(
    `${colors.dim}A utility for combining ccusage data${colors.reset}\n`
  )

  console.log(`${colors.bright}Usage:${colors.reset}`)
  console.log('  ccombine <command> [options]\n')

  console.log(`${colors.bright}Commands:${colors.reset}`)
  Object.values(commands).forEach((cmd) => {
    console.log(
      `  ${colors.cyan}${cmd.name.padEnd(8)}${colors.reset} ${cmd.description}`
    )
  })

  console.log(`\n${colors.bright}Examples:${colors.reset}`)
  console.log(
    '  ccombine auto                    # Fetch and merge latest usage data'
  )
  console.log(
    '  ccombine sync data.json claude   # Merge Claude data from file'
  )
  console.log('  ccombine init ./data             # Initialize empty cc.json\n')

  console.log(
    `${colors.dim}For command-specific help, use: ccombine <command> --help${colors.reset}`
  )
}

function printCommandHelp(cmd: CommandInfo): void {
  console.log(
    `${colors.bright}${cmd.name}${colors.reset} - ${cmd.description}\n`
  )

  console.log(`${colors.bright}Usage:${colors.reset}`)
  console.log(`  ${cmd.usage}\n`)

  console.log(`${colors.bright}Options:${colors.reset}`)
  cmd.options.forEach((opt) => {
    const required = opt.required
      ? ` ${colors.red}(required)${colors.reset}`
      : ''
    console.log(
      `  ${colors.cyan}${opt.flag.padEnd(20)}${colors.reset} ${opt.description}${required}`
    )
  })

  if (cmd.examples.length > 0) {
    console.log(`\n${colors.bright}Examples:${colors.reset}`)
    cmd.examples.forEach((ex) => {
      console.log(`  ${colors.dim}$${colors.reset} ${ex}`)
    })
  }
}

async function handleInit(
  args: string[],
  defaultBasePath: string
): Promise<void> {
  let targetArg = ''
  let outPath: string | undefined
  let force = false

  if (args.includes('--help') || args.includes('-h')) {
    printCommandHelp(commands.init)
    process.exit(0)
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--out' || arg === '--base') {
      if (i + 1 >= args.length) {
        log.error(`Missing value for ${arg}`)
        console.log(`\nUse 'ccombine init --help' for usage information`)
        process.exit(1)
      }
      outPath = resolvePath(args[++i])
    } else if (arg === '--force') {
      force = true
    } else if (!arg.startsWith('-')) {
      if (targetArg) {
        log.error(`Unexpected positional argument: ${arg}`)
        console.log(`\nUse 'ccombine init --help' for usage information`)
        process.exit(1)
      }
      targetArg = arg
    } else if (arg !== '--help' && arg !== '-h') {
      log.error(`Unknown option for init: ${arg}`)
      console.log(`\nUse 'ccombine init --help' for usage information`)
      process.exit(1)
    }
  }

  let targetPath =
    outPath ?? (targetArg ? resolvePath(targetArg) : defaultBasePath)
  if (!targetPath.endsWith('.json')) {
    targetPath = resolvePath(targetPath, 'cc.json')
  }

  if (await fileExists(targetPath)) {
    if (!force) {
      log.error(`File already exists: ${targetPath}`)
      console.log(`Use --force to overwrite, or choose a different path`)
      process.exit(1)
    }
    log.warn(`Overwriting existing file: ${targetPath}`)
  }

  await ensureDirectoryFor(targetPath)

  const blank: ExtendedCcFile = {
    totals: {
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      totalTokens: 0,
      totalCost: 0
    },
    claudeCode: {
      daily: [],
      totals: {
        inputTokens: 0,
        outputTokens: 0,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 0,
        totalCost: 0
      }
    },
    codex: {
      daily: [],
      totals: {
        inputTokens: 0,
        outputTokens: 0,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 0,
        totalCost: 0
      }
    }
  }

  await Bun.write(targetPath, JSON.stringify(blank, null, 2) + '\n')
  log.success(`Initialized blank cc.json at ${targetPath}`)
}

/**
 * Safely coerces an unknown value to a Totals object with defaults
 * @param t - Unknown value to coerce (typically from parsed JSON)
 * @returns Valid Totals object with numeric fields defaulting to 0
 */
function coerceTotals(t: unknown): Totals {
  const r = isObject(t) ? t : {}
  return {
    inputTokens: toNumber(r['inputTokens'] as NumberLike),
    outputTokens: toNumber(r['outputTokens'] as NumberLike),
    cacheCreationTokens: toNumber(r['cacheCreationTokens'] as NumberLike),
    cacheReadTokens: toNumber(r['cacheReadTokens'] as NumberLike),
    totalTokens: toNumber(r['totalTokens'] as NumberLike),
    totalCost: toNumber(r['totalCost'] as NumberLike)
  }
}

/**
 * Safely coerces an unknown value to a DailyEntry object
 * @param item - Unknown value to coerce (typically from parsed JSON)
 * @returns Valid DailyEntry with all required fields populated
 */
function coerceDailyEntry(
  item: unknown,
  context: string = 'dataset'
): DailyEntry {
  const r = isObject(item) ? item : {}

  const modelBreakdownsRaw = Array.isArray(r['modelBreakdowns'])
    ? (r['modelBreakdowns'] as unknown[])
    : []
  const modelBreakdowns: ModelBreakdown[] = modelBreakdownsRaw.map((mb) => {
    const m = isObject(mb) ? mb : {}
    return {
      modelName:
        typeof m['modelName'] === 'string' ? (m['modelName'] as string) : '',
      inputTokens: toNumber(m['inputTokens'] as NumberLike),
      outputTokens: toNumber(m['outputTokens'] as NumberLike),
      cacheCreationTokens: toNumber(m['cacheCreationTokens'] as NumberLike),
      cacheReadTokens: toNumber(m['cacheReadTokens'] as NumberLike),
      cost: toNumber(m['cost'] as NumberLike)
    }
  })

  const modelsUsed = Array.isArray(r['modelsUsed'])
    ? (r['modelsUsed'] as unknown[]).filter(
        (x): x is string => typeof x === 'string'
      )
    : undefined

  const entry: DailyEntry = {
    date: String((r['date'] as unknown) ?? ''),
    inputTokens: toNumber(r['inputTokens'] as NumberLike),
    outputTokens: toNumber(r['outputTokens'] as NumberLike),
    cacheCreationTokens: toNumber(r['cacheCreationTokens'] as NumberLike),
    cacheReadTokens: toNumber(r['cacheReadTokens'] as NumberLike),
    totalTokens: toNumber(r['totalTokens'] as NumberLike),
    totalCost: toNumber(r['totalCost'] as NumberLike),
    modelsUsed,
    modelBreakdowns: modelBreakdowns.length ? modelBreakdowns : undefined
  }

  return reconcileDailyEntry(entry, context)
}

/**
 * Normalizes an unknown object to the expected CcFile shape
 * @param obj - Unknown object from JSON parse to normalize
 * @returns CcFile with validated daily entries and optional totals
 */
function normalizeCcShape(obj: unknown, context: string = 'dataset'): CcFile {
  const o = isObject(obj) ? obj : {}
  const rawDaily = Array.isArray(o['daily']) ? (o['daily'] as unknown[]) : []
  const daily = rawDaily.map((item) => coerceDailyEntry(item, context))
  const totals = isObject(o['totals']) ? coerceTotals(o['totals']) : undefined
  return { daily, totals }
}

/**
 * Sorts daily entries by date in ascending chronological order
 * @param entries - Array of daily entries to sort
 * @returns New sorted array (does not mutate input)
 */
function sortByDateAsc(entries: DailyEntry[]): DailyEntry[] {
  return entries.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  )
}

/**
 * Converts Codex date format to ISO date format
 * @param dateStr - Date string in "Sep 12, 2025" format
 * @returns ISO formatted date "2025-09-12" or original if parsing fails
 * @example normalizeCodexDate("Sep 12, 2025") // "2025-09-12"
 */
function normalizeCodexDate(dateStr: string): string {
  const months: Record<string, string> = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  }

  const match = dateStr.match(/^(\w{3})\s+(\d{1,2}),\s+(\d{4})$/)
  if (!match) return dateStr

  const [, monthName, day, year] = match
  const month = months[monthName]
  if (!month) return dateStr

  return `${year}-${month}-${day.padStart(2, '0')}`
}

/**
 * Converts a Codex (cousage) daily entry to Claude Code (ccusage) format
 * @param codex - Codex format daily entry with models and USD costs
 * @returns DailyEntry with normalized date, combined output tokens, and model breakdowns
 */
function convertCodexToCc(codex: CodexDailyEntry): DailyEntry {
  const modelBreakdowns: ModelBreakdown[] = Object.entries(
    codex.models || {}
  ).map(([modelName, data]) => ({
    modelName,
    inputTokens: data.inputTokens,
    outputTokens: data.outputTokens + data.reasoningOutputTokens,
    cacheCreationTokens: 0,
    cacheReadTokens: data.cachedInputTokens,
    cost: 0
  }))

  if (modelBreakdowns.length > 0) {
    const totalTokens = codex.totalTokens || 1
    modelBreakdowns.forEach((mb) => {
      const modelTokens = mb.inputTokens + mb.outputTokens + mb.cacheReadTokens
      mb.cost = (modelTokens / totalTokens) * codex.costUSD
    })
  }

  const entry: DailyEntry = {
    date: normalizeCodexDate(codex.date),
    inputTokens: codex.inputTokens,
    outputTokens: codex.outputTokens + codex.reasoningOutputTokens,
    cacheCreationTokens: 0,
    cacheReadTokens: codex.cachedInputTokens,
    totalTokens: codex.totalTokens,
    totalCost: codex.costUSD,
    modelsUsed: Object.keys(codex.models || {}),
    modelBreakdowns: modelBreakdowns.length > 0 ? modelBreakdowns : undefined
  }

  return reconcileDailyEntry(entry, 'import:codex')
}

/**
 * Fetches usage data from the cousage (Codex) CLI command
 * @param cmd - Shell command to execute (e.g., "cousage --json")
 * @returns Parsed CodexFile or null if command fails
 */
async function fetchCousageData(cmd: string): Promise<CodexFile | null> {
  try {
    log.info(`Fetching Codex data...`)
    const result = await $`sh -c ${cmd}`.text()
    return JSON.parse(result) as CodexFile
  } catch (error) {
    log.error(`Error fetching Codex data: ${error}`)
    return null
  }
}

/**
 * Fetches usage data from the ccusage (Claude Code) CLI command
 * @param cmd - Shell command to execute (e.g., "ccusage --json")
 * @returns Normalized CcFile or null if command fails
 */
async function fetchCcusageData(cmd: string): Promise<CcFile | null> {
  try {
    log.info(`Fetching Claude Code data...`)
    const result = await $`sh -c ${cmd}`.text()
    return normalizeCcShape(JSON.parse(result), 'import:ccusage')
  } catch (error) {
    log.error(`Error fetching Claude Code data: ${error}`)
    return null
  }
}

function formatNumber(n: number): string {
  return numberFormatter.format(Math.round(n))
}

function formatTotals(totals: Totals): string {
  return `input:${formatNumber(totals.inputTokens)} | output:${formatNumber(totals.outputTokens)} | total:${formatNumber(totals.totalTokens)} | cost:${totals.totalCost.toFixed(4)}`
}

function totalsEqual(a: Totals, b: Totals): boolean {
  return (
    a.inputTokens === b.inputTokens &&
    a.outputTokens === b.outputTokens &&
    a.cacheCreationTokens === b.cacheCreationTokens &&
    a.cacheReadTokens === b.cacheReadTokens &&
    a.totalTokens === b.totalTokens &&
    Math.abs(a.totalCost - b.totalCost) < 1e-4
  )
}

function isLowerTokenConflict(
  existing: DailyEntry,
  incoming: DailyEntry
): boolean {
  return toNumber(incoming.totalTokens) < toNumber(existing.totalTokens)
}

function conflictMessage(label: string, conflict: MergeConflict): string {
  const existingTokens = formatNumber(toNumber(conflict.existing.totalTokens))
  const incomingTokens = formatNumber(toNumber(conflict.incoming.totalTokens))
  return `${label} ${colors.yellow}${conflict.date}${colors.reset}: existing ${colors.green}${existingTokens}${colors.reset} tokens, incoming ${colors.red}${incomingTokens}${colors.reset} tokens`
}

/**
 * Merges daily entries from multiple sources into a single dataset
 * @param entries - Array of daily entries from different sources
 * @param baseByDate - Existing entries indexed by date
 * @returns Object with merge statistics and updated map
 */
function mergeEntries(
  entries: DailyEntry[],
  baseByDate: Map<string, DailyEntry>
): MergeStats {
  const stats: MergeStats = {
    added: [],
    replaced: [],
    unchanged: [],
    conflicts: []
  }

  for (const incoming of entries) {
    const existing = baseByDate.get(incoming.date)
    if (!existing) {
      baseByDate.set(incoming.date, incoming)
      stats.added.push(incoming.date)
      continue
    }

    if (isReplacementBetter(existing, incoming)) {
      baseByDate.set(incoming.date, incoming)
      stats.replaced.push(incoming.date)
      continue
    }

    if (isLowerTokenConflict(existing, incoming)) {
      stats.conflicts.push({ date: incoming.date, existing, incoming })
      continue
    }

    stats.unchanged.push(incoming.date)
  }

  return stats
}

function resolveConflicts(
  label: string,
  stats: MergeStats,
  targetMap: Map<string, DailyEntry>,
  options: { interactive: boolean; dryRun: boolean; acceptLower: boolean }
): { resolved: string[]; skipped: string[] } {
  if (stats.conflicts.length === 0) {
    return { resolved: [], skipped: [] }
  }

  const resolvedDates: string[] = []
  const skippedDates: string[] = []
  const remainingConflicts: MergeConflict[] = []

  for (const conflict of stats.conflicts) {
    if (options.dryRun) {
      if (options.acceptLower) {
        log.dim(`[DRY RUN] Would replace ${conflictMessage(label, conflict)}`)
        resolvedDates.push(conflict.date)
      } else {
        log.dim(
          `[DRY RUN] Conflict detected - ${conflictMessage(label, conflict)} (kept existing)`
        )
        skippedDates.push(conflict.date)
        remainingConflicts.push(conflict)
      }
      continue
    }

    if (options.acceptLower) {
      log.warn(
        `Conflict override (accept-lower) - ${conflictMessage(label, conflict)}`
      )
      targetMap.set(conflict.date, conflict.incoming)
      resolvedDates.push(conflict.date)
      continue
    }

    if (!options.interactive) {
      log.warn(
        `Conflict detected - ${conflictMessage(label, conflict)} (kept existing)`
      )
      skippedDates.push(conflict.date)
      remainingConflicts.push(conflict)
      continue
    }

    const response =
      prompt(
        `${colors.yellow}⚠${colors.reset}  ${conflictMessage(label, conflict)}\n   Replace existing entry? (y/N) `
      ) ?? ''
    if (YES_PATTERN.test(response.trim())) {
      log.success(`Conflict resolved - replaced ${conflict.date}`)
      targetMap.set(conflict.date, conflict.incoming)
      resolvedDates.push(conflict.date)
    } else {
      log.info(`Conflict kept - retained existing data for ${conflict.date}`)
      skippedDates.push(conflict.date)
      remainingConflicts.push(conflict)
    }
  }

  if (resolvedDates.length > 0) {
    stats.replaced.push(...resolvedDates)
  }

  stats.conflicts = remainingConflicts

  return { resolved: resolvedDates, skipped: skippedDates }
}

async function selectTotals(
  label: string,
  entries: DailyEntry[],
  storedTotals: Totals | undefined,
  options: { interactive: boolean; dryRun: boolean }
): Promise<TotalsDecision> {
  const computedTotals = computeTotals(entries)

  if (!storedTotals) {
    return { totals: computedTotals, source: 'computed', changed: false }
  }

  if (totalsEqual(storedTotals, computedTotals)) {
    return { totals: computedTotals, source: 'computed', changed: false }
  }

  const storedIsZero =
    storedTotals.totalTokens === 0 && storedTotals.totalCost === 0
  const computedIsHigher =
    computedTotals.totalTokens > storedTotals.totalTokens ||
    computedTotals.totalCost > storedTotals.totalCost

  if (storedIsZero || computedIsHigher) {
    if (!options.dryRun) {
      return { totals: computedTotals, source: 'computed', changed: true }
    } else {
      log.dim(`[DRY RUN] Would update ${label} totals to computed values.`)
      return { totals: storedTotals, source: 'stored', changed: false }
    }
  }

  const message = `${label} totals mismatch: stored ${formatTotals(storedTotals)} vs computed ${formatTotals(computedTotals)}`

  if (options.dryRun) {
    log.dim(`[DRY RUN] ${message}. Keeping stored totals.`)
    return { totals: storedTotals, source: 'stored', changed: false }
  }

  if (!options.interactive) {
    return { totals: storedTotals, source: 'stored', changed: false }
  }

  const answer =
    prompt(
      `${colors.yellow}⚠${colors.reset}  ${message}\n   Update totals to computed values? (y/N) `
    ) ?? ''
  if (YES_PATTERN.test(answer.trim())) {
    log.success(`${label}: totals updated to computed values.`)
    return { totals: computedTotals, source: 'computed', changed: true }
  }

  log.info(`${label}: totals left as stored values.`)
  return { totals: storedTotals, source: 'stored', changed: false }
}

async function validateRequiredParams(
  command: string,
  args: string[]
): Promise<boolean> {
  if (command === 'sync') {
    const nonFlagArgs = args.filter((arg) => !arg.startsWith('-'))
    if (nonFlagArgs.length < 2) {
      log.error(`Missing required parameters for sync command`)
      console.log(`\n${colors.bright}Required parameters:${colors.reset}`)
      console.log(`  <file>     JSON file containing usage data`)
      console.log(`  <provider> Provider type: 'claude' or 'codex'\n`)
      console.log(`Use 'ccombine sync --help' for more information`)
      return false
    }
  }
  return true
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    printUsage()
    process.exit(1)
  }

  if (args.includes('-h') || args.includes('--help')) {
    if (args.length === 1) {
      printUsage()
    } else {
      const cmdArg = args.find((arg) => !arg.startsWith('-'))
      if (cmdArg && commands[cmdArg]) {
        printCommandHelp(commands[cmdArg])
      } else {
        printUsage()
      }
    }
    process.exit(0)
  }

  const DEFAULT_BASE_PATH = resolvePath('public', 'data', 'cc.json')
  const knownCommands = new Set(['auto', 'sync', 'init'])
  let command: 'auto' | 'sync' | 'init' | undefined
  let commandArgs = args

  // Determine command
  if (args.length > 0 && knownCommands.has(args[0])) {
    command = args[0] as 'auto' | 'sync' | 'init'
    commandArgs = args.slice(1)
  } else if (args[0] && !args[0].startsWith('-')) {
    log.error(`Unknown command: ${args[0]}`)
    console.log(`\nAvailable commands: ${Array.from(knownCommands).join(', ')}`)
    console.log(`Use 'ccombine --help' for more information`)
    process.exit(1)
  } else {
    log.error(`No command specified`)
    printUsage()
    process.exit(1)
  }

  // Check for command-specific help
  if (commandArgs.includes('--help') || commandArgs.includes('-h')) {
    if (commands[command]) {
      printCommandHelp(commands[command])
      process.exit(0)
    }
  }

  if (command === 'init') {
    await handleInit(commandArgs, DEFAULT_BASE_PATH)
    return
  }

  let basePath = DEFAULT_BASE_PATH
  let outPath: string | undefined
  let dryRun = false
  let acceptLower = false
  let cousageCmd = 'bunx @ccusage/codex@latest --json'
  let ccusageCmd = 'bunx ccusage@latest --json'
  let inputPath = ''
  let provider: ProviderType | null = null

  const expectValue = (
    currentArgs: string[],
    idx: number,
    option: string
  ): [string, number] => {
    if (idx + 1 >= currentArgs.length) {
      log.error(`Missing value for ${option}`)
      console.log(`\nUse 'ccombine ${command} --help' for usage information`)
      process.exit(1)
    }
    return [currentArgs[idx + 1], idx + 1]
  }

  if (command === 'auto') {
    for (let i = 0; i < commandArgs.length; i++) {
      const arg = commandArgs[i]
      if (arg === '--base') {
        const [value, next] = expectValue(commandArgs, i, '--base')
        basePath = resolvePath(value)
        i = next
      } else if (arg === '--out') {
        const [value, next] = expectValue(commandArgs, i, '--out')
        outPath = resolvePath(value)
        i = next
      } else if (arg === '--cousage-cmd') {
        const [value, next] = expectValue(commandArgs, i, '--cousage-cmd')
        cousageCmd = value
        i = next
      } else if (arg === '--ccusage-cmd') {
        const [value, next] = expectValue(commandArgs, i, '--ccusage-cmd')
        ccusageCmd = value
        i = next
      } else if (arg === '--dry' || arg === '--dry-run') {
        dryRun = true
      } else if (arg === '--accept-lower') {
        acceptLower = true
      } else if (arg !== '--help' && arg !== '-h') {
        log.error(`Unknown option for auto: ${arg}`)
        console.log(`\nUse 'ccombine auto --help' for available options`)
        process.exit(1)
      }
    }
  } else if (command === 'sync') {
    if (!(await validateRequiredParams('sync', commandArgs))) {
      process.exit(1)
    }

    inputPath = resolvePath(commandArgs[0])
    const providerArg = commandArgs[1].toLowerCase()
    if (providerArg !== 'claude' && providerArg !== 'codex') {
      log.error(`Invalid provider: '${commandArgs[1]}'`)
      console.log(`\nValid providers: 'claude' or 'codex'`)
      console.log(`Use 'ccombine sync --help' for more information`)
      process.exit(1)
    }
    provider = providerArg as ProviderType

    for (let i = 2; i < commandArgs.length; i++) {
      const arg = commandArgs[i]
      if (arg === '--base') {
        const [value, next] = expectValue(commandArgs, i, '--base')
        basePath = resolvePath(value)
        i = next
      } else if (arg === '--out') {
        const [value, next] = expectValue(commandArgs, i, '--out')
        outPath = resolvePath(value)
        i = next
      } else if (arg === '--dry' || arg === '--dry-run') {
        dryRun = true
      } else if (arg === '--accept-lower') {
        acceptLower = true
      } else if (arg !== '--help' && arg !== '-h') {
        log.error(`Unknown option for sync: ${arg}`)
        console.log(`\nUse 'ccombine sync --help' for available options`)
        process.exit(1)
      }
    }
  } else {
    log.error(`Unexpected error: unhandled command '${command}'`)
    process.exit(1)
  }

  if (command === 'sync' && !(await fileExists(inputPath))) {
    log.error(`Input file not found: ${inputPath}`)
    console.log(`\nPlease check the file path and try again`)
    process.exit(1)
  }

  if (!outPath) {
    outPath = basePath
  }
  const outputPath = outPath

  const baseExists = await fileExists(basePath)
  const baseExtended: Partial<ExtendedCcFile> = baseExists
    ? await readJson<Partial<ExtendedCcFile>>(basePath)
    : {}

  const claudeByDate = new Map<string, DailyEntry>()
  for (const entry of extractProviderEntries(
    baseExtended?.claudeCode,
    'existing:claude'
  )) {
    claudeByDate.set(entry.date, entry)
  }

  const codexByDate = new Map<string, DailyEntry>()
  for (const entry of extractProviderEntries(
    baseExtended?.codex,
    'existing:codex'
  )) {
    codexByDate.set(entry.date, entry)
  }

  const storedMainTotals = baseExtended.totals
    ? coerceTotals(baseExtended.totals)
    : undefined
  const storedClaudeTotals = isObject(baseExtended?.claudeCode?.totals)
    ? coerceTotals(baseExtended.claudeCode?.totals as unknown)
    : undefined
  const storedCodexTotals = isObject(baseExtended?.codex?.totals)
    ? coerceTotals(baseExtended.codex?.totals as unknown)
    : undefined

  const interactivePrompts =
    process.stdout.isTTY && command === 'sync' && !dryRun

  const allStats = {
    added: 0,
    replaced: 0,
    unchanged: 0,
    conflictsResolved: 0,
    conflictsKept: 0
  }

  if (command === 'auto') {
    const [codexData, ccData] = await Promise.all([
      fetchCousageData(cousageCmd),
      fetchCcusageData(ccusageCmd)
    ])

    if (codexData) {
      const codexDaily = codexData.daily.map(convertCodexToCc)
      const stats = mergeEntries(codexDaily, codexByDate)
      const conflictOutcome = resolveConflicts('Codex', stats, codexByDate, {
        interactive: false,
        dryRun,
        acceptLower
      })

      allStats.added += stats.added.length
      allStats.replaced += stats.replaced.length
      allStats.unchanged += stats.unchanged.length
      allStats.conflictsResolved += conflictOutcome.resolved.length
      allStats.conflictsKept += conflictOutcome.skipped.length

      log.info(
        `Codex: Added ${colors.green}${stats.added.length}${colors.reset}, Replaced ${colors.yellow}${stats.replaced.length}${colors.reset}, Unchanged ${colors.dim}${stats.unchanged.length}${colors.reset}`
      )
      if (conflictOutcome.resolved.length || conflictOutcome.skipped.length) {
        log.info(
          `Codex: Conflicts resolved ${colors.green}${conflictOutcome.resolved.length}${colors.reset}, kept ${colors.yellow}${conflictOutcome.skipped.length}${colors.reset}`
        )
      }
    } else {
      log.warn('Failed to fetch Codex data - continuing with existing data')
    }

    if (ccData) {
      const claudeDaily = ccData.daily
      const stats = mergeEntries(claudeDaily, claudeByDate)
      const conflictOutcome = resolveConflicts(
        'Claude Code',
        stats,
        claudeByDate,
        {
          interactive: false,
          dryRun,
          acceptLower
        }
      )

      allStats.added += stats.added.length
      allStats.replaced += stats.replaced.length
      allStats.unchanged += stats.unchanged.length
      allStats.conflictsResolved += conflictOutcome.resolved.length
      allStats.conflictsKept += conflictOutcome.skipped.length

      log.info(
        `Claude Code: Added ${colors.green}${stats.added.length}${colors.reset}, Replaced ${colors.yellow}${stats.replaced.length}${colors.reset}, Unchanged ${colors.dim}${stats.unchanged.length}${colors.reset}`
      )
      if (conflictOutcome.resolved.length || conflictOutcome.skipped.length) {
        log.info(
          `Claude Code: Conflicts resolved ${colors.green}${conflictOutcome.resolved.length}${colors.reset}, kept ${colors.yellow}${conflictOutcome.skipped.length}${colors.reset}`
        )
      }
    } else {
      log.warn(
        'Failed to fetch Claude Code data - continuing with existing data'
      )
    }
  } else if (command === 'sync') {
    if (!provider) {
      log.error('Missing provider for sync command')
      process.exit(1)
    }

    const syncProvider = provider
    const rawData = await readJson<unknown>(inputPath)
    const newEntries =
      syncProvider === 'codex' && isCodexFile(rawData)
        ? rawData.daily.map(convertCodexToCc)
        : normalizeCcShape(rawData, `sync:${syncProvider}`).daily

    const providerMap = syncProvider === 'claude' ? claudeByDate : codexByDate
    const stats = mergeEntries(newEntries, providerMap)
    const label = syncProvider === 'claude' ? 'Claude Code' : 'Codex'
    const conflictOutcome = resolveConflicts(label, stats, providerMap, {
      interactive: interactivePrompts,
      dryRun,
      acceptLower
    })

    allStats.added += stats.added.length
    allStats.replaced += stats.replaced.length
    allStats.unchanged += stats.unchanged.length
    allStats.conflictsResolved += conflictOutcome.resolved.length
    allStats.conflictsKept += conflictOutcome.skipped.length

    log.info(
      `${label}: Added ${colors.green}${stats.added.length}${colors.reset}, Replaced ${colors.yellow}${stats.replaced.length}${colors.reset}, Unchanged ${colors.dim}${stats.unchanged.length}${colors.reset}`
    )
    if (conflictOutcome.resolved.length || conflictOutcome.skipped.length) {
      log.info(
        `${label}: Conflicts resolved ${colors.green}${conflictOutcome.resolved.length}${colors.reset}, kept ${colors.yellow}${conflictOutcome.skipped.length}${colors.reset}`
      )
    }
  }

  const merged: ExtendedCcFile = {}
  const allDates = new Set<string>()
  const combinedByDate = new Map<string, DailyEntry>()

  for (const date of claudeByDate.keys()) allDates.add(date)
  for (const date of codexByDate.keys()) allDates.add(date)

  for (const date of allDates) {
    const claudeEntry = claudeByDate.get(date)
    const codexEntry = codexByDate.get(date)

    const combined: DailyEntry = {
      date,
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      totalTokens: 0,
      totalCost: 0,
      modelsUsed: [],
      modelBreakdowns: []
    }

    if (claudeEntry) {
      combined.inputTokens += claudeEntry.inputTokens
      combined.outputTokens += claudeEntry.outputTokens
      combined.cacheCreationTokens += claudeEntry.cacheCreationTokens
      combined.cacheReadTokens += claudeEntry.cacheReadTokens
      combined.totalTokens += claudeEntry.totalTokens
      combined.totalCost += claudeEntry.totalCost
      if (claudeEntry.modelsUsed && combined.modelsUsed)
        combined.modelsUsed.push(...claudeEntry.modelsUsed)
      if (claudeEntry.modelBreakdowns && combined.modelBreakdowns)
        combined.modelBreakdowns.push(...claudeEntry.modelBreakdowns)
    }

    if (codexEntry) {
      combined.inputTokens += codexEntry.inputTokens
      combined.outputTokens += codexEntry.outputTokens
      combined.cacheCreationTokens += codexEntry.cacheCreationTokens
      combined.cacheReadTokens += codexEntry.cacheReadTokens
      combined.totalTokens += codexEntry.totalTokens
      combined.totalCost += codexEntry.totalCost
      if (codexEntry.modelsUsed && combined.modelsUsed)
        combined.modelsUsed.push(...codexEntry.modelsUsed)
      if (codexEntry.modelBreakdowns && combined.modelBreakdowns)
        combined.modelBreakdowns.push(...codexEntry.modelBreakdowns)
    }

    combinedByDate.set(date, reconcileDailyEntry(combined, 'combined'))
  }

  const combinedDaily = sortByDateAsc(Array.from(combinedByDate.values()))
  if (combinedDaily.length > 0) {
    validateReconciled('Combined dataset', combinedDaily)
    const mainTotalsDecision = await selectTotals(
      'Combined',
      combinedDaily,
      storedMainTotals,
      {
        interactive: interactivePrompts,
        dryRun
      }
    )
    merged.totals = mainTotalsDecision.totals
  }

  const claudeEntries = sortByDateAsc(Array.from(claudeByDate.values()))
  if (claudeEntries.length > 0) {
    validateReconciled('Claude Code dataset', claudeEntries)
    const claudeTotalsDecision = await selectTotals(
      'Claude Code',
      claudeEntries,
      storedClaudeTotals,
      {
        interactive: interactivePrompts,
        dryRun
      }
    )
    merged.claudeCode = {
      daily: claudeEntries,
      totals: claudeTotalsDecision.totals
    }
  }

  const codexEntries = sortByDateAsc(Array.from(codexByDate.values()))
  if (codexEntries.length > 0) {
    validateReconciled('Codex dataset', codexEntries)
    const codexTotalsDecision = await selectTotals(
      'Codex',
      codexEntries,
      storedCodexTotals,
      {
        interactive: interactivePrompts,
        dryRun
      }
    )
    merged.codex = {
      daily: codexEntries,
      totals: codexTotalsDecision.totals
    }
  }

  if (dryRun) {
    if (merged.totals) {
      log.dim(
        `[DRY RUN] Combined totals from ${combinedDaily.length} unique dates`
      )
    }
    if (claudeEntries.length > 0) {
      log.dim(`[DRY RUN] Claude Code entries: ${claudeEntries.length}`)
    }
    if (codexEntries.length > 0) {
      log.dim(`[DRY RUN] Codex entries: ${codexEntries.length}`)
    }
  } else {
    const serialized = JSON.stringify(merged, null, 2) + '\n'
    const outputExists = await fileExists(outputPath)
    let shouldWrite = !outputExists

    if (outputExists) {
      const existingContent = await Bun.file(outputPath).text()
      shouldWrite = existingContent !== serialized
    }

    if (shouldWrite) {
      await ensureDirectoryFor(outputPath)
      await Bun.write(outputPath, serialized)
      log.success(`Successfully wrote merged data to ${outputPath}`)
    } else {
      log.dim('No changes.')
    }
  }

  if (reconciliationRecords.length > 0) {
    const heading = dryRun
      ? 'Detected cost discrepancies'
      : 'Reconciled daily totals'
    console.log(`\n${colors.bright}${heading}:${colors.reset}`)
    reconciliationRecords.forEach((record) => {
      const before = record.before.toFixed(6)
      const after = record.after.toFixed(6)
      const delta = (record.delta >= 0 ? '+' : '') + record.delta.toFixed(6)
      console.log(
        `  ${record.context} ${colors.yellow}${record.date}${colors.reset} — ${colors.dim}${before}${colors.reset} → ${colors.green}${after}${colors.reset} (${delta})`
      )
    })
  }

  if (!dryRun) {
    console.log(`\n${colors.bright}Summary:${colors.reset}`)
    const summaryItems: Array<{
      label: string
      count: number
      color: string
    }> = [
      { label: 'Added', count: allStats.added, color: colors.green },
      { label: 'Replaced', count: allStats.replaced, color: colors.yellow },
      { label: 'Unchanged', count: allStats.unchanged, color: colors.dim },
      {
        label: 'Reconciled',
        count: reconciliationRecords.length,
        color: colors.cyan
      }
    ]

    const printed = summaryItems.filter((item) => item.count > 0)

    if (printed.length > 0) {
      printed.forEach((item) => {
        console.log(
          `  ${item.label}: ${item.color}${item.count}${colors.reset}`
        )
      })
    } else {
      console.log(`  ${colors.dim}No changes.${colors.reset}`)
    }

    if (allStats.conflictsResolved > 0 || allStats.conflictsKept > 0) {
      console.log(
        `  Conflicts: ${colors.green}${allStats.conflictsResolved} resolved${colors.reset}, ${colors.yellow}${allStats.conflictsKept} kept${colors.reset}`
      )
    }
  }
}

main().catch((err) => {
  log.error(`Fatal error: ${err?.message || err}`)
  if (process.env.DEBUG) {
    console.error(err)
  }
  process.exit(1)
})
