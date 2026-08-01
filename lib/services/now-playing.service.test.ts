import { afterEach, describe, expect, it, mock } from 'bun:test'
import { NowPlayingService } from './now-playing.service'

const originalFetch = globalThis.fetch
const originalLastFmApiKey = process.env.LASTFM_API_KEY

const playingNowResponse = () =>
  new Response(
    JSON.stringify({
      payload: {
        count: 1,
        listens: [
          {
            track_metadata: {
              track_name: 'Teardrop',
              artist_name: 'Massive Attack'
            }
          }
        ]
      }
    }),
    { status: 200 }
  )

afterEach(() => {
  globalThis.fetch = originalFetch

  if (originalLastFmApiKey === undefined) {
    delete process.env.LASTFM_API_KEY
  } else {
    process.env.LASTFM_API_KEY = originalLastFmApiKey
  }
})
describe('NowPlayingService', () => {
  it('deduplicates concurrent acquisitions and serves the cached payload', async () => {
    delete process.env.LASTFM_API_KEY
    const fetchMock = mock(() => Promise.resolve(playingNowResponse()))
    globalThis.fetch = Object.assign(fetchMock, originalFetch)
    const service = new NowPlayingService()

    const [first, second] = await Promise.all([
      service.fetchNowPlaying(),
      service.fetchNowPlaying()
    ])
    const cached = await service.fetchNowPlaying()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first).toEqual({
      status: 'complete',
      track_name: 'Teardrop',
      artist_name: 'Massive Attack',
      coverArt: null,
      message: 'Complete'
    })
    expect(second).toEqual(first)
    expect(cached).toEqual(first)
  })

  it('returns a timeout payload when an upstream request is aborted', async () => {
    delete process.env.LASTFM_API_KEY
    globalThis.fetch = Object.assign(
      mock(() =>
        Promise.reject(
          new DOMException('The operation was aborted.', 'AbortError')
        )
      ),
      originalFetch
    )
    const service = new NowPlayingService()

    await expect(service.fetchNowPlaying()).resolves.toEqual({
      status: 'error',
      message: 'Request timeout'
    })
  })
})
