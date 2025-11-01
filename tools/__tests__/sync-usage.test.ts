import { describe, expect, it } from 'bun:test'
import type {
  ExtendedCCData,
  Totals,
  DailyData,
  ProviderData
} from '../../lib/types/ai'

const createMockDailyData = (date: string, cost: number): DailyData => ({
  date,
  inputTokens: 1000,
  outputTokens: 500,
  cacheCreationTokens: 100,
  cacheReadTokens: 200,
  totalTokens: 1800,
  totalCost: cost,
  modelsUsed: ['claude-sonnet-4-5-20250929'],
  modelBreakdowns: [
    {
      modelName: 'claude-sonnet-4-5-20250929',
      inputTokens: 1000,
      outputTokens: 500,
      cacheCreationTokens: 100,
      cacheReadTokens: 200,
      cost
    }
  ]
})

const createMockProviderData = (cost: number): ProviderData => ({
  daily: [createMockDailyData('2025-10-30', cost)],
  totals: {
    inputTokens: 1000,
    outputTokens: 500,
    cacheCreationTokens: 100,
    cacheReadTokens: 200,
    totalTokens: 1800,
    totalCost: cost
  }
})

const mockAgentExporterOutput = {
  claudecode: createMockProviderData(10.5),
  codex: createMockProviderData(5.25),
  gemini: createMockProviderData(2.15)
}

const PROVIDER_MAP: Record<string, Exclude<keyof ExtendedCCData, 'totals'>> = {
  claudecode: 'claudeCode',
  anthropic: 'claudeCode',
  ccusage: 'claudeCode',
  codex: 'codex',
  'github-copilot': 'codex',
  openai: 'codex',
  opencode: 'opencode',
  zai: 'opencode',
  zhipuai: 'opencode',
  'zai-coding-plan': 'opencode',
  lmstudio: 'opencode',
  qwen: 'qwen',
  gemini: 'gemini',
  google: 'gemini'
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

function transformData(raw: Record<string, ProviderData>): ExtendedCCData {
  const result: ExtendedCCData = {}

  for (const [providerName, providerData] of Object.entries(raw)) {
    const mappedName = PROVIDER_MAP[providerName.toLowerCase()]

    if (mappedName) {
      result[mappedName] = {
        daily: providerData.daily,
        totals: providerData.totals
      }
    }
  }

  result.totals = computeGrandTotals(result)

  return result
}

function parseArgs(args: string[]): {
  dryRun: boolean
  period?: string
  startDate?: string
  endDate?: string
  output: string
  syncFirst: boolean
  errors: string[]
} {
  const options = {
    dryRun: false,
    output: 'public/data/cc.json',
    syncFirst: true,
    errors: [] as string[]
  }

  const result: {
    dryRun: boolean
    period?: string
    startDate?: string
    endDate?: string
    output: string
    syncFirst: boolean
    errors: string[]
  } = { ...options }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--dry-run':
      case '--dry':
        result.dryRun = true
        break

      case '--no-sync':
        result.syncFirst = false
        break

      case '--period':
      case '-p':
        if (i + 1 >= args.length) {
          result.errors.push('Missing value for --period')
        } else {
          result.period = args[++i]
        }
        break

      case '--start':
      case '-s':
        if (i + 1 >= args.length) {
          result.errors.push('Missing value for --start')
        } else {
          result.startDate = args[++i]
        }
        break

      case '--end':
      case '-e':
        if (i + 1 >= args.length) {
          result.errors.push('Missing value for --end')
        } else {
          result.endDate = args[++i]
        }
        break

      case '--output':
      case '-o':
        if (i + 1 >= args.length) {
          result.errors.push('Missing value for --output')
        } else {
          result.output = args[++i]
        }
        break

      default:
        if (arg.startsWith('-')) {
          result.errors.push(`Unknown option: ${arg}`)
        }
    }
  }

  return result
}

