/**
 * Domain utility functions for date calculations and data enrichment.
 *
 * @remarks
 * This module provides convenience wrapper functions around DomainService methods,
 * offering a simpler API for common domain operations like date calculations,
 * ownership metrics, and timeline generation.
 *
 * **Key features:**
 * - Date extraction (registration, expiration, renewal)
 * - Ownership duration calculations (years, months, days)
 * - Expiration warnings and progress tracking
 * - Timeline event generation
 * - TLD extraction
 *
 * **Design pattern:**
 * Most functions delegate to {@link DomainService.enrichDomain} which computes
 * all metrics at once, making these wrappers efficient for accessing individual metrics.
 *
 * @example
 * ```ts
 * import { getOwnershipDuration, isExpiringSoon } from '@/lib/domains/utils'
 *
 * const years = getOwnershipDuration(domain)
 * const expiring = isExpiringSoon(domain, 90) // 90 days threshold
 * ```
 *
 * @module lib/domains/utils
 * @category Domains
 * @public
 */

import type { Domain } from '@/lib/types'
import { DomainService } from '@/lib/services'
import type { DomainTimelineEvent } from '@/lib/types/domain'

export type { Domain, Renewal } from '@/lib/types'

/**
 * Gets the registration date for a domain.
 * @param domain - Domain object
 * @returns Registration date
 * @see {@link DomainService.enrichDomain}
 * @category Domains
 * @public
 */
export function getRegistrationDate(domain: Domain): Date {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.registrationDate
}

/**
 * Gets the expiration date for a domain based on renewal history.
 *
 * @param domain - Domain object with renewal records
 * @returns Computed expiration date
 *
 * @remarks
 * This function delegates to {@link DomainService.enrichDomain} which computes
 * the expiration date by summing all renewal periods from the initial registration.
 * The calculation accounts for multi-year renewals and uses the last renewal's
 * end date as the expiration.
 *
 * @example
 * ```ts
 * import { getExpirationDate } from '@/lib/domains/utils'
 *
 * const expirationDate = getExpirationDate(domain)
 * console.log(expirationDate) // 2026-03-15T00:00:00.000Z
 * ```
 *
 * @example
 * ```ts
 * // Check if domain is expired
 * const expDate = getExpirationDate(domain)
 * const isExpired = expDate < new Date()
 * if (isExpired) {
 *   console.log('Domain has expired!')
 * }
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @category Domains
 * @public
 */
export function getExpirationDate(domain: Domain): Date {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.expirationDate
}

/**
 * Gets the ownership duration in years for a domain.
 *
 * @param domain - Domain object with renewal history
 * @returns Ownership duration in whole years (floor value)
 *
 * @remarks
 * This function calculates how many full years the domain has been owned
 * since the initial registration date. The value is floored, so a domain
 * owned for 2 years and 11 months returns 2.
 *
 * Uses {@link DomainService.enrichDomain} for efficient metric computation.
 *
 * @example
 * ```ts
 * import { getOwnershipDuration } from '@/lib/domains/utils'
 *
 * const years = getOwnershipDuration(domain)
 * console.log(`Owned for ${years} years`) // "Owned for 3 years"
 * ```
 *
 * @example
 * ```ts
 * // Display ownership milestone
 * const years = getOwnershipDuration(domain)
 * if (years >= 5) {
 *   console.log('Long-term domain!')
 * }
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @see {@link getOwnershipMonths} For month-level precision
 * @see {@link getOwnershipDays} For day-level precision
 * @category Domains
 * @public
 */
export function getOwnershipDuration(domain: Domain): number {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.ownershipYears
}

/**
 * Gets the ownership duration in months for a domain.
 *
 * @param domain - Domain object with renewal history
 * @returns Total ownership duration in months
 *
 * @remarks
 * This function calculates the precise number of months between the registration
 * date and the current date. Month boundaries are respected - if the current
 * day is earlier than the registration day, the month count is decremented.
 *
 * For year-level precision, use {@link getOwnershipDuration}.
 *
 * @example
 * ```ts
 * import { getOwnershipMonths } from '@/lib/domains/utils'
 *
 * const months = getOwnershipMonths(domain)
 * console.log(`Owned for ${months} months`) // "Owned for 38 months"
 * ```
 *
 * @example
 * ```ts
 * // Calculate years and remaining months
 * const totalMonths = getOwnershipMonths(domain)
 * const years = Math.floor(totalMonths / 12)
 * const months = totalMonths % 12
 * console.log(`${years}y ${months}mo`) // "3y 2mo"
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @see {@link getOwnershipDuration} For year-level precision
 * @see {@link getOwnershipDays} For day-level precision
 * @category Domains
 * @public
 */
