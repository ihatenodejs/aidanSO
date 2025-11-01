import type { CheckContext, CheckDefinition, CheckResult } from '../types'

interface PageLoadMetrics {
  url: string
  totalTime: number // Time from start to completion
}

interface PerformanceGoals {
  totalTime: number // Total time should be < 3500ms
}

const DEFAULT_GOALS: PerformanceGoals = {
  totalTime: 3500
}

const PAGES_TO_TEST = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/ai/usage', name: 'AI Usage' },
  { path: '/domains', name: 'Domains' },
  { path: '/contact', name: 'Contact' }
]

async function measurePageLoad(
  url: string,
  timeout: number = 25000
): Promise<PageLoadMetrics> {
  const startTime = performance.now()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal
    })

    await response.text()

    clearTimeout(timeoutId)

    const totalTime = performance.now() - startTime

    return {
      url,
      totalTime: Math.round(totalTime)
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout after ${timeout}ms`)
    }

    throw error
  }
}

function evaluateMetrics(
  metrics: PageLoadMetrics,
  goals: PerformanceGoals
): { passed: boolean; issues: string[] } {
  const issues: string[] = []

  if (metrics.totalTime > goals.totalTime) {
    issues.push(
      `Total Time ${metrics.totalTime}ms exceeds goal ${goals.totalTime}ms`
    )
  }

  return {
    passed: issues.length === 0,
    issues
  }
}

function formatMetrics(metrics: PageLoadMetrics): string {
  return `  Total Time: ${metrics.totalTime}ms`
}

async function checkServerRunning(
  baseUrl: string,
  timeout: number = 25000
): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(baseUrl, {
      signal: controller.signal,
      redirect: 'follow'
    })

    clearTimeout(timeoutId)
    return response.ok || response.status === 404 // 404 is fine, means server is running
  } catch {
    return false
  }
}

const pageLoadPerformance: CheckDefinition = {
  id: 'page-load-performance',
  description:
    'Measure page load times and ensure they meet performance goals.',

  async run(context: CheckContext): Promise<CheckResult> {
    const port = process.env.PORT || '3000'
    const baseUrl = `http://localhost:${port}`
    void context // signature requires context for consistency with other checks

    // Check if server is running
    const serverRunning = await checkServerRunning(baseUrl)

    if (!serverRunning) {
      return {
        id: 'page-load-performance',
        ok: false,
        messages: [
          `Server not running at ${baseUrl}`,
          'Please start the server with: bun run dev'
        ]
      }
    }

    const messages: string[] = []
    let allPassed = true
    const goals = DEFAULT_GOALS

    // Test each page
    for (const page of PAGES_TO_TEST) {
      const url = `${baseUrl}${page.path}`

      try {
        const metrics = await measurePageLoad(url)
        const evaluation = evaluateMetrics(metrics, goals)

        if (evaluation.passed) {
          messages.push(`✓ ${page.name} (${page.path})`)
          messages.push(formatMetrics(metrics))
        } else {
          allPassed = false
          messages.push(`✗ ${page.name} (${page.path})`)
          messages.push(formatMetrics(metrics))
          messages.push('  Issues:')
          for (const issue of evaluation.issues) {
            messages.push(`    - ${issue}`)
          }
        }

        messages.push('') // Empty line for spacing
      } catch (error) {
        allPassed = false
        const errorMsg =
          error instanceof Error ? error.message : 'Unknown error'
        messages.push(`✗ ${page.name} (${page.path}): ${errorMsg}`)
        messages.push('')
      }
    }

    // Add performance goals summary
    messages.push('Performance Goal:')
    messages.push(`  Total Time: < ${goals.totalTime}ms`)

    return {
      id: 'page-load-performance',
      ok: allPassed,
      messages
    }
  }
}

export const checks: CheckDefinition[] = [pageLoadPerformance]
