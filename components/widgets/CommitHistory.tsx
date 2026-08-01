'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CommitHistoryData, CommitHistoryDay } from '@/lib/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HEATMAP_COLORS = [
  'bg-gray-800',
  'bg-green-950',
  'bg-green-800',
  'bg-green-600',
  'bg-green-400'
]
const DEFAULT_VISIBLE_WEEK_COUNT = 13
const DAY_CELL_WIDTH_PX = 16
const WEEK_GAP_PX = 4
const HEATMAP_LABELS_WIDTH_PX = 40
const TOOLTIP_WIDTH_PX = 240
const TOOLTIP_HEIGHT_PX = 80
const VIEWPORT_PADDING_PX = 8
const numberFormatter = new Intl.NumberFormat('en-US')
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC'
})
const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC'
})

interface CalendarWeek {
  days: (CommitHistoryDay | null)[]
  monthLabel?: string
}

interface TooltipState {
  day: CommitHistoryDay
  x: number
  y: number
  opensBelow: boolean
}

function isCommitHistoryData(value: unknown): value is CommitHistoryData {
  if (!value || typeof value !== 'object') return false

  const data = value as Partial<CommitHistoryData>
  return (
    (data.status === 'complete' ||
      data.status === 'partial' ||
      data.status === 'error') &&
    Array.isArray(data.days) &&
    data.days.every(
      (day) =>
        typeof day.date === 'string' &&
        typeof day.github === 'number' &&
        typeof day.forgejo === 'number' &&
        typeof day.total === 'number'
    ) &&
    typeof data.totalContributions === 'number' &&
    typeof data.githubContributions === 'number' &&
    typeof data.forgejoContributions === 'number'
  )
}

function buildCalendarWeeks(days: CommitHistoryDay[]): CalendarWeek[] {
  if (!days.length) return []

  const leadingSlots = new Date(`${days[0].date}T00:00:00.000Z`).getUTCDay()
  const slots: (CommitHistoryDay | null)[] = [
    ...Array<null>(leadingSlots).fill(null),
    ...days
  ]
  const trailingSlots = (7 - (slots.length % 7)) % 7
  slots.push(...Array<null>(trailingSlots).fill(null))

  let previousMonth: number | undefined
  return Array.from({ length: slots.length / 7 }, (_, weekIndex) => {
    const weekDays = slots.slice(weekIndex * 7, weekIndex * 7 + 7)
    const firstDay = weekDays.find((day) => day !== null)
    const month = firstDay
      ? new Date(`${firstDay.date}T00:00:00.000Z`).getUTCMonth()
      : undefined
    const monthLabel =
      month !== undefined && month !== previousMonth && firstDay
        ? monthFormatter.format(new Date(`${firstDay.date}T00:00:00.000Z`))
        : undefined

    previousMonth = month ?? previousMonth
    return { days: weekDays, monthLabel }
  })
}

function getHeatmapColor(total: number, maxTotal: number): string {
  if (total === 0 || maxTotal === 0) return HEATMAP_COLORS[0]

  const level = Math.min(4, Math.max(1, Math.ceil((total / maxTotal) * 4)))
  return HEATMAP_COLORS[level]
}

function getVisibleWeekCount(viewportWidth: number): number {
  return Math.max(
    1,
    Math.floor(
      (viewportWidth - HEATMAP_LABELS_WIDTH_PX + WEEK_GAP_PX) /
        (DAY_CELL_WIDTH_PX + WEEK_GAP_PX)
    )
  )
}

