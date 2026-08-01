export interface CommitHistoryDay {
  date: string
  github: number
  forgejo: number
  total: number
}

export interface CommitHistoryData {
  status: 'complete' | 'partial' | 'error'
  days: CommitHistoryDay[]
  totalContributions: number
  githubContributions: number
  forgejoContributions: number
  message?: string
}
