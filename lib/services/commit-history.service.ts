import { createHash } from 'node:crypto'
import { unstable_cache } from 'next/cache'
import type { CommitHistoryData, CommitHistoryDay } from '@/lib/types'

const DAYS_IN_RANGE = 365
const FETCH_TIMEOUT_MS = 5000
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
const FORGEJO_HEATMAP_URL = 'https://git.p0ntus.com/api/v1/users/aidan/heatmap'

interface GitHubContributionDay {
  date: string
  contributionCount: number
}

interface ForgejoContributionDay {
  timestamp: number
  contributions: number
}

const GITHUB_CONTRIBUTIONS_QUERY = `
  query ContributionCalendar($from: DateTime!, $to: DateTime!) {
    user(login: "ihatenodejs") {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

function toUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function buildDays(now: Date): CommitHistoryDay[] {
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (DAYS_IN_RANGE - 1))

  return Array.from({ length: DAYS_IN_RANGE }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + index)

    return { date: toUtcDateString(date), github: 0, forgejo: 0, total: 0 }
  })
}

function isGitHubContributionDays(
  value: unknown
): value is GitHubContributionDay[] {
  return (
    Array.isArray(value) &&
    value.every(
      (day) =>
        typeof day === 'object' &&
        day !== null &&
        typeof day.date === 'string' &&
        typeof day.contributionCount === 'number' &&
        Number.isFinite(day.contributionCount)
    )
  )
}

function isForgejoContributionDays(
  value: unknown
): value is ForgejoContributionDay[] {
  return (
    Array.isArray(value) &&
    value.every(
      (day) =>
        typeof day === 'object' &&
        day !== null &&
        typeof day.timestamp === 'number' &&
        Number.isFinite(day.timestamp) &&
        typeof day.contributions === 'number' &&
        Number.isFinite(day.contributions)
    )
  )
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

export class CommitHistoryService {
  constructor(private readonly getNow: () => Date = () => new Date()) {}

  async fetchCommitHistory(): Promise<CommitHistoryData> {
    const days = buildDays(this.getNow())
    const daysByDate = new Map(days.map((day) => [day.date, day]))
    const start = new Date(`${days[0].date}T00:00:00.000Z`)
    const end = new Date(`${days.at(-1)?.date}T23:59:59.999Z`)
    const [githubResult, forgejoResult] = await Promise.allSettled([
      this.fetchGitHubContributions(start, end).catch((error: unknown) => {
        console.error('GitHub contribution data request failed')
        throw error
      }),
      this.fetchForgejoContributions().catch((error: unknown) => {
        console.error('Forgejo contribution data request failed')
        throw error
      })
    ])

    const githubAvailable = githubResult.status === 'fulfilled'
    const forgejoAvailable = forgejoResult.status === 'fulfilled'

    if (githubAvailable) {
      for (const contribution of githubResult.value) {
        const day = daysByDate.get(contribution.date)
        if (day) day.github += contribution.contributionCount
      }
    }

    if (forgejoAvailable) {
      for (const contribution of forgejoResult.value) {
        const timestampDate = new Date(contribution.timestamp * 1000)
        if (Number.isNaN(timestampDate.getTime())) continue

        const day = daysByDate.get(toUtcDateString(timestampDate))
        if (day) day.forgejo += contribution.contributions
      }
    }

    if (!githubAvailable && !forgejoAvailable) {
      return {
        status: 'error',
        days: [],
        totalContributions: 0,
        githubContributions: 0,
        forgejoContributions: 0,
        message: 'GitHub and Forgejo contribution data are unavailable.'
      }
    }

    const completedDays = days.map((day) => ({
      ...day,
      total: day.github + day.forgejo
    }))
    const githubContributions = completedDays.reduce(
      (total, day) => total + day.github,
      0
    )
    const forgejoContributions = completedDays.reduce(
      (total, day) => total + day.forgejo,
      0
    )

    return {
      status: githubAvailable && forgejoAvailable ? 'complete' : 'partial',
      days: completedDays,
      totalContributions: githubContributions + forgejoContributions,
      githubContributions,
      forgejoContributions,
      message: githubAvailable
        ? forgejoAvailable
          ? undefined
          : 'Forgejo contribution data is unavailable.'
        : 'GitHub contribution data is unavailable.'
    }
  }

  private async fetchGitHubContributions(
    from: Date,
    to: Date
  ): Promise<GitHubContributionDay[]> {
    const token = process.env.GITHUB_PAT?.trim()
    if (!token) {
      console.error(
        'GitHub contribution data is unavailable: missing credential'
      )
      throw new Error('GitHub credential is missing')
    }

    const response = await fetchWithTimeout(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'aidan.so',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: GITHUB_CONTRIBUTIONS_QUERY,
        variables: { from: from.toISOString(), to: to.toISOString() }
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error(
        `GitHub contribution data is unavailable: HTTP ${response.status}`
      )
      throw new Error(`GitHub request failed with ${response.status}`)
    }

    const body: unknown = await response.json()
    const contributionDays =
      body &&
      typeof body === 'object' &&
      'data' in body &&
      body.data &&
      typeof body.data === 'object' &&
      'user' in body.data &&
      body.data.user &&
      typeof body.data.user === 'object' &&
      'contributionsCollection' in body.data.user &&
      body.data.user.contributionsCollection &&
      typeof body.data.user.contributionsCollection === 'object' &&
      'contributionCalendar' in body.data.user.contributionsCollection &&
      body.data.user.contributionsCollection.contributionCalendar &&
      typeof body.data.user.contributionsCollection.contributionCalendar ===
        'object' &&
      'weeks' in body.data.user.contributionsCollection.contributionCalendar
        ? body.data.user.contributionsCollection.contributionCalendar.weeks
        : undefined

    if (!Array.isArray(contributionDays)) {
      console.error(
        'GitHub contribution data is unavailable: malformed payload'
      )
      throw new Error('GitHub payload is malformed')
    }

    const flattenedDays = contributionDays.flatMap((week) =>
      week && typeof week === 'object' && 'contributionDays' in week
        ? week.contributionDays
        : []
    )

    if (!isGitHubContributionDays(flattenedDays)) {
      console.error(
        'GitHub contribution data is unavailable: malformed calendar'
      )
      throw new Error('GitHub calendar is malformed')
    }

    return flattenedDays
  }

  private async fetchForgejoContributions(): Promise<ForgejoContributionDay[]> {
    const token = process.env.FORGEJO_COMMIT_HISTORY_PAT?.trim()
    if (!token) {
      console.error(
        'Forgejo contribution data is unavailable: missing credential'
      )
      throw new Error('Forgejo credential is missing')
    }

    const response = await fetchWithTimeout(FORGEJO_HEATMAP_URL, {
      headers: { Authorization: `token ${token}` },
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error(
        `Forgejo contribution data is unavailable: HTTP ${response.status}`
      )
      throw new Error(`Forgejo request failed with ${response.status}`)
    }

    const body: unknown = await response.json()
    if (!isForgejoContributionDays(body)) {
      console.error(
        'Forgejo contribution data is unavailable: malformed payload'
      )
      throw new Error('Forgejo payload is malformed')
    }

    return body
  }
}

const getCachedCommitHistory = unstable_cache(
  async (_githubCredential: string, _forgejoCredential: string) =>
    new CommitHistoryService().fetchCommitHistory(),
  ['commit-history'],
  { revalidate: 60 * 60 * 6, tags: ['commit-history'] }
)

function getCredentialFingerprint(token: string | undefined): string {
  return token
    ? createHash('sha256').update(token).digest('hex')
    : 'credential-missing'
}

export function getCommitHistory(): Promise<CommitHistoryData> {
  return getCachedCommitHistory(
    getCredentialFingerprint(process.env.GITHUB_PAT?.trim()),
    getCredentialFingerprint(process.env.FORGEJO_COMMIT_HISTORY_PAT?.trim())
  )
}
