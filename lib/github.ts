/**
 * GitHub and Forgejo API integration service with server-side caching.
 *
 * @remarks
 * This module provides secure, cached access to GitHub and Forgejo APIs for:
 * - Fetching recent repository updates
 * - Retrieving repository metrics (stars, forks)
 * - Managing featured project data
 *
 * **Security Features:**
 * - Dual-layer caching (unstable_cache + React cache) prevents API abuse
 * - 1-hour revalidation protects GitHub PAT from rate limits
 * - Server-side cache shared across all requests
 *
 * **Environment Variables:**
 * - `GITHUB_PROJECTS_USER` or `GITHUB_USERNAME`: Override default username
 * - `GITHUB_PROJECTS_PAT` or `GITHUB_PAT`: GitHub Personal Access Token (optional)
 *
 * @example
 * ```ts
 * import { getRecentGitHubRepos, getFeaturedReposWithMetrics } from '@/lib/github'
 *
 * // Get recent repos for configured user
 * const { username, repos } = await getRecentGitHubRepos()
 *
 * // Get featured projects with live metrics
 * const projects = await getFeaturedReposWithMetrics()
 * console.log(`${projects[0].name}: ${projects[0].stars} stars`)
 * ```
 *
 * @category Services
 * @module lib/github
 * @public
 */

import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { featuredRepos } from '@/lib/config/featured-repos'

/** Default GitHub username when not configured via environment variables */
const DEFAULT_GITHUB_USER = 'ihatenodejs'

/** Default Forgejo instance URL */
const DEFAULT_FORGEJO_URL = 'git.p0ntus.com'

/** Maximum number of recent repositories to fetch */
const REPO_LIMIT = 4

/** Cache revalidation time in seconds (1 hour) */
const REVALIDATE_SECONDS = 60 * 60

/** GitHub API repository response structure */
interface GitHubRepoApi {
  id: number
  name: string
  html_url: string
  updated_at: string
  stargazers_count?: number
  forks_count?: number
}

/** Forgejo API repository response structure */
interface ForgejoRepoApi {
  id: number
  name: string
  html_url: string
  stars_count?: number
  forks_count?: number
}

/**
 * Simplified repository summary for recent repos list.
 *
 * @public
 */
export interface GitHubRepoSummary {
  /** Repository ID from GitHub API */
  id: number
  /** Repository name */
  name: string
  /** Full URL to repository */
  url: string
  /** ISO 8601 timestamp of last update */
  updatedAt: string
}

/**
 * Featured project with live metrics from GitHub or Forgejo.
 *
 * @remarks
 * This interface represents a featured repository with real-time
 * star and fork counts fetched from the respective platform's API.
 *
 * @public
 */
export interface FeaturedProject {
  /** Unique identifier for the project */
  id: number
  /** Repository owner username or organization */
  owner: string
  /** Repository name */
  repo: string
  /** Display name (may include owner prefix) */
  name: string
  /** Project description */
  description: string
  /** Source platform */
  platform: 'github' | 'forgejo'
  /** Full URL to repository */
  url: string
  /** Current star count */
  stars: number
  /** Current fork count */
  forks: number
}

/**
 * Repository engagement metrics.
 *
 * @internal
 */
interface RepoMetrics {
  /** Number of stars/stargazers */
  stars: number
  /** Number of forks */
  forks: number
}

/**
 * Resolves GitHub username from environment variables or uses default.
 *
 * @returns GitHub username to use for API requests
 * @internal
 */
const resolveConfiguredUser = (): string => {
  const configured = process.env.GITHUB_PROJECTS_USER ?? process.env.GITHUB_USERNAME
  const fallback = DEFAULT_GITHUB_USER

  if (!configured) {
    return fallback
  }

  const trimmed = configured.trim()
  return trimmed.length ? trimmed : fallback
}

/**
 * Resolves GitHub PAT from environment variables for authentication.
 *
 * @returns Authorization header value or undefined if no token configured
 * @internal
 */
const resolveAuthHeader = (): string | undefined => {
  const token = process.env.GITHUB_PROJECTS_PAT ?? process.env.GITHUB_PAT

  if (!token) {
    return undefined
  }

  return `Bearer ${token.trim()}`
}

