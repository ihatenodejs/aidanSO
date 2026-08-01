import { NextResponse } from 'next/server'
import { NowPlayingService } from '@/lib/services'
import type { NowPlayingData } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const nowPlayingService = new NowPlayingService()

export async function GET(): Promise<NextResponse<NowPlayingData>> {
  return NextResponse.json(await nowPlayingService.fetchNowPlaying())
}
