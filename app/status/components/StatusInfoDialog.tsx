'use client'

import { Server, Globe, AlertTriangle } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { surfaces, cn, colors } from '@/lib/theme'

interface StatusInfoDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function StatusInfoDialog({
  isOpen,
  onClose
}: StatusInfoDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="status-info-title"
    >
      <Dialog.Content>
        <Dialog.Close />

        <Dialog.Header>
          <Dialog.Title id="status-info-title">
            How Status Measurements Work
          </Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="space-y-6">
          {/* Overview */}
          <div>
            <p className="text-sm leading-relaxed text-gray-300">
              Status checks are run from the same infrastructure that serves
              this page. Results are cached for 60 seconds so the dashboard
              always shows a recent snapshot without overwhelming upstream
              services.
            </p>
          </div>

          {/* Limitations */}
          <div
            className={cn('rounded-lg border-l-4 p-4')}
            style={{
              borderColor: colors.accents.docsBorder,
              backgroundColor: colors.accents.docsBg
            }}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-200">
              <AlertTriangle size={16} className="text-yellow-400" />
              <span>Limitations</span>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                • Status data is cached for 60 seconds before the next server
                check
              </li>
              <li>
                • Checks originate from the same infrastructure that hosts some
                other services, and thus colocated services may report low
                response times
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-400">
              That near-zero network distance means some timings look faster
              than what you might actually experience.
            </p>
          </div>

          {/* Server Measurements */}
          <div className={cn(surfaces.card.simple, 'bg-gray-900/70 p-4')}>
            <div className="mb-3 flex items-center gap-2">
              <div
                className="rounded-lg p-1.5"
                style={{ backgroundColor: colors.accents.docsBg }}
              >
                <Server size={18} style={{ color: colors.accents.link }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">
                Server Measurements
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>Runs directly from the server hosting this website</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Uses HTTP HEAD requests to capture status codes and response
                  time data, retrying with GET if HEAD is rejected
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  10 second timeout prevents stuck checks from delaying the
                  report
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Any HTTP 2xx or 3xx response is treated as operational; other
                  statuses are marked down
                </span>
              </li>
            </ul>
          </div>

          {/* Client Measurements */}
          <div className={cn(surfaces.card.simple, 'bg-gray-900/70 p-4')}>
            <div className="mb-3 flex items-center gap-2">
              <div
                className="rounded-lg p-1.5"
                style={{ backgroundColor: colors.accents.docsBg }}
              >
                <Globe size={18} style={{ color: colors.accents.link }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">
                Client Measurements
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Measured by your browser using lightweight HEAD requests
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Uses{' '}
                  <code className="rounded bg-gray-800 px-1 py-0.5 text-[11px] text-gray-300">
                    no-cors
                  </code>{' '}
                  mode to gather timing details without exposing response bodies
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Combined with server measurements to power the response time
                  chart
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Client timings populate the service cards only when the server
                  confirms the service is operational
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>
                  Browser network or timeout failures override the timing with
                  the appropriate error badge
                </span>
              </li>
            </ul>
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <button
            onClick={onClose}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              'bg-gray-800 text-gray-200 hover:bg-gray-700'
            )}
          >
            Close
          </button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
