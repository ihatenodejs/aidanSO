export interface FeaturedRepoConfig {
  id: number
  owner: string
  repo: string
  description: string
  platform: 'github' | 'forgejo'
  forgejoUrl?: string // Base URL for Forgejo instance
}

export const featuredRepos: FeaturedRepoConfig[] = [
  {
    id: 1,
    owner: 'aidan',
    repo: 'aidxnCC',
    description: 'aidxnCC is the third version of my personal website',
    platform: 'forgejo',
    forgejoUrl: 'git.p0ntus.com',
  },
  {
    id: 2,
    owner: 'abocn',
    repo: 'TelegramBot',
    description: 'Landing page for p0ntus mail',
    platform: 'github',
  },
  {
    id: 3,
    owner: 'abocn',
    repo: 'modules',
    description: 'A Magisk/KernelSU module repository',
    platform: 'github',
  },
  {
    id: 4,
    owner: 'pontus',
    repo: 'pontus-front',
    description: 'The frontend and API for p0ntus, my free privacy-focused service provider',
    platform: 'forgejo',
    forgejoUrl: 'git.p0ntus.com',
  },
]