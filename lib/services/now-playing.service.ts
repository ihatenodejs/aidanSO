import type { LastFmImage, LastFmResponse, NowPlayingData } from '@/lib/types'

interface TrackMetadata {
  track_name: string
  artist_name: string
  release_name?: string
  mbid?: string
  additional_info?: {
    recording_mbid?: string
    artist_mbids?: string[]
    release_mbid?: string
  }
}

export class NowPlayingService {
  private readonly lastFmApiKey = process.env.LASTFM_API_KEY
  private cache: { data: NowPlayingData; timestamp: number } | null = null
  private readonly CACHE_TTL = 20000
  private readonly FETCH_TIMEOUT = 8000
  private pendingRequest: Promise<NowPlayingData> | null = null

  private async fetchWithTimeout(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT)

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }

  async fetchNowPlaying(): Promise<NowPlayingData> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.data
    }

    if (this.pendingRequest) {
      return this.pendingRequest
    }

    this.pendingRequest = this.performFetch()
    try {
      return await this.pendingRequest
    } finally {
      this.pendingRequest = null
    }
  }

  private async performFetch(): Promise<NowPlayingData> {
    try {
      const listenBrainzResponse = await this.fetchWithTimeout(
        'https://api.listenbrainz.org/1/user/p0ntus/playing-now',
        {
          headers: process.env.LISTENBRAINZ_TOKEN
            ? { Authorization: `Token ${process.env.LISTENBRAINZ_TOKEN}` }
            : {}
        }
      )

      if (!listenBrainzResponse.ok) {
        return {
          status: 'error',
          message: `ListenBrainz error: ${listenBrainzResponse.status}`
        }
      }

      const listenBrainzData = await listenBrainzResponse.json()

      if (listenBrainzData.payload.count === 0) {
        const result: NowPlayingData = {
          status: 'complete',
          message: 'No track currently playing'
        }
        this.cache = { data: result, timestamp: Date.now() }
        return result
      }

      const trackMetadata: TrackMetadata =
        listenBrainzData.payload.listens[0].track_metadata

      let lastFmData: LastFmResponse | null = null
      let lastFmCoverArt: string | null = null

      if (this.lastFmApiKey) {
        const lastFmQueries = []

        if (trackMetadata.additional_info?.recording_mbid) {
          lastFmQueries.push(
            this.fetchLastFmByMbid(trackMetadata.additional_info.recording_mbid)
          )
        }

        lastFmQueries.push(
          this.fetchLastFmByTrack(
            trackMetadata.artist_name,
            trackMetadata.track_name
          )
        )

        const lastFmResults = await Promise.allSettled(lastFmQueries)

        for (const result of lastFmResults) {
          if (result.status === 'fulfilled' && result.value) {
            lastFmData = result.value
            const images =
              lastFmData.album?.image ?? lastFmData.track?.album?.image
            const largeImage =
              images?.find(
                (image: LastFmImage) => image.size === 'extralarge'
              ) ??
              images?.find((image: LastFmImage) => image.size === 'large') ??
              images?.[images.length - 1]

            if (largeImage?.['#text'].trim()) {
              lastFmCoverArt = largeImage['#text']
            }
            break
          }
        }
      }

      let finalCoverArt = lastFmCoverArt

      if (!finalCoverArt) {
        if (trackMetadata.additional_info?.release_mbid) {
          try {
            const coverArtResponse = await this.fetchWithTimeout(
              `https://coverartarchive.org/release/${trackMetadata.additional_info.release_mbid}/front`
            )

            if (coverArtResponse.ok) {
              finalCoverArt = coverArtResponse.url
            }
          } catch (error) {
            console.log('[!] Cover Art Archive direct fetch failed:', error)
          }
        }

        if (
          !finalCoverArt &&
          trackMetadata.release_name &&
          trackMetadata.artist_name
        ) {
          try {
            const mbSearchResponse = await this.fetchWithTimeout(
              `https://musicbrainz.org/ws/2/release/?query=artist:${encodeURIComponent(
                trackMetadata.artist_name
              )}%20AND%20release:${encodeURIComponent(trackMetadata.release_name)}&fmt=json&limit=1`
            )

            if (mbSearchResponse.ok) {
              const mbData = await mbSearchResponse.json()

              if (mbData.releases && mbData.releases.length > 0) {
                const releaseMbid = mbData.releases[0].id

                try {
                  const coverArtResponse = await this.fetchWithTimeout(
                    `https://coverartarchive.org/release/${releaseMbid}/front`
                  )

                  if (coverArtResponse.ok) {
                    finalCoverArt = coverArtResponse.url
                  }
                } catch (error) {
                  console.log(
                    '[!] Cover Art Archive fallback fetch failed:',
                    error
                  )
                }
              }
            }
          } catch (error) {
            console.log('[!] MusicBrainz search failed:', error)
          }
        }
      }

      const result: NowPlayingData = {
        status: 'complete',
        track_name: trackMetadata.track_name,
        artist_name: trackMetadata.artist_name,
        release_name: trackMetadata.release_name,
        mbid: trackMetadata.additional_info?.release_mbid || trackMetadata.mbid,
        coverArt: finalCoverArt || null,
        lastFmData: lastFmData || undefined,
        message: 'Complete'
      }

      this.cache = { data: result, timestamp: Date.now() }
      return result
    } catch (error) {
      console.error('[!] Error in performFetch:', error)
      return {
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private async fetchLastFmByMbid(
    mbid: string
  ): Promise<LastFmResponse | null> {
    if (!this.lastFmApiKey) return null

    try {
      const response = await this.fetchWithTimeout(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfoByMbid&mbid=${mbid}&api_key=${this.lastFmApiKey}&format=json`
      )

      if (response.ok) {
        return (await response.json()) as LastFmResponse
      }
    } catch (error) {
      console.log('[!] Last.fm MBID fetch failed:', error)
    }

    return null
  }

  private async fetchLastFmByTrack(
    artist: string,
    track: string
  ): Promise<LastFmResponse | null> {
    if (!this.lastFmApiKey) return null

    try {
      const params = new URLSearchParams({
        method: 'track.getInfo',
        api_key: this.lastFmApiKey,
        artist,
        track,
        format: 'json',
        autocorrect: '1'
      })

      const response = await this.fetchWithTimeout(
        `https://ws.audioscrobbler.com/2.0/?${params}`
      )

      if (response.ok) {
        return (await response.json()) as LastFmResponse
      }
    } catch (error) {
      console.log('[!] Last.fm track fetch failed:', error)
    }

    return null
  }
}
