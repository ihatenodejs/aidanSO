'use client'

import { surfaces, cn, colors } from '@/lib/theme'
import { Code, Zap } from 'lucide-react'

export default function StatusAPIDoc() {
  return (
    <div className="space-y-4 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div
          className="rounded-lg p-2"
          style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}
        >
          <Code size={20} style={{ color: colors.accents.link }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl">
            Status API
          </h2>
          <p className="text-xs text-gray-400">
            Query service status programmatically
          </p>
        </div>
      </div>

      <div className={cn(surfaces.card.simple, 'p-4')}>
        <div className="mb-2 flex items-center gap-2">
          <Zap size={14} className="text-gray-400" />
          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            Endpoint
          </span>
        </div>
        <div className="rounded-md bg-gray-950/50 px-3 py-2 font-mono text-sm">
          <span className="text-green-400">GET</span>{' '}
          <span className="text-gray-300">/api/status</span>
        </div>
      </div>

      <div className={cn(surfaces.card.simple, 'p-4')}>
        <div className="mb-3 flex items-center gap-2">
          <Code size={14} className="text-gray-400" />
          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            Response Example
          </span>
        </div>
        <div className="overflow-x-auto">
          <pre className="rounded-md bg-gray-950/50 p-3 text-xs leading-relaxed">
            <code className="text-gray-300">
              {`{
  "overallHealth": "operational",
  "services": [{
    "service": {
      "id": "aidan-so",
      "name": "aidan.so",
      "url": "https://aidan.so"
    },
    "status": "operational",
    "statusCode": 200,
    "responseTime": null,
    "serverResponseTime": 145,
    "error": null
  }],
  "stats": {
    "total": 6,
    "operational": 6,
    "down": 0
  }
}`}
            </code>
          </pre>
        </div>
      </div>

      <div className="grid gap-2 text-xs">
        <div className="flex gap-2">
          <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-gray-300">
            overallHealth
          </code>
          <span className="text-gray-400">
            operational | partial_outage | full_outage
          </span>
        </div>
        <div className="flex gap-2">
          <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-gray-300">
            serverResponseTime
          </code>
          <span className="text-gray-400">Response time in milliseconds</span>
        </div>
        <div className="flex gap-2">
          <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-gray-300">
            responseTime
          </code>
          <span className="text-gray-400">
            Client measurement (present but null until the browser populates it)
          </span>
        </div>
        <div className="flex gap-2">
          <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-gray-300">
            statusCode
          </code>
          <span className="text-gray-400">
            HTTP status code (200 = operational)
          </span>
        </div>
      </div>
    </div>
  )
}
