'use client'

import * as React from 'react'
import { TbStack2 } from 'react-icons/tb'
import Link from '@/components/objects/Link'
import { Dialog } from '@/components/ui/Dialog'
import { isInactiveTool, type AITool, type AIToolStatus } from '../types'
import { cn } from '@/lib/theme'

interface AIStackProps {
  tools: AITool[]
  title?: string
  subtitle?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  emptyMessage?: string
}

type StatusClassMap = Record<AIToolStatus, string>

const statusClasses: StatusClassMap = {
  primary: 'text-green-400 border-green-400 bg-green-400/10',
  active: 'text-green-300 border-green-300 bg-green-300/10',
  occasional: 'text-orange-300 border-orange-300 bg-orange-300/10',
  cancelled: 'text-red-300 border-red-300 bg-red-300/10',
  unused: 'text-slate-300 border-slate-400 bg-slate-300/10'
}

const statusLabels: Record<AIToolStatus, string> = {
  primary: 'Primary',
  active: 'Active Use',
  occasional: 'Occasional Use',
  cancelled: 'Cancelled',
  unused: 'Unused'
}

const DEFAULT_TITLE = 'My AI Stack'
const DEFAULT_SUBTITLE =
  'The AI tools I use as a part of my routine and workflow.'

const infoLabelClasses =
  'text-xs whitespace-nowrap rounded-md px-2 py-1.5 transition-colors hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300 sm:text-sm'

function formatPrice(price: number, period?: string) {
  if (price === 0) return 'Free'
  const periodSuffix =
    period === 'quarterly'
      ? '/quarter'
      : period
        ? `/${period.slice(0, 2)}`
        : '/mo'
  if (Number.isInteger(price)) return `$${price}${periodSuffix}`
  return `$${price.toFixed(2)}${periodSuffix}`
}

interface ToolInfoDialogProps {
  tool: AITool | null
  onClose: () => void
}

function InfoField({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs tracking-wide text-gray-400 uppercase">{label}</p>
      <div className="text-sm text-gray-200">{children}</div>
    </div>
  )
}

function ToolInfoDialog({ tool, onClose }: ToolInfoDialogProps) {
  const titleId = React.useId()

  if (!tool) return null

  const inactiveTool = isInactiveTool(tool) ? tool : null
  const priceLabel =
    tool.price !== undefined
      ? tool.discountedPrice !== undefined
        ? `${formatPrice(tool.discountedPrice, tool.subscriptionPeriod)} (from ${formatPrice(tool.price, tool.subscriptionPeriod)})`
        : formatPrice(tool.price, tool.subscriptionPeriod)
      : null

  return (
    <Dialog isOpen={Boolean(tool)} onClose={onClose} ariaLabelledBy={titleId}>
      <Dialog.Content>
        <Dialog.Close />

        <Dialog.Header>
          <Dialog.Title id={titleId}>{tool.name}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="space-y-5">
          <p className="text-sm leading-relaxed text-gray-300">
            {tool.description}
          </p>

          <div className="grid gap-4 text-sm text-gray-300 sm:grid-cols-2">
            <InfoField label="Status">
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                  statusClasses[tool.status]
                )}
              >
                {statusLabels[tool.status]}
              </span>
            </InfoField>
            {priceLabel && <InfoField label="Price">{priceLabel}</InfoField>}
            {tool.discountedPrice !== undefined && tool.price !== undefined && (
              <InfoField label="Original Price">
                {formatPrice(tool.price, tool.subscriptionPeriod)}
              </InfoField>
            )}
            {tool.subscriptionPeriod && (
              <InfoField label="Billing Period">
                {tool.subscriptionPeriod.charAt(0).toUpperCase() +
                  tool.subscriptionPeriod.slice(1)}
              </InfoField>
            )}
          </div>

          {inactiveTool && (
            <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
              <p className="text-xs tracking-wide text-gray-400 uppercase">
                {inactiveTool.status === 'cancelled'
                  ? 'Why I cancelled'
                  : "Why it's unused"}
              </p>
              <p className="mt-2 text-sm text-gray-200">
                {inactiveTool.reason}
              </p>
            </div>
          )}
        </Dialog.Body>

        <Dialog.Footer className="flex items-center justify-between gap-6">
          <div className="flex flex-wrap gap-3 text-sm">
            {tool.link && (
              <Link
                href={tool.link}
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit ↗
              </Link>
            )}
            {(tool.usage || tool.hasUsage) && (
              <Link
                href={tool.usage ?? '/ai/usage'}
                className="text-blue-400 hover:underline"
              >
                Usage →
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
          >
            Close
          </button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}

export default function AIStack({
  tools,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  icon: IconComponent = TbStack2,
  emptyMessage = 'No tools to display right now.'
}: AIStackProps) {
  const [selectedTool, setSelectedTool] = React.useState<AITool | null>(null)

  return (
    <>
      <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-200 sm:text-2xl">
            <IconComponent size={20} className="sm:h-6 sm:w-6" />
            {title}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">{subtitle}</p>
        </div>
        {tools.length === 0 ? (
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col rounded-lg border border-gray-700 p-3 transition-all duration-300 hover:border-gray-500 sm:p-4"
              >
                <div className="mb-2 flex flex-1 items-start justify-between sm:mb-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    {tool.icon && (
                      <tool.icon className="shrink-0 text-xl text-gray-300 sm:text-2xl" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-gray-200 sm:text-base">
                          {tool.name}
                        </h3>
                        {tool.price !== undefined && (
                          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                            {tool.discountedPrice !== undefined &&
                            tool.price !== tool.discountedPrice ? (
                              <>
                                <span className="text-xs text-gray-500 line-through sm:text-sm">
                                  {formatPrice(
                                    tool.price,
                                    tool.subscriptionPeriod
                                  )}
                                </span>
                                <span className="text-xs text-gray-200 sm:text-sm">
                                  {formatPrice(
                                    tool.discountedPrice,
                                    tool.subscriptionPeriod
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-200 sm:text-sm">
                                {formatPrice(
                                  tool.price,
                                  tool.subscriptionPeriod
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-gray-400 sm:text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={cn(
                      'w-fit rounded-full border px-2 py-0.5 text-xs sm:py-1',
                      statusClasses[tool.status]
                    )}
                  >
                    {statusLabels[tool.status]}
                  </span>
                  <div className="flex flex-wrap items-center">
                    {tool.link && (
                      <Link
                        href={tool.link}
                        className="text-xs whitespace-nowrap hover:text-blue-300 sm:text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit →
                      </Link>
                    )}
                    {(tool.usage || tool.hasUsage) && (
                      <Link
                        href={tool.usage ?? '/ai/usage'}
                        className="mx-2 text-xs whitespace-nowrap hover:text-blue-300 sm:text-sm"
                      >
                        Usage →
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedTool(tool)}
                      className={cn(
                        'text-blue-300 hover:text-blue-200',
                        infoLabelClasses
                      )}
                    >
                      Info →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ToolInfoDialog
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </>
  )
}