export default function CommitHistory() {
  const [data, setData] = useState<CommitHistoryData | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [visibleWeekCount, setVisibleWeekCount] = useState(
    DEFAULT_VISIBLE_WEEK_COUNT
  )
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCommitHistory() {
      try {
        const response = await fetch('/api/commit-history', {
          signal: controller.signal
        })
        const payload: unknown = await response.json()

        if (!response.ok || !isCommitHistoryData(payload)) {
          throw new Error('Commit history is unavailable.')
        }

        setData(payload)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return

        console.error('Failed to load commit history:', error)
        setRequestError('Commit history is unavailable.')
      }
    }

    void loadCommitHistory()
    return () => controller.abort()
  }, [])

  const weeks = useMemo(() => buildCalendarWeeks(data?.days ?? []), [data])
  const maxWeekOffset = Math.max(0, weeks.length - visibleWeekCount)
  const clampedWeekOffset = Math.min(weekOffset, maxWeekOffset)
  const visibleWeeks = useMemo(() => {
    const end = weeks.length - clampedWeekOffset
    return weeks.slice(Math.max(0, end - visibleWeekCount), end)
  }, [clampedWeekOffset, visibleWeekCount, weeks])
  const maxTotal = useMemo(
    () => Math.max(0, ...(data?.days.map((day) => day.total) ?? [])),
    [data]
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const viewport = scroller

    function updateVisibleWeekCount() {
      const nextCount = getVisibleWeekCount(viewport.clientWidth)
      setVisibleWeekCount((count) => (count === nextCount ? count : nextCount))
      setWeekOffset((offset) =>
        Math.min(offset, Math.max(0, weeks.length - nextCount))
      )
    }

    updateVisibleWeekCount()
    const observer = new ResizeObserver(updateVisibleWeekCount)
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [weeks])

  function showTooltip(day: CommitHistoryDay, target: HTMLElement) {
    const rect = target.getBoundingClientRect()
    const maxLeft = Math.max(
      VIEWPORT_PADDING_PX,
      window.innerWidth - TOOLTIP_WIDTH_PX - VIEWPORT_PADDING_PX
    )

    setTooltip({
      day,
      x: Math.min(Math.max(VIEWPORT_PADDING_PX, rect.left), maxLeft),
      y: rect.top,
      opensBelow: rect.top < TOOLTIP_HEIGHT_PX + VIEWPORT_PADDING_PX
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-200">Commit History</h2>
        {data && data.status !== 'error' && maxWeekOffset > 0 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setWeekOffset((offset) =>
                  Math.min(maxWeekOffset, offset + visibleWeekCount)
                )
              }
              disabled={clampedWeekOffset === maxWeekOffset}
              className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Show older commit history"
              title="Show older history"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-16 text-center text-xs text-gray-400">
              {visibleWeeks.length} weeks
            </span>
            <button
              type="button"
              onClick={() =>
                setWeekOffset((offset) =>
                  Math.max(0, offset - visibleWeekCount)
                )
              }
              disabled={clampedWeekOffset === 0}
              className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Show newer commit history"
              title="Show newer history"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      {!data && !requestError && (
        <div className="space-y-3" aria-live="polite">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-800" />
          <div className="h-28 animate-pulse rounded bg-gray-800" />
          <span className="sr-only">Loading commit history</span>
        </div>
      )}
      {requestError && (
        <div
          className="flex min-h-44 items-center gap-2 text-sm text-gray-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-400" />
          {requestError}
        </div>
      )}
      {data?.status === 'error' && (
        <div
          className="flex min-h-44 items-center gap-2 text-sm text-gray-400"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-400" />
          {data.message}
        </div>
      )}
      {data && data.status !== 'error' && (
        <>
          {data.status === 'partial' && data.message && (
            <p
              className="mb-4 flex items-center gap-2 text-sm text-yellow-300"
              role="status"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {data.message}
            </p>
          )}
          <div ref={scrollerRef} className="overflow-hidden pb-2">
            <div className="w-max min-w-full">
              <div className="flex gap-1">
                <div className="flex w-9 flex-col gap-1 pr-1 text-[10px] text-gray-400">
                  <div className="h-4" />
                  {WEEKDAYS.map((weekday) => (
                    <div key={weekday} className="h-4 leading-4">
                      {weekday}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-1 flex h-4 gap-1 text-[10px] text-gray-400">
                    {visibleWeeks.map((week, index) => (
                      <div key={index} className="w-4 shrink-0">
                        {week.monthLabel}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {visibleWeeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.days.map((day, dayIndex) =>
                          day ? (
                            <div key={day.date} className="h-4 w-4">
                              <button
                                type="button"
                                aria-label={`${dateFormatter.format(new Date(`${day.date}T00:00:00.000Z`))}: ${day.total} contributions — GitHub: ${day.github}, Forgejo: ${day.forgejo}`}
                                className={`h-4 w-4 rounded-sm ${getHeatmapColor(day.total, maxTotal)} focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`}
                                onMouseEnter={(event) =>
                                  showTooltip(day, event.currentTarget)
                                }
                                onMouseLeave={() => setTooltip(null)}
                                onFocus={(event) =>
                                  showTooltip(day, event.currentTarget)
                                }
                                onBlur={() => setTooltip(null)}
                              />
                            </div>
                          ) : (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className="h-4 w-4"
                            />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1" aria-hidden="true">
              {HEATMAP_COLORS.map((color) => (
                <div key={color} className={`h-3 w-3 rounded-sm ${color}`} />
              ))}
            </div>
            <span>More</span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-200">
            {numberFormatter.format(data.totalContributions)} contributions in
            the last year
          </p>
          <p className="mt-1 text-xs text-gray-400">
            GitHub {numberFormatter.format(data.githubContributions)} · Forgejo{' '}
            {numberFormatter.format(data.forgejoContributions)}
          </p>
        </>
      )}
      {tooltip &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50 w-60 rounded-md border border-gray-700 bg-gray-900 p-2 text-xs text-gray-300 shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.opensBelow
                ? tooltip.y + DAY_CELL_WIDTH_PX + 8
                : tooltip.y - 8,
              transform: tooltip.opensBelow ? undefined : 'translateY(-100%)'
            }}
            role="tooltip"
          >
            <p className="font-medium">
              {dateFormatter.format(
                new Date(`${tooltip.day.date}T00:00:00.000Z`)
              )}
            </p>
            <p>{tooltip.day.total} contributions</p>
            <p className="text-gray-400">
              GitHub: {tooltip.day.github} · Forgejo: {tooltip.day.forgejo}
            </p>
          </div>,
          document.body
        )}
    </div>
  )
}