export function getOwnershipMonths(domain: Domain): number {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.ownershipMonths
}

/**
 * Gets the ownership duration in days for a domain.
 *
 * @param domain - Domain object with renewal history
 * @returns Total ownership duration in days
 *
 * @remarks
 * This function provides the most precise ownership duration metric by
 * calculating the exact number of days between registration and the current date.
 * Uses ceiling to ensure partial days are counted.
 *
 * For less granular metrics, use {@link getOwnershipDuration} or {@link getOwnershipMonths}.
 *
 * @example
 * ```ts
 * import { getOwnershipDays } from '@/lib/domains/utils'
 *
 * const days = getOwnershipDays(domain)
 * console.log(`Owned for ${days} days`) // "Owned for 1,247 days"
 * ```
 *
 * @example
 * ```ts
 * // Check if domain is newly registered
 * const days = getOwnershipDays(domain)
 * if (days < 30) {
 *   console.log('New domain!')
 * }
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @see {@link getOwnershipDuration} For year-level precision
 * @see {@link getOwnershipMonths} For month-level precision
 * @category Domains
 * @public
 */
export function getOwnershipDays(domain: Domain): number {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.ownershipDays
}

/**
 * Calculates the total renewal period in days from registration to expiration.
 *
 * @param domain - Domain object with renewal history
 * @returns Total days from initial registration to current expiration date
 *
 * @remarks
 * This function computes the complete lifecycle span of all renewals combined.
 * Unlike {@link getOwnershipDays} which measures time from registration to now,
 * this measures the total committed period (registration to expiration).
 *
 * Useful for calculating average renewal period length or total commitment duration.
 *
 * @example
 * ```ts
 * import { getTotalRenewalPeriodDays } from '@/lib/domains/utils'
 *
 * const totalDays = getTotalRenewalPeriodDays(domain)
 * console.log(`Total period: ${totalDays} days`) // "Total period: 1,825 days"
 * ```
 *
 * @example
 * ```ts
 * // Calculate average renewal length
 * const totalDays = getTotalRenewalPeriodDays(domain)
 * const renewalCount = domain.renewals.length
 * const avgDays = totalDays / renewalCount
 * console.log(`Avg renewal: ${Math.round(avgDays / 365)} years`)
 * ```
 *
 * @see {@link getOwnershipDays} For current ownership duration
 * @see {@link getDaysUntilExpiration} For remaining days
 * @category Domains
 * @public
 */
