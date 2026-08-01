import { afterEach, describe, expect, it, mock } from 'bun:test'
import { CommitHistoryService } from './commit-history.service'

const originalFetch = globalThis.fetch
const originalGitHubToken = process.env.GITHUB_PAT
const originalForgejoToken = process.env.FORGEJO_COMMIT_HISTORY_PAT
const fixedNow = () => new Date('2026-08-01T15:30:00.000Z')

function githubResponse(days: { date: string; contributionCount: number }[]) {
  return new Response(
    JSON.stringify({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 0,
              weeks: [{ contributionDays: days }]
            }
          }
        }
      }
    }),
    { status: 200 }
  )
}

function forgejoResponse(days: { timestamp: number; contributions: number }[]) {
  return new Response(JSON.stringify(days), { status: 200 })
}

function restoreEnvironment(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}

afterEach(() => {
  globalThis.fetch = originalFetch
  restoreEnvironment('GITHUB_PAT', originalGitHubToken)
  restoreEnvironment('FORGEJO_COMMIT_HISTORY_PAT', originalForgejoToken)
})

describe('CommitHistoryService', () => {
  it('builds and merges the rolling UTC contribution calendar', async () => {
    process.env.GITHUB_PAT = 'github-token'
    process.env.FORGEJO_COMMIT_HISTORY_PAT = 'forgejo-token'
    const fetchMock = mock((url: string) => {
      if (url === 'https://api.github.com/graphql') {
        return Promise.resolve(
          githubResponse([
            { date: '2025-08-02', contributionCount: 2 },
            { date: '2026-08-01', contributionCount: 3 }
          ])
        )
      }

      return Promise.resolve(
        forgejoResponse([
          {
            timestamp: Date.parse('2025-08-01T12:00:00Z') / 1000,
            contributions: 99
          },
          {
            timestamp: Date.parse('2026-08-01T04:00:00Z') / 1000,
            contributions: 4
          },
          {
            timestamp: Date.parse('2026-08-01T16:00:00Z') / 1000,
            contributions: 1
          }
        ])
      )
    })
    globalThis.fetch = Object.assign(fetchMock, originalFetch)

    const result = await new CommitHistoryService(fixedNow).fetchCommitHistory()

    expect(result.status).toBe('complete')
    expect(result.days).toHaveLength(365)
    expect(result.days[0]).toEqual({
      date: '2025-08-02',
      github: 2,
      forgejo: 0,
      total: 2
    })
    expect(result.days.at(-1)).toEqual({
      date: '2026-08-01',
      github: 3,
      forgejo: 5,
      total: 8
    })
    expect(result).toMatchObject({
      totalContributions: 10,
      githubContributions: 5,
      forgejoContributions: 5
    })
  })

  it('returns the successful provider calendar when GitHub is unavailable', async () => {
    delete process.env.GITHUB_PAT
    process.env.FORGEJO_COMMIT_HISTORY_PAT = 'forgejo-token'
    globalThis.fetch = Object.assign(
      mock(() =>
        Promise.resolve(
          forgejoResponse([
            {
              timestamp: Date.parse('2026-08-01T12:00:00Z') / 1000,
              contributions: 7
            }
          ])
        )
      ),
      originalFetch
    )

    const result = await new CommitHistoryService(fixedNow).fetchCommitHistory()

    expect(result.status).toBe('partial')
    expect(result.message).toBe('GitHub contribution data is unavailable.')
    expect(result.days).toHaveLength(365)
    expect(result.githubContributions).toBe(0)
    expect(result.forgejoContributions).toBe(7)
  })

  it('keeps Forgejo data when the GitHub request rejects', async () => {
    process.env.GITHUB_PAT = 'github-token'
    process.env.FORGEJO_COMMIT_HISTORY_PAT = 'forgejo-token'
    globalThis.fetch = Object.assign(
      mock((url: string) =>
        url === 'https://api.github.com/graphql'
          ? Promise.reject(new Error('upstream unavailable'))
          : Promise.resolve(
              forgejoResponse([
                {
                  timestamp: Date.parse('2026-08-01T12:00:00Z') / 1000,
                  contributions: 7
                }
              ])
            )
      ),
      originalFetch
    )

    await expect(
      new CommitHistoryService(fixedNow).fetchCommitHistory()
    ).resolves.toMatchObject({
      status: 'partial',
      message: 'GitHub contribution data is unavailable.',
      totalContributions: 7,
      githubContributions: 0,
      forgejoContributions: 7
    })
  })

  it('returns an error payload when both providers fail', async () => {
    process.env.GITHUB_PAT = 'github-token'
    process.env.FORGEJO_COMMIT_HISTORY_PAT = 'forgejo-token'
    globalThis.fetch = Object.assign(
      mock(() => Promise.reject(new Error('upstream unavailable'))),
      originalFetch
    )

    await expect(
      new CommitHistoryService(fixedNow).fetchCommitHistory()
    ).resolves.toEqual({
      status: 'error',
      days: [],
      totalContributions: 0,
      githubContributions: 0,
      forgejoContributions: 0,
      message: 'GitHub and Forgejo contribution data are unavailable.'
    })
  })
})
