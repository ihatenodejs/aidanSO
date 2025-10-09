export type ProviderId = 'all' | 'claudeCode' | 'codex'

export interface HeatmapPalette {
  empty: string
  steps: string[]
}

export interface ChartTheme {
  areaStroke: string
  areaFill: string
  trend: string
  pie: string[]
  barPrimary: string
  barSecondary: string
  line: string
}

export interface ButtonTheme {
  activeBackground: string
  activeText: string
}

export interface ToolTheme {
  id: ProviderId
  label: string
  accent: string
  accentContrast: string
  accentMuted: string
  secondary: string
  tertiary: string
  focusRing: string
  button: ButtonTheme
  chart: ChartTheme
  heatmap: HeatmapPalette
  emphasis: {
    cost: string
  }
}

const claudeTheme: ToolTheme = {
  id: 'claudeCode',
  label: 'Claude Code',
  accent: '#c15f3c',
  accentContrast: '#1a100d',
  accentMuted: '#d68b6b',
  secondary: '#b1ada1',
  tertiary: '#f4f3ee',
  focusRing: '#c15f3c',
  button: {
    activeBackground: '#c15f3c',
    activeText: '#1a100d',
  },
  chart: {
    areaStroke: '#c15f3c',
    areaFill: '#c15f3c',
    trend: '#b1ada1',
    pie: ['#c15f3c', '#d68b6b', '#b1ada1', '#8d5738', '#f4f3ee'],
    barPrimary: '#c15f3c',
    barSecondary: '#b1ada1',
    line: '#f4f3ee',
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#4a3328', '#6b4530', '#8d5738', '#c15f3c'],
  },
  emphasis: {
    cost: '#c15f3c',
  },
}

const codexTheme: ToolTheme = {
  id: 'codex',
  label: 'Codex',
  accent: '#f5f5f5',
  accentContrast: '#111827',
  accentMuted: '#d1d5db',
  secondary: '#9ca3af',
  tertiary: '#6b7280',
  focusRing: '#f5f5f5',
  button: {
    activeBackground: '#f5f5f5',
    activeText: '#111827',
  },
  chart: {
    areaStroke: '#f5f5f5',
    areaFill: '#f5f5f5',
    trend: '#d1d5db',
    pie: ['#f5f5f5', '#d1d5db', '#9ca3af', '#6b7280', '#374151'],
    barPrimary: '#f5f5f5',
    barSecondary: '#9ca3af',
    line: '#e5e7eb',
  },
  heatmap: {
    empty: '#111827',
    steps: ['#1f2937', '#374151', '#4b5563', '#f5f5f5'],
  },
  emphasis: {
    cost: '#f5f5f5',
  },
}

const combinedTheme: ToolTheme = {
  id: 'all',
  label: 'All Tools',
  accent: '#9ca3af',
  accentContrast: '#111827',
  accentMuted: '#6b7280',
  secondary: '#6b7280',
  tertiary: '#e5e7eb',
  focusRing: '#9ca3af',
  button: {
    activeBackground: '#9ca3af',
    activeText: '#111827',
  },
  chart: {
    areaStroke: '#9ca3af',
    areaFill: '#9ca3af',
    trend: '#6b7280',
    pie: ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'],
    barPrimary: '#9ca3af',
    barSecondary: '#6b7280',
    line: '#e5e7eb',
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#374151', '#4b5563', '#6b7280', '#9ca3af'],
  },
  emphasis: {
    cost: '#9ca3af',
  },
}

export const toolThemes: Record<ProviderId, ToolTheme> = {
  all: combinedTheme,
  claudeCode: claudeTheme,
  codex: codexTheme,
}

export const getToolTheme = (provider: ProviderId): ToolTheme => {
  return toolThemes[provider] ?? toolThemes.all
}
