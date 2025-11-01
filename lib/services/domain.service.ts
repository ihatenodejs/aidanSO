import type { Domain, DomainWithMetrics } from '@/lib/types'
import { projects } from '@/lib/config/projects'
import type { SortOrder } from '@/lib/types/service'

/**
 * Service for managing domain portfolio data and computing domain metrics.
 *
 * @remarks
 * This service provides comprehensive domain portfolio management:
 * - Automatic metric calculation (expiration, ownership duration)
 * - Flexible filtering and sorting
 * - Statistical analysis
 * - Renewal tracking
 *
 * All date calculations use UTC to ensure consistency across timezones.
 *
 * @example
 * ```ts
 * import { DomainService } from '@/lib/services'
 *
 * // Get all domains with computed metrics
 * const domains = DomainService.getAllDomainsEnriched()
 *
 * // Find expiring domains
 * const expiring = DomainService.filterDomains({ expiringSoon: true })
 *
 * // Get portfolio statistics
 * const stats = DomainService.getDomainStats()
 * console.log(`Total domains: ${stats.total}`)
 * ```
 *
 * @category Services
 * @public
 */
export class DomainService {
  private static computeExpirationDate(domain: Domain): Date {
    let expirationDate = new Date(domain.renewals[0].date)

    for (const renewal of domain.renewals) {
      const renewalDate = new Date(renewal.date)
      expirationDate = new Date(renewalDate)
      expirationDate.setFullYear(expirationDate.getFullYear() + renewal.years)
    }

    return expirationDate
  }

  private static computeRegistrationDate(domain: Domain): Date {
    return new Date(domain.renewals[0].date)
  }

