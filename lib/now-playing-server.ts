import { Server as SocketServer } from 'socket.io'

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

interface LastFmImage {
  size: string
  '#text': string
}

interface LastFmAlbum {
  image?: LastFmImage[]
}

interface LastFmTrack {
  album?: LastFmAlbum
}

interface LastFmResponse {
  album?: LastFmAlbum
  track?: LastFmTrack
}

interface NowPlayingData {
  track_name?: string
  artist_name?: string
  release_name?: string
  mbid?: string
  coverArt?: string | null
  lastFmData?: LastFmResponse
  status: 'loading' | 'partial' | 'complete' | 'error'
  message?: string
}

export class NowPlayingService {
  private readonly io: SocketServer
  private readonly lastFmApiKey: string | undefined
  private cache: { data: NowPlayingData; timestamp: number } | null = null
  private readonly CACHE_TTL = 20000 // 20 seconds cache
  private readonly FETCH_TIMEOUT = 8000 // 8 seconds timeout
  private pendingRequest: Promise<void> | null = null

  constructor(io: SocketServer) {
    this.io = io
    this.lastFmApiKey = process.env.LASTFM_API_KEY
  }

  /**
   * Fetch with timeout wrapper
   */
  private async fetchWithTimeout(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeout)
      return response
    } catch (error) {
      clearTimeout(timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  async fetchNowPlaying(socketId: string) {
    const emit = (data: Partial<NowPlayingData>) => {
      this.io.to(socketId).emit('nowPlaying', data)
    }

    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      emit(this.cache.data)
      return
    }

    // Request deduplication: if a request is already in progress, wait for it
    if (this.pendingRequest) {
      await this.pendingRequest
      // After the pending request completes, send the cached result
      if (this.cache) {
        emit(this.cache.data)
      }
      return
    }

    // Start new request
    this.pendingRequest = this.performFetch(socketId)
    try {
      await this.pendingRequest
    } finally {
      this.pendingRequest = null
    }
  }

  private async performFetch(socketId: string) {
    const emit = (data: Partial<NowPlayingData>) => {
      this.io.to(socketId).emit('nowPlaying', data)
    }

    try {
      emit({ status: 'loading', message: 'Fetching from ListenBrainz...' })

      const listenBrainzResponse = await this.fetchWithTimeout(
        'https://api.listenbrainz.org/1/user/p0ntus/playing-now',
        {
          headers: process.env.LISTENBRAINZ_TOKEN
            ? { Authorization: `Token ${process.env.LISTENBRAINZ_TOKEN}` }
            : {}
        }
      )

      if (!listenBrainzResponse.ok) {
        emit({
          status: 'error',
          message: `ListenBrainz error: ${listenBrainzResponse.status}`
        })
        return
      }

      const listenBrainzData = await listenBrainzResponse.json()

      if (listenBrainzData.payload.count === 0) {
        const result: NowPlayingData = {
          status: 'complete',
          message: 'No track currently playing'
        }
        this.cache = { data: result, timestamp: Date.now() }
        emit(result)
        return
      }

      const trackMetadata: TrackMetadata =
        listenBrainzData.payload.listens[0].track_metadata

      emit({
        status: 'partial',
        track_name: trackMetadata.track_name,
        artist_name: trackMetadata.artist_name,
        release_name: trackMetadata.release_name,
        mbid: trackMetadata.additional_info?.release_mbid,
        message: 'Fetching additional info...'
      })

      // Try to get data from Last.fm if MBID
      let lastFmData: LastFmResponse | null = null
      let lastFmCoverArt: string | null = null

      if (this.lastFmApiKey) {
        emit({ status: 'partial', message: 'Fetching from Last.fm...' })

        const lastFmQueries = []

        // Try with MBID if available
        if (trackMetadata.additional_info?.recording_mbid) {
          lastFmQueries.push(
            this.fetchLastFmByMbid(trackMetadata.additional_info.recording_mbid)
          )
        }

        // Also try with track and artist name
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
            // Extract cover
            if (lastFmData.album?.image) {
              const images = lastFmData.album.image
              const largeImage =
                images.find((img: LastFmImage) => img.size === 'extralarge') ||
                images.find((img: LastFmImage) => img.size === 'large') ||
                images[images.length - 1]
              if (
                largeImage &&
                largeImage['#text'] &&
                largeImage['#text'].trim() !== ''
              ) {
                lastFmCoverArt = largeImage['#text']
              }
            } else if (lastFmData.track?.album?.image) {
              const images = lastFmData.track.album.image
              const largeImage =
                images.find((img: LastFmImage) => img.size === 'extralarge') ||
                images.find((img: LastFmImage) => img.size === 'large') ||
                images[images.length - 1]
              if (
                largeImage &&
                largeImage['#text'] &&
                largeImage['#text'].trim() !== ''
              ) {
                lastFmCoverArt = largeImage['#text']
              }
            }
            break
          }
        }
      }

      // Get album art
      let finalCoverArt = lastFmCoverArt

      if (!finalCoverArt) {
        if (trackMetadata.additional_info?.release_mbid) {
          emit({
            status: 'partial',
            message: 'Fetching from Cover Art Archive...'
          })

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
          emit({
            status: 'partial',
            message: 'Searching MusicBrainz for album art...'
          })

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

      // Cache successful result
      this.cache = { data: result, timestamp: Date.now() }
      emit(result)
    } catch (error) {
      console.error('[!] Error in performFetch:', error)
      const errorResult: NowPlayingData = {
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred'
      }
      emit(errorResult)
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
        artist: artist,
        track: track,
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
