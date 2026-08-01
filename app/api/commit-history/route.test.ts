import { describe, expect, it, mock } from 'bun:test'
import type { CommitHistoryData } from '@/lib/types'

let payload: CommitHistoryData = {
  status: 'complete',
  days: [],
  totalContributions: 0,
  githubContributions: 0,
  forgejoContributions: 0
}

mock.module('@/lib/services/commit-history.service', () => ({
  getCommitHistory: mock(() => Promise.resolve(payload))
}))
// The route must load after its module-level service dependency is mocked.

const { GET } = await import('./route')

describe('GET /api/commit-history', () => {
  it('returns the complete widget payload', async () => {
    payload = {
      status: 'complete',
      days: [{ date: '2026-08-01', github: 2, forgejo: 3, total: 5 }],
      totalContributions: 5,
      githubContributions: 2,
      forgejoContributions: 3
    }

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(payload)
  })

  it('keeps recoverable errors as HTTP 200 payloads', async () => {
    payload = {
      status: 'error',
      days: [],
      totalContributions: 0,
      githubContributions: 0,
      forgejoContributions: 0,
      message: 'GitHub and Forgejo contribution data are unavailable.'
    }

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(payload)
  })
})
