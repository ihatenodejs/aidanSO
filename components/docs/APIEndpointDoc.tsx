import { cn } from '@/lib/utils'
import { colors } from '@/lib/theme'
import type { APIEndpoint } from '@/lib/docs/types'
import CodeBlock from './CodeBlock'
import { LuLock } from 'react-icons/lu'

interface APIEndpointDocProps {
  endpoint: APIEndpoint
  className?: string
}

const methodStyles = {
  GET: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: colors.accents.success,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  POST: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: colors.accents.info,
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  PUT: {
    backgroundColor: colors.accents.warningBg,
    color: colors.accents.warning,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  DELETE: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: colors.accents.error,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  PATCH: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.3)'
  }
} as const

export default function APIEndpointDoc({
  endpoint,
  className
}: APIEndpointDocProps) {
  return (
    <div id={endpoint.id} className={cn('scroll-mt-20', className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span
              className="rounded-md border px-3 py-1 text-sm font-bold"
              style={methodStyles[endpoint.method]}
            >
              {endpoint.method}
            </span>
            <code
              className="font-mono text-lg"
              style={{ color: colors.text.secondary }}
            >
              {endpoint.path}
            </code>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.body }}>
            {endpoint.description}
          </p>
          {endpoint.auth?.required && (
            <div
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: 'rgba(245, 158, 11, 0.3)',
                backgroundColor: colors.accents.warningBg,
                color: colors.accents.warning
              }}
            >
              <LuLock className="h-4 w-4" />
              <span>
                Authentication required
                {endpoint.auth.type && `: ${endpoint.auth.type}`}
              </span>
            </div>
          )}
        </div>

        {/* Query Parameters */}
        {endpoint.parameters?.query && endpoint.parameters.query.length > 0 && (
          <div className="space-y-2">
            <h4
              className="text-sm font-semibold"
              style={{ color: colors.text.body }}
            >
              Query Parameters
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: colors.borders.default }}
                  >
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: colors.text.muted }}
                    >
                      Name
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: colors.text.muted }}
                    >
                      Type
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: colors.text.muted }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.parameters.query.map((param, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-0"
                      style={{ borderColor: colors.borders.subtle }}
                    >
                      <td
                        className="px-4 py-3 font-mono"
                        style={{ color: colors.text.secondary }}
                      >
                        {param.name}
                        {!param.optional && (
                          <span
                            className="ml-1"
                            style={{ color: colors.accents.error }}
                          >
                            *
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 font-mono"
                        style={{ color: colors.text.muted }}
                      >
                        {param.type}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: colors.text.body }}
                      >
                        {param.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Body */}
        {endpoint.parameters?.body && endpoint.parameters.body.length > 0 && (
          <div className="space-y-2">
            <h4
              className="text-sm font-semibold"
              style={{ color: colors.text.body }}
            >
              Request Body
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: colors.borders.default }}
                  >
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: colors.text.muted }}
                    >
                      Field
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: colors.text.muted }}
                    >
                      Type
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: colors.text.muted }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.parameters.body.map((param, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-0"
                      style={{ borderColor: colors.borders.subtle }}
                    >
                      <td
                        className="px-4 py-3 font-mono"
                        style={{ color: colors.text.secondary }}
                      >
                        {param.name}
                        {!param.optional && (
                          <span
                            className="ml-1"
                            style={{ color: colors.accents.error }}
                          >
                            *
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 font-mono"
                        style={{ color: colors.text.muted }}
                      >
                        {param.type}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: colors.text.body }}
                      >
                        {param.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Responses */}
        <div className="space-y-3">
          <h4
            className="text-sm font-semibold"
            style={{ color: colors.text.body }}
          >
            Responses
          </h4>
          {endpoint.responses.map((response, index) => {
            const isSuccess = response.status >= 200 && response.status < 300
            const isError = response.status >= 400
            const statusStyle = isSuccess
              ? {
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: colors.accents.success
                }
              : isError
                ? {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: colors.accents.error
                  }
                : {
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: colors.accents.info
                  }

            return (
              <div
                key={index}
                className="space-y-2 rounded-lg border p-4"
                style={{
                  borderColor: colors.borders.default,
                  backgroundColor: colors.backgrounds.card
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="rounded px-2 py-1 font-mono text-sm font-semibold"
                    style={statusStyle}
                  >
                    {response.status}
                  </span>
                  <span className="text-sm" style={{ color: colors.text.body }}>
                    {response.description}
                  </span>
                </div>
                {response.example && (
                  <CodeBlock
                    code={JSON.stringify(response.example, null, 2)}
                    language="json"
                    title="Example Response"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Examples */}
        {endpoint.examples && endpoint.examples.length > 0 && (
          <div className="space-y-3">
            <h4
              className="text-sm font-semibold"
              style={{ color: colors.text.body }}
            >
              Request Examples
            </h4>
            {endpoint.examples.map((example, index) => (
              <div key={index} className="space-y-3">
                {example.title && (
                  <h5
                    className="text-sm font-medium"
                    style={{ color: colors.text.muted }}
                  >
                    {example.title}
                  </h5>
                )}
                <div className="grid gap-3 lg:grid-cols-2">
                  <CodeBlock
                    code={
                      typeof example.request === 'string'
                        ? example.request
                        : JSON.stringify(example.request, null, 2)
                    }
                    language="bash"
                    title="Request"
                  />
                  <CodeBlock
                    code={
                      typeof example.response === 'string'
                        ? example.response
                        : JSON.stringify(example.response, null, 2)
                    }
                    language="json"
                    title="Response"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
