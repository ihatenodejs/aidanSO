export interface ModelBreakdown {
  modelName: string
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  cost: number
}

export interface DailyData {
  date: string
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  totalTokens: number
  totalCost: number
  modelsUsed: string[]
  modelBreakdowns: ModelBreakdown[]
}

export interface CCData {
  daily: DailyData[]
  totals: {
    inputTokens: number
    outputTokens: number
    cacheCreationTokens: number
    cacheReadTokens: number
    totalCost: number
    totalTokens: number
  }
}

export interface HeatmapDay {
  date: string
  value: number
  tokens: number
  cost: number
  day: number
  formattedDate: string
}

