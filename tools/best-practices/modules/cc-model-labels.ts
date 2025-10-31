import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { DailyData, ExtendedCCData } from '../../../lib/types/ai'
import { AIService } from '../../../lib/services/ai.service'
import type { CheckContext, CheckDefinition, CheckResult } from '../types'

const ccModelLabels: CheckDefinition = {
  id: 'cc-model-labels',
  description:
    'Ensure every model in public/data/cc.json has a human-readable label mapping.',
  async run(context: CheckContext): Promise<CheckResult> {
    const ccPath = resolve(context.repoRoot, 'public/data/cc.json')

    let parsed: ExtendedCCData
    try {
      const raw = await readFile(ccPath, 'utf8')
      parsed = JSON.parse(raw) as ExtendedCCData
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        id: 'cc-model-labels',
        ok: false,
        messages: [`Failed to load ${ccPath}: ${message}`]
      }
    }

    const series = collectDailySeries(parsed)
    const uniqueModels = new Set<string>()
    const missing = new Map<string, Set<string>>()

    for (const [seriesName, days] of series) {
      for (const day of days) {
        const contexts: string[] = [day.date, seriesName].filter(Boolean)
        const contextLabel = contexts.join(' @ ')

        for (const model of extractModelsFromDay(day)) {
          uniqueModels.add(model)
          if (AIService.getModelLabel(model) === model) {
            if (!missing.has(model)) {
              missing.set(model, new Set())
            }
            missing.get(model)!.add(contextLabel)
          }
        }
      }
    }

    if (missing.size > 0) {
      const messages: string[] = []
      for (const [model, occurrences] of missing) {
        const contexts = Array.from(occurrences.values())
        const preview =
          contexts.length > 5
            ? `${contexts.slice(0, 5).join(', ')} (and ${contexts.length - 5} more)`
            : contexts.join(', ')
        messages.push(`Missing label for "${model}" — seen in ${preview}`)
      }
      return {
        id: 'cc-model-labels',
        ok: false,
        messages
      }
    }

    return {
      id: 'cc-model-labels',
      ok: true,
      messages: [
        `Validated ${uniqueModels.size} unique models across ${series.size} daily series`
      ]
    }
  }
}

export const checks: CheckDefinition[] = [ccModelLabels]

function collectDailySeries(data: ExtendedCCData): Map<string, DailyData[]> {
  const series = new Map<string, DailyData[]>()

  if (isDailyContainer(data)) {
    series.set('root', data.daily)
  }

  for (const [key, value] of Object.entries(data)) {
    if (!value || typeof value !== 'object') {
      continue
    }
    if (isDailyContainer(value)) {
      series.set(key, value.daily)
    }
  }

  return series
}

function isDailyContainer(value: unknown): value is { daily: DailyData[] } {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Array.isArray((value as { daily?: unknown }).daily)
  )
}

function extractModelsFromDay(day: DailyData): string[] {
  const models = new Set<string>()
  for (const model of day.modelsUsed || []) {
    models.add(model)
  }
  for (const breakdown of day.modelBreakdowns || []) {
    if (breakdown?.modelName) {
      models.add(breakdown.modelName)
    }
  }
  return Array.from(models)
}