describe('sync-usage argument parsing', () => {
  it('parses dry-run flag', () => {
    const result = parseArgs(['--dry-run'])
    expect(result.dryRun).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('parses short form dry flag', () => {
    const result = parseArgs(['--dry'])
    expect(result.dryRun).toBe(true)
  })

  it('parses no-sync flag', () => {
    const result = parseArgs(['--no-sync'])
    expect(result.syncFirst).toBe(false)
  })

  it('parses period option', () => {
    const result = parseArgs(['--period', 'monthly'])
    expect(result.period).toBe('monthly')
    expect(result.errors).toHaveLength(0)
  })

  it('parses period short form', () => {
    const result = parseArgs(['-p', 'yearly'])
    expect(result.period).toBe('yearly')
  })

  it('parses date range options', () => {
    const result = parseArgs(['--start', '2025-01-01', '--end', '2025-12-31'])
    expect(result.startDate).toBe('2025-01-01')
    expect(result.endDate).toBe('2025-12-31')
    expect(result.errors).toHaveLength(0)
  })

  it('parses date short forms', () => {
    const result = parseArgs(['-s', '2025-01-01', '-e', '2025-12-31'])
    expect(result.startDate).toBe('2025-01-01')
    expect(result.endDate).toBe('2025-12-31')
  })

  it('parses custom output path', () => {
    const result = parseArgs(['--output', 'custom/path.json'])
    expect(result.output).toBe('custom/path.json')
  })

  it('parses output short form', () => {
    const result = parseArgs(['-o', 'out.json'])
    expect(result.output).toBe('out.json')
  })

  it('detects missing period value', () => {
    const result = parseArgs(['--period'])
    expect(result.errors).toContain('Missing value for --period')
  })

  it('detects missing start date value', () => {
    const result = parseArgs(['--start'])
    expect(result.errors).toContain('Missing value for --start')
  })

  it('detects missing end date value', () => {
    const result = parseArgs(['--end'])
    expect(result.errors).toContain('Missing value for --end')
  })

  it('detects missing output value', () => {
    const result = parseArgs(['--output'])
    expect(result.errors).toContain('Missing value for --output')
  })

  it('detects unknown options', () => {
    const result = parseArgs(['--unknown', '--invalid'])
    expect(result.errors).toContain('Unknown option: --unknown')
    expect(result.errors).toContain('Unknown option: --invalid')
  })

  it('parses multiple options together', () => {
    const result = parseArgs([
      '--dry-run',
      '--period',
      'monthly',
      '--output',
      'test.json'
    ])
    expect(result.dryRun).toBe(true)
    expect(result.period).toBe('monthly')
    expect(result.output).toBe('test.json')
    expect(result.errors).toHaveLength(0)
  })

  it('has correct defaults', () => {
    const result = parseArgs([])
    expect(result.dryRun).toBe(false)
    expect(result.syncFirst).toBe(true)
    expect(result.output).toBe('public/data/cc.json')
    expect(result.period).toBeUndefined()
    expect(result.startDate).toBeUndefined()
    expect(result.endDate).toBeUndefined()
  })
})

describe('provider mapping', () => {
  it('maps claudecode to claudeCode', () => {
    const raw = { claudecode: createMockProviderData(10.5) }
    const result = transformData(raw)
    expect(result.claudeCode).toBeDefined()
    expect(result.claudeCode?.totals.totalCost).toBe(10.5)
  })

  it('maps anthropic alias to claudeCode', () => {
    const raw = { anthropic: createMockProviderData(10.5) }
    const result = transformData(raw)
    expect(result.claudeCode).toBeDefined()
    expect(result.claudeCode?.totals.totalCost).toBe(10.5)
  })

  it('maps ccusage alias to claudeCode', () => {
    const raw = { ccusage: createMockProviderData(10.5) }
    const result = transformData(raw)
    expect(result.claudeCode).toBeDefined()
    expect(result.claudeCode?.totals.totalCost).toBe(10.5)
  })

  it('maps codex provider', () => {
    const raw = { codex: createMockProviderData(5.25) }
    const result = transformData(raw)
    expect(result.codex).toBeDefined()
    expect(result.codex?.totals.totalCost).toBe(5.25)
  })

  it('maps github-copilot alias to codex', () => {
    const raw = { 'github-copilot': createMockProviderData(5.25) }
    const result = transformData(raw)
    expect(result.codex).toBeDefined()
    expect(result.codex?.totals.totalCost).toBe(5.25)
  })

  it('maps openai alias to codex', () => {
    const raw = { openai: createMockProviderData(5.25) }
    const result = transformData(raw)
    expect(result.codex).toBeDefined()
    expect(result.codex?.totals.totalCost).toBe(5.25)
  })

  it('maps gemini provider', () => {
    const raw = { gemini: createMockProviderData(2.15) }
    const result = transformData(raw)
    expect(result.gemini).toBeDefined()
    expect(result.gemini?.totals.totalCost).toBe(2.15)
  })

  it('maps google alias to gemini', () => {
    const raw = { google: createMockProviderData(2.15) }
    const result = transformData(raw)
    expect(result.gemini).toBeDefined()
    expect(result.gemini?.totals.totalCost).toBe(2.15)
  })

  it('maps qwen provider', () => {
    const raw = { qwen: createMockProviderData(1.5) }
    const result = transformData(raw)
    expect(result.qwen).toBeDefined()
    expect(result.qwen?.totals.totalCost).toBe(1.5)
  })

  it('maps opencode provider', () => {
    const raw = { opencode: createMockProviderData(0.5) }
    const result = transformData(raw)
    expect(result.opencode).toBeDefined()
    expect(result.opencode?.totals.totalCost).toBe(0.5)
  })

  it('handles case-insensitive provider names', () => {
    const raw = {
      ClaudeCode: createMockProviderData(10.5),
      CODEX: createMockProviderData(5.25)
    }
    const result = transformData(raw)
    expect(result.claudeCode).toBeDefined()
    expect(result.codex).toBeDefined()
  })

  it('ignores unknown provider names', () => {
    const raw = {
      unknown: createMockProviderData(1.0),
      claudecode: createMockProviderData(10.5)
    }
    const result = transformData(raw)
    expect(result.claudeCode).toBeDefined()
    expect(result.totals?.totalCost).toBe(10.5)
  })
})

describe('data transformation', () => {
  it('preserves daily data during transformation', () => {
    const raw = {
      claudecode: {
        daily: [
          createMockDailyData('2025-10-29', 5.0),
          createMockDailyData('2025-10-30', 5.5)
        ],
        totals: {
          inputTokens: 2000,
          outputTokens: 1000,
          cacheCreationTokens: 200,
          cacheReadTokens: 400,
          totalTokens: 3600,
          totalCost: 10.5
        }
      }
    }

    const result = transformData(raw)
    expect(result.claudeCode?.daily).toHaveLength(2)
    expect(result.claudeCode?.daily[0].date).toBe('2025-10-29')
    expect(result.claudeCode?.daily[1].date).toBe('2025-10-30')
  })

  it('preserves model breakdowns', () => {
    const raw = {
      claudecode: {
        daily: [
          {
            ...createMockDailyData('2025-10-30', 10.5),
            modelsUsed: ['claude-sonnet-4-5', 'claude-opus-4-1'],
            modelBreakdowns: [
              {
                modelName: 'claude-sonnet-4-5',
                inputTokens: 600,
                outputTokens: 300,
                cacheCreationTokens: 60,
                cacheReadTokens: 120,
                cost: 6.0
              },
              {
                modelName: 'claude-opus-4-1',
                inputTokens: 400,
                outputTokens: 200,
                cacheCreationTokens: 40,
                cacheReadTokens: 80,
                cost: 4.5
              }
            ]
          }
        ],
        totals: {
          inputTokens: 1000,
          outputTokens: 500,
          cacheCreationTokens: 100,
          cacheReadTokens: 200,
          totalTokens: 1800,
          totalCost: 10.5
        }
      }
    }

    const result = transformData(raw)
    expect(result.claudeCode?.daily[0].modelBreakdowns).toHaveLength(2)
    expect(result.claudeCode?.daily[0].modelsUsed).toContain(
      'claude-sonnet-4-5'
    )
    expect(result.claudeCode?.daily[0].modelsUsed).toContain('claude-opus-4-1')
  })
})

describe('grand totals computation', () => {
  it('computes totals from single provider', () => {
    const data: ExtendedCCData = {
      claudeCode: createMockProviderData(10.5)
    }

    const totals = computeGrandTotals(data)
    expect(totals.totalCost).toBe(10.5)
    expect(totals.inputTokens).toBe(1000)
    expect(totals.outputTokens).toBe(500)
    expect(totals.cacheCreationTokens).toBe(100)
    expect(totals.cacheReadTokens).toBe(200)
    expect(totals.totalTokens).toBe(1800)
  })

  it('sums totals across multiple providers', () => {
    const data: ExtendedCCData = {
      claudeCode: createMockProviderData(10.5),
      codex: createMockProviderData(5.25),
      gemini: createMockProviderData(2.15)
    }

    const totals = computeGrandTotals(data)
    expect(totals.totalCost).toBe(17.9)
    expect(totals.inputTokens).toBe(3000)
    expect(totals.outputTokens).toBe(1500)
    expect(totals.cacheCreationTokens).toBe(300)
    expect(totals.cacheReadTokens).toBe(600)
    expect(totals.totalTokens).toBe(5400)
  })

  it('handles empty data', () => {
    const data: ExtendedCCData = {}
    const totals = computeGrandTotals(data)
    expect(totals.totalCost).toBe(0)
    expect(totals.inputTokens).toBe(0)
    expect(totals.outputTokens).toBe(0)
    expect(totals.totalTokens).toBe(0)
  })

  it('ignores undefined providers', () => {
    const data: ExtendedCCData = {
      claudeCode: createMockProviderData(10.5),
      codex: undefined,
      gemini: createMockProviderData(2.15)
    }

    const totals = computeGrandTotals(data)
    expect(totals.totalCost).toBe(12.65)
    expect(totals.totalTokens).toBe(3600)
  })
})

describe('full transformation with grand totals', () => {
  it('includes computed grand totals in result', () => {
    const raw = {
      claudecode: createMockProviderData(10.5),
      codex: createMockProviderData(5.25),
      gemini: createMockProviderData(2.15)
    }

    const result = transformData(raw)
    expect(result.totals).toBeDefined()
    expect(result.totals?.totalCost).toBe(17.9)
    expect(result.totals?.totalTokens).toBe(5400)
  })

  it('creates valid ExtendedCCData structure', () => {
    const raw = mockAgentExporterOutput
    const result = transformData(raw)

    // Check structure
    expect(result).toHaveProperty('claudeCode')
    expect(result).toHaveProperty('codex')
    expect(result).toHaveProperty('gemini')
    expect(result).toHaveProperty('totals')

    // Check each provider has required fields
    expect(result.claudeCode).toHaveProperty('daily')
    expect(result.claudeCode).toHaveProperty('totals')
    expect(result.codex).toHaveProperty('daily')
    expect(result.codex).toHaveProperty('totals')

    // Check grand totals
    expect(result.totals).toBeDefined()
    expect(typeof result.totals?.totalCost).toBe('number')
    expect(typeof result.totals?.totalTokens).toBe('number')
  })
})

describe('date validation', () => {
  it('validates ISO date format YYYY-MM-DD', () => {
    const isValidDate = (date: string): boolean => {
      return /^\d{4}-\d{2}-\d{2}$/.test(date)
    }

    expect(isValidDate('2025-01-01')).toBe(true)
    expect(isValidDate('2025-12-31')).toBe(true)
    expect(isValidDate('2025-1-1')).toBe(false) // needs zero padding
    expect(isValidDate('25-01-01')).toBe(false) // needs 4-digit year
    expect(isValidDate('2025/01/01')).toBe(false) // wrong separator
  })

  it('validates date range order', () => {
    const isValidRange = (start: string, end: string): boolean => {
      return new Date(start) <= new Date(end)
    }

    expect(isValidRange('2025-01-01', '2025-12-31')).toBe(true)
    expect(isValidRange('2025-06-15', '2025-06-15')).toBe(true) // same day ok
    expect(isValidRange('2025-12-31', '2025-01-01')).toBe(false) // reversed
  })
})

describe('period validation', () => {
  it('validates known period values', () => {
    const validPeriods = ['daily', 'weekly', 'monthly', 'yearly']
    const isValidPeriod = (period: string): boolean => {
      return validPeriods.includes(period)
    }

    expect(isValidPeriod('daily')).toBe(true)
    expect(isValidPeriod('weekly')).toBe(true)
    expect(isValidPeriod('monthly')).toBe(true)
    expect(isValidPeriod('yearly')).toBe(true)
    expect(isValidPeriod('invalid')).toBe(false)
    expect(isValidPeriod('1m')).toBe(false) // wrong format
  })
})

describe('error handling', () => {
  it('accumulates multiple parsing errors', () => {
    const result = parseArgs(['--unknown', '--invalid'])

    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors).toContain('Unknown option: --unknown')
    expect(result.errors).toContain('Unknown option: --invalid')
  })

  it('detects missing values at end of args', () => {
    const result = parseArgs(['--period'])
    expect(result.errors).toContain('Missing value for --period')
  })
})

describe('integration scenarios', () => {
  it('handles real-world multi-provider scenario', () => {
    const raw = {
      claudecode: {
        daily: [
          createMockDailyData('2025-10-29', 15.25),
          createMockDailyData('2025-10-30', 18.5)
        ],
        totals: {
          inputTokens: 50000,
          outputTokens: 25000,
          cacheCreationTokens: 5000,
          cacheReadTokens: 10000,
          totalTokens: 90000,
          totalCost: 33.75
        }
      },
      codex: {
        daily: [createMockDailyData('2025-10-30', 8.25)],
        totals: {
          inputTokens: 20000,
          outputTokens: 10000,
          cacheCreationTokens: 2000,
          cacheReadTokens: 4000,
          totalTokens: 36000,
          totalCost: 8.25
        }
      },
      gemini: {
        daily: [createMockDailyData('2025-10-30', 2.5)],
        totals: {
          inputTokens: 10000,
          outputTokens: 5000,
          cacheCreationTokens: 1000,
          cacheReadTokens: 2000,
          totalTokens: 18000,
          totalCost: 2.5
        }
      }
    }

    const result = transformData(raw)

    expect(result.claudeCode).toBeDefined()
    expect(result.codex).toBeDefined()
    expect(result.gemini).toBeDefined()

    expect(result.claudeCode?.daily).toHaveLength(2)
    expect(result.codex?.daily).toHaveLength(1)
    expect(result.gemini?.daily).toHaveLength(1)

    expect(result.totals?.totalCost).toBe(44.5)
    expect(result.totals?.totalTokens).toBe(144000)
    expect(result.totals?.inputTokens).toBe(80000)
    expect(result.totals?.outputTokens).toBe(40000)
  })
})
