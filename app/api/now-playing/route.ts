import { NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'

export const runtime = 'edge'

/**
 * Fetch currently playing music from ListenBrainz
 *
 * Returns the most recent listening data for the configured user.
 * Requires LISTENBRAINZ_TOKEN environment variable to be set.
 *
 * @returns {Promise<NextResponse>} ListenBrainz listening data with track metadata
 *
 * @example
 * // Response structure
 * {
 *   payload: {
 *     count: 1,
 *     listens: [{
 *       playing_now: true,
 *       track_metadata: {
 *         artist_name: "Daft Punk",
 *         track_name: "Get Lucky",
 *         release_name: "Random Access Memories"
 *       }
 *     }]
 *   }
 * }
 *
 * @category API
 */
export async function GET() {
  try {
    const response = await fetch(
      'https://api.listenbrainz.org/1/user/p0ntus/playing-now',
      {
        headers: {
          Authorization: `Token ${process.env.LISTENBRAINZ_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching now playing', 'NowPlayingAPI', error)
    return NextResponse.json(
      { error: 'Failed to fetch now playing data' },
      { status: 500 }
    )
  }
}
