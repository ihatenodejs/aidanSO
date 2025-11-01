export type ProviderId =
  | 'all'
  | 'claudeCode'
  | 'codex'
  | 'opencode'
  | 'qwen'
  | 'gemini'

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
    activeText: '#1a100d'
  },
  chart: {
    areaStroke: '#c15f3c',
    areaFill: '#c15f3c',
    trend: '#b1ada1',
    pie: ['#c15f3c', '#d68b6b', '#b1ada1', '#8d5738', '#f4f3ee'],
    barPrimary: '#c15f3c',
    barSecondary: '#b1ada1',
    line: '#f4f3ee'
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#4a3328', '#6b4530', '#8d5738', '#c15f3c']
  },
  emphasis: {
    cost: '#c15f3c'
  }
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
    activeText: '#111827'
  },
  chart: {
    areaStroke: '#f5f5f5',
    areaFill: '#f5f5f5',
    trend: '#d1d5db',
    pie: ['#f5f5f5', '#d1d5db', '#9ca3af', '#6b7280', '#374151'],
    barPrimary: '#f5f5f5',
    barSecondary: '#9ca3af',
    line: '#e5e7eb'
  },
  heatmap: {
    empty: '#111827',
    steps: ['#1f2937', '#374151', '#4b5563', '#f5f5f5']
  },
  emphasis: {
    cost: '#f5f5f5'
  }
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
    activeText: '#111827'
  },
  chart: {
    areaStroke: '#9ca3af',
    areaFill: '#9ca3af',
    trend: '#6b7280',
    pie: ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'],
    barPrimary: '#9ca3af',
    barSecondary: '#6b7280',
    line: '#e5e7eb'
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#374151', '#4b5563', '#6b7280', '#9ca3af']
  },
  emphasis: {
    cost: '#9ca3af'
  }
}

const opencodeTheme: ToolTheme = {
  id: 'opencode',
  label: 'OpenCode',
  accent: '#10b981',
  accentContrast: '#064e3b',
  accentMuted: '#6ee7b7',
  secondary: '#34d399',
  tertiary: '#d1fae5',
  focusRing: '#10b981',
  button: {
    activeBackground: '#10b981',
    activeText: '#064e3b'
  },
  chart: {
    areaStroke: '#10b981',
    areaFill: '#10b981',
    trend: '#34d399',
    pie: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
    barPrimary: '#10b981',
    barSecondary: '#34d399',
    line: '#d1fae5'
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#065f46', '#047857', '#059669', '#10b981']
  },
  emphasis: {
    cost: '#10b981'
  }
}

const qwenTheme: ToolTheme = {
  id: 'qwen',
  label: 'Qwen',
  accent: '#8b5cf6',
  accentContrast: '#2e1065',
  accentMuted: '#c4b5fd',
  secondary: '#a78bfa',
  tertiary: '#ede9fe',
  focusRing: '#8b5cf6',
  button: {
    activeBackground: '#8b5cf6',
    activeText: '#2e1065'
  },
  chart: {
    areaStroke: '#8b5cf6',
    areaFill: '#8b5cf6',
    trend: '#a78bfa',
    pie: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    barPrimary: '#8b5cf6',
    barSecondary: '#a78bfa',
    line: '#ede9fe'
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#4c1d95', '#6d28d9', '#7c3aed', '#8b5cf6']
  },
  emphasis: {
    cost: '#8b5cf6'
  }
}

const geminiTheme: ToolTheme = {
  id: 'gemini',
  label: 'Gemini',
  accent: '#3b82f6',
  accentContrast: '#1e3a8a',
  accentMuted: '#93c5fd',
  secondary: '#60a5fa',
  tertiary: '#dbeafe',
  focusRing: '#3b82f6',
  button: {
    activeBackground: '#3b82f6',
    activeText: '#1e3a8a'
  },
  chart: {
    areaStroke: '#3b82f6',
    areaFill: '#3b82f6',
    trend: '#60a5fa',
    pie: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    barPrimary: '#3b82f6',
    barSecondary: '#60a5fa',
    line: '#dbeafe'
  },
  heatmap: {
    empty: '#1f2937',
    steps: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6']
  },
  emphasis: {
    cost: '#3b82f6'
  }
}

export const toolThemes: Record<ProviderId, ToolTheme> = {
  all: combinedTheme,
  claudeCode: claudeTheme,
  codex: codexTheme,
  opencode: opencodeTheme,
  qwen: qwenTheme,
  gemini: geminiTheme
}

export const getToolTheme = (provider: ProviderId): ToolTheme => {
  return toolThemes[provider] ?? toolThemes.all
}