/**
 * Builds HTTP headers for GitHub API requests.
 *
 * @remarks
 * Automatically includes Authorization header if PAT is configured.
 *
 * @returns Headers object for fetch requests
 * @internal
 */
const buildGitHubHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'aidan.so',
  }

  const authHeader = resolveAuthHeader()
  if (authHeader) {
    headers.Authorization = authHeader
  }

  return headers
}

/**
 * Fetches recently updated repositories for a GitHub user.
 *
 * @param username - GitHub username to fetch repositories for
 * @returns Array of repository summaries, sorted by most recently updated
 *
 * @remarks
 * - Limited to 4 most recent repositories
 * - Uses Next.js fetch cache with 1-hour revalidation
 * - Returns empty array on error (logs to console)
 *
 * @internal
 */
const fetchRecentRepos = async (username: string): Promise<GitHubRepoSummary[]> => {
  const url = new URL(`https://api.github.com/users/${username}/repos`)
  url.searchParams.set('sort', 'updated')
  url.searchParams.set('per_page', REPO_LIMIT.toString())

  try {
    const response = await fetch(url, {
      headers: buildGitHubHeaders(),
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [`github-repos-${username}`],
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch GitHub repos for ${username}: ${response.status} ${response.statusText}`)
      return []
    }

    const data = (await response.json()) as GitHubRepoApi[]

    return data.slice(0, REPO_LIMIT).map((repo) => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      updatedAt: repo.updated_at,
    }))
  } catch (error) {
    console.error(`Unexpected error fetching GitHub repos for ${username}:`, error)
    return []
  }
}

/**
 * Server-side cached wrapper for fetchRecentRepos.
 *
 * @remarks
 * Uses Next.js unstable_cache to prevent API abuse across requests.
 * Cache is shared server-side and persists for 1 hour.
 *
 * @internal
 */
const getCachedRecentRepos = unstable_cache(
  async (username: string) => fetchRecentRepos(username),
  ['github-recent-repos'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['github-repos'],
  }
)

/**
 * Retrieves recently updated GitHub repositories for the configured user.
 *
 * @returns Object containing username and array of recent repositories
 *
 * @remarks
 * **Caching Strategy:**
 * - Server-side cache (unstable_cache): Shared across all requests, 1-hour TTL
 * - Request cache (React cache): Deduplicates calls within single request
 *
 * **Security:**
 * - Protects GitHub PAT from rate limit abuse
 * - Maximum 1 API call per hour regardless of page refreshes
 *
 * @example
 * ```ts
 * const { username, repos } = await getRecentGitHubRepos()
 * repos.forEach(repo => console.log(`${repo.name}: ${repo.url}`))
 * ```
 *
 * @public
 */
export const getRecentGitHubRepos = cache(async () => {
  const username = resolveConfiguredUser()
  const repos = await getCachedRecentRepos(username)

  return {
    username,
    repos,
  }
})

/**
 * Fetches star and fork counts for a specific GitHub repository.
 *
 * @param owner - Repository owner (user or organization)
 * @param repo - Repository name
 * @returns Repository metrics or null on error
 *
 * @internal
 */
const fetchGitHubRepoMetrics = async (owner: string, repo: string): Promise<RepoMetrics | null> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: buildGitHubHeaders(),
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [`github-repo-${owner}-${repo}`],
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch GitHub repo ${owner}/${repo}: ${response.status}`)
      return null
    }

    const data = (await response.json()) as GitHubRepoApi

    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    }
  } catch (error) {
    console.error(`Error fetching GitHub repo ${owner}/${repo}:`, error)
    return null
  }
}

/**
 * Server-side cached wrapper for GitHub repository metrics.
 *
 * @remarks
 * Prevents API abuse by caching metrics for 1 hour server-side.
 *
 * @internal
 */
const getCachedGitHubRepoMetrics = unstable_cache(
  async (owner: string, repo: string) => fetchGitHubRepoMetrics(owner, repo),
  ['github-repo-metrics'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['github-metrics'],
  }
)

/**
 * Fetches star and fork counts for a Forgejo repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param forgejoBaseUrl - Forgejo instance base URL (default: git.p0ntus.com)
 * @returns Repository metrics or null on error
 *
 * @internal
 */
