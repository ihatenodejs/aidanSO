'use client'

import { useMemo, useEffect, useState, useRef } from 'react'
import PageShell from '@/components/layout/PageShell'
import PageHeader from '@/components/objects/PageHeader'
import { Card } from '@/components/ui/Card'
import { Activity } from 'lucide-react'
import StatusOverview from './StatusOverview'
import MetricsOverview from './MetricsOverview'
import ServiceMonitor from './ServiceMonitor'
import type {
  ErrorType,
  ServiceStatusResult,
  StatusReport
} from '@/lib/types/status'

type SerializedServiceStatusResult = Omit<ServiceStatusResult, 'checkedAt'> & {
  checkedAt: string
}

export type SerializedStatusReport = Omit<
  StatusReport,
  'services' | 'checkedAt'
> & {
  services: SerializedServiceStatusResult[]
  checkedAt: string
}

type BrowserLatencyMeasurement = {
  projectId: string
  responseTime: number | null
  outcome: 'success' | 'timeout' | 'network'
}

interface StatusPageClientProps {
  report: SerializedStatusReport
  avgResponseTime: number
}

export default function StatusPageClient({
  report: initialReport,
  avgResponseTime: initialAvgResponseTime
}: StatusPageClientProps) {
  const [serverReport, setServerReport] =
    useState<SerializedStatusReport>(initialReport)
  const [clientMeasuredServices, setClientMeasuredServices] = useState<
    ServiceStatusResult[]
  >([])
  const [avgResponseTime, setAvgResponseTime] = useState(initialAvgResponseTime)
  const [isChecking, setIsChecking] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(
    new Date(initialReport.checkedAt)
  )
  const isCheckingRef = useRef(false)
  const serverReportRef = useRef(serverReport)

  useEffect(() => {
    serverReportRef.current = serverReport
  }, [serverReport])

  const hydratedReport = useMemo<StatusReport>(() => {
    const services = serverReport.services.map((service) => ({
      ...service,
      checkedAt: new Date(service.checkedAt)
    }))

    return {
      ...serverReport,
      checkedAt: new Date(serverReport.checkedAt),
      services
    }
  }, [serverReport])

  useEffect(() => {
    const measureClientResponseTimes = async () => {
      if (isCheckingRef.current) return
      isCheckingRef.current = true
      setIsChecking(true)

      try {
        const currentServices: ServiceStatusResult[] =
          serverReportRef.current.services.map((service) => ({
            ...service,
            checkedAt: new Date(service.checkedAt)
          }))

        const measureBrowserLatency = async (
          service: ServiceStatusResult
        ): Promise<BrowserLatencyMeasurement> => {
          const controller = new AbortController()
          const startTime = Date.now()
          const timeoutId = setTimeout(() => controller.abort(), 10000)

          try {
            await fetch(`https://${service.project.domain}`, {
              method: 'HEAD',
              mode: 'no-cors',
              signal: controller.signal,
              cache: 'no-cache'
            })

            const responseTime = Date.now() - startTime

            return {
              projectId: service.project.id,
              responseTime,
              outcome: 'success'
            }
          } catch (error) {
            const isTimeout =
              error instanceof Error && error.name === 'AbortError'

            return {
              projectId: service.project.id,
              responseTime: null,
              outcome: isTimeout ? 'timeout' : 'network'
            }
          } finally {
            clearTimeout(timeoutId)
          }
        }

        const [serverResponse, latencyMeasurements] = await Promise.all([
          fetch('/api/status', { cache: 'no-cache' }),
          Promise.all(
            currentServices.map((service) => measureBrowserLatency(service))
          )
        ])

        let authoritativeServices = currentServices

        if (serverResponse.ok) {
          const freshServerData: StatusReport = await serverResponse.json()
          const normalizedServices: ServiceStatusResult[] =
            freshServerData.services.map((service) => ({
              ...service,
              checkedAt: new Date(service.checkedAt)
            }))

          authoritativeServices = normalizedServices

          const serializedData: SerializedStatusReport = {
            ...freshServerData,
            services: freshServerData.services.map((s) => ({
              ...s,
              checkedAt:
                typeof s.checkedAt === 'string'
                  ? s.checkedAt
                  : new Date(s.checkedAt).toISOString()
            })),
            checkedAt:
              typeof freshServerData.checkedAt === 'string'
                ? freshServerData.checkedAt
                : new Date(freshServerData.checkedAt).toISOString()
          }
          setServerReport(serializedData)

          const responseTimes = normalizedServices
            .map((s) => s.serverResponseTime)
            .filter((time): time is number => time !== null)
          const newAvgResponseTime =
            responseTimes.length > 0
              ? Math.round(
                  responseTimes.reduce((sum, time) => sum + time, 0) /
                    responseTimes.length
                )
              : 0
          setAvgResponseTime(newAvgResponseTime)
        }

        const measurementMap = new Map(
          latencyMeasurements.map((measurement) => [
            measurement.projectId,
            measurement
          ])
        )

        const now = new Date()
        const reconciledClientServices: ServiceStatusResult[] =
          authoritativeServices.map((service): ServiceStatusResult => {
            const measurement = measurementMap.get(service.project.id)

            if (!measurement) {
              return {
                ...service,
                responseTime: null,
                checkedAt: now
              }
            }

            if (measurement.outcome === 'success') {
              if (service.status === 'operational') {
                return {
                  ...service,
                  responseTime: measurement.responseTime,
                  error: null,
                  errorType: null,
                  checkedAt: now
                }
              }

              return {
                ...service,
                responseTime: null,
                checkedAt: now
              }
            }

            const isTimeout = measurement.outcome === 'timeout'
            const errorType: ErrorType = isTimeout ? 'timeout' : 'network'
            const errorMessage = isTimeout
              ? 'Browser request timeout'
              : 'Browser network error'

            return {
              ...service,
              status: 'down',
              statusCode: service.status === 'down' ? service.statusCode : null,
              responseTime: null,
              error: errorMessage,
              errorType,
              checkedAt: now
            }
          })

        setClientMeasuredServices(reconciledClientServices)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error updating status data:', error)
      } finally {
        isCheckingRef.current = false
        setIsChecking(false)
      }
    }

    measureClientResponseTimes()

    const interval = setInterval(() => {
      measureClientResponseTimes()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const servicesWithBothMeasurements = useMemo(() => {
    if (clientMeasuredServices.length === 0) {
      return hydratedReport.services
    }

    return hydratedReport.services.map((service) => {
      const clientMeasured = clientMeasuredServices.find(
        (s) => s.project.id === service.project.id
      )

      return clientMeasured ?? service
    })
  }, [hydratedReport.services, clientMeasuredServices])

  return (
    <PageShell variant="full-width" className="space-y-4">
      <div className="my-12 text-center">
        <PageHeader
          icon={<Activity size={60} className="text-gray-300" />}
          title="Status"
        />
      </div>

      <StatusOverview
        health={hydratedReport.overallHealth}
        checkedAt={hydratedReport.checkedAt}
        lastUpdated={lastUpdated}
      />

      <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card className="p-0">
            <MetricsOverview
              services={servicesWithBothMeasurements}
              stats={hydratedReport.stats}
              avgResponseTime={avgResponseTime}
              isChecking={isChecking}
            />
          </Card>
        </div>

        <Card className="p-8">
          <ServiceMonitor services={servicesWithBothMeasurements} />
        </Card>
      </div>
    </PageShell>
  )
}