export function getTotalRenewalPeriodDays(domain: Domain): number {
  const registrationDate = getRegistrationDate(domain)
  const expirationDate = getExpirationDate(domain)
  const diffTime = expirationDate.getTime() - registrationDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Gets the renewal progress as a percentage (0-100).
 *
 * @param domain - Domain object with renewal history
 * @returns Percentage of current renewal period elapsed (0-100)
 *
 * @remarks
 * This function calculates how far through the total renewal period
 * the domain ownership currently is. The value represents the percentage
 * from registration date to expiration date.
 *
 * - 0% = just registered
 * - 50% = halfway through renewal period
 * - 100% = at or past expiration
 *
 * @example
 * ```ts
 * import { getRenewalProgress } from '@/lib/domains/utils'
 *
 * const progress = getRenewalProgress(domain)
 * console.log(`${progress.toFixed(1)}% complete`) // "67.3% complete"
 * ```
 *
 * @example
 * ```ts
 * // Display progress bar
 * const progress = getRenewalProgress(domain)
 * const barWidth = Math.round(progress)
 * console.log('█'.repeat(barWidth) + '░'.repeat(100 - barWidth))
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @see {@link getDaysUntilExpiration} For days remaining
 * @category Domains
 * @public
 */
export function getRenewalProgress(domain: Domain): number {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.renewalProgressPercent
}

/**
 * Gets the number of days until domain expiration.
 *
 * @param domain - Domain object with renewal history
 * @returns Days until expiration (negative if already expired)
 *
 * @remarks
 * This function calculates days from the current date to the domain's
 * expiration date. The value can be:
 *
 * - Positive: Days remaining before expiration
 * - Zero: Expires today
 * - Negative: Days since expiration (domain expired)
 *
 * Commonly used with {@link isExpiringSoon} for renewal alerts.
 *
 * @example
 * ```ts
 * import { getDaysUntilExpiration } from '@/lib/domains/utils'
 *
 * const days = getDaysUntilExpiration(domain)
 * console.log(`${days} days until expiration`) // "45 days until expiration"
 * ```
 *
 * @example
 * ```ts
 * // Display appropriate message based on status
 * const days = getDaysUntilExpiration(domain)
 * if (days < 0) {
 *   console.log(`Expired ${Math.abs(days)} days ago!`)
 * } else if (days === 0) {
 *   console.log('Expires today!')
 * } else if (days < 30) {
 *   console.log(`Renew soon - ${days} days left`)
 * } else {
 *   console.log(`${days} days remaining`)
 * }
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @see {@link isExpiringSoon} For boolean expiration check
 * @category Domains
 * @public
 */
export function getDaysUntilExpiration(domain: Domain): number {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.daysUntilExpiration
}

/**
 * Checks if a domain is expiring soon based on a configurable threshold.
 *
 * @param domain - Domain object with renewal history
 * @param thresholdDays - Number of days to consider "expiring soon" (default: 90)
 * @returns True if domain expires within the threshold period
 *
 * @remarks
 * This function provides a simple boolean check for domains requiring renewal attention.
 * The default 90-day threshold is typical for domain renewal planning, but can be
 * adjusted based on your renewal workflow.
 *
 * Returns true if:
 * - Domain expires in fewer days than the threshold
 * - Domain is already expired (negative days)
 *
 * @example
 * ```ts
 * import { isExpiringSoon } from '@/lib/domains/utils'
 *
 * // Check with default 90-day threshold
 * if (isExpiringSoon(domain)) {
 *   console.log('Renewal required soon!')
 * }
 * ```
 *
 * @example
 * ```ts
 * // Custom threshold for urgent renewals
 * const urgent = isExpiringSoon(domain, 30)
 * const warning = isExpiringSoon(domain, 90)
 *
 * if (urgent) {
 *   console.log('🚨 URGENT: Renew within 30 days!')
 * } else if (warning) {
 *   console.log('⚠️ Renewal recommended')
 * }
 * ```
 *
 * @example
 * ```ts
 * // Filter domains needing renewal
 * const domains = DomainService.getAllDomains()
 * const needsRenewal = domains.filter(d => isExpiringSoon(d, 60))
 * console.log(`${needsRenewal.length} domains need renewal`)
 * ```
 *
 * @see {@link getDaysUntilExpiration} For exact day count
 * @category Domains
 * @public
 */
export function isExpiringSoon(domain: Domain, thresholdDays: number = 90): boolean {
  return getDaysUntilExpiration(domain) <= thresholdDays
}

/**
 * Formats a Date object to a human-readable string.
 *
 * @param date - Date object to format
 * @returns Formatted date string in "MMM DD, YYYY" format (e.g., "Jan 15, 2025")
 *
 * @remarks
 * Uses US locale formatting with abbreviated month names. The format is
 * consistent across the application for displaying domain-related dates.
 *
 * Output format: "Month Day, Year" where:
 * - Month: 3-letter abbreviation (Jan, Feb, Mar, etc.)
 * - Day: Numeric day of month
 * - Year: Full 4-digit year
 *
 * @example
 * ```ts
 * import { formatDate } from '@/lib/domains/utils'
 *
 * const date = new Date('2025-03-15')
 * console.log(formatDate(date)) // "Mar 15, 2025"
 * ```
 *
 * @example
 * ```ts
 * // Format expiration date for display
 * import { getExpirationDate, formatDate } from '@/lib/domains/utils'
 *
 * const expDate = getExpirationDate(domain)
 * const formatted = formatDate(expDate)
 * console.log(`Expires: ${formatted}`) // "Expires: Dec 31, 2026"
 * ```
 *
 * @example
 * ```ts
 * // Format all renewal dates
 * domain.renewals.forEach(renewal => {
 *   const date = formatDate(new Date(renewal.date))
 *   console.log(`${date}: ${renewal.years} year(s)`)
 * })
 * ```
 *
 * @category Domains
 * @public
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Generates a timeline of renewal events from domain renewal history.
 *
 * @param domain - Domain object with renewal records
 * @returns Array of timeline events with dates, types, and renewal periods
 *
 * @remarks
 * This function transforms the domain's renewal array into a structured
 * timeline suitable for visualization. Each event includes:
 *
 * - `date`: Date object of the renewal/registration
 * - `type`: 'registration' for first renewal, 'renewal' for subsequent ones
 * - `years`: Number of years renewed for that period
 *
 * The first renewal in the array is always treated as the initial registration.
 *
 * @example
 * ```ts
 * import { getRenewalTimeline } from '@/lib/domains/utils'
 *
 * const timeline = getRenewalTimeline(domain)
 * timeline.forEach(event => {
 *   console.log(`${event.type}: ${event.date} (${event.years}y)`)
 * })
 * // Output:
 * // registration: 2020-01-15 (2y)
 * // renewal: 2022-01-15 (3y)
 * // renewal: 2025-01-15 (1y)
 * ```
 *
 * @example
 * ```ts
 * // Build visual timeline
 * const timeline = getRenewalTimeline(domain)
 * const formatted = timeline.map(event => ({
 *   ...event,
 *   icon: event.type === 'registration' ? '🎯' : '🔄',
 *   label: `${formatDate(event.date)} - ${event.years} year(s)`
 * }))
 * ```
 *
 * @see {@link DomainTimelineEvent} For event type definition
 * @category Domains
 * @public
 */
export function getRenewalTimeline(domain: Domain): DomainTimelineEvent[] {
  return domain.renewals.map((renewal, index) => ({
    date: new Date(renewal.date),
    type: index === 0 ? 'registration' : 'renewal',
    years: renewal.years
  }))
}

/**
 * Extracts the top-level domain (TLD) from a domain name.
 *
 * @param domain - Domain object
 * @returns TLD including the dot (e.g., '.com', '.dev', '.co.uk')
 *
 * @remarks
 * This function extracts the TLD portion of the domain name, which includes
 * the dot separator. For complex TLDs like '.co.uk', only the final segment
 * is returned ('.uk').
 *
 * Uses {@link DomainService.enrichDomain} for consistent TLD extraction logic.
 *
 * @example
 * ```ts
 * import { getTLD } from '@/lib/domains/utils'
 *
 * const domain = { domain: 'example.com', ... }
 * console.log(getTLD(domain)) // ".com"
 * ```
 *
 * @example
 * ```ts
 * // Group domains by TLD
 * const domains = DomainService.getAllDomains()
 * const byTLD = domains.reduce((acc, d) => {
 *   const tld = getTLD(d)
 *   acc[tld] = (acc[tld] || 0) + 1
 *   return acc
 * }, {} as Record<string, number>)
 * console.log(byTLD) // { '.com': 15, '.dev': 3, '.io': 2 }
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @category Domains
 * @public
 */
export function getTLD(domain: Domain): string {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.tld
}

/**
 * Gets the next renewal date for a domain (alias for expiration date).
 *
 * @param domain - Domain object with renewal history
 * @returns Next renewal date (same as expiration date)
 *
 * @remarks
 * This function is a semantic alias for {@link getExpirationDate}. Both return
 * the same value - the date when the current renewal period ends and the domain
 * must be renewed to avoid expiration.
 *
 * Use this function when you want to emphasize the "renewal" aspect rather than
 * the "expiration" aspect of the date.
 *
 * @example
 * ```ts
 * import { getNextRenewalDate } from '@/lib/domains/utils'
 *
 * const renewalDate = getNextRenewalDate(domain)
 * console.log(`Next renewal: ${renewalDate}`) // "Next renewal: 2026-03-15..."
 * ```
 *
 * @example
 * ```ts
 * // Calculate time until next renewal
 * import { getNextRenewalDate, formatDate } from '@/lib/domains/utils'
 *
 * const nextRenewal = getNextRenewalDate(domain)
 * const daysUntil = Math.ceil((nextRenewal.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
 * console.log(`Renewal in ${daysUntil} days (${formatDate(nextRenewal)})`)
 * ```
 *
 * @see {@link DomainService.enrichDomain}
 * @see {@link getExpirationDate} For the same value with different semantics
 * @see {@link getDaysUntilExpiration} For days until renewal needed
 * @category Domains
 * @public
 */
export function getNextRenewalDate(domain: Domain): Date {
  const enriched = DomainService.enrichDomain(domain)
  return enriched.nextRenewalDate
}
