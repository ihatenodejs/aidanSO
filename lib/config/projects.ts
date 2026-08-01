import type { Project } from '@/lib/types/project'

/**
 * Unified project configuration combining domain and service data.
 *
 * @remarks
 * This configuration defines all domains in the portfolio along with their
 * service monitoring settings. Each project includes:
 * - Domain registration details (registrar, renewals, status)
 * - Service monitoring configuration (tracking status)
 *
 * URLs for service monitoring are auto-generated as `https://${domain}`.
 *
 * Projects with `serviceInfo.trackStatus: false` are excluded from status monitoring.
 * The top-level `usage` field takes precedence as the authoritative description.
 *
 * @example
 * ```ts
 * import { projects } from '@/lib/config/projects'
 *
 * // Get all projects
 * console.log(`Managing ${projects.length} projects`)
 *
 * // Filter by service category
 * const personalProjects = projects.filter(p => p.serviceCategory === 'personal')
 *
 * // Get actively monitored services
 * const monitored = projects.filter(p => p.serviceInfo.trackStatus)
 * ```
 *
 * @module lib/config/projects
 * @category Configuration
 * @public
 */

/**
 * Complete list of all projects and domains.
 *
 * @remarks
 * Combines domain portfolio data with service monitoring configuration.
 * Projects are organized by service category (personal/project) for status page display.
 *
 * @public
 */
export const projects: Project[] = [
  // Personal Domains
  {
    id: 'aidan-so',
    domain: 'aidan.so',
    serviceCategory: 'personal',
    usage: 'The home of my primary website',
    domainInfo: {
      registrar: 'Dynadot',
      autoRenew: false,
      status: 'active',
      category: 'personal',
      tags: ['homepage', 'nextjs'],
      renewals: [{ date: '2025-10-09', years: 1 }]
    },
    serviceInfo: {
      trackStatus: true
    }
  },
  {
    id: 'aidxn-cc',
    domain: 'aidxn.cc',
    serviceCategory: 'personal',
    usage: 'The old domain of my primary website',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'personal',
      tags: ['homepage', 'nextjs'],
      renewals: [{ date: '2025-01-04', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'disfunction-blog',
    domain: 'disfunction.blog',
    serviceCategory: 'personal',
    usage: "My blog's official home",
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'personal',
      tags: ['blog'],
      renewals: [{ date: '2025-02-02', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },

  // Project Domains
  {
    id: 'p0ntus-com',
    domain: 'p0ntus.com',
    serviceCategory: 'project',
    usage: 'Roblox account store',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'service',
      tags: ['store', 'services', 'nextjs'],
      renewals: [
        { date: '2024-11-14', years: 1 },
        { date: '2025-11-14', years: 1 }
      ]
    },
    serviceInfo: {
      trackStatus: true
    }
  },
  {
    id: 'git.p0ntus.com',
    domain: 'git.p0ntus.com',
    serviceCategory: 'project',
    usage: 'Self-hosted Forgejo',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'service',
      tags: ['git', 'services'],
      renewals: [
        { date: '2024-11-14', years: 1 },
        { date: '2025-11-14', years: 1 }
      ]
    },
    serviceInfo: {
      trackStatus: true
    }
  },
  {
    id: 'modules-lol',
    domain: 'modules.aidan.so',
    serviceCategory: 'project',
    usage: "An 'app store' of Magisk modules and FOSS Android apps",
    serviceInfo: {
      trackStatus: true
    }
  },
  {
    id: 'dontbeevil-lol',
    domain: 'dontbeevil.lol',
    serviceCategory: 'project',
    usage: 'A public Matrix homeserver',
    domainInfo: {
      registrar: 'Namecheap',
      autoRenew: false,
      status: 'active',
      category: 'project',
      tags: ['matrix', 'services', 'humor', 'vanity'],
      renewals: [{ date: '2025-01-08', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'kowalski-social',
    domain: 'kowalski.social',
    serviceCategory: 'project',
    usage: "The website for ABOCN's Kowalski project",
    domainInfo: {
      registrar: 'Name.com',
      autoRenew: true,
      status: 'active',
      category: 'project',
      tags: ['social', 'abocn'],
      renewals: [{ date: '2025-07-03', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'pontushost-com',
    domain: 'pontushost.com',
    serviceCategory: 'project',
    usage: 'My hosting provider project',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'service',
      tags: ['hosting', 'services'],
      renewals: [{ date: '2025-08-18', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'pontusmail-org',
    domain: 'pontusmail.org',
    serviceCategory: 'project',
    usage: 'An email domain for LibreCloud Mail',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'service',
      tags: ['email', 'services'],
      renewals: [{ date: '2025-12-17', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'ihate-college',
    domain: 'ihate.college',
    serviceCategory: 'project',
    usage: 'One of my domains used for LibreCloud Mail and services',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'active',
      category: 'project',
      tags: ['email', 'humor', 'vanity'],
      renewals: [{ date: '2025-01-05', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'copyparty',
    domain: 'files.aidan.so',
    serviceCategory: 'personal',
    usage: 'My public deployment of Copyparty',
    serviceInfo: {
      trackStatus: true
    }
  },

  // Reserved/Inactive Projects
  {
    id: 'pontus-pics',
    domain: 'pontus.pics',
    serviceCategory: 'project',
    usage: 'An unused domain for an upcoming image hosting service',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'reserved',
      category: 'project',
      tags: ['images', 'hosting', 'future'],
      renewals: [{ date: '2024-12-17', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'wikitools-cloud',
    domain: 'wikitools.cloud',
    serviceCategory: 'project',
    usage: 'Unused (for now!)',
    domainInfo: {
      registrar: 'Namecheap',
      autoRenew: false,
      status: 'reserved',
      category: 'project',
      tags: ['tools', 'wiki', 'future'],
      renewals: [{ date: '2025-01-04', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'androidintegrity-org',
    domain: 'androidintegrity.org',
    serviceCategory: 'project',
    usage: 'A project to fix Play Integrity',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'reserved',
      category: 'project',
      tags: ['android', 'open-source'],
      renewals: [{ date: '2024-11-24', years: 3 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },

  // Legacy/Parked Domains
  {
    id: 'librecloud-cc',
    domain: 'librecloud.cc',
    serviceCategory: 'project',
    usage: 'My old cloud services provider project',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'parked',
      category: 'legacy',
      tags: ['cloud', 'services'],
      renewals: [{ date: '2025-02-02', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'dont-be-evil-lol',
    domain: 'dont-be-evil.lol',
    serviceCategory: 'project',
    usage: 'A domain for LibreCloud Mail',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'parked',
      category: 'fun',
      tags: ['email', 'humor', 'vanity'],
      renewals: [{ date: '2025-01-08', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'strongintegrity-life',
    domain: 'strongintegrity.life',
    serviceCategory: 'project',
    usage: 'A domain used for LibreCloud Mail',
    domainInfo: {
      registrar: 'Spaceship',
      autoRenew: false,
      status: 'reserved',
      category: 'fun',
      tags: ['email', 'humor', 'android'],
      renewals: [{ date: '2025-01-08', years: 1 }]
    },
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'auth.librecloud.cc',
    domain: 'auth.librecloud.cc',
    serviceCategory: 'project',
    serviceInfo: {
      trackStatus: false
    }
  },
  {
    id: 'pass.librecloud.cc',
    domain: 'pass.librecloud.cc',
    serviceCategory: 'project',
    serviceInfo: {
      // Tracking is not accurate at the moment
      trackStatus: false
    }
  }
]
