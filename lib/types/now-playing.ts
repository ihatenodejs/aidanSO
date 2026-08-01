export interface LastFmImage {
  size: string
  '#text': string
}

export interface LastFmAlbum {
  image?: LastFmImage[]
}

export interface LastFmTrack {
  album?: LastFmAlbum
}

export interface LastFmResponse {
  album?: LastFmAlbum
  track?: LastFmTrack
}

export interface NowPlayingData {
  track_name?: string
  artist_name?: string
  release_name?: string
  mbid?: string
  coverArt?: string | null
  lastFmData?: LastFmResponse
  status: 'loading' | 'partial' | 'complete' | 'error'
  message?: string
}
