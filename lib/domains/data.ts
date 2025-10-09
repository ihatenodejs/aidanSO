import { SiNamecheap, SiSpaceship } from 'react-icons/si'
import NameIcon from '@/components/icons/NameIcon'
import DynadotIcon from '@/components/icons/DynadotIcon'
import { RegistrarConfig, Domain } from '@/lib/types'

export const registrars: Record<string, RegistrarConfig> = {
  'Spaceship': {
    name: 'Spaceship',
    icon: SiSpaceship,
    color: 'text-white'
  },
  'Namecheap': {
    name: 'Namecheap',
    icon: SiNamecheap,
    color: 'text-orange-400'
  },
  'Name.com': {
    name: 'Name.com',
    icon: NameIcon,
    color: 'text-green-300'
  },
  'Dynadot': {
    name: 'Dynadot',
    icon: DynadotIcon,
    color: 'text-blue-400'
  },
}

export const domains: Domain[] = [
  {
    domain: "aidan.so",
    usage: "The home of my primary website",
    registrar: "Dynadot",
    autoRenew: false,
    status: "active",
    category: "personal",
    tags: ["homepage", "nextjs"],
    renewals: [
      { date: "2025-10-09", years: 1 }
    ]
  },
  {
    domain: "aidxn.cc",
    usage: "The old domain of my primary website",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "personal",
    tags: ["homepage", "nextjs"],
    renewals: [
      { date: "2025-01-04", years: 1 }
    ]
  },
  {
    domain: "pontushost.com",
    usage: "My hosting provider project",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "service",
    tags: ["hosting", "services"],
    renewals: [
      { date: "2025-08-18", years: 1 }
    ]
  },
  {
    domain: "disfunction.blog",
    usage: "My blog's official home",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "personal",
    tags: ["blog"],
    renewals: [
      { date: "2025-02-02", years: 1 }
    ]
  },
  {
    domain: "androidintegrity.org",
    usage: "A project to fix Play Integrity",
    registrar: "Spaceship",
    autoRenew: false,
    status: "reserved",
    category: "project",
    tags: ["android", "open-source"],
    renewals: [
      { date: "2024-11-24", years: 3 },
    ]
  },
  {
    domain: "librecloud.cc",
    usage: "My old cloud services provider project",
    registrar: "Spaceship",
    autoRenew: false,
    status: "parked",
    category: "legacy",
    tags: ["cloud", "services"],
    renewals: [
      { date: "2025-02-02", years: 1 }
    ]
  },
  {
    domain: "ihate.college",
    usage: "One of my fun domains, used for p0ntus mail and services",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "project",
    tags: ["email", "humor", "vanity"],
    renewals: [
      { date: "2025-01-05", years: 1 },
    ]
  },
  {
    domain: "pontus.pics",
    usage: "An unused domain for an upcoming image hosting service",
    registrar: "Spaceship",
    autoRenew: false,
    status: "reserved",
    category: "project",
    tags: ["images", "hosting", "future"],
    renewals: [
      { date: "2024-12-17", years: 1 }
    ]
  },
  {
    domain: "p0ntus.com",
    usage: "My active cloud services project",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "service",
    tags: ["cloud", "services"],
    renewals: [
      { date: "2024-11-14", years: 1 }
    ]
  },
  {
    domain: "modules.lol",
    usage: "An 'app store' of Magisk modules and FOSS Android apps",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "project",
    tags: ["android", "apps", "open-source"],
    renewals: [
      { date: "2024-12-17", years: 1 }
    ]
  },
  {
    domain: "dontbeevil.lol",
    usage: "A public Matrix homeserver",
    registrar: "Namecheap",
    autoRenew: false,
    status: "active",
    category: "project",
    tags: ["matrix", "services", "humor", "vanity"],
    renewals: [
      { date: "2025-01-08", years: 1 },
    ]
  },
  {
    domain: "wikitools.cloud",
    usage: "Unused (for now!)",
    registrar: "Namecheap",
    autoRenew: false,
    status: "reserved",
    category: "project",
    tags: ["tools", "wiki", "future"],
    renewals: [
      { date: "2025-01-04", years: 1 }
    ]
  },
  {
    domain: "dont-be-evil.lol",
    usage: "A joke domain for p0ntus mail",
    registrar: "Spaceship",
    autoRenew: false,
    status: "parked",
    category: "fun",
    tags: ["email", "humor", "vanity"],
    renewals: [
      { date: "2025-01-08", years: 1 }
    ]
  },
  {
    domain: "pontusmail.org",
    usage: "An email domain for p0ntus Mail",
    registrar: "Spaceship",
    autoRenew: false,
    status: "active",
    category: "service",
    tags: ["email", "services"],
    renewals: [
      { date: "2025-12-17", years: 1 }
    ]
  },
  {
    domain: "strongintegrity.life",
    usage: "A Play Integrity meme domain used for p0ntus mail (now inactive)",
    registrar: "Spaceship",
    autoRenew: false,
    status: "reserved",
    category: "fun",
    tags: ["email", "humor", "android"],
    renewals: [
      { date: "2025-01-08", years: 1 }
    ]
  },
  {
    domain: "kowalski.social",
    usage: "A domain for ABOCN's Kowalski project",
    registrar: "Name.com",
    autoRenew: true,
    status: "active",
    category: "project",
    tags: ["social", "abocn"],
    renewals: [
      { date: "2025-07-03", years: 1 }
    ]
  }
]
