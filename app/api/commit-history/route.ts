import { NextResponse } from 'next/server'
import { getCommitHistory } from '@/lib/services/commit-history.service'
import type { CommitHistoryData } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<CommitHistoryData>> {
  return NextResponse.json(await getCommitHistory())
}
