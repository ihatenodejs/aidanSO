import { StatusService } from '@/lib/services'
import StatusPageClient, {
  type SerializedStatusReport
} from './components/StatusPageClient'

/**
 * Status Page
 *
 * @remarks
 * Server-side rendered dashboard with real-time status checks.
 * Displays current system health, service metrics, response times, and detailed service grid.
 * Loading state handled by loading.tsx for Suspense boundary.
 */
export default async function StatusPage() {
  const report = await StatusService.checkAllServicesFromServer()

  const responseTimes = report.services
    .map((s) => s.serverResponseTime)
    .filter((time): time is number => time !== null)
  const avgResponseTime =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length
        )
      : 0

  const serializedReport: SerializedStatusReport = {
    overallHealth: report.overallHealth,
    services: report.services.map((service) => ({
      ...service,
      checkedAt: service.checkedAt.toISOString()
    })),
    stats: report.stats,
    checkedAt: report.checkedAt.toISOString()
  }

  return (
    <StatusPageClient
      report={serializedReport}
      avgResponseTime={avgResponseTime}
    />
  )
}
