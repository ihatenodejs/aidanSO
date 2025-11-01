export interface FeaturedRepoConfig {
  id: number
  owner: string
  repo: string
  description: string
  platform: 'github' | 'forgejo'
  forgejoUrl?: string // Base URL for Forgejo instance
  url?: string // Optional website URL
  npm?: string // Optional NPM package name
}

export const featuredRepos: FeaturedRepoConfig[] = [
  {
    id: 1,
    owner: 'ihatenodejs',
    repo: 'librecloud-web',
    description:
      'LibreCloud is a free, open-source, and privacy-focused cloud service provider',
    platform: 'github'
  },
  {
    id: 2,
    owner: 'abocn',
    repo: 'TelegramBot',
    description: 'An extendable Telegram bot written in TypeScript.',
    platform: 'github',
    url: 'https://kowalski.social'
  },
  {
    id: 3,
    owner: 'abocn',
    repo: 'modules',
    description: 'A Magisk/KernelSU module repository',
    platform: 'github',
    url: 'https://modules.lol'
  },
  {
    id: 4,
    owner: 'ihatenodejs',
    repo: 'agent-exporter',
    description: 'Export usage statistics from various agents.',
    platform: 'github',
    npm: 'agent-exporter'
  }
]
