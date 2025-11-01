export interface CheckContext {
  repoRoot: string
}

export interface CheckResult {
  id: string
  ok: boolean
  messages: string[]
}

export interface CheckDefinition {
  id: string
  description: string
  run(context: CheckContext): Promise<CheckResult>
}

export type CheckModule = {
  checks: CheckDefinition[]
}
