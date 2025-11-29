import { NextResponse } from 'next/server'
import { StatusService } from '@/lib/services'
import { logger } from '@/lib/utils/logger'

export const runtime = 'edge'
export const revalidate = 60 // in seconds

/**
 * API endpoint for checking system status.
 *
 * @remarks
 * Returns the operational status of all monitored domains and services.
 * Performs parallel HTTP checks on all configured services and returns
 * a comprehensive status report.
 *
 * Response includes:
 * - Overall system health (operational/partial_outage/full_outage)
 * - Individual service statuses with server response times (client-side responseTime defaults to null)
 * - Summary statistics
 * - Timestamp of the check
 *
 * Uses Edge Runtime for optimal performance and global distribution.
 * Results are cached for 60 seconds to reduce load.
 *
 * @returns {Promise<NextResponse>} Status report JSON
 *
 * @example
 * // Response structure
 * {
 *   overallHealth: "operational",
 *   services: [
 *     {
 *       service: {
 *         id: "aidan-so",
 *         name: "aidan.so",
 *         description: "Main portfolio website",
 *         url: "https://aidan.so",
 *         category: "personal",
 *         active: true
 *       },
 *       status: "operational",
 *       statusCode: 200,
 *       responseTime: null,
 *       serverResponseTime: 82,
 *       error: null,
 *       checkedAt: "2025-10-09T12:00:00.000Z"
 *     }
 *   ],
 *   stats: {
 *     total: 4,
 *     operational: 4,
 *     down: 0,
 *     checking: 0
 *   },
 *   checkedAt: "2025-10-09T12:00:00.000Z"
 * }
 *
 * @category API
 * @public
 */
export async function GET() {
  try {
    const report = await StatusService.checkAllServicesFromServer()

    return NextResponse.json(report, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    logger.error('Error checking service status', 'StatusAPI', error)

    return NextResponse.json(
      {
        error: 'Failed to check service status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
