/**
 * Project and domain type definitions.
 *
 * @module lib/types/project
 * @category Types
 * @public
 */

import type { DomainStatus, DomainCategory, DomainRegistrarId } from './domain'

/**
 * Domain renewal record tracking renewal history.
 *
 * @example
 * ```ts
 * const renewal: Renewal = {
 *   date: '2024-01-15',
 *   years: 2
 * }
 * ```
 *
 * @public
 */
export interface Renewal {
  /** ISO date string of renewal (YYYY-MM-DD format) */
  date: string

  /** Number of years renewed */
  years: number
}

/**
 * Domain-specific information for a project.
 *
 * @remarks
 * Contains all domain registration and management details including
 * registrar, renewal history, status, and categorization.
 *
 * @public
 */
export interface ProjectDomainInfo {
  /** Description of domain usage/purpose */
  usage: string

  /** Registrar where domain is registered */
  registrar: DomainRegistrarId

  /** Whether auto-renewal is enabled */
  autoRenew: boolean

  /** Current status of the domain */
  status: DomainStatus

  /** Portfolio category for organization */
  category: DomainCategory

  /** Tags for filtering and search */
  tags: string[]

  /** Renewal history (chronological order) */
  renewals: Renewal[]
}

/**
 * Service monitoring configuration for a project.
 *
 * @remarks
 * Defines if a project should be monitored for availability.
 * Services with `trackStatus: false` are hidden from status monitoring.
 * The URL is auto-generated as `https://${domain}` for all projects.
 *
 * @public
 */
export interface ProjectServiceInfo {
  /** Whether this service should be actively monitored on the status page */
  trackStatus: boolean
}

/**
 * Service category for status page organization.
 *
 * @remarks
 * - `personal`: Personal domains and services (portfolio, profiles, etc.)
 * - `project`: Project domains and applications (tools, services, etc.)
 *
 * @public
 */
export type ServiceCategory = 'personal' | 'project'

/**
 * Complete project data structure combining domain and service information.
 *
 * @remarks
 * This is the unified data model that replaces the separate MonitoredService
 * and Domain interfaces. Each project represents a domain with optional
 * service monitoring capabilities.
 *
 * @example
 * ```ts
 * const project: Project = {
 *   id: 'aidan-so',
 *   domain: 'aidan.so',
 *   serviceCategory: 'personal',
 *   domainInfo: {
 *     usage: 'Primary portfolio website',
 *     registrar: 'Dynadot',
 *     autoRenew: false,
 *     status: 'active',
 *     category: 'personal',
 *     tags: ['homepage', 'nextjs'],
 *     renewals: [{ date: '2025-10-09', years: 1 }]
 *   },
 *   serviceInfo: {
 *     trackStatus: true
 *   }
 * }
 * ```
 *
 * @public
 */
export interface Project {
  /** Unique identifier for the project (kebab-case) */
  id: string

  /** Domain name (e.g., 'example.com') */
  domain: string

  /** Service category for status page organization */
  serviceCategory: ServiceCategory

  /** Domain registration and management details (optional - if null, excluded from domains page) */
  domainInfo?: ProjectDomainInfo

  /** Service monitoring configuration */
  serviceInfo: ProjectServiceInfo
}
