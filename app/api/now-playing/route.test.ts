import { describe, expect, it, mock } from 'bun:test'
import type { NowPlayingData } from '@/lib/types'

let payload: NowPlayingData = {
  status: 'complete',
  track_name: 'Teardrop',
  artist_name: 'Massive Attack',
  coverArt: null,
  message: 'Complete'
}

mock.module('@/lib/services/now-playing.service', () => ({
  NowPlayingService: class {
    fetchNowPlaying = mock(() => Promise.resolve(payload))
  }
}))
// The route must load after its module-level service dependency is mocked.

const { GET } = await import('./route')

describe('GET /api/now-playing', () => {
  it('returns the complete widget payload', async () => {
    payload = {
      status: 'complete',
      track_name: 'Teardrop',
      artist_name: 'Massive Attack',
      coverArt: null,
      message: 'Complete'
    }

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(payload)
  })

  it('keeps recoverable upstream errors as HTTP 200 payloads', async () => {
    payload = { status: 'error', message: 'Request timeout' }

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(payload)
  })
})