  private static computeOwnershipDays(domain: Domain): number {
    const registrationDate = this.computeRegistrationDate(domain)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - registrationDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  private static computeOwnershipYears(domain: Domain): number {
    const days = this.computeOwnershipDays(domain)
    return Math.floor(days / 365.25)
  }

  private static computeOwnershipMonths(domain: Domain): number {
    const registrationDate = this.computeRegistrationDate(domain)
    const now = new Date()

    let months = (now.getFullYear() - registrationDate.getFullYear()) * 12
    months += now.getMonth() - registrationDate.getMonth()

    if (now.getDate() < registrationDate.getDate()) {
      months--
    }

    return Math.max(0, months)
  }

  private static computeDaysUntilExpiration(domain: Domain): number {
    const expirationDate = this.computeExpirationDate(domain)
    const now = new Date()
    const diffTime = expirationDate.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  private static computeRenewalProgressPercent(domain: Domain): number {
    const ownershipDays = this.computeOwnershipDays(domain)
    const registrationDate = this.computeRegistrationDate(domain)
    const expirationDate = this.computeExpirationDate(domain)
    const totalDays = Math.ceil(
      (expirationDate.getTime() - registrationDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return Math.min(100, Math.max(0, (ownershipDays / totalDays) * 100))
  }

  private static isExpiringSoon(
    domain: Domain,
    thresholdDays: number = 90
  ): boolean {
    return this.computeDaysUntilExpiration(domain) <= thresholdDays
  }

  private static extractTLD(domain: Domain): string {
    const lastDot = domain.domain.lastIndexOf('.')
    return lastDot !== -1 ? domain.domain.substring(lastDot) : ''
  }

  /**
   * Enriches a domain with computed metrics including expiration dates,
   * ownership duration, and renewal progress.
   *
   * @param domain - The domain to enrich
   * @returns {DomainWithMetrics} Domain with added properties:
   *   - `expirationDate: Date` - Computed expiration date
   *   - `registrationDate: Date` - Initial registration date
   *   - `ownershipDays: number` - Total days owned
   *   - `ownershipYears: number` - Total years owned (floor)
   *   - `ownershipMonths: number` - Total months owned
   *   - `daysUntilExpiration: number` - Days until domain expires
   *   - `renewalProgressPercent: number` - 0-100 percent through renewal period
   *   - `isExpiringSoon: boolean` - Expires within 90 days
   *   - `nextRenewalDate: Date` - Date of next renewal (same as expirationDate)
   *   - `tld: string` - Top-level domain (e.g., '.com', '.dev')
   */
  static enrichDomain(domain: Domain): DomainWithMetrics {
    const expirationDate = this.computeExpirationDate(domain)
    const registrationDate = this.computeRegistrationDate(domain)

    return {
      ...domain,
      expirationDate,
      registrationDate,
      ownershipDays: this.computeOwnershipDays(domain),
      ownershipYears: this.computeOwnershipYears(domain),
      ownershipMonths: this.computeOwnershipMonths(domain),
      daysUntilExpiration: this.computeDaysUntilExpiration(domain),
      renewalProgressPercent: this.computeRenewalProgressPercent(domain),
      isExpiringSoon: this.isExpiringSoon(domain),
      nextRenewalDate: expirationDate,
      tld: this.extractTLD(domain)
    }
  }

  /**
   * Retrieves all domains from projects.
   *
   * @returns {Domain[]} Array of all domain specifications
   * @remarks Only includes projects that have domainInfo defined
   */
  static getAllDomains(): Domain[] {
    return projects
      .filter((project) => project.domainInfo !== undefined)
      .map((project) => ({
        domain: project.domain,
        usage: project.domainInfo!.usage,
        registrar: project.domainInfo!.registrar,
        autoRenew: project.domainInfo!.autoRenew,
        status: project.domainInfo!.status,
        category: project.domainInfo!.category,
        tags: project.domainInfo!.tags,
        renewals: project.domainInfo!.renewals
      }))
  }

  /**
   * Retrieves all domains with enriched metrics.
   *
   * @returns {DomainWithMetrics[]} Array of all domains with computed properties
   */
  static getAllDomainsEnriched(): DomainWithMetrics[] {
    return this.getAllDomains().map((domain) => this.enrichDomain(domain))
  }

  /**
   * Retrieves a single domain by its full domain name.
   *
   * @param domainName - The full domain name (e.g., 'aidxn.com')
   * @returns {DomainWithMetrics | null} Enriched domain or null if not found
   * @remarks Returns null if the project doesn't have domainInfo
   */
  static getDomainByName(domainName: string): DomainWithMetrics | null {
    const project = projects.find((p) => p.domain === domainName)
    if (!project || !project.domainInfo) return null

    const domain: Domain = {
      domain: project.domain,
      usage: project.domainInfo.usage,
      registrar: project.domainInfo.registrar,
      autoRenew: project.domainInfo.autoRenew,
      status: project.domainInfo.status,
      category: project.domainInfo.category,
      tags: project.domainInfo.tags,
      renewals: project.domainInfo.renewals
    }

    return this.enrichDomain(domain)
  }

  /**
   * Filters domains based on multiple criteria.
   *
   * @param filters - Filter criteria
   * @param filters.status - Domain status to filter by ('active' | 'parked' | 'reserved')
   * @param filters.category - Domain category to filter by ('personal' | 'service' | 'project' | 'fun' | 'legacy')
   * @param filters.registrar - Registrar name to filter by
   * @param filters.expiringSoon - Filter by expiration status (within 90 days)
   * @param filters.autoRenew - Filter by auto-renewal setting
   * @returns {DomainWithMetrics[]} Array of enriched domains matching all specified filters
   *
   * @example
   * ```ts
   * const activeDomains = DomainService.filterDomains({ status: 'active' })
   * const expiringDomains = DomainService.filterDomains({ expiringSoon: true })
   * ```
   */
  static filterDomains(filters: {
    status?: Domain['status']
    category?: Domain['category']
    registrar?: string
    expiringSoon?: boolean
    autoRenew?: boolean
  }): DomainWithMetrics[] {
    let filteredProjects = projects.filter((p) => p.domainInfo !== undefined)

    if (filters.status) {
      filteredProjects = filteredProjects.filter(
        (p) => p.domainInfo!.status === filters.status
      )
    }

    if (filters.category) {
      filteredProjects = filteredProjects.filter(
        (p) => p.domainInfo!.category === filters.category
      )
    }

    if (filters.registrar) {
      filteredProjects = filteredProjects.filter(
        (p) => p.domainInfo!.registrar === filters.registrar
      )
    }

    if (filters.autoRenew !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.domainInfo!.autoRenew === filters.autoRenew
      )
    }

    const domains = filteredProjects.map((project) => ({
      domain: project.domain,
      usage: project.domainInfo!.usage,
      registrar: project.domainInfo!.registrar,
      autoRenew: project.domainInfo!.autoRenew,
      status: project.domainInfo!.status,
      category: project.domainInfo!.category,
      tags: project.domainInfo!.tags,
      renewals: project.domainInfo!.renewals
    }))

    const enriched = domains.map((d) => this.enrichDomain(d))

    if (filters.expiringSoon !== undefined) {
      return enriched.filter((d) => d.isExpiringSoon === filters.expiringSoon)
    }

    return enriched
  }

  /**
   * Sorts an array of domains by a specified property.
   *
   * @param domains - Array of domains to sort
   * @param sortBy - Property key to sort by (type-safe)
   * @param order - Sort direction: 'asc' (ascending) or 'desc' (descending), default: 'asc'
   * @returns {DomainWithMetrics[]} New sorted array (does not mutate original)
   *
   * @remarks
   * Creates a shallow copy before sorting to avoid mutating the original array.
   * Handles comparison of all value types (string, number, Date, boolean).
   *
   * @example
   * ```ts
   * const domains = DomainService.getAllDomainsEnriched()
   *
   * // Sort by expiration date (soonest first)
   * const byExpiration = DomainService.sortDomains(domains, 'daysUntilExpiration', 'asc')
   *
   * // Sort by domain name alphabetically
   * const byName = DomainService.sortDomains(domains, 'domain', 'asc')
   *
   * // Sort by ownership duration (longest first)
   * const byOwnership = DomainService.sortDomains(domains, 'ownershipDays', 'desc')
   * ```
   *
   * @public
   */
  static sortDomains(
    domains: DomainWithMetrics[],
    sortBy: keyof DomainWithMetrics,
    order: SortOrder = 'asc'
  ): DomainWithMetrics[] {
    return [...domains].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (aVal === bVal) return 0

      const comparison = aVal < bVal ? -1 : 1
      return order === 'asc' ? comparison : -comparison
    })
  }

  /**
   * Groups all domains by their category.
   *
   * @returns {Record<Domain['category'], DomainWithMetrics[]>} Object mapping each category to its domains
   *
   * @remarks
   * Returns an object with category keys ('personal', 'service', 'project', 'fun', 'legacy'),
   * each containing an array of enriched domains in that category.
   *
   * All categories are present in the result, even if empty.
   *
   * @example
   * ```ts
   * const grouped = DomainService.groupDomainsByCategory()
   *
   * console.log(`Personal domains: ${grouped.personal.length}`)
   * console.log(`Service domains: ${grouped.service.length}`)
   *
   * // Iterate through personal domains
   * grouped.personal.forEach(domain => {
   *   console.log(`${domain.domain} - ${domain.description}`)
   * })
   *
   * // Find most expensive category
   * const categoryCosts = Object.entries(grouped).map(([category, domains]) => ({
   *   category,
   *   totalDomains: domains.length
   * }))
   * ```
   *
   * @public
   */
  static groupDomainsByCategory(): Record<
    Domain['category'],
    DomainWithMetrics[]
  > {
    const grouped: Record<Domain['category'], DomainWithMetrics[]> = {
      personal: [],
      service: [],
      project: [],
      fun: [],
      legacy: []
    }

    const enriched = this.getAllDomainsEnriched()

    enriched.forEach((domain) => {
      grouped[domain.category].push(domain)
    })

    return grouped
  }

  /**
   * Computes statistics about my domain portfolio.
   *
   * @returns {DomainPortfolioStats} Statistics object with counts, breakdowns, and aggregates
   *
   * @remarks
   * Provides a complete statistical overview including:
   * - Total domain count
   * - Counts by status (active, parked, reserved)
   * - Domains expiring within 90 days
   * - Auto-renewal counts
   * - Breakdown by category
   * - Breakdown by registrar
   *
   * This method performs a single pass through the domain list for efficiency.
   *
   * @example
   * ```ts
   * const stats = DomainService.getDomainStats()
   *
   * console.log(`Portfolio Overview:`)
   * console.log(`  Total: ${stats.total}`)
   * console.log(`  Active: ${stats.active}`)
   * console.log(`  Expiring Soon: ${stats.expiringSoon}`)
   * console.log(`  Auto-Renew Enabled: ${stats.autoRenew}`)
   *
   * // Category breakdown
   * console.log(`\nBy Category:`)
   * Object.entries(stats.byCategory).forEach(([category, count]) => {
   *   console.log(`  ${category}: ${count}`)
   * })
   *
   * // Registrar analysis
   * console.log(`\nBy Registrar:`)
   * Object.entries(stats.byRegistrar)
   *   .sort(([,a], [,b]) => b - a)
   *   .forEach(([registrar, count]) => {
   *     console.log(`  ${registrar}: ${count}`)
   *   })
   * ```
   *
   * @public
   */
  static getDomainStats(): DomainPortfolioStats {
    const enriched = this.getAllDomainsEnriched()

    return {
      total: enriched.length,
      active: enriched.filter((d) => d.status === 'active').length,
      parked: enriched.filter((d) => d.status === 'parked').length,
      reserved: enriched.filter((d) => d.status === 'reserved').length,
      expiringSoon: enriched.filter((d) => d.isExpiringSoon).length,
      autoRenew: enriched.filter((d) => d.autoRenew).length,
      byCategory: {
        personal: enriched.filter((d) => d.category === 'personal').length,
        service: enriched.filter((d) => d.category === 'service').length,
        project: enriched.filter((d) => d.category === 'project').length,
        fun: enriched.filter((d) => d.category === 'fun').length,
        legacy: enriched.filter((d) => d.category === 'legacy').length
      },
      byRegistrar: enriched.reduce(
        (acc, d) => {
          acc[d.registrar] = (acc[d.registrar] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    }
  }
}

/**
 * Domain portfolio statistics result.
 *
 * @remarks
 * Breakdown of domain metrics returned by {@link DomainService.getDomainStats}.
 *
 * @example
 * ```ts
 * const stats: DomainPortfolioStats = DomainService.getDomainStats()
 * ```
 *
 * @category Types
 * @public
 */
export interface DomainPortfolioStats {
  /** Total number of domains in portfolio */
  total: number
  /** Number of active domains */
  active: number
  /** Number of parked domains */
  parked: number
  /** Number of reserved domains */
  reserved: number
  /** Number of domains expiring within 90 days */
  expiringSoon: number
  /** Number of domains with auto-renew enabled */
  autoRenew: number
  /** Domain counts by category */
  byCategory: {
    personal: number
    service: number
    project: number
    fun: number
    legacy: number
  }
  /** Domain counts by registrar */
  byRegistrar: Record<string, number>
}