const fetchForgejoRepoMetrics = async (
  owner: string,
  repo: string,
  forgejoBaseUrl: string = DEFAULT_FORGEJO_URL
): Promise<RepoMetrics | null> => {
  try {
    const apiUrl = `https://${forgejoBaseUrl}/api/v1/repos/${owner}/${repo}`

    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'aidan.so',
      },
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [`forgejo-repo-${forgejoBaseUrl}-${owner}-${repo}`],
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch Forgejo repo ${owner}/${repo} from ${forgejoBaseUrl}: ${response.status}`)
      return null
    }

    const data = (await response.json()) as ForgejoRepoApi

    return {
      stars: data.stars_count ?? 0,
      forks: data.forks_count ?? 0,
    }
  } catch (error) {
    console.error(`Error fetching Forgejo repo ${owner}/${repo} from ${forgejoBaseUrl}:`, error)
    return null
  }
}

/**
 * Server-side cached wrapper for Forgejo repository metrics.
 *
 * @remarks
 * Prevents API abuse by caching metrics for 1 hour server-side.
 *
 * @internal
 */
const getCachedForgejoRepoMetrics = unstable_cache(
  async (owner: string, repo: string, forgejoBaseUrl: string = DEFAULT_FORGEJO_URL) =>
    fetchForgejoRepoMetrics(owner, repo, forgejoBaseUrl),
  ['forgejo-repo-metrics'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['forgejo-metrics'],
  }
)

/**
 * Fetches all featured projects with live metrics from their platforms.
 *
 * @returns Array of featured projects with current star/fork counts
 *
 * @remarks
 * Automatically fetches from the correct API (GitHub or Forgejo) based on
 * platform configuration in featured-repos.ts.
 *
 * @internal
 */
const fetchFeaturedProjects = async (): Promise<FeaturedProject[]> => {
  const projects = await Promise.all(
    featuredRepos.map(async (config) => {
      let metrics: RepoMetrics | null = null

      if (config.platform === 'github') {
        metrics = await getCachedGitHubRepoMetrics(config.owner, config.repo)
      } else if (config.platform === 'forgejo') {
        metrics = await getCachedForgejoRepoMetrics(
          config.owner,
          config.repo,
          config.forgejoUrl ?? DEFAULT_FORGEJO_URL
        )
      }

      const url = config.platform === 'github'
        ? `https://github.com/${config.owner}/${config.repo}`
        : `https://${config.forgejoUrl ?? DEFAULT_FORGEJO_URL}/${config.owner}/${config.repo}`

      return {
        id: config.id,
        owner: config.owner,
        repo: config.repo,
        name: config.owner === config.repo ? config.repo : `${config.owner}/${config.repo}`,
        description: config.description,
        platform: config.platform,
        url,
        stars: metrics?.stars ?? 0,
        forks: metrics?.forks ?? 0,
      }
    })
  )

  return projects
}

/**
 * Retrieves featured projects with live star and fork counts.
 *
 * @returns Array of featured projects with real-time metrics
 *
 * @remarks
 * **Data Source:**
 * Projects are configured in `lib/config/featured-repos.ts`.
 * Metrics are fetched live from GitHub and Forgejo APIs.
 *
 * **Caching Strategy:**
 * - Server-side cache (unstable_cache): Shared across all requests, 1-hour TTL
 * - Request cache (React cache): Deduplicates calls within single request
 *
 * **Security:**
 * - Prevents API abuse through dual-layer caching
 * - Maximum 1 API call per repository per hour
 *
 * @example
 * ```ts
 * const projects = await getFeaturedReposWithMetrics()
 *
 * projects.forEach(project => {
 *   console.log(`${project.name}: ${project.stars} ⭐ ${project.forks} 🍴`)
 *   console.log(`Platform: ${project.platform}`)
 *   console.log(`URL: ${project.url}`)
 * })
 * ```
 *
 * @public
 */
export const getFeaturedReposWithMetrics = cache(
  unstable_cache(
    async () => fetchFeaturedProjects(),
    ['featured-repos'],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: ['featured-projects'],
    }
  )
)
